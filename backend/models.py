"""
backend/models.py

Complete SQLAlchemy 2.0 ORM models for LingPen.

Table inventory
───────────────
  users               — registered accounts, roles
  languages           — language registry (Malayalam, Hindi, Tamil, …)
  treebanks           — a versioned corpus owned by a user
  treebank_members    — collaboration join table (user ↔ treebank + role)
  documents           — a source text within a treebank
  sentences           — one CoNLL-U sentence block
  tokens              — one CoNLL-U token row (incl. multiword + empty nodes)
  annotation_revisions — full audit log of every field change
  validation_reports  — per-sentence validation warnings and errors

Critical schema decisions (do NOT change without a migration plan)
──────────────────────────────────────────────────────────────────
  • feats, misc        → JSONB  (queryable key-value pairs, not raw text)
  • deps               → JSONB  (Enhanced UD graph edges, list of {head, rel})
  • annotation_status  → exists from day one (Phase 3 review workflow)
  • annotation_revisions → exists from day one (Phase 2 history/revert UI)
  • sent_id            → preserves the original # sent_id CoNLL-U comment
  • token_index        → stored as TEXT not INTEGER (multiword "1-2", empty "1.1")

Usage
─────
  from models import Base, User, Language, Treebank, Document, Sentence, Token
  # Then: async with engine.begin() as conn: await conn.run_sync(Base.metadata.create_all)
  # (prefer Alembic for production migrations)
"""

from __future__ import annotations

import enum
from datetime import datetime
from typing import Any

from sqlalchemy import (
    BigInteger,
    Boolean,
    DateTime,
    Enum,
    ForeignKey,
    Index,
    Integer,
    String,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import (
    DeclarativeBase,
    Mapped,
    mapped_column,
    relationship,
)

# ──────────────────────────────────────────────────────────────
# Base
# ──────────────────────────────────────────────────────────────


class Base(DeclarativeBase):
    """Shared declarative base for all LingPen models."""

    type_annotation_map = {
        dict[str, Any]: JSONB,
        list[Any]: JSONB,
    }


# ──────────────────────────────────────────────────────────────
# Enums
# ──────────────────────────────────────────────────────────────


class UserRole(str, enum.Enum):
    ANNOTATOR = "annotator"  # can edit DRAFT sentences they are assigned
    REVIEWER = "reviewer"  # can approve / reject UNDER_REVIEW sentences
    ADMIN = "admin"  # full access within a treebank
    SUPERUSER = "superuser"  # platform-level admin (LingPen team only)


class AnnotationStatus(str, enum.Enum):
    DRAFT = "draft"  # being edited by annotator
    UNDER_REVIEW = "under_review"  # submitted; awaiting reviewer decision
    APPROVED = "approved"  # reviewer has accepted the annotation
    REJECTED = "rejected"  # reviewer requested changes (→ back to DRAFT)


class ValidationSeverity(str, enum.Enum):
    ERROR = "error"  # blocks export (e.g. dependency cycle)
    WARNING = "warning"  # non-blocking (e.g. unusual deprel for UPOS)
    INFO = "info"  # informational (e.g. rare construction flagged)


class ChangeType(str, enum.Enum):
    EDIT = "edit"  # normal field change
    REVERT = "revert"  # field rolled back to a prior value
    IMPORT = "import"  # set during CoNLL-U file import (no prior value)


class MemberRole(str, enum.Enum):
    ANNOTATOR = "annotator"
    REVIEWER = "reviewer"
    ADMIN = "admin"


class ScriptDirection(str, enum.Enum):
    LTR = "ltr"  # left-to-right (Malayalam, Tamil, Hindi, …)
    RTL = "rtl"  # right-to-left (Urdu, Sindhi)


# ──────────────────────────────────────────────────────────────
# Timestamp mixin
# ──────────────────────────────────────────────────────────────


class TimestampMixin:
    """Adds created_at / updated_at to any model."""

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )


