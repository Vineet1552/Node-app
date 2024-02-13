import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function ShowStudentMarks() {
  const {id} = useParams();
  const [marks, setMarks] = useState([]);

  useEffect(() => {
    async function fetchMarks() {
      try {
        const response = await fetch(`http://localhost:4000/findMarks/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch marks');
        }
        const marksData = await response.json();
        marksData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // decending mee sort

        setMarks(marksData);
      } catch (error) {
        console.error('Error fetching marks:', error);
      }
    }
    fetchMarks();
  }, [id]);

  return (
    <div>
      <h1>Student Marks</h1>
      <ul>
        {marks.map((mark, index) => (
          <li key={index}>
            Subject: {mark.subjectName}, Marks: {mark.marks}
          </li>
        ))}
      </ul>
    </div>
  );
}
