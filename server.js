import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allowedOrigins = [
  'https://projek-fetch.futurevl.xyz',
  'https://api.projek-fetch.futurevl.xyz',
  'http://localhost:5173'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const ensureDbDirectory = () => {
  const dbDir = path.join(__dirname, 'db');
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir);
  }
};

const readJsonFile = (filename) => {
  const filePath = path.join(__dirname, 'db', filename);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '[]');
    return [];
  }
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
};

const writeJsonFile = (filename, data) => {
  const filePath = path.join(__dirname, 'db', filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Students Endpoints
app.post('/api/siswa', (req, res) => {
  try {
    ensureDbDirectory();
    const newStudent = req.body;
    const students = readJsonFile('siswa.json');
    students.push(newStudent);
    writeJsonFile('siswa.json', students);
    res.json({ success: true, message: 'Registration successful' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
});

app.get('/api/siswa', (req, res) => {
  try {
    ensureDbDirectory();
    const students = readJsonFile('siswa.json');
    res.json(students);
  } catch (error) {
    res.status(404).json({ error: 'Student data not found' });
  }
});

// Schedule Endpoints
app.get('/api/jadwal', (req, res) => {
  try {
    ensureDbDirectory();
    const schedules = readJsonFile('jadwal.json');
    res.json(schedules);
  } catch (error) {
    res.status(404).json({ error: 'Schedule data not found' });
  }
});

app.post('/api/jadwal', (req, res) => {
  try {
    ensureDbDirectory();
    const newSchedule = req.body;
    const schedules = readJsonFile('jadwal.json');
    schedules.push(newSchedule);
    writeJsonFile('jadwal.json', schedules);
    res.json({ success: true, message: 'Schedule added successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add schedule' });
  }
});

app.put('/api/jadwal/:index', (req, res) => {
  try {
    ensureDbDirectory();
    const index = parseInt(req.params.index);
    const updatedSchedule = req.body;
    const schedules = readJsonFile('jadwal.json');
    
    if (index >= 0 && index < schedules.length) {
      schedules[index] = updatedSchedule;
      writeJsonFile('jadwal.json', schedules);
      res.json({ success: true, message: 'Schedule updated successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Schedule not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update schedule' });
  }
});

app.delete('/api/jadwal/:index', (req, res) => {
  try {
    ensureDbDirectory();
    const index = parseInt(req.params.index);
    const schedules = readJsonFile('jadwal.json');
    
    if (index >= 0 && index < schedules.length) {
      schedules.splice(index, 1);
      writeJsonFile('jadwal.json', schedules);
      res.json({ success: true, message: 'Schedule deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Schedule not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete schedule' });
  }
});

// Announcement Endpoints
app.get('/api/pengumuman', (req, res) => {
  try {
    ensureDbDirectory();
    const announcements = readJsonFile('pengumuman.json');
    res.json(announcements);
  } catch (error) {
    res.status(404).json({ error: 'Announcement data not found' });
  }
});

app.post('/api/pengumuman', (req, res) => {
  try {
    ensureDbDirectory();
    const newAnnouncement = req.body;
    const announcements = readJsonFile('pengumuman.json');
    announcements.push(newAnnouncement);
    writeJsonFile('pengumuman.json', announcements);
    res.json({ success: true, message: 'Announcement added successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add announcement' });
  }
});

app.put('/api/pengumuman/:index', (req, res) => {
  try {
    ensureDbDirectory();
    const index = parseInt(req.params.index);
    const updatedAnnouncement = req.body;
    const announcements = readJsonFile('pengumuman.json');
    
    if (index >= 0 && index < announcements.length) {
      announcements[index] = updatedAnnouncement;
      writeJsonFile('pengumuman.json', announcements);
      res.json({ success: true, message: 'Announcement updated successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Announcement not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update announcement' });
  }
});

app.delete('/api/pengumuman/:index', (req, res) => {
  try {
    ensureDbDirectory();
    const index = parseInt(req.params.index);
    const announcements = readJsonFile('pengumuman.json');
    
    if (index >= 0 && index < announcements.length) {
      announcements.splice(index, 1);
      writeJsonFile('pengumuman.json', announcements);
      res.json({ success: true, message: 'Announcement deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Announcement not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete announcement' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});