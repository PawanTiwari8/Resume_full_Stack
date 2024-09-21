import Resume from '../models/resumeSchema.js'
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

  export const uploadResume = (req,res) =>{
    const { email, city, state, name, exCompany,phoneNumber,skills } = req.body;
    const path = req.file.path.replace(/\\/g, '/');
    const newResume = new Resume({
      email,
      city,
      state,
      name,
      exCompany,
      phoneNumber,
      skills:skills.split(','),
      resumePath: path,  // Save the file path in the database
    });
  
    newResume.save()
      .then(() => res.status(200).json({ message: 'Resume saved successfully!' }))
      .catch(err => res.status(500).json({ error: 'Error saving resume', err }));
  }

  export const getAllResumes = async (req,res)=>{
    try {
        const resumes = await Resume.find();  // Fetch all resumes
        console.log(resumes);
        
        res.status(200).json(resumes);        // Send resumes as JSON
      } catch (error) {
        res.status(500).json({ error: 'Error fetching resumes', error });
      }
  }
  
  export const downloadResume =  async(req, res) => {
    console.log(req.params.filename)
    const filePath = path.join(__dirname, '../uploads/', req.params.filename); // Replace 'uploads' with the correct folder path
    console.log(filePath)
    res.download(filePath, (err) => {
      if (err) {
        console.log(err);
        res.status(500).send({
          message: 'File could not be downloaded.',
        });
      }
    });
  }
