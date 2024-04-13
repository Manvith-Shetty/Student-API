import dotenv from 'dotenv';
import express from "express";
import bodyParser from "body-parser";
import fs from 'fs';
import students from './student.json' assert {type: 'json'};
dotenv.config();

const app = express();
const PORT = 3000;

//middleware
app.use(bodyParser.urlencoded({ extended: true}));

//GET students
app.get("/api/students", (req, res)=>{
    return res.json(students);
})

app.get("/students", (req, res)=>{
    const html = `
    <ol>
        ${students.map((students)=>`<li>${students.first_name} ${students.usn}</li></li>`).join("")}
    </ol>
    `;
    return res.send(html);
})

app.get("/api/students/filter", (req, res)=>{
    const gender = req.query.gender;
    const filteredStudents = students.filter((student)=>student.gender === gender);
    console.log(filteredStudents);
    return res.status(200).json(filteredStudents);
})

//Handles GET, PATCH And DELETE routes
app
    .route("/api/students/:id")
    //GET student details
    .get((req, res)=>{
        //req.params.id gives string. So convert it into int
        const id =  Number(req.params.id);
        const studentIndex = students.findIndex((student)=>student.id === id);
        if(studentIndex > -1)
            return res.status(200).json(students[studentIndex]);
        else    
            return res.status(404).json({message: `Student with id: ${id} not found.`});
    })
    //PATCH student details(Only overwrites data sent from client)
    .patch((req, res)=>{
        const id = parseInt(req.params.id);
        //data from client which can have some or all prop
        const body = req.body;
        const searchIndex = students.findIndex((student)=>student.id == id);
        if(searchIndex > -1){
            //if student with id exists
            //get student data
            const existingStudent = students.find((student)=> student.id === id);
            //New student data to replace
            const replacementStudent = {
                id: id,
                //If body.first_name is not null(user entered new first_name) then update stduent. else existing student first_name
                first_name: body.first_name || existingStudent.first_name,
                middle_name: body.middle_name || existingStudent.middle_name,
                last_name: body.last_name || existingStudent.last_name,
                email: body.email || existingStudent.email,
                gender: body.gender || existingStudent.gender,
                contact: body.contact || existingStudent.contact,
                department: body.department || existingStudent.department,
                usn: body.usn || existingStudent.usn,
                date_of_birth: body.date_of_birth || existingStudent.date_of_birth,
                admission_date: body.admission_date || existingStudent.admission_date,
                CGPA: body.CGPA || existingStudent.CGPA,
                year_of_graduation: body.year_of_graduation || existingStudent.year_of_graduation
            }
            //replace student data with new one 
            students[searchIndex] = replacementStudent;
            //write the data into student.json file
            fs.writeFile("./student.json", JSON.stringify(students), (err, data)=>{
                return res.status(200).json(replacementStudent);
            });
        }else{
            return res.status(404).json({error:  `Student with id: ${id} not found. No student was updated`});
        } 
    })
    //DELETE student
    .delete((req, res)=>{
        const id = Number(req.params.id);
        //Index of student with id
        const searchIndex = students.findIndex((student) => student.id === id);
        //searchIndex is -1 if student not found
        if(searchIndex > -1){
            //deletes a student at index=searchIndex and second arg refers to how many to delete
            //array.splice(index, howmany, item1, item2.....)
            students.splice(searchIndex, 1);
            fs.writeFile("./student.json", JSON.stringify(students), (err, data)=>{
                return res.status(200).json({status: "Successfully deleted"});
            });
        }else{
            return res.status(404).json({error: `Student with id: ${id} not found. No student were deleted`});
        }
    })
    .put((req, res)=>{
        const id = parseInt(req.params.id);
        const body = req.body;
        const searchStudent = students.findIndex((student)=> student.id === id);
        if(searchStudent > -1){
            const replacementStudent = {
                id: id,
                first_name: body.first_name,
                middle_name: body.middle_name,
                last_name: body.last_name,
                email: body.email,
                gender: body.gender,
                contact: body.contact,
                department: body.department,
                usn: body.usn,
                date_of_birth: body.date_of_birth,
                admission_date: body.admission_date,
                CGPA: body.CGPA,
                year_of_graduation: body.year_of_graduation
            }
            students[searchStudent] = replacementStudent;
            fs.writeFile("./student.json", JSON.stringify(students), (err, data)=>{
                return res.status(200).json({message: `Successfully replaced student with id: ${id}`});
            });
        }else{
            return res.status(404).json({error:  `Student with id: ${id} not found. No student data was replaced`});
        }

    })


//POST student details
app.post("/api/students", (req, res)=>{
    const body = req.body;
    //adds the new data into json
    students.push({...body, id: students.length+1});
    //writes the new data into student.json return success
    fs.writeFile("./student.json", JSON.stringify(students), (err, data)=>{
        return res.status(200).json({message: "Successfully inserted", id: students.length});
    });
})

app.listen(process.env.PORT, ()=>{
    console.log(`Server is running on port ${PORT}.`)
})
