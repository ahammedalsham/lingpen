# Contributing to LingPen

Thank you for your interest in contributing! This document outlines guidelines for contributing code, documentation, and issues.

## Code of Conduct

- Be respectful and inclusive
- Focus feedback on ideas, not people
- Welcome diverse perspectives
- Report violations to the maintainers

## Getting Started

### Fork & Clone

```bash
git clone https://github.com/yourusername/LingPen.git
cd lingpen
git remote add upstream https://github.com/ahammedalsham/LingPen.git
```

### Setup Development Environment

See [README.md](./README.md) for setup instructions.

## Development Workflow

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

Use descriptive names:
- ✅ `feature/add-export-conllu`
- ✅ `fix/sentence-locking-race-condition`
- ❌ `feature/stuff`
- ❌ `fix/bug`

### 2. Make Changes

- Write clean, readable code
- Add comments for complex logic
- Follow the style guidelines (see below)
- Add or update tests for your changes
- Update documentation as needed

### 3. Run Tests & Linting

**Backend:**
```bash
cd backend

# Format code
black .

# Check types
mypy app --ignore-missing-imports

# Lint
ruff check .

# Run tests
pytest tests/ -v --cov=app
```

**Frontend:**
```bash
cd frontend

# Format code
npm run lint:fix

# Type checking
npm run type-check

# Run tests
npm test

# Build check
npm run build
```

### 4. Commit Changes

Use clear, descriptive commit messages:

```
git commit -m "feat: add CoNLL-U export endpoint

- Implement /api/v1/export/conllu route
- Add ExportService with CoNLL-U formatting
- Add tests for export validation"
```

Format: `<type>: <subject>`

Types: `feat`, `fix`, `docs`, `test`, `refactor`, `perf`, `chore`

### 5. Push & Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a PR on GitHub with:
- Clear title and description
- Links to related issues
- Screenshots (if UI changes)
- Test results

## Code Style Guidelines

### Python (Backend)

**Format & Lint:**
```bash
black app/
ruff check app/ --fix
mypy app/ --ignore-missing-imports
```

**Naming Conventions:**
- Functions: `snake_case` 
- Classes: `PascalCase`
- Constants: `UPPER_CASE`
- Private: `_leading_underscore`

**Docstrings:**
```python
def create_user(email: str, password: str) -> User:
    """
    Create a new user account.
    
    Args:
        email: User's email address
        password: Plain-text password (will be hashed)
    
    Returns:
        Newly created User object
    
    Raises:
        ConflictException: If email already exists
    """
    # implementation
```

**Type Hints:**
```python
# Always use type hints
def process_tokens(
    tokens: list[Token],
    user_id: int,
) -> dict[str, Any]:
    pass

# Optional types
from typing import Optional
def find_user(user_id: int) -> Optional[User]:
    pass
```

### TypeScript (Frontend)

**Format & Lint:**
```bash
npm run lint:fix
npm run type-check
```

**Naming Conventions:**
- Functions: `camelCase`
- Types/Interfaces: `PascalCase`
- Constants: `UPPER_CASE`
- Files: `kebab-case` (components) or `camelCase` (utils)

**Types:**
```typescript
// Use explicit types, not `any`
interface User {
  id: number;
  email: string;
  role: 'annotator' | 'reviewer' | 'admin';
}

const processUser = (user: User): string => {
  return user.email;
};
```

**React Components:**
```typescript
interface TreebankListProps {
  treebanks: Treebank[];
  onSelect: (id: number) => void;
  isLoading?: boolean;
}

export const TreebankList: React.FC<TreebankListProps> = ({
  treebanks,
  onSelect,
  isLoading = false,
}) => {
  // component logic
};
```

## Testing Requirements

### Backend Tests

- **Unit tests** for services and utilities
- **Integration tests** for API endpoints
- Minimum 70% code coverage

Example:
```python
# tests/unit/test_auth.py
def test_hash_password():
    password = "test_pass"
    hashed = hash_password(password)
    assert verify_password(password, hashed)

# tests/integration/test_user_endpoints.py
def test_create_user(client):
    response = client.post("/api/v1/users", json={
        "email": "test@example.com",
        "password": "securepass123"
    })
    assert response.status_code == 201
```

### Frontend Tests

- **Component tests** with React Testing Library
- **Hook tests** for custom hooks
- Minimum 60% code coverage

Example:
```typescript
// components/treebanks/__tests__/TreebankList.test.tsx
import { render, screen } from '@testing-library/react';
import { TreebankList } from '../TreebankList';

test('renders treebank list', () => {
  const treebanks = [{ id: 1, name: 'Test' }];
  render(<TreebankList treebanks={treebanks} onSelect={jest.fn()} />);
  expect(screen.getByText('Test')).toBeInTheDocument();
});
```

## Documentation

### Update README.md

If your change affects user-facing functionality, update:
- Feature list
- Quick start instructions
- Troubleshooting section

### Add Docstrings

Every public function should have a docstring explaining:
- What it does
- Parameters and return type
- Exceptions it raises
- Example usage (if complex)

### Update ARCHITECTURE.md

For significant architectural changes, update:
- System diagrams
- Design decisions
- Database schema (if changed)

## Pull Request Review

Checklist before submitting:
- [ ] Tests added/updated
- [ ] Code formatted and linted
- [ ] Types check correctly
- [ ] Documentation updated
- [ ] No console errors/warnings
- [ ] Commit messages are descriptive
- [ ] Branch is up-to-date with main

## Reporting Issues

Use GitHub Issues with clear templates:

**Bug Report:**
- Description of issue
- Steps to reproduce
- Expected vs actual behavior
- Environment (OS, browser, versions)
- Screenshots/logs

**Feature Request:**
- Problem statement
- Proposed solution
- Alternative approaches
- Use cases

**Security Issue:**
- Do NOT create public issue
- Email maintainers directly
- Include proof-of-concept

## Deployment & Releases

### Release Process

1. Update version in `package.json` and `pyproject.toml`
2. Update `CHANGELOG.md` with changes
3. Create git tag: `git tag v0.2.0`
4. Push tag: `git push origin v0.2.0`
5. GitHub Actions auto-builds and deploys

### Semantic Versioning

- `MAJOR.MINOR.PATCH` (e.g., `1.2.3`)
- MAJOR: Breaking changes
- MINOR: New features (backward compatible)
- PATCH: Bug fixes

## Questions?

- **Documentation**: See [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Issues**: Open GitHub issue with question label
- **Discussions**: Use GitHub Discussions for design decisions

---

Happy contributing! 🎉
