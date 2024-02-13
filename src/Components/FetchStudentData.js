//fetchStudentData.js
// import React, { useState, useEffect } from 'react';
// import '../Components/FetchStudentData.css';
// import { Link } from 'react-router-dom';

// export default function FetchStudentData() {
//   const [studentData, setStudentData] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const itemsPerPage = 5;
//   const pagenumber = [...Array(totalPages).keys()].map(num => num+1);

//   useEffect(() => {
//     fetchData();
//     // eslint-disable-next-line
//   }, [currentPage]); // Run fetchData when currentPage changes

//   async function fetchData() {
//     try {
//       const response = await fetch(`http://localhost:4000/getAllPagination?page=${currentPage}&limit=${itemsPerPage}&firstName=${firstName}`);
//       if (!response.ok) {
//         throw new Error('Failed to fetch data');
//       }
//       const responseData = await response.json();
//       setStudentData(responseData.students);
//       setTotalPages(Math.ceil(responseData.studentlength / itemsPerPage));
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   }
  
//   async function Search(event) {
//     try {
//       const firstName = event.target.value;
//       if(firstName === '') {
//         fetchData();
//       }
//       else {
//         const response = await fetch(`http://localhost:4000/getAllSearch?firstName=${firstName}`);
//         const responseData = await response.json();
//         setStudentData(responseData.students);
//       }

//     } catch (error) {
//       console.error('Error fetching search suggestions:', error);
//     }
//   }

// // async function Search(event) {
// //   try {
// //     const firstName = event.target.value;
// //     let debounceTimer;

// //     clearTimeout(debounceTimer);
    
// //     debounceTimer = setTimeout(async () => {
// //       if(firstName === '') {
// //         fetchData();
// //       } else {
// //         const response = await fetch(`http://localhost:4000/getAllSearch?firstName=${firstName}`);
// //         if (!response.ok) {
// //           throw new Error('faileds');
// //         }
// //         const responseData = await response.json();
// //         setStudentData(responseData.students);
// //       }
// //     }, 400);
// //   } catch (error) {
// //     console.error('Error fetching search suggestions:', error);
// //   }
// // }


//   async function deleteStudent(id) {
//     try {
//       const response = await fetch(`http://localhost:4000/oneDataDelete/${id}`, {
//         method: 'DELETE'
//       });
//       if (!response.ok) {
//         throw new Error('Failed to delete student');
//       }
//       setStudentData(studentData.filter(student => student._id !== id));
//     } catch (error) {
//       console.error('Error deleting student:', error);
//     }
//   }

//   async function addMarksFrontend(Id) {
//     try {
//       const subjectName = prompt("Enter subject name:");
//       const marks = parseInt(prompt("Enter marks:"));

//       if (!subjectName || isNaN(marks)) {
//         alert('Enter the marks and subject name');
//         return;
//       }

//       const response = await fetch(`http://localhost:4000/addMarks/${Id}`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ subjectName, marks })
//       });

//       if (!response.ok) {
//         throw new Error('Failed to add marks');
//       }

//       const responseData = await response.json();
//       // console.log(responseData);
//       return responseData;
//     } catch (error) {
//       console.error('Error adding marks:', error);
//       throw error;
//     }
//   }

//   async function deleteMarks(studentId) {
//     try {
//       const response = await fetch(`http://localhost:4000/deleteMarks/${studentId}`, {
//         method: 'DELETE'
//       });
//       if (!response.ok) {
//         throw new Error('Failed to delete marks');
//       }
//       const updatedStudentData = studentData.filter(student => student._id !== studentId);
//       setStudentData(updatedStudentData);
//     } catch (error) {
//       console.error('Error deleting marks:', error);
//     }
//   }

//   function goToNextPage() {
//     if (currentPage < totalPages) {
//       setCurrentPage(currentPage + 1);
//     }
//   }

//   function goToPrevPage() {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   }

//   function handlePageClick(pgNumber) {
//     setCurrentPage(pgNumber);
//   }

//   function renderStudentRows() {
//     return studentData.map((student, index) => (
//       <tr key={index}>
//         <td>{student.firstName}</td>
//         <td>{student.lastName}</td>
//         <td>{student.dialCode}</td>
//         <td>{student.studentEmail}</td>
//         <td>{student.studentPhone}</td>
//         <td>
//           <Link to={`/showMarks/${student._id}`}>
//             <button type="button" id="but">Show marks</button>
//           </Link>
//         </td>
//         <td>
//           <button type="button" id="but" onClick={() => addMarksFrontend(student._id)}>
//             Add Marks
//           </button>
//         </td>
//         <td>
//           <button type="button" id="but" onClick={() => deleteMarks(student._id)}>
//             Delete Marks
//           </button>
//         </td>
//         <td>
//           <button type="button" id="but" onClick={() => deleteStudent(student._id)}>
//             Delete Student
//           </button>
//         </td>
//       </tr>
//     ));
//   }

//   return (
//     <>
//       <div>
//         <h1>Welcome to the Student Page</h1>
//         <div class="search-container">
//           <input type="text" placeholder="Search.." name="search" onChange={Search} />
//         </div>
//         <table id="myTable">
//           <thead>
//             <tr>
//               <th>First Name</th>
//               <th>Last Name</th>
//               <th>Dial Code</th>
//               <th>Email</th>
//               <th>Phone Number</th>
//               <th>Button for Marks</th>
//               <th>Button for Add Marks</th>
//               <th>Button for Delete Marks</th>
//               <th>Button for Delete Student</th>
//             </tr>
//           </thead>
//           <tbody>{renderStudentRows()}</tbody>
//         </table>
//         <div>
//           <button id='btn2' onClick={goToPrevPage}>Previous Page</button>
//           {pagenumber.map(pgNumber => (
//             <div key={pgNumber} className={`page-item ${currentPage === pgNumber ? 'active' : ''}`}>
//               <ul style={{ cursor: 'pointer' }} onClick={() => handlePageClick(pgNumber)} className='page-link'>{pgNumber}</ul>
//             </div>
//           ))}
//           <button id='btn2' onClick={goToNextPage}>Next Page</button>
//         </div>
//       </div>
//     </>
//   );
// }




import React, { useState, useEffect } from 'react';
import '../Components/FetchStudentData.css';
import { Link } from 'react-router-dom';
import { useDebouncedCallback } from 'use-debounce';

export default function FetchStudentData() {
  const [studentData, setStudentData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5;
  const [searchTerm, setSearchTerm] = useState('');



  const search = useDebouncedCallback((filter) => {
    setSearchTerm(filter);
  }, 500)


  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [currentPage, searchTerm]);

  async function fetchData() {
    try {
      const response = await fetch(`http://localhost:4000/getAllPagination?page=${currentPage}&limit=${itemsPerPage}&firstName=${searchTerm}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const responseData = await response.json();
      setStudentData(responseData.students);
      setTotalPages(Math.ceil(responseData.studentlength / itemsPerPage));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async function deleteStudent(id) {
    try {
      const response = await fetch(`http://localhost:4000/oneDataDelete/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Failed to delete student');
      }
      setStudentData(studentData.filter(student => student._id !== id));
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  }

  async function addMarksFrontend(Id) {
    try {
      const subjectName = prompt("Enter subject name:");
      const marks = parseInt(prompt("Enter marks:"));

      if (!subjectName || isNaN(marks)) {
        alert('Enter the marks and subject name');
        return;
      }

      const response = await fetch(`http://localhost:4000/addMarks/${Id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ subjectName, marks })
      });

      if (!response.ok) {
        throw new Error('Failed to add marks');
      }

      const responseData = await response.json();
      // console.log(responseData);
      return responseData;
    } catch (error) {
      console.error('Error adding marks:', error);
      throw error;
    }
  }

  async function deleteMarks(studentId) {
    try {
      const response = await fetch(`http://localhost:4000/deleteMarks/${studentId}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Failed to delete marks');
      }
      const updatedStudentData = studentData.filter(student => student._id !== studentId);
      setStudentData(updatedStudentData);
    } catch (error) {
      console.error('Error deleting marks:', error);
    }
  }

  function goToNextPage() {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  }

  function goToPrevPage() {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }

  function handlePageClick(pgNumber) {
    setCurrentPage(pgNumber);
  }

  async function handleSearch(event) {
      search(event.target.value);
      setCurrentPage(1);
  }

  function renderStudentRows() {
    return studentData.map((student, index) => (
      <tr key={index}>
        <td>{student.firstName}</td>
        <td>{student.lastName}</td>
        <td>{student.dialCode}</td>
        <td>{student.studentEmail}</td>
        <td>{student.studentPhone}</td>
        <td>
          <Link to={`/showMarks/${student._id}`}>
            <button type="button" id="but">Show marks</button>
          </Link>
        </td>
        <td>
          <button type="button" id="but" onClick={() => addMarksFrontend(student._id)}>
            Add Marks
          </button>
        </td>
        <td>
          <button type="button" id="but" onClick={() => deleteMarks(student._id)}>
            Delete Marks
          </button>
        </td>
        <td>
          <button type="button" id="but" onClick={() => deleteStudent(student._id)}>
            Delete Student
          </button>
        </td>
      </tr>
    ));
  }

  return (
    <>
      <div>
        <h1>Welcome to the Student Page</h1>
        <div className="search-container">
          <input type="text" placeholder="Search.." name="search" onChange={handleSearch} />
        </div>
        <table id="myTable">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Dial Code</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Button for Marks</th>
              <th>Button for Add Marks</th>
              <th>Button for Delete Marks</th>
              <th>Button for Delete Student</th>
            </tr>
          </thead>
          <tbody>{renderStudentRows()}</tbody>
        </table>
        <div>
          <button id='btn2' onClick={goToPrevPage}>Previous Page</button>
          {/* <span>Page {currentPage} of {totalPages}</span> */}
          <ul className="pagination">
            {Array.from(Array(totalPages).keys()).map(pgNumber => (
              <p key={pgNumber} className={`page-item ${currentPage === pgNumber + 1 ? 'active' : ''}`}>
                <span style={{ cursor: 'pointer' }} onClick={() => handlePageClick(pgNumber + 1)} className='page-link'>{pgNumber + 1}</span>
              </p>
            ))}
          </ul>
          <button id='btn2' onClick={goToNextPage}>Next Page</button>
        </div>
      </div>
    </>
  );
}
