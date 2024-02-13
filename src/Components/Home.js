
//Home.js
import React from 'react'
import { Link } from 'react-router-dom'
import '../Components/Home.css'

export default function Home() {
  return (
    <>
    <h1>welcome to student management center</h1>
    <Link to='/fetchData'><button id='but'>fetchData</button></Link>
    <Link to='/addStudent'><button id='but'>Add Student</button></Link>
    </>
  )
}
