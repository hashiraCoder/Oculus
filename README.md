
```
Oculus
├─ Backend
│  ├─ .env
│  ├─ app.js
│  ├─ auth
│  │  └─ services
│  │     ├─ index.js
│  │     ├─ login.service.js
│  │     ├─ logout.service.js
│  │     ├─ refresh-token.service.js
│  │     ├─ register.service.js
│  │     └─ session.service.js
│  ├─ config
│  │  ├─ db.js
│  │  ├─ env.js
│  │  ├─ logger.js
│  │  └─ redis.js
│  ├─ controllers
│  │  └─ auth.controller.js
│  ├─ database
│  │  ├─ db.connection.js
│  │  ├─ migrate.js
│  │  ├─ migrations
│  │  ├─ schema
│  │  │  ├─ enums.sql
│  │  │  ├─ indexes.sql
│  │  │  ├─ refresh_sessions.sql
│  │  │  ├─ repositories.sql
│  │  │  ├─ scans.sql
│  │  │  ├─ users.sql
│  │  │  ├─ users_workspaces.sql
│  │  │  ├─ vulnerabilities.sql
│  │  │  └─ workspaces.sql
│  │  └─ seeds
│  ├─ logs
│  │  ├─ combined.log
│  │  └─ error.log
│  ├─ middleware
│  │  ├─ auth.middleware.js
│  │  ├─ error.middleware.js
│  │  ├─ logger.middleware.js
│  │  └─ rateLimit.middleware.js
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ repositories
│  │  ├─ repository.repository.js
│  │  ├─ scan.repository.js
│  │  ├─ user.repository.js
│  │  ├─ vulnerability.repository.js
│  │  └─ workspace.repository.js
│  ├─ routes
│  │  └─ user.routes.js
│  ├─ server.js
│  ├─ services
│  │  ├─ auth.service.js
│  │  └─ lockout.service.js
│  ├─ utils
│  │  ├─ apiError.js
│  │  ├─ apiResponse.js
│  │  ├─ asyncHandler.js
│  │  ├─ jwt.js
│  │  ├─ loginLimiter.js
│  │  ├─ password.js
│  │  └─ validator.js
│  └─ validators
│     ├─ auth.validator.js
│     ├─ repository.validator.js
│     ├─ scan.validator.js
│     ├─ vulnerability.validator.js
│     └─ workspace.validator.js
├─ Frontend
└─ package-lock.json

```
/**
 * Returns every workspace the user belongs to.
 *
 * Intentionally not paginated because:
 * - Used during authentication
 * - Expected cardinality is small (<100)
 * - Required for workspace selection after login
 */