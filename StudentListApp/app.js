const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'banana',
    database: 'studentlistapp'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    const sql = 'SELECT * FROM studentlistapp.student';
    connection.query(sql, (error, results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.send('Error retrieving students');
        }
      res.render('index', { student: results });
    });
});

app.get('/student/:id', (req, res) => {
    // Extract the student ID from the request parameters
    const studentId = req.params.id;
    const sql = 'SELECT * FROM studentlistapp.student WHERE studentId = ?';
    // Fetch data from MySQL based on the student ID
    connection.query(sql, [studentId], (error, results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.send('Error Retrieving student by ID');
        }
        // Check if any student with the given ID was found
        if (results.length > 0) {
        // Render HTML page with the student data
            res.render('student', { student: results[0] });
        } else {
        // If no student with the given ID was found
            res.send('Student not found');
        }
    });
});

app.get('/addStudent', (req, res) => {
    res.render('addStudent');
});
app.post('/addStudent', (req, res) => {
    // Extract student data from the request body
    const { name, image, dob, contact } = req.body;
    const sql = 'INSERT INTO studentlistapp.student (name, image, dob, contact) VALUES (?, ?, ?, ?)';
// Insert the new student into the database
    connection.query( sql , [name, image, dob, contact], (error, results) => {
        if (error) {
        // Handle any error that occurs during the database operation
            console.error("Error adding student:", error);
            res.send('Error adding student');
        } else {
        // Send a success response
            res.redirect('/');
        }
    });
});

app.get('/editStudent/:id', (req,res) => {
    const studentId = req.params.id;
    const sql = 'SELECT * FROM products WHERE studentId = ?';
    // Fetch data from MySQL based on the product ID
    connection.query( sql , [studentId], (error, results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.send('Error retrieving product by ID');
        }
    // Check if any product with the given ID was found
        if (results.length > 0) {
    // Render HTML page with the product data
            res.render('editStudent', { student: results[0] });
        } else {
    // If no product with the given ID was found, render a 404 page or handle it accordingly
            res.send('Student not found');
        }
    });
});

app.post('/editStudent/:id', (req, res) => {
    const studentId = req.params.id;
    const { name, contact, dob, studentId  } = req.body;
    const sql = 'UPDATE student SET studentName = ?, dob = ?, contact = ? WHERE studentId = ?';
    connection.query(sql, [name, dob, contact, studentId], (error, results) => {
        if (error) {
            console.error('Database update error:', error.message);
            res.send('Error updating product');
        } else {
            res.redirect('/');
        }
    });
});

app.get('/deleteStudent/:id', (req, res) => {
    const studentId = req.params.id;
    const sql = 'DELETE FROM student WHERE studentId = ?';
    connection.query(sql, [studentId], (error, results) => {
        if (error) {
            console.error('Database delete error:', error.message);
            res.send('Error deleting product');
        } else {
            res.redirect('/');
        }
    });
});


app.listen(port, () => {
  console.log(`Server is running beautifully at http://localhost:${port}`);
});