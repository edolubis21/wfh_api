# WFH Attendance API (Express + MySQL + JWT)

## Setup

1. Copy `.env.example` to `.env` and update DB credentials + JWT_SECRET.
2. Create database and tables using `migrations.sql`.
   ```bash
   mysql -u root -p < migrations.sql
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run:
   ```bash
   npm run dev
   ```

## Endpoints

- POST /api/auth/register
- POST /api/auth/login
- POST /api/attendance/checkin (Bearer token)
- POST /api/attendance/checkout (Bearer token)
- GET /api/attendance (Bearer token)
# wfh_api
