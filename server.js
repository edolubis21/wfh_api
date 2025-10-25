import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import authRoutes from './routes/auth.js';
import attendanceRoutes from './routes/attendance.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// prefix all with /api
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);

app.get('/', (req, res) => res.send({ message: 'WFH Attendance API', status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
})
