import express from 'express'
import upload from '../middleware/upload.js'
import { uploadResume,getAllResumes,downloadResume} from '../controller/resumeController.js';

const resumeRouter = express.Router()


resumeRouter.get('/resumes', getAllResumes);         // GET all resumes
resumeRouter.post('/upload', upload.single('resume'), uploadResume);  // POST resume with form data
resumeRouter.get('/download/:filename', downloadResume);

export default resumeRouter;