# ══════════════════════════════════════════════════════════════
# TABLE: users
# ══════════════════════════════════════════════════════════════


class User(TimestampMixin, Base):
    """
    A registered LingPen account.

    Roles are platform-wide defaults; per-treebank roles are held in
    TreebankMember.  A SUPERUSER can manage the platform itself.
    """

    __tablename__ = "users"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)

    username: Mapped[str] = mapped_column(
        String(64),
        nullable=False,
        unique=True,
        index=True,
        comment="URL-safe display name, e.g. 'ranjini_k'",
    )
    email: Mapped[str] = mapped_column(
        String(254),
        nullable=False,
        unique=True,
        index=True,
    )
    password_hash: Mapped[str] = mapped_column(
        String(256),
        nullable=False,
        comment="bcrypt hash — never store plaintext",
    )
    role: Mapped[UserRole] = mapped_column(
        Enum(UserRole, name="user_role"),
        nullable=False,
        default=UserRole.ANNOTATOR,
        server_default=UserRole.ANNOTATOR.value,
    )
    is_active: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True,
        server_default="true",
        comment="False = soft-deleted / banned account",
    )
    display_name: Mapped[str | None] = mapped_column(
        String(128),
        nullable=True,
        comment="Optional full name for attribution in exports",
    )
    institution: Mapped[str | None] = mapped_column(
        String(256),
        nullable=True,
        comment="University or research lab affiliation",
    )
    orcid: Mapped[str | None] = mapped_column(
        String(37),
        nullable=True,
        unique=True,
        comment="ORCID iD for academic attribution, e.g. 0000-0002-1825-0097",
    )

    # ── Relationships ────────────────────────────────────────
    owned_treebanks: Mapped[list[Treebank]] = relationship(
        back_populates="owner",
        foreign_keys="Treebank.owner_id",
    )
    memberships: Mapped[list[TreebankMember]] = relationship(back_populates="user")
    annotation_revisions: Mapped[list[AnnotationRevision]] = relationship(
        back_populates="changed_by_user",
        foreign_keys="AnnotationRevision.changed_by",
    )
    created_tokens: Mapped[list[Token]] = relationship(
        back_populates="creator",
        foreign_keys="Token.created_by",
    )


# ══════════════════════════════════════════════════════════════
# TABLE: languages
# ══════════════════════════════════════════════════════════════


class Language(Base):
    """
    Language registry entry.

    Pre-populated for all Indian languages LingPen targets initially.
    New entries can be added by SUPERUSER only.

    Example row:
        iso_code="mal", name="Malayalam", script="malayalam",
        family="Dravidian", direction="ltr",
        metadata={"ud_treebanks": ["UD_Malayalam-MTB"], "wals_code": "mal"}
    """

    __tablename__ = "languages"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)

    iso_code: Mapped[str] = mapped_column(
        String(8),
        nullable=False,
        unique=True,
        index=True,
        comment="ISO 639-1 (2-char) or 639-3 (3-char) code, e.g. 'mal', 'hi'",
    )
    name: Mapped[str] = mapped_column(
        String(128),
        nullable=False,
        comment="English name, e.g. 'Malayalam'",
    )
    native_name: Mapped[str | None] = mapped_column(
        String(128),
        nullable=True,
        comment="Name in the language's own script, e.g. 'മലയാളം'",
    )
    script: Mapped[str | None] = mapped_column(
        String(64),
        nullable=True,
        comment="ISO 15924 script name, e.g. 'malayalam', 'devanagari'",
    )
    family: Mapped[str | None] = mapped_column(
        String(64),
        nullable=True,
        comment="Language family, e.g. 'Dravidian', 'Indo-Aryan'",
    )
    direction: Mapped[ScriptDirection] = mapped_column(
        Enum(ScriptDirection, name="script_direction"),
        nullable=False,
        default=ScriptDirection.LTR,
        server_default=ScriptDirection.LTR.value,
        comment="Text rendering direction — critical for arc visualizer layout",
    )
    metadata_: Mapped[dict[str, Any] | None] = mapped_column(
        "metadata",
        JSONB,
        nullable=True,
        comment="Flexible bag: ud_treebanks, wals_code, morphological_type, etc.",
    )

    # ── Relationships ────────────────────────────────────────
    treebanks: Mapped[list[Treebank]] = relationship(back_populates="language")


# ══════════════════════════════════════════════════════════════
# TABLE: treebanks
# ══════════════════════════════════════════════════════════════


class Treebank(TimestampMixin, Base):
    """
    A versioned, named corpus — the top-level container for LingPen data.

    One treebank belongs to one language and one owner (User).
    Collaborators are tracked via TreebankMember.

    `version` follows UD versioning conventions, e.g. "2.14".
    `license` should be a SPDX identifier, e.g. "CC-BY-SA-4.0".
    """

    __tablename__ = "treebanks"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)

    name: Mapped[str] = mapped_column(
        String(256),
        nullable=False,
        comment="Human-readable name, e.g. 'UD Malayalam MTB'",
    )
    language_id: Mapped[int] = mapped_column(
        ForeignKey("languages.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )
    owner_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    version: Mapped[str] = mapped_column(
        String(32),
        nullable=False,
        default="0.1",
        server_default="0.1",
        comment="Corpus version string, e.g. '2.14'",
    )
    license: Mapped[str] = mapped_column(
        String(64),
        nullable=False,
        default="CC-BY-SA-4.0",
        server_default="CC-BY-SA-4.0",
        comment="SPDX license identifier",
    )
    is_public: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
        server_default="false",
        comment="True = browsable by unauthenticated users",
    )
    github_repo: Mapped[str | None] = mapped_column(
        String(256),
        nullable=True,
        comment="Optional GitHub repo URL for upstream sync (Phase 4)",
    )

    # ── Relationships ────────────────────────────────────────
    language: Mapped[Language] = relationship(back_populates="treebanks")
    owner: Mapped[User] = relationship(
        back_populates="owned_treebanks",
        foreign_keys=[owner_id],
    )
    members: Mapped[list[TreebankMember]] = relationship(
        back_populates="treebank", cascade="all, delete-orphan"
    )
    documents: Mapped[list[Document]] = relationship(
        back_populates="treebank", cascade="all, delete-orphan", order_by="Document.doc_order"
    )

    # ── Constraints ──────────────────────────────────────────
    __table_args__ = (UniqueConstraint("owner_id", "name", name="uq_treebank_owner_name"),)


# ══════════════════════════════════════════════════════════════
# TABLE: treebank_members  (collaboration join table)
# ══════════════════════════════════════════════════════════════


class TreebankMember(Base):
    """
    Many-to-many association between Users and Treebanks with a role.

    Phase 1: owner only (no collaborators yet).
    Phase 3: invite collaborators here and assign MemberRole.

    Sentences assigned to a specific member are tracked via
    Sentence.assigned_to (not here).
    """

    __tablename__ = "treebank_members"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    treebank_id: Mapped[int] = mapped_column(
        ForeignKey("treebanks.id", ondelete="CASCADE"),
        nullable=False,
    )
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )
    role: Mapped[MemberRole] = mapped_column(
        Enum(MemberRole, name="member_role"),
        nullable=False,
        default=MemberRole.ANNOTATOR,
    )
    invited_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    accepted_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
        comment="NULL = invitation pending",
    )

    # ── Relationships ────────────────────────────────────────
    treebank: Mapped[Treebank] = relationship(back_populates="members")
    user: Mapped[User] = relationship(back_populates="memberships")

    # ── Constraints ──────────────────────────────────────────
    __table_args__ = (
        UniqueConstraint("treebank_id", "user_id", name="uq_member_treebank_user"),
        Index("ix_treebank_members_treebank", "treebank_id"),
        Index("ix_treebank_members_user", "user_id"),
    )


