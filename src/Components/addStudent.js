// AddStudent.js
import React, { useState } from 'react';
import '../Components/addStudent.css'


export default function AddStudent() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    studentEmail: '',
    studentPhone: '',
    dialCode: '',
    password: '',
  });

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/dataCreation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        throw new Error('Failed to add student');
      }
      alert('Student added successfully!');
      setFormData({
        firstName: '',
        lastName: '',
        studentEmail: '',
        studentPhone: '',
        dialCode: '',
        password: '',
      });
    } catch (error) {
      console.error('Error adding student:', error);
      alert('Failed to add student. Please try again.');
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  }

  return (
    <div>
      <h1>Add Student in DataBase</h1>
      <form onSubmit={handleSubmit} id='container'>
        <label>
          First Name:
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
        </label>
        <label>
          Last Name:
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
        </label>
        <label>
          Email:
          <input type="email" name="studentEmail" value={formData.studentEmail} onChange={handleChange} required />
        </label>
        <label>
          Phone Number:
          <input type="tel" name="studentPhone" value={formData.studentPhone} onChange={handleChange} required />
        </label>
        <label>
          Dial Code:
          <input type="tel" name="dialCode" value={formData.dialCode} onChange={handleChange} required />
        </label>
        <label>
          Password:
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </label>
        <button type="submit" id='but1'>Add Student</button>
      </form>
    </div>
  );
}



