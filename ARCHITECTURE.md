# Architecture & Design Decisions

## System Overview

LingPen is built on a **modern, scalable architecture** designed for concurrent annotator collaboration:

```
┌─────────────────────────┐
│     Next.js Frontend    │  ← React 19, TypeScript, Zustand
│   (Port 3000)           │
└────────────┬────────────┘
             │ HTTPS/REST
             ↓
┌─────────────────────────┐
│    FastAPI Backend      │  ← Async, SQLAlchemy 2.0
│   (Port 8000)           │
│                         │
│  • API Routes (v1/v2)   │
│  • Auth/RBAC            │
│  • Business Logic       │
└────────────┬────────────┘
             │ TCP
             ↓
┌─────────────────────────┐
│   PostgreSQL 16         │  ← JSONB fields, GIN indexes
│   (Port 5432)           │
└─────────────────────────┘
```

## Backend Architecture

### Layer Stack

```
┌──────────────────────────────┐
│   FastAPI Application        │  app.main.py
├──────────────────────────────┤
│   Routes (api/v1/...)        │  Endpoint definitions
├──────────────────────────────┤
│   Services (business logic)  │  User stories, workflows
├──────────────────────────────┤
│   Models (ORM)               │  SQLAlchemy models
├──────────────────────────────┤
│   Database Layer             │  AsyncSession, connection pool
└──────────────────────────────┘
```

### Key Design Patterns

#### 1. **Async/Await Throughout**
- All database operations are async-first
- Enables handling 1000+ concurrent annotators
- Non-blocking I/O for database queries

#### 2. **Layered Architecture**
- **Routes**: HTTP endpoint contracts
- **Services**: Business logic, calculations, validations
- **Models**: ORM definitions for database schema
- **Core**: Database connections, configuration

#### 3. **Request/Response Validation**
- All API requests validated with Pydantic schemas
- Automatic OpenAPI documentation generation
- Type-safe request/response handling

#### 4. **Exception Handling**
- Custom `APIException` base class
- Global exception handler middleware
- Consistent error response format:
  ```json
  {
    "error": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "request_id": "uuid",
    "details": { "field": "email" }
  }
  ```

#### 5. **Authentication & Authorization**
- JWT token-based authentication (stateless)
- Role-based access control (RBAC)
- Permissions: read, write, delete, admin
- Protected routes with dependency injection

### Database Schema Design

#### Core Tables

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| `users` | User accounts | id, username, email, password_hash, role |
| `languages` | Language registry | id, iso_code, name, script_direction |
| `treebanks` | Corpus containers | id, name, owner_id, language_id, version |
| `treebank_members` | Collaborations | id, treebank_id, user_id, role |
| `documents` | Source texts | id, treebank_id, title, doc_order |
| `sentences` | CoNLL-U blocks | id, document_id, sent_id, annotation_status |
| `tokens` | Annotation units | id, sentence_id, token_index, form, lemma, upos, ... |
| `annotation_revisions` | Audit log | id, token_id, field_name, old_value, new_value |
| `validation_reports` | CoNLL-U errors | id, sentence_id, rule_id, severity |

#### JSONB Columns (for Flexibility)

- **`tokens.feats`**: Morphological features (e.g., `{"Case": "Dat", "VerbForm": "Fin"}`)
- **`tokens.deps`**: Enhanced UD dependencies (e.g., `[{"head": 4, "rel": "nsubj"}]`)
- **`tokens.misc`**: Miscellaneous metadata (e.g., `{"SpaceAfter": "No"}`)
- **`sentences.metadata`**: CoNLL-U comments preserved as JSON
- **`languages.metadata`**: Flexible metadata (UD treebanks, WALS code, etc.)

#### Indexes (for Performance)

