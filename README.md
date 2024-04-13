# Student API

Student API is an REST API that contains the details of students using JSON.

## Installation

Install all the npm dependencies

```bash
npm install
```

## Routes

```bash
GET /api/students
Get all the students from Student API
```
```bash
# student id is a path parameter
GET /api/students/:id
Responds with a single student with the requested student id
```
```bash
# query pramameter for gender
GET /api/students/filter?gender=Female
Filters all the Students by their gender
```
```bash
# provide body parameters
POST /api/students
Create a new Student
```
```bash
# query pramameter for gender
PATCH /api/students/:id
Edit the details of a student that is specified in the path parameter
```
```bash
# replacement values for all the parameters
PUT /api/students/:id
Completely replace the student based on the path parameter id specified
```
```bash
# student id is a path parameter
DELETE /api/students/:id
Delete a student from the Student API based on the path parameter provided for the student id
```

## Scope

utilize it for Student project management application for department

## License

[MIT](https://choosealicense.com/licenses/mit/)