# ══════════════════════════════════════════════════════════════
# TABLE: documents
# ══════════════════════════════════════════════════════════════


class Document(TimestampMixin, Base):
    """
    A source text within a treebank — corresponds to one uploaded CoNLL-U file
    or a logical sub-corpus (e.g. "News domain", "Wikipedia articles").

    `doc_order` controls display order within the treebank.
    `metadata_` stores provenance: original filename, publication, URL, etc.
    """

    __tablename__ = "documents"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    treebank_id: Mapped[int] = mapped_column(
        ForeignKey("treebanks.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    title: Mapped[str] = mapped_column(
        String(512),
        nullable=False,
        comment="Human-readable title, e.g. 'Wikipedia sample Jan 2024'",
    )
    source: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
        comment="Original source URL, publication, or dataset name",
    )
    doc_order: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
        comment="Display order within the treebank",
    )
    original_filename: Mapped[str | None] = mapped_column(
        String(512),
        nullable=True,
        comment="Filename of the uploaded CoNLL-U file, for reference",
    )
    metadata_: Mapped[dict[str, Any] | None] = mapped_column(
        "metadata",
        JSONB,
        nullable=True,
        comment="Provenance bag: genre, domain, collection_date, license_override, etc.",
    )

    # ── Relationships ────────────────────────────────────────
    treebank: Mapped[Treebank] = relationship(back_populates="documents")
    sentences: Mapped[list[Sentence]] = relationship(
        back_populates="document",
        cascade="all, delete-orphan",
        order_by="Sentence.sent_order",
    )

    # ── Indexes ──────────────────────────────────────────────
    __table_args__ = (Index("ix_documents_treebank_order", "treebank_id", "doc_order"),)


# ══════════════════════════════════════════════════════════════
# TABLE: sentences
# ══════════════════════════════════════════════════════════════


class Sentence(TimestampMixin, Base):
    """
    One CoNLL-U sentence block.

    `sent_id`   — the value of the # sent_id comment in the original file.
                  Preserved verbatim so exports are round-trip identical.
    `sent_text` — the value of the # text comment (raw sentence string).
    `sent_order` — integer position within the document (for ordered display).
    `annotation_status` — drives the Phase 3 review workflow.
    `assigned_to`  — which annotator is responsible for this sentence.
    `locked_by` / `lock_expires_at` — optimistic lock to prevent concurrent edits.
    `metadata_` — all other # key = value comments from the CoNLL-U source.
    """

    __tablename__ = "sentences"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    document_id: Mapped[int] = mapped_column(
        ForeignKey("documents.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # CoNLL-U provenance
    sent_id: Mapped[str | None] = mapped_column(
        String(256),
        nullable=True,
        comment="Value of the # sent_id comment in the source file",
    )
    sent_text: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
        comment="Value of the # text comment — the raw sentence string",
    )
    sent_order: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        comment="Zero-based position of this sentence within its document",
    )

    # Annotation workflow  (exists from Phase 1 — do NOT defer)
    annotation_status: Mapped[AnnotationStatus] = mapped_column(
        Enum(AnnotationStatus, name="annotation_status"),
        nullable=False,
        default=AnnotationStatus.DRAFT,
        server_default=AnnotationStatus.DRAFT.value,
        index=True,
    )
    assigned_to: Mapped[int | None] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
        comment="Which annotator is responsible for this sentence (Phase 3)",
    )

    # Optimistic locking to prevent concurrent edits (Phase 3)
    locked_by: Mapped[int | None] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        comment="User currently editing this sentence",
    )
    lock_expires_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
        comment="Lock auto-expires; client must renew every 5 minutes",
    )

    # Extra CoNLL-U comments preserved as JSONB
    metadata_: Mapped[dict[str, Any] | None] = mapped_column(
        "metadata",
        JSONB,
        nullable=True,
        comment="All # key = value comment lines other than sent_id and text",
    )

    # ── Relationships ────────────────────────────────────────
    document: Mapped[Document] = relationship(back_populates="sentences")
    tokens: Mapped[list[Token]] = relationship(
        back_populates="sentence",
        cascade="all, delete-orphan",
        order_by="Token.token_order",
    )
    validation_reports: Mapped[list[ValidationReport]] = relationship(
        back_populates="sentence",
        cascade="all, delete-orphan",
    )
    assignee: Mapped[User | None] = relationship(
        foreign_keys=[assigned_to],
    )
    lock_holder: Mapped[User | None] = relationship(
        foreign_keys=[locked_by],
    )

    # ── Indexes ──────────────────────────────────────────────
    __table_args__ = (
        Index("ix_sentences_document_order", "document_id", "sent_order"),
        Index("ix_sentences_status", "annotation_status"),
        Index("ix_sentences_assigned", "assigned_to"),
        # GIN index on metadata JSONB for # key = value comment search (Phase 4)
        Index(
            "ix_sentences_metadata_gin",
            "metadata",
            postgresql_using="gin",
        ),
    )


