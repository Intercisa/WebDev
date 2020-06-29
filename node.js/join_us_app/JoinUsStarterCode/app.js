const express = require('express');
const mysql = require('mysql');
const bodyParser  = require("body-parser");
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));


const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password  : 'password',
    database : 'join_us', 
    insecureAuth : true
});


/*
//test
app.get('/', (req, res) =>{
    res.send('HELLO FROM OUR WEBB APP!');
  });
*/
  
  app.get('/', (req, res) =>{
    const countQurey = 'SELECT COUNT(*) AS count FROM users';
    connection.query(countQurey, (err, results) =>{
        if(err) throw err;
        const count = results[0].count;
        res.render('home', {count}); // {count: count}
    });
  });

  app.post('/register', (req, res)=>{
      const person = {email : req.body.email};
      connection.query('INSERT INTO users SET ?', person, (err, result)=>{
        if(err) throw err;
        res.redirect('/');
      });
  });

  app.listen(8080, () => console.log('Server running on 8080!'));
