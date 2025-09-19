import mysql from "mysql2/promise";

// ! connect mysql server

const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "user_db",
});

console.log("MySQL Connected successfully");

// ! create database 

//await db.execute("create database user_db");

// !show databases

//console.log(await db.execute("show databases"));

//!create table

//await db.execute(`
//  create table users(
//id int auto_increment primary key,
//username varchar(100) not null,
//email varchar(100) not null unique
//);
//`);

// ! insert data using line values

//await db.execute(`
//INSERT INTO users(username, email)
//VALUES ('ankit', 'ankit@gmail.com');
//`);

// insert data using prepared statements 

//await db.execute(`
//INSERT INTO users(username, email)
//VALUES(?, ?)`, ['anup', 'anup@gmail.com']
//);

// insert multiple data while insert multiple data use query instead of execute and when you have multiple arrrya of data the use only one ?

/*const values = [
    ["Ram", "ram@gmail.com"],
    ["Himesh", "himesh@gmail.com"],
    ["Om", "om@gmail.com"],
    ["Anish", "anish@gmail.com"],
    ["Milan", "milan@gmail.com"],

];
await db.query("insert into users(username, email) values ? ", [values]);

*/



// we use execute method it return an array in which first have rows and second have field with meta data
// ! Read 
// while showing all user
const [rows] = await db.execute(`select * from users`);
// while need specific user
//const [rows] = await db.execute(` select * from users where username = "ankit"`)
console.log(rows);

//update
//sytax
// update table_name
//set column1 = values1, column2 = values2, ...
//where condition;

/*
try {
    const [rows] = await db.execute(
        "update users set username = 'AnkitBhandari' where email = 'ankit@gmail.com' "
    );
    console.log("All users:", rows);

} catch (error) {
    console.error(error);
}
*/
// recommended way

/*
try {
    const [rows] = await db.execute(
        "update users set username = ? where email = ? ",
        ["anupbhandari", "anup@gmail.com"]
    );
    console.log("All users:", rows);

} catch (error) {
    console.error(error);
}
    */


//Delete 
// synatx
//delete from table_name
//where condition;

/*
try {
    const [rows] = await db.execute(
        "delete from users where email = 'ankit@gmail.com' "
    );
    console.log("All users:", rows);

} catch (error) {
    console.error(error);
}
    */
// recommended way

/*
try {
    const [rows] = await db.execute(
        "delete from users where email = ? ", [
        "om@gmail.com",
    ]
    );
    console.log("All users:", rows);

} catch (error) {
    console.error(error);
}
    */