# ══════════════════════════════════════════════════════════════
# TABLE: tokens
# ══════════════════════════════════════════════════════════════


class Token(Base):
    """
    One CoNLL-U token row — the atomic unit of annotation.

    Covers all three CoNLL-U node types:
        Standard tokens    token_index = "1", "2", "3", …
        Multiword tokens   token_index = "1-2", "3-4", … (e.g. Malayalam copula splits)
        Empty nodes        token_index = "1.1", "2.1", … (Enhanced UD gapping)

    CRITICAL column decisions
    ─────────────────────────
    token_index  TEXT not INTEGER — multiword and empty node IDs are non-integer.
    token_order  INTEGER — numeric sort key within the sentence (set on import).
    feats        JSONB   — {"Case": "Dat", "VerbForm": "Fin"} not "Case=Dat|VerbForm=Fin"
    deps         JSONB   — [{"head": 4, "rel": "nsubj"}, {"head": 7, "rel": "ref"}]
                           (Enhanced UD DEPS column, list of {head, rel} objects)
    misc         JSONB   — {"SpaceAfter": "No", "Translit": "varunnu"}

    created_by is set to the importing user on bulk import; to the editing
    user when a field is first changed after import.
    """

    __tablename__ = "tokens"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    sentence_id: Mapped[int] = mapped_column(
        ForeignKey("sentences.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # ── CoNLL-U fields ───────────────────────────────────────
    token_index: Mapped[str] = mapped_column(
        String(16),
        nullable=False,
        comment="CoNLL-U ID field: '1', '1-2' (MWT), or '1.1' (empty node)",
    )
    token_order: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        comment="Numeric sort key: 10000*int_part + decimal_part. "
        "E.g. '1'→10000, '1-2'→10000, '1.1'→10001, '2'→20000",
    )
    form: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
        comment="Surface form — Malayalam Unicode, NFC-normalised on import",
    )
    lemma: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
        comment="Dictionary form / lemma",
    )
    upos: Mapped[str | None] = mapped_column(
        String(8),
        nullable=True,
        index=True,
        comment="Universal POS tag (one of the 17 UD UPOS values)",
    )
    xpos: Mapped[str | None] = mapped_column(
        String(64),
        nullable=True,
        comment="Language-specific POS tag (optional; treebank-defined)",
    )
    feats: Mapped[dict[str, Any] | None] = mapped_column(
        JSONB,
        nullable=True,
        comment='Morphological features as JSONB: {"Case":"Dat","VerbForm":"Fin"}',
    )
    head: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
        comment="Index of the syntactic head token; 0 = root",
    )
    deprel: Mapped[str | None] = mapped_column(
        String(64),
        nullable=True,
        index=True,
        comment="Basic dependency relation, e.g. 'nsubj', 'obj', 'compound:svc'",
    )
    deps: Mapped[list[Any] | None] = mapped_column(
        JSONB,
        nullable=True,
        comment='Enhanced UD graph edges: [{"head":4,"rel":"nsubj"},{"head":7,"rel":"ref"}]',
    )
    misc: Mapped[dict[str, Any] | None] = mapped_column(
        JSONB,
        nullable=True,
        comment='MISC column as JSONB: {"SpaceAfter":"No","Translit":"avan"}',
    )

    # ── Provenance ───────────────────────────────────────────
    created_by: Mapped[int | None] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        comment="User who last edited this token (or imported it)",
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    # ── Relationships ────────────────────────────────────────
    sentence: Mapped[Sentence] = relationship(back_populates="tokens")
    creator: Mapped[User | None] = relationship(
        back_populates="created_tokens",
        foreign_keys=[created_by],
    )
    annotation_revisions: Mapped[list[AnnotationRevision]] = relationship(
        back_populates="token",
        cascade="all, delete-orphan",
        order_by="AnnotationRevision.timestamp",
    )

    # ── Indexes ──────────────────────────────────────────────
    __table_args__ = (
        # Primary lookup: all tokens for a sentence in order
        Index("ix_tokens_sentence_order", "sentence_id", "token_order"),
        # Corpus search queries (Phase 4)
        Index("ix_tokens_upos", "upos"),
        Index("ix_tokens_deprel", "deprel"),
        # JSONB GIN indexes — enable fast FEATS and DEPS pattern search
        # e.g. WHERE feats @> '{"VerbForm": "Vnoun"}'
        # e.g. WHERE deps @> '[{"rel": "nsubj:pass"}]'
        Index(
            "ix_tokens_feats_gin",
            "feats",
            postgresql_using="gin",
        ),
        Index(
            "ix_tokens_deps_gin",
            "deps",
            postgresql_using="gin",
        ),
        Index(
            "ix_tokens_misc_gin",
            "misc",
            postgresql_using="gin",
        ),
    )


# ══════════════════════════════════════════════════════════════
# TABLE: annotation_revisions
# ══════════════════════════════════════════════════════════════


class AnnotationRevision(Base):
    """
    Immutable audit log of every field change on every token.

    EXISTS FROM DAY ONE — retrofitting this table later is extremely painful
    because history cannot be reconstructed from the current token state.

    One row per field per change:
        token_id=42, field_name="upos", old_value="NOUN", new_value="VERB"

    `old_value` and `new_value` are always stored as JSON-serialised strings
    so that complex fields (feats, deps, misc) are preserved in full.

    `change_type` distinguishes:
        IMPORT  — set during CoNLL-U file upload (old_value is NULL)
        EDIT    — normal annotator edit
        REVERT  — rollback to a prior revision via the history UI

    The Phase 2 history panel queries this table grouped by token and ordered
    by timestamp.  The revert action inserts a new REVERT revision rather than
    deleting the earlier EDIT — the log is append-only.
    """

    __tablename__ = "annotation_revisions"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    token_id: Mapped[int] = mapped_column(
        ForeignKey("tokens.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    changed_by: Mapped[int | None] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        comment="NULL only if the change was made by an automated import process",
    )

    # What changed
    field_name: Mapped[str] = mapped_column(
        String(32),
        nullable=False,
        comment="Name of the Token column that changed: 'upos', 'deprel', 'feats', etc.",
    )
    old_value: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
        comment="Previous value serialised as JSON string; NULL for IMPORT rows",
    )
    new_value: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
        comment="New value serialised as JSON string",
    )
    change_type: Mapped[ChangeType] = mapped_column(
        Enum(ChangeType, name="change_type"),
        nullable=False,
        default=ChangeType.EDIT,
    )

    # Immutable timestamp — no server_default onupdate
    timestamp: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    # Optional: which revision this row reverts to (for REVERT rows)
    reverts_revision_id: Mapped[int | None] = mapped_column(
        ForeignKey("annotation_revisions.id", ondelete="SET NULL"),
        nullable=True,
        comment="For REVERT rows: the revision ID that was restored",
    )

    # ── Relationships ────────────────────────────────────────
    token: Mapped[Token] = relationship(
        back_populates="annotation_revisions",
    )
    changed_by_user: Mapped[User | None] = relationship(
        back_populates="annotation_revisions",
        foreign_keys=[changed_by],
    )
    reverts_revision: Mapped[AnnotationRevision | None] = relationship(
        foreign_keys=[reverts_revision_id],
        remote_side="AnnotationRevision.id",
    )

    # ── Indexes ──────────────────────────────────────────────
    __table_args__ = (
        # History panel: all revisions for a token in chronological order
        Index("ix_revisions_token_timestamp", "token_id", "timestamp"),
        # Attribution: all changes by a user (contributor profile, Phase 3)
        Index("ix_revisions_user_timestamp", "changed_by", "timestamp"),
    )


# ══════════════════════════════════════════════════════════════
# TABLE: validation_reports
# ══════════════════════════════════════════════════════════════


class ValidationReport(Base):
    """
    Per-sentence validation results produced by the CoNLL-U validator.

    Rows are regenerated each time a sentence is validated — the table is
    NOT append-only.  Old reports for a sentence are deleted before inserting
    the new batch.

    `rule_id`   — machine-readable identifier for the validation rule,
                  e.g. "cycle_detected", "missing_root", "invalid_upos".
                  Used by the frontend to render rule-specific help text.
    `token_ids` — JSONB list of token IDs implicated in this violation
                  (empty list if the violation is sentence-level).
    `field`     — which CoNLL-U field triggered this report (may be NULL
                  for structural violations like cycles).

    Severity levels:
        ERROR   — must be resolved before export is allowed
        WARNING — non-blocking; exported with a comment in the CoNLL-U file
        INFO    — advisory; not exported
    """

    __tablename__ = "validation_reports"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    sentence_id: Mapped[int] = mapped_column(
        ForeignKey("sentences.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    rule_id: Mapped[str] = mapped_column(
        String(64),
        nullable=False,
        comment="Machine-readable rule identifier, e.g. 'cycle_detected'",
    )
    severity: Mapped[ValidationSeverity] = mapped_column(
        Enum(ValidationSeverity, name="validation_severity"),
        nullable=False,
        index=True,
    )
    message: Mapped[str] = mapped_column(
        Text,
        nullable=False,
        comment="Human-readable description shown in the validation panel",
    )

    # Which tokens are implicated (empty list = sentence-level violation)
    token_ids: Mapped[list[Any]] = mapped_column(
        JSONB,
        nullable=False,
        default=list,
        server_default="[]",
        comment="List of token IDs implicated in this violation",
    )

    # Which field triggered this (NULL for structural violations)
    field: Mapped[str | None] = mapped_column(
        String(32),
        nullable=True,
        comment="CoNLL-U field name that triggered this report, e.g. 'upos'",
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    # ── Relationships ────────────────────────────────────────
    sentence: Mapped[Sentence] = relationship(back_populates="validation_reports")

    # ── Indexes ──────────────────────────────────────────────
    __table_args__ = (
        # Fetch all reports for a sentence (primary access pattern)
        Index("ix_validation_sentence_severity", "sentence_id", "severity"),
    )


# ──────────────────────────────────────────────────────────────
# Convenience export
# ──────────────────────────────────────────────────────────────

__all__ = [
    "Base",
    # Enums
    "UserRole",
    "AnnotationStatus",
    "ValidationSeverity",
    "ChangeType",
    "MemberRole",
    "ScriptDirection",
    # Models
    "User",
    "Language",
    "Treebank",
    "TreebankMember",
    "Document",
    "Sentence",
    "Token",
    "AnnotationRevision",
    "ValidationReport",
]
