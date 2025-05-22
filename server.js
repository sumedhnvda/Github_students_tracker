import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import axios from 'axios';

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
mongoose.connect(
  'mongodb+srv://sumedhnavuda:%408217nvda@cluster0.evh93.mongodb.net/my_students?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true }
);

// Student Schema
const studentSchema = new mongoose.Schema({
  githubId: String,
  login: String,
  name: String,
  avatar_url: String,
});

const Student = mongoose.model('Student', studentSchema);

// Add student endpoint
app.post('/api/students/add', async (req, res) => {
  try {
    const { githubId, login, name, avatar_url, commits } = req.body;
    // Prevent duplicates
    let student = await Student.findOne({ githubId });
    if (!student) {
      student = new Student({ githubId, login, name, avatar_url,});
      await student.save();
    }
    res.status(201).json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get students ranked by commits
app.get('/api/students/ranked', async (req, res) => {
  const students = await Student.find().sort({ commits: -1 });
  res.json(students);
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));