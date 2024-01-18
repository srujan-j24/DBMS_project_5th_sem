CREATE DATABASE IF NOT EXISTS studentDB;

USE studentDB;

CREATE TABLE student (
    Name varchar(50),
    college_ID varchar(20),
    USN varchar(15),
    primary key(college_ID)
);