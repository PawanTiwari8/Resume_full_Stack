import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ShowResume = () => {
  const [resumes, setResumes] = useState([]);
  const URL = import.meta.env.VITE_REACT_APP_URL;
  


  const fetchResumeDetails = (resumePath)=>{
    console.log(resumePath)
    try{
    axios({
      url: `${URL}/api/auth/resume/download/${resumePath.split('/').pop()}`, // Extract filename from path
      method: 'GET',
      responseType: 'blob', // Important for file download

    }).then((response) => {
      console.log(response)
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      console.log(link)
      link.setAttribute('download', 'resume.pdf'); // Set default name for downloaded file
      document.body.appendChild(link);
      link.click();
    });
  } catch (error) {
    console.error('Failed to fetch resume details', error);
  }
  }
  // Fetch the list of resumes from the backend when the component mounts
  useEffect(() => {
    axios.get(`${URL}/api/auth/resume/resumes` )
      .then(response => {
        console.log(response);
        setResumes(response.data);
      })
      .catch(error => {
        console.error('Error fetching resumes:', error);
      });
  }, []);

  if (resumes.length === 0) {
    return <div>No resumes found</div>;
  }

  return (
    <div>
      <h1 className='text-slate-50'>Resume List</h1>
      <table className=' border-2'> 
        <thead className='text-slate-50 border-2'>
          <tr>
            <th className='border-2'>First Name</th>
            <th className='border-2'>Last Name</th>
            <th className='border-2'>Email</th>
            <th className='border-2'>Phone Number</th>
            <th className='border-2'>Download Resume</th>
          </tr>
        </thead>
        <tbody className=' text-slate-50 border-2'>
          {resumes.map((resume) => (
            <tr key={resume._id}>
              <td className='border-2'>{resume.name}</td>
              <td className='border-2'>{resume.city}</td>
              <td className='border-2'>{resume.email}</td>
              <td className='border-2'>{resume.phoneNumber}</td>
              <td className='border-2'>
              <button onClick={()=>fetchResumeDetails(resume.resumePath)}>Download Resume</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShowResume;
