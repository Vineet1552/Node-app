// app.js
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Components/Home';
import FetchStudentData from './Components/FetchStudentData';
import ShowStudentMarks from './Components/showStudentMarks';
import AddStudent from './Components/addStudent';

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/fetchData' element={<FetchStudentData/>}/>
        <Route path="/showMarks/:id" element={<ShowStudentMarks />} />
        <Route path="/addStudent" element={<AddStudent />} />

      </Routes>
    </Router>
    </>
  );
}

export default App;
