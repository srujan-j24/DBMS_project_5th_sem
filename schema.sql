CREATE DATABASE IF NOT EXISTS studentDB;

USE studentDB;

CREATE TABLE IF NOT EXISTS batch(
    year int primary key
);

CREATE TABLE IF NOT EXISTS branch(
    ID varchar(10) primary key,
    name varchar(50)
);

CREATE TABLE IF NOT EXISTS class(
    ID varchar(20) primary key,
    sem int,
    section varchar(2),
    branch_ID varchar(10),
    foreign key(branch_ID) references branch(ID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS student(
    college_ID int primary key,
    name varchar(50),
    USN varchar(20),
    batch_ID int,
    password varchar(30),
    cur_class_ID varchar(10),
    branch_ID varchar(10),
    logged_in boolean,
    foreign key(branch_ID) references branch(ID) ON DELETE CASCADE,
    foreign key(batch_ID) references batch(year) ON DELETE CASCADE,
    foreign key(cur_class_ID) references class(ID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS personal_info(
    college_ID int primary key,
    blood_type varchar(3),
    DOB date,
    personal_phone bigint,
    parent_phone bigint,
    address varchar(255),
    validity tinyint,
    foreign key(college_ID) references student(college_ID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS scheme(
    ID int,
    branch_id varchar(10),
    sem1 json,
    sem2 json,
    sem3 json,
    sem4 json,
    sem5 json,
    sem6 json,
    sem7 json,
    sem8 json,
    primary key(ID, branch_id),
    foreign key(branch_id) references branch(ID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS marks(
    college_ID int primary key,
    scheme_ID int,
    sem1 json,
    sem2 json,
    sem3 json,
    sem4 json,
    sem5 json,
    sem6 json,
    sem7 json,
    sem8 json,
    foreign key(college_ID) references student(college_ID) on DELETE CASCADE,
    foreign key(scheme_ID) references scheme(ID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS staff(
    ID varchar(7) primary key,
    name varchar(30),
    access_data json,
    is_hod boolean,
    is_admin boolean,
    password varchar(30),
  ''  branch_ID varchar(10),
    logged_in boolean,
    foreign key(branch_ID) references branch(ID) ON DELETE CASCADE 
);