const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')

const app = express()
const port = 3000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    return res.send({
        error: false,
        message: 'RESTful CRUD API with NodeJS, Express, MYSQL'
    })
})

//connect to mysql database
let dbCon = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'api'
})
dbCon.connect()

//get data
app.get('/read', (req, res) => {
    dbCon.query('SELECT * FROM user', (error, results, fields) => {
        if (error) throw error;

        let message = ""
        if (results === undefined || results.length == 0) {
            message = "table is empty"
        } else {
            message = "Retrieved all Data"
        }
        return res.send({error: false, data: results, message: message})
    })
})

//login
app.get('/login', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    // validation
    if (!email && !password) {
        return res.status(400).send({ error: true, message: "Please enter correct data."})
    } else {
        dbCon.query('SELECT * FROM `user` WHERE email=?;', [email], (error, results, fields) => {
            if (error) throw error;

            return res.send({error: false, data: results, message: ""})
        })
    }
})

//update data
app.put('/update/:id', (req, res) => {
    let id = req.params.id
    let email = req.body.email
    let password = req.body.password

    if (!id || !email || !password) {
        return res.status(400).send({ error:true, message: "Please write data correctly."})
    } else {
        dbCon.query("UPDATE user SET email = ?, password = ? WHERE id = ?", [email, password, id], (error, results, fields) => {
            if (error) throw error

            let message = ""
            if (results.changedRows === 0) {
                message = "not found or data not update"
            } else {
                message = "updated"
            }

            return res.send({error: false, data:results, message: message})
        })
    }
})

//delete data by id
app.delete('/delete/:id', (req, res) => {
    let id = req.params.id

    if (!id) {
        return res.status(400).send({error: true, message: "Please enter ID correctly."})
    } else {
        dbCon.query('DELETE FROM user WHERE id = ?', id, (error, results, fields) => {
            if (error) throw error

            let message = ""
            if (results.affectedRows === 0) {
                message = " not found."
            } else {
                message = " Deleted"
            }

            return res.send({error: false, data: results, message: message})
        })
    }
})


app.listen(port, () => console.log(`listening on port ${port}`))

module.exports = app;