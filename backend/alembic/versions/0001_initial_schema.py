"""Initial schema — all LingPen tables

Revision ID: 0001
Revises:
Create Date: 2026-05-15
"""
from __future__ import annotations

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSONB

revision = "0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ── Enum types (must be created before the tables that use them) ──
    op.execute("CREATE TYPE user_role AS ENUM ('annotator','reviewer','admin','superuser')")
    op.execute("CREATE TYPE member_role AS ENUM ('annotator','reviewer','admin')")
    op.execute("CREATE TYPE script_direction AS ENUM ('ltr','rtl')")
    op.execute("CREATE TYPE annotation_status AS ENUM ('draft','under_review','approved','rejected')")
    op.execute("CREATE TYPE validation_severity AS ENUM ('error','warning','info')")
    op.execute("CREATE TYPE change_type AS ENUM ('edit','revert','import')")

    # ── users ────────────────────────────────────────────────
    op.create_table(
        "users",
        sa.Column("id",            sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column("username",      sa.String(64),   nullable=False),
        sa.Column("email",         sa.String(254),  nullable=False),
        sa.Column("password_hash", sa.String(256),  nullable=False),
        sa.Column("role",          sa.Text(),       nullable=False, server_default="annotator"),
        sa.Column("is_active",     sa.Boolean(),    nullable=False, server_default="true"),
        sa.Column("display_name",  sa.String(128),  nullable=True),
        sa.Column("institution",   sa.String(256),  nullable=True),
        sa.Column("orcid",         sa.String(37),   nullable=True),
        sa.Column("created_at",    sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at",    sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("ix_users_username", "users", ["username"], unique=True)
    op.create_index("ix_users_email",    "users", ["email"],    unique=True)

    # ── languages ────────────────────────────────────────────
    op.create_table(
        "languages",
        sa.Column("id",          sa.Integer(),    primary_key=True, autoincrement=True),
        sa.Column("iso_code",    sa.String(8),    nullable=False),
        sa.Column("name",        sa.String(128),  nullable=False),
        sa.Column("native_name", sa.String(128),  nullable=True),
        sa.Column("script",      sa.String(64),   nullable=True),
        sa.Column("family",      sa.String(64),   nullable=True),
        sa.Column("direction",   sa.Text(),       nullable=False, server_default="ltr"),
        sa.Column("metadata",    JSONB,           nullable=True),
    )
    op.create_index("ix_languages_iso_code", "languages", ["iso_code"], unique=True)

    # ── treebanks ────────────────────────────────────────────
    op.create_table(
        "treebanks",
        sa.Column("id",          sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column("name",        sa.String(256),  nullable=False),
        sa.Column("language_id", sa.Integer(),    sa.ForeignKey("languages.id", ondelete="RESTRICT"), nullable=False),
        sa.Column("owner_id",    sa.BigInteger(), sa.ForeignKey("users.id",     ondelete="RESTRICT"), nullable=False),
        sa.Column("description", sa.Text(),       nullable=True),
        sa.Column("version",     sa.String(32),   nullable=False, server_default="0.1"),
        sa.Column("license",     sa.String(64),   nullable=False, server_default="CC-BY-SA-4.0"),
        sa.Column("is_public",   sa.Boolean(),    nullable=False, server_default="false"),
        sa.Column("github_repo", sa.String(256),  nullable=True),
        sa.Column("created_at",  sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at",  sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.UniqueConstraint("owner_id", "name", name="uq_treebank_owner_name"),
    )
    op.create_index("ix_treebanks_language", "treebanks", ["language_id"])
    op.create_index("ix_treebanks_owner",    "treebanks", ["owner_id"])

    # ── treebank_members ─────────────────────────────────────
    op.create_table(
        "treebank_members",
        sa.Column("id",          sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column("treebank_id", sa.BigInteger(), sa.ForeignKey("treebanks.id", ondelete="CASCADE"), nullable=False),
        sa.Column("user_id",     sa.BigInteger(), sa.ForeignKey("users.id",     ondelete="CASCADE"), nullable=False),
        sa.Column("role",        sa.Text(),       nullable=False, server_default="annotator"),
        sa.Column("invited_at",  sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("accepted_at", sa.DateTime(timezone=True), nullable=True),
        sa.UniqueConstraint("treebank_id", "user_id", name="uq_member_treebank_user"),
    )
    op.create_index("ix_treebank_members_treebank", "treebank_members", ["treebank_id"])
    op.create_index("ix_treebank_members_user",     "treebank_members", ["user_id"])

    # ── documents ────────────────────────────────────────────
    op.create_table(
        "documents",
        sa.Column("id",                sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column("treebank_id",       sa.BigInteger(), sa.ForeignKey("treebanks.id", ondelete="CASCADE"), nullable=False),
        sa.Column("title",             sa.String(512),  nullable=False),
        sa.Column("source",            sa.Text(),       nullable=True),
        sa.Column("doc_order",         sa.Integer(),    nullable=False, server_default="0"),
        sa.Column("original_filename", sa.String(512),  nullable=True),
        sa.Column("metadata",          JSONB,           nullable=True),
        sa.Column("created_at",        sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at",        sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("ix_documents_treebank_order", "documents", ["treebank_id", "doc_order"])

    # ── sentences ────────────────────────────────────────────
    op.create_table(
        "sentences",
        sa.Column("id",                sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column("document_id",       sa.BigInteger(), sa.ForeignKey("documents.id", ondelete="CASCADE"), nullable=False),
        sa.Column("sent_id",           sa.String(256),  nullable=True),
        sa.Column("sent_text",         sa.Text(),       nullable=True),
        sa.Column("sent_order",        sa.Integer(),    nullable=False),
        sa.Column("annotation_status", sa.Text(),       nullable=False, server_default="draft"),
        sa.Column("assigned_to",       sa.BigInteger(), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
        sa.Column("locked_by",         sa.BigInteger(), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
        sa.Column("lock_expires_at",   sa.DateTime(timezone=True), nullable=True),
        sa.Column("metadata",          JSONB,           nullable=True),
        sa.Column("created_at",        sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at",        sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("ix_sentences_document_order", "sentences", ["document_id", "sent_order"])
    op.create_index("ix_sentences_status",         "sentences", ["annotation_status"])
    op.create_index("ix_sentences_assigned",       "sentences", ["assigned_to"])
    op.create_index("ix_sentences_metadata_gin",   "sentences", ["metadata"],
                    postgresql_using="gin")

    # ── tokens ───────────────────────────────────────────────
    op.create_table(
        "tokens",
        sa.Column("id",          sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column("sentence_id", sa.BigInteger(), sa.ForeignKey("sentences.id", ondelete="CASCADE"), nullable=False),
        sa.Column("token_index", sa.String(16),   nullable=False),
        sa.Column("token_order", sa.Integer(),    nullable=False),
        sa.Column("form",        sa.Text(),       nullable=True),
        sa.Column("lemma",       sa.Text(),       nullable=True),
        sa.Column("upos",        sa.String(8),    nullable=True),
        sa.Column("xpos",        sa.String(64),   nullable=True),
        sa.Column("feats",       JSONB,           nullable=True),
        sa.Column("head",        sa.Integer(),    nullable=True),
        sa.Column("deprel",      sa.String(64),   nullable=True),
        sa.Column("deps",        JSONB,           nullable=True),
        sa.Column("misc",        JSONB,           nullable=True),
        sa.Column("created_by",  sa.BigInteger(), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
        sa.Column("created_at",  sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at",  sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("ix_tokens_sentence_order", "tokens", ["sentence_id", "token_order"])
    op.create_index("ix_tokens_upos",           "tokens", ["upos"])
    op.create_index("ix_tokens_deprel",         "tokens", ["deprel"])
    op.create_index("ix_tokens_feats_gin",      "tokens", ["feats"], postgresql_using="gin")
    op.create_index("ix_tokens_deps_gin",       "tokens", ["deps"],  postgresql_using="gin")
    op.create_index("ix_tokens_misc_gin",       "tokens", ["misc"],  postgresql_using="gin")

    # ── annotation_revisions ─────────────────────────────────
    op.create_table(
        "annotation_revisions",
        sa.Column("id",                  sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column("token_id",            sa.BigInteger(), sa.ForeignKey("tokens.id",               ondelete="CASCADE"),  nullable=False),
        sa.Column("changed_by",          sa.BigInteger(), sa.ForeignKey("users.id",                ondelete="SET NULL"), nullable=True),
        sa.Column("field_name",          sa.String(32),   nullable=False),
        sa.Column("old_value",           sa.Text(),       nullable=True),
        sa.Column("new_value",           sa.Text(),       nullable=True),
        sa.Column("change_type",         sa.Text(),       nullable=False, server_default="edit"),
        sa.Column("timestamp",           sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("reverts_revision_id", sa.BigInteger(), sa.ForeignKey("annotation_revisions.id", ondelete="SET NULL"), nullable=True),
    )
    op.create_index("ix_revisions_token_timestamp", "annotation_revisions", ["token_id", "timestamp"])
    op.create_index("ix_revisions_user_timestamp",  "annotation_revisions", ["changed_by", "timestamp"])

    # ── validation_reports ───────────────────────────────────
    op.create_table(
        "validation_reports",
        sa.Column("id",          sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column("sentence_id", sa.BigInteger(), sa.ForeignKey("sentences.id", ondelete="CASCADE"), nullable=False),
        sa.Column("rule_id",     sa.String(64),   nullable=False),
        sa.Column("severity",    sa.Text(),       nullable=False),
        sa.Column("message",     sa.Text(),       nullable=False),
        sa.Column("token_ids",   JSONB,           nullable=False, server_default="[]"),
        sa.Column("field",       sa.String(32),   nullable=True),
        sa.Column("created_at",  sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("ix_validation_sentence_severity", "validation_reports", ["sentence_id", "severity"])


def downgrade() -> None:
    op.drop_table("validation_reports")
    op.drop_table("annotation_revisions")
    op.drop_table("tokens")
    op.drop_table("sentences")
    op.drop_table("documents")
    op.drop_table("treebank_members")
    op.drop_table("treebanks")
    op.drop_table("languages")
    op.drop_table("users")

    op.execute("DROP TYPE IF EXISTS change_type")
    op.execute("DROP TYPE IF EXISTS validation_severity")
    op.execute("DROP TYPE IF EXISTS annotation_status")
    op.execute("DROP TYPE IF EXISTS script_direction")
    op.execute("DROP TYPE IF EXISTS member_role")
    op.execute("DROP TYPE IF EXISTS user_role")