```sql
-- Foreign key lookups
CREATE INDEX ix_sentences_document_order ON sentences(document_id, sent_order);

-- Status queries (Phase 3 review workflow)
CREATE INDEX ix_sentences_status ON sentences(annotation_status);

-- JSONB searches (Phase 4 corpus search)
CREATE INDEX ix_tokens_feats_gin ON tokens USING GIN(feats);
CREATE INDEX ix_tokens_deps_gin ON tokens USING GIN(deps);

-- User attribution
CREATE INDEX ix_revisions_user_timestamp ON annotation_revisions(changed_by, timestamp);
```

### API Versioning

- Current version: `v1` (at `/api/v1/`)
- Future versions deployed alongside (e.g., `/api/v2/`)
- Allows breaking changes without affecting existing clients

### Project Dependencies

**Production:**
- `fastapi` - Web framework
- `sqlalchemy` - ORM
- `asyncpg` - PostgreSQL async driver
- `pydantic` - Request/response validation
- `python-jose` - JWT tokens
- `passlib` - Password hashing
- `uvicorn` - ASGI server

**Development:**
- `pytest` - Unit/integration tests
- `black` - Code formatter
- `mypy` - Type checker
- `ruff` - Linter
- `factory-boy` - Test factories

## Frontend Architecture

### Project Structure

```
frontend/src/
├── app/                  # Next.js App Router
│   ├── (auth)/          # Route group: /login, /register
│   ├── (dashboard)/     # Route group: protected /dashboard routes
│   ├── layout.tsx       # Root layout with providers
│   └── page.tsx         # Home page
│
├── components/          # Reusable React components
│   ├── ui/              # Shadcn/ui primitives
│   ├── common/          # Layout (Nav, Sidebar, Footer)
│   ├── forms/           # Form components
│   └── features/        # Feature-specific components
│
├── hooks/               # Custom React hooks
│   ├── useAuth.ts       # Authentication logic
│   ├── useFetch.ts      # API fetching
│   └── useQuery.ts      # Advanced queries
│
├── services/            # API client layer
│   ├── api.ts           # Axios wrapper
│   ├── auth.ts          # Auth endpoints
│   └── treebanks.ts     # Treebank endpoints
│
├── store/               # Zustand state management
│   ├── authStore.ts     # Auth state
│   ├── treebankStore.ts # Treebank state
│   └── uiStore.ts       # UI state
│
├── types/               # TypeScript types
│   ├── api.ts           # API response types
│   └── models.ts        # Domain model types
│
└── config/              # Configuration
    ├── env.ts           # Environment variables
    └── routes.ts        # Route definitions
```

### State Management Strategy

**Zustand** (not Redux):
- Lightweight (5KB vs 10KB+)
- Simpler API (no actions, reducers)
- Persistent storage support
- Perfect for a single SPA

**Example Store:**
```typescript
export const useAuthStore = create(
  persist((set) => ({
    user: null,
    token: null,
    logout: () => set({ user: null, token: null }),
  }), {
    name: 'auth-storage'  // Persists to localStorage
  })
);
```

### API Client Pattern

**Centralized axios wrapper** for:
- Automatic bearer token injection
- Consistent error handling
- Automatic 401 redirect to login
- Request/response logging
- Retry logic

### Component Organization

**Feature-based structure** (not "containers/presentational"):
```
components/
├── auth/           # Auth-specific components
│   ├── LoginForm.tsx
│   └── RegisterForm.tsx
├── treebanks/      # Treebank-specific components
│   ├── TreebankList.tsx
│   ├── TreebankCard.tsx
│   └── TreebankEditor.tsx
└── annotations/    # Annotation-specific components
    ├── SentenceEditor.tsx
    └── TokenSelector.tsx
```

### Key Frontend Libraries

| Library | Purpose | Why? |
|---------|---------|------|
| Next.js | Full-stack React framework | Server components, built-in routing |
| Zustand | State management | Lightweight, simple API |
| react-hook-form | Form handling | Zero dependencies, great validation |
| axios | HTTP client | Request/response interceptors |
| Tailwind CSS | Styling | Utility-first, fast development |
| Shadcn/ui | UI components | Copy-paste component library |

