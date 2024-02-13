// methods.js

const express = require('express');
const { Data1, Data2 } = require('../Model/model');
const joi = require('joi');
// const dataValidator = require('../Validator/Validation');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const secretkey = "secretkey";
const { v4: uuidv4 } = require("uuid");
const { dataValidator } = require('../Validator/Validation');
const mongoose = require('mongoose');
const Agenda = require("agenda");

// get all student data api
const getAll = async(req, res) => {
    try {
        const student = await Data1.find({},{jti:0, password:0});
        return res.send(student);
    } catch (error) {
        console.error("Error saving data:", error);
        res.status(500).send("Internal server error");
    }
}

// student data creation api
// const dataCreation = async (req, res) => {
//     try {

//         const email = req.body.studentEmail;
//         const phone = req.body.studentPhone;

//         const existingStudent = await Data1.findOne({ studentEmail: email, studentPhone: phone });
//         if (existingStudent) {
//             return res.send({
//                 msg: "User already exists",
//             });
//         }

//         // Hash the password
//         const hashedPassword = await bcrypt.hash(req.body.password, 10);

//         // Create a new user object with the hashed password
//         const newStudent = {
//             firstName: req.body.firstName,
//             lastName: req.body.lastName,
//             studentEmail: req.body.studentEmail,
//             studentPhone: req.body.studentPhone,
//             dialCode: req.body.dialCode,
//             password: hashedPassword, // Assign the hashed password
//         };

//         // Create the user in the database
//         await Data1.create(newStudent);

//         await sendMail(email);
//         // Send success response
//         res.send("Data created");
//     } catch (error) {
//         // Handle errors
//         console.error("Error saving data:", error);
//         res.status(500).send("Internal server error");
//     }
// };




