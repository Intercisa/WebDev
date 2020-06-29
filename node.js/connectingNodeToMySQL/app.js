const faker = require('faker');
const mysql = require('mysql');

const connection = mysql.createConnection({
    host:'localhost', 
    user: 'root',
    password : 'password',
    database : 'join_us', 
    insecureAuth : true
});


//qurey mysql from node
const q = 'SELECT CURDATE() as time, CURDATE() as date, NOW() as now';
connection.query(q, (error, results, fields)=>{
    if(error) throw error;
    console.log(results);
});
connection.end();

//add test data to mysql from node
const generateAddress = () => {
    for (let i = 0; i < 100; i++) {
        const q = `insert into test(streetAddress, city, state) values('${faker.address.streetAddress()}', '${faker.address.city()}', '${faker.address.state()}')`;    
        connection.query(q, (error, results, fields)=>{
            if(error) throw error;
            console.log(results);
        });
    }
};
generateAddress();
connection.end();

//add 500 user data to mysql from node
const generateAddress = () => {
    for (let i = 0; i < 500; i++) {
        let person = {email: faker.internet.email(),
                      created_at: faker.date.past()};

        //const q = `insert into users(email, created_at) values('${faker.internet.email()}', '${faker.date.past()}')`; 
        const q = 'insert into users set ?'   
        connection.query(q, person ,(error, results, fields)=>{
            if(error) throw error;
            console.log(results);
        });
    }
};
generateAddress();
connection.end();