## Security Architecture

### Authentication Flow

```
┌─────────────────────────┐
│   User enters email     │
│   + password            │
└────────────┬────────────┘
             │
             ↓
┌─────────────────────────┐
│ POST /api/v1/auth/login │
│ (no auth required)      │
└────────────┬────────────┘
             │
             ↓
┌─────────────────────────┐
│ Backend:                │
│ 1. Find user by email   │
│ 2. Verify password      │
│ 3. Generate JWT token   │
│ 4. Return token + user  │
└────────────┬────────────┘
             │
             ↓
┌─────────────────────────┐
│ Frontend stores token   │
│ in Zustand + localStorage
└────────────┬────────────┘
             │
             ↓
┌─────────────────────────┐
│ All requests include:   │
│ Authorization: Bearer X │
└─────────────────────────┘
```

### Role-Based Access Control (RBAC)

```python
PERMISSIONS = {
    "superuser": {read, write, delete, admin},
    "admin": {read, write, delete},
    "reviewer": {read, write},
    "annotator": {read, write}
}
```

Route protection:
```python
@router.get("/api/v1/admin/users")
async def admin_users(
    current_user: User = Depends(get_current_user),
):
    if not RolePermissions.can_admin(current_user.role):
        raise AuthorizationException()
    # ...
```

### Environment Variable Security

**Never committed to git:**
- `.env` files in `.gitignore`
- `JWT_SECRET`, `POSTGRES_PASSWORD`, etc.
- Secrets managed per environment (dev/staging/prod)

## Deployment Strategy

### Development (Docker Compose)

```bash
docker-compose up
# Starts: PostgreSQL, Backend, Frontend
```

### Production (Kubernetes-Ready)

Recommended setup:
1. **PostgreSQL**: Managed service (AWS RDS, etc.)
2. **Backend**: Docker container, auto-scaled
3. **Frontend**: Static hosting (Vercel, Netlify) OR Docker + nginx
4. **Reverse Proxy**: nginx/Caddy for SSL termination

### Environment-Specific Configs

```
.env.development    # Local dev settings
.env.staging        # Staging environment
.env.production     # Production settings
```

## Performance Optimizations

### Backend
- **Async I/O**: All database queries non-blocking
- **Connection Pooling**: 10 connections + 5 overflow
- **Indexes**: GIN indexes on JSONB columns for fast searches
- **Pagination**: Default limit of 50 items per request
- **Caching**: Token validation cached per request

### Frontend
- **Code Splitting**: Automatic with Next.js
- **Image Optimization**: next/image component
- **State Management**: Minimal re-renders with Zustand
- **API Caching**: Axios interceptors for client-side caching

## Scaling Considerations

### Horizontal Scaling
- Backend is stateless (tokens validated per request)
- Multiple backend instances behind load balancer
- PostgreSQL connection pool per instance

### Vertical Scaling
- Increase database `pool_size` for more concurrent users
- Add caching layer (Redis) for frequently accessed data
- Consider read replicas for reporting queries

## Monitoring & Logging

### Backend Logging

Levels: DEBUG, INFO, WARNING, ERROR
```python
from app.logging_config import logger
logger.info(f"[{request_id}] Processing request")
```

### Frontend Error Tracking
- Sentry integration (optional)
- Error boundaries for React crashes
- Console warnings in development

## Future Enhancements

1. **WebSocket Support**: Real-time collaboration (Phase 5)
2. **Full-Text Search**: PostgreSQL full-text or Elasticsearch (Phase 4)
3. **GraphQL API**: Alternative to REST (Phase 4)
4. **Analytics Dashboard**: Usage statistics (Phase 5)
5. **Mobile App**: React Native (Phase 6)

---

For questions or discussions, open an issue on GitHub.
