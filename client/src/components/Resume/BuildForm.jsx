import { useState } from 'react'
import React from 'react'
import './BuildForm.css'
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import ResumeComponent from './ResumeComponent';
import axios from 'axios'

const BuldForm = () => {
    const [formData, setFormData] = useState(null); 
    const [tags, setTags] = useState([])
    const URL = import.meta.env.VITE_REACT_APP_URL;

    function handleKeyDown(e){
        if(e.key !== 'Enter') return
        e.preventDefault();
        const value = e.target.value

        if(!value.trim()) return

        setTags([...tags, value])
        e.target.value = ''
    }

    function removeTag(index){
        setTags(tags.filter((el, i) => i !== index))
    }


    

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const formElements = e.target.elements;
    const data = {
      email: formElements.floating_email.value,
      city: formElements.floating_city.value,
      state: formElements.floating_city.value,
      name:  formElements.floating_first_name.value +  formElements.floating_last_name.value,
      mobile: formElements.floating_phone.value,
      company :formElements.floating_company.value,
      skills : tags

    };
    
    setFormData(data); 
    setTimeout(() => handleDownloadPDF(data), 0);
  };

  const handleDownloadPDF = (data) => {
    const resumeElement = document.getElementById('resume');
    
    html2canvas(resumeElement, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
      });
      pdf.addImage(imgData, 'PNG', 0, 0, 210, 280);
      // pdf.save('resume.pdf');
      const pdfBlob = pdf.output('blob');
      uploadFormDataAndPdf(data, pdfBlob);
    });
  };

  const uploadFormDataAndPdf = async (formData, pdfBlob) => {
    const form = new FormData();
    

    // Append form data
    form.append('email', formData.email);
    form.append('city', formData.city);
    form.append('state', formData.state);
    form.append('name', formData.name);
    form.append('phoneNumber', formData.mobile);
    form.append('exCompany', formData.company);
    form.append('skills', formData.skills);
    // Append the PDF Blob as a file
    form.append('resume', pdfBlob, 'resume.pdf');
    console.log(form);
    
    
    try {
      const response = await axios({
        method: 'post',
        url: URL + '/api/auth/resume/upload',
        data: form,
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      // Send form data and PDF to the backend
      

      if (response.status === 200) {
        alert('Form data and resume PDF successfully uploaded!');
      }
    } catch (error) {
      console.error('Error uploading form data and PDF:', error);
      alert('There was an error uploading the data.');
    }
  };
  
  return (

   <div>
    {!formData?(
   
    <form class="max-w-md mx-auto mt-4" onSubmit={handleFormSubmit}>
      <div class="relative z-0 w-full mb-5 group">
          <input type="email" name="floating_email" id="floating_email" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
          <label for="floating_email" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email address</label>
      </div>
      <div class="relative z-0 w-full mb-5 group">
          <input type="text" name="floating_city" id="floating_password" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
          <label for="floating_password" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Present City</label>
      </div>
      <div class="relative z-0 w-full mb-5 group">
          <input type="text" name="floating_state" id="floating_repeat_password" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
          <label for="floating_repeat_password" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Present State</label>
      </div>
      <div class="grid md:grid-cols-2 md:gap-6">
        <div class="relative z-0 w-full mb-5 group">
            <input type="text" name="floating_first_name" id="floating_first_name" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
            <label for="floating_first_name" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">First name</label>
        </div>
        <div class="relative z-0 w-full mb-5 group">
            <input type="text" name="floating_last_name" id="floating_last_name" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
            <label for="floating_last_name" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Last name</label>
        </div>
      </div>
      <div class="grid md:grid-cols-2 md:gap-6">
        <div class="relative z-0 w-full mb-5 group">
            <input type="tel"  name="floating_phone" id="floating_phone" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
            <label for="floating_phone" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Phone number</label>
        </div>
        <div class="relative z-0 w-full mb-5 group">
            <input type="text" name="floating_company" id="floating_company" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
            <label for="floating_company" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Company (Ex. Google)</label>
        </div>
        <div className="tags-input-container">
            { tags.map((tag, index) => (
                <div className="tag-item" key={index}>
                    <span className="text">{tag}</span>
                    <span className="close" onClick={() => removeTag(index)}>&times;</span>
                </div>
            )) }
            <input onKeyDown={handleKeyDown} type="text" className="tags-input" placeholder="Add Skills" />
        </div>
      </div>
      <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
    </form>):
    (formData && <ResumeComponent data={formData} />)}
    
    </div>
  )
}

export default BuldForm