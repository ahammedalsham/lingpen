"""
backend/tests/integration/test_core_flow.py

End-to-end integration tests for the critical LingPen annotation workflow:
register → login → create treebank → upload CoNLL-U → edit token → export

Run with:
    DATABASE_URL=postgresql+asyncpg://... API_BASE_URL=http://localhost:8000 \
    pytest tests/integration/ -v
"""

import os

import httpx
import pytest

BASE = os.environ.get("API_BASE_URL", "http://localhost:8000")

# Path to sample Malayalam CoNLL-U fixture
FIXTURE_PATH = "tests/fixtures/malayalam_sample.conllu"


@pytest.fixture(scope="module")
def client():
    with httpx.Client(base_url=BASE, timeout=10.0) as c:
        yield c


@pytest.fixture(scope="module")
def auth_token(client):
    """Register a test user and return a JWT."""
    resp = client.post(
        "/api/auth/register",
        json={
            "email": "ci_test@lingpen.in",
            "username": "ci_tester",
            "password": "Str0ngP@ssword!",
        },
    )
    # 201 on success, 409 if user exists from a previous run
    assert resp.status_code in (201, 409)

    resp = client.post(
        "/api/auth/login", json={"email": "ci_test@lingpen.in", "password": "Str0ngP@ssword!"}
    )
    assert resp.status_code == 200
    return resp.json()["access_token"]


@pytest.fixture(scope="module")
def authed(client, auth_token):
    """Return a client with Authorization header pre-set."""
    client.headers["Authorization"] = f"Bearer {auth_token}"
    return client


class TestCoreAnnotationFlow:
    def test_health(self, client):
        r = client.get("/api/health")
        assert r.status_code == 200
        assert r.json()["status"] == "ok"

    def test_create_treebank(self, authed):
        r = authed.post(
            "/api/treebanks",
            json={
                "name": "CI Malayalam Test",
                "language_iso": "mal",
                "description": "Integration test treebank",
            },
        )
        assert r.status_code == 201
        self.__class__.treebank_id = r.json()["id"]

    def test_upload_conllu(self, authed):
        tid = self.__class__.treebank_id
        with open(FIXTURE_PATH, "rb") as f:
            r = authed.post(
                f"/api/treebanks/{tid}/upload",
                files={"file": ("malayalam_sample.conllu", f, "text/plain")},
            )
        assert r.status_code == 200
        body = r.json()
        assert body["imported"] >= 5, "Expected at least 5 sentences imported"
        self.__class__.sentence_count = body["imported"]

    def test_list_sentences(self, authed):
        tid = self.__class__.treebank_id
        r = authed.get(f"/api/treebanks/{tid}/sentences")
        assert r.status_code == 200
        data = r.json()
        assert data["total"] == self.__class__.sentence_count
        # Save a sentence and token ID for subsequent tests
        self.__class__.sentence_id = data["items"][0]["id"]

    def test_get_tokens(self, authed):
        sid = self.__class__.sentence_id
        r = authed.get(f"/api/sentences/{sid}/tokens")
        assert r.status_code == 200
        tokens = r.json()
        assert len(tokens) > 0
        self.__class__.token_id = tokens[0]["id"]

    def test_edit_token_field(self, authed):
        """Edit a token field and verify the revision is logged."""
        tid = self.__class__.token_id
        r = authed.put(f"/api/tokens/{tid}", json={"field": "upos", "value": "VERB"})
        assert r.status_code == 200

        # Check revision was logged
        r2 = authed.get(f"/api/tokens/{tid}/history")
        assert r2.status_code == 200
        history = r2.json()
        assert any(h["field_name"] == "upos" for h in history)

    def test_validation_endpoint(self, authed):
        sid = self.__class__.sentence_id
        r = authed.get(f"/api/sentences/{sid}/validate")
        assert r.status_code == 200
        # Response should have a "warnings" and "errors" list
        body = r.json()
        assert "errors" in body
        assert "warnings" in body

    def test_export_conllu(self, authed):
        """Export must be valid CoNLL-U (contains tab-separated lines)."""
        tid = self.__class__.treebank_id
        r = authed.get(f"/api/treebanks/{tid}/export")
        assert r.status_code == 200
        content = r.text

        # Every non-comment, non-blank line must have exactly 9 tabs (10 fields)
        token_lines = [line for line in content.splitlines() if line and not line.startswith("#")]
        assert len(token_lines) > 0
        for line in token_lines:
            fields = line.split("\t")
            assert len(fields) == 10, f"Bad CoNLL-U line: {line!r}"