//datacreation with validations
const dataCreation = async (req, res) => {
    try {
        const{
            studentEmail,
            studentPhone
        } = req.body;

        await dataValidator.validateAsync(req.body);

        const existingStudent = await Data1.findOne({ studentEmail: studentEmail, studentPhone: studentPhone });
        if (existingStudent) {
            return res.send({
                msg: "User already exists",
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // Create a new user object with the hashed password
        const newStudent = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            studentEmail: req.body.studentEmail,
            studentPhone: req.body.studentPhone,
            dialCode: req.body.dialCode,
            password: hashedPassword, // Assign the hashed password
        };

        // Create the user in the database
        await Data1.create(newStudent);

        await sendMail(studentEmail);
        // Send success response
        res.send("Data created");
    } catch (error) {
        // Handle errors
        console.error("Error saving data:", error);
        res.status(500).send("Internal server error");
    }
};

// if student data created send mail to the student - function
async function sendMail(email) {
    const transporter  = nodemailer.createTransport({
        service : 'gmail',
        auth: {
            user : 'vermavineet688@gmail.com',
            pass: 'tdpe jfbr jxgp wnyr'
        }
    });

    const mailOptions = {
        from : 'vermavineet688@gmail.com',
        to: email,
        subject: 'Welcome',
        html : `<h1>hello welcome to our team</h1>`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Email send failed with error:', error);
    }
}


// student one data deletion api
const oneDataDelete = async(req, res) => {
    try {
        const ID = req.params._id;
        const data = await Data1.findByIdAndDelete(ID);
        if(!data) {
            res.send("student with that id is not present");
        }
        else {
            res.send("deleted");
        }
    } catch (error) {
        console.error("Error saving data:", error);
        res.status(500).send("Internal server error");
    }
}


// one student find by id api
const findOneStudent = async(req, res) => {
    try {
        const ID = req.params._id;
        const data = await Data1.findById(ID).select('-password');
        res.send(data);
    } catch (error) {
        console.error("Error saving data:", error);
        res.status(500).send("Internal server error");
    }
}

// updation of student data
const updateOneStudentData = async(req, res) => {
    try {
        const ID = req.params._id;
        const data = await Data1.findByIdAndUpdate(ID, req.body, { new: true });
        
        if (!data) {
            return res.status(400).send("Student not found");
        }
        
        res.send(data); // Send updated data
    } catch (error) {
        console.error("Error updating student data:", error);
        res.status(500).send("Internal server error");
    }
}


// student login - concept jwt - token
const Login = async (req, res) => {
    try {
        const { studentEmail, password } = req.body;

        const student = await Data1.findOne({ studentEmail });

        if (!student) {
            return res.status(400).json({ msg: "Student not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, student.password);

        if (isPasswordValid) {
            const jti = uuidv4(); // Generate unique token identifier
            // Update user document with new token
            await Data1.updateOne({ _id: student._id }, { $set: { jti: jti } });
            jwt.sign({ studentId: student._id, jti: jti }, secretkey, { expiresIn: '300s' }, (error, token) => {
                if (error) {
                    console.error("Error generating token:", error);
                    return res.status(500).json({ error: "Internal server error" });
                }
                res.json({ token });
            });
        } else {
            res.status(401).json({ msg: "Invalid password" });
        }
    } catch (error) {
        console.error("Error logging in:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const verifyLogin = async(req, res) => {
    jwt.verify(req.token, secretkey, async(err, authData) => {
        if(err) {
            console.error("Error verifying token:", err);
            return res.status(403).json({ msg: "Forbidden" });
        }
        try {
            const studentData = await Data1.findOne({ _id: authData.studentId}); // , jti: authData.jti we have removed this 
            if(!studentData) {
                return res.status(400).json({ msg: "Student not found or invalid token" });
            }
            res.json({
                msg: "Profile accessed",
                user: studentData
            });
        } catch (error) {
            console.error("Error accessing profile:", error);
            res.status(500).json({ msg: "Internal server error" });
        }
    });
}


// student marks witrh ref Data1
const addMarks = async(req, res) => {
    // const {
    //     subjectName,
    //     marks
    // } = req.body;
    id = req.params._id;
    subjectName = req.body.subjectName;
    marks = req.body.marks;


    const data = {
        id: id,
        subjectName: subjectName,
        marks: marks
    }
    await Data2.create(data);
    res.send("marks data created");
}

// fetching marks
const findMarks = async (req, res) => {
    try {
        const id = req.params.id;
        
        // Finding student with the Data1 objectid
        const student = await Data1.findById(id);
        
        if (!student) {
            return res.status(404).send('Student not found');
        }
        // console.log(student);

        // Use the student's ID to find associated marks in Data2
        const marks = await Data2.find({ id: student._id });   // student._id Data1 mee jo object id hai woh hai ye
        // console.log(id); // student id (Data1 object id that we ref in Data2)
        // console.log(student._id);

        if (!marks) {
            return res.status(404).send('Marks not found');
        }

        res.send(marks);
    } catch (error) {
        console.error('Error finding marks:', error);
        res.status(500).send('Internal server error');
    }
};

// delete marks
const deleteMarks = async (req, res) => {
    try {
      const studentId = req.params.id;
  
      // Delete all marks for the specified student
      const deletedMarks = await Data2.deleteMany({ id: studentId });
  
      res.status(200).json({ message: `Deleted all marks for student with ID ${studentId}` });
    } catch (error) {
      console.error("Error deleting marks:", error);
      res.status(500).send("Internal server error");
    }
}



// agenda

const agenda = new Agenda({db:{address:'mongodb://0.0.0.0:27017/STUDENTINFO'}});
agenda.define('sendConfirmationEmail', async (job) => {
    try {
        const { studentEmail } = job.attrs.data;
        
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'vermavineet688@gmail.com',
                pass: 'tdpe jfbr jxgp wnyr'
            }
        });
        
        await transporter.sendMail({
            from: 'vermavineet688@gmail.com',
      to: studentEmail,
      subject: 'Email Confirmation',
      text: 'Confirmation done!'
    });
    console.log(`Confirmation email sent to ${studentEmail}`);
} catch (error) {
    console.error('Error sending confirmation email:', error);
}
});

// // Define the agenda function to create data and schedule email
const agendaFunction = async (req, res) => {
    try {
        const { studentEmail } = req.body;
        
        // Create data
        await Data1.create(req.body);
        // console.log(studentEmail);
        console.log(studentEmail);
        await agenda.schedule('in 20 seconds', 'sendConfirmationEmail',  {studentEmail} );
        res.send('Data created. Confirmation email will be sent to the student after 10 seconds.');
    } catch (error) {
        console.error('Error creating data or scheduling email:', error);
        res.status(500).send('Internal server error');
    }
};
agenda.start();


//get all data with pagination
// const getAllPagination = async (req, res) => {
//     const { page, limit } = req.query;
  
//     try {
//       const studentlength = await Data1.countDocuments();
//       const students = await Data1.find({}, { jti: 0, password: 0 })
//         .skip((parseInt(page) - 1) * parseInt(limit)).limit(parseInt(limit));
  
//       return res.json({ students, studentlength });
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       res.status(500).send('Internal server error');
//     }
//   };


// // search bar get data
// const getAllSearch = async (req, res) => {
//     try {
//         const { firstName } = req.query;
//         const regex = new RegExp(firstName, 'i');
//         const students = await Data1.find({ firstName: { $regex: regex } }, {jti:0, password:0});
//         return res.json({ students });
//     } catch (error) {
//         console.error('Error fetching search suggestions:', error);
//         res.status(500).send('Internal server error');
//     }
// };


// pagination and searchbar in one 
const getAllPagination = async (req, res) => {
    const { page, limit, firstName } = req.query; 
  
    try {
      let students;
      let studentlength;

      if (firstName) {
        const regex = new RegExp(firstName, 'i');
        students = await Data1.find({ firstName: { $regex: regex } }, { jti: 0, password: 0 })
          .skip((parseInt(page) - 1) * parseInt(limit)).limit(parseInt(limit));
        studentlength = await Data1.countDocuments({ firstName: { $regex: regex } });
      } else {
        studentlength = await Data1.countDocuments();
        students = await Data1.find({}, { jti: 0, password: 0 })
          .skip((parseInt(page) - 1) * parseInt(limit)).limit(parseInt(limit));
      }

      return res.json({ students, studentlength });
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).send('Internal server error');
    }
};





module.exports = {
    getAll,
    dataCreation,
    oneDataDelete,
    findOneStudent,
    updateOneStudentData,
    Login,
    verifyLogin,
    addMarks,
    findMarks,
    deleteMarks,
    getAllPagination,
    agendaFunction,
    // getAllSearch,
}
