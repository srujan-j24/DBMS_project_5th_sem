CREATE DATABASE IF NOT EXISTS studentDB;

USE studentDB;

CREATE TABLE IF NOT EXISTS batch(
    year int,
    primary key(year)
);

CREATE TABLE IF NOT EXISTS student (
    Name varchar(50),
    college_ID varchar(20),
    USN varchar(15),
    batch_ID int,
    password varchar(30),
    primary key(college_ID),
    foreign key(batch_ID) references batch(year) on delete cascade
);

CREATE TABLE IF NOT EXISTS marks(
    marks_ID varchar(10),
    sem1 json,
    sem2 json,
    sem3 json,
    sem4 json,
    sem5 json,
    sem6 json,
    sem7 json,
    sem8 json,
    batch_ID int,
    primary key(marks_ID),
    foreign key(batch_ID) references batch(year) on delete cascade
);



CREATE TABLE IF NOT EXISTS scheme(
    scheme_ID varchar(20),
    branch varchar(30),
    sem1 json,
    sem2 json,
    sem3 json,
    sem4 json,
    sem5 json,
    sem6 json,
    sem7 json,
    sem8 json,
    primary key(scheme_ID)
);

CREATE TABLE IF NOT EXISTS class(
    sem int,
    section int,
    branch varchar(30),
    primary key(sem,section,branch)
);

CREATE TABLE IF NOT EXISTS staff(
    staff_ID varchar(20),
    department varchar(30),
    name varchar(30),
    access_data json,
    is_HOD boolean,
    is_Admin boolean,
    password varchar(30),
    primary key(staff_ID)
);

CREATE TABLE IF NOT EXISTS academic_info(
    college_ID varchar(20),
    scheme_ID varchar(10),
    batch_ID int,
    marks_ID varchar(30),
    sem int,
    section int,
    branch varchar(30),
    primary key(college_ID),
    foreign key(college_ID) references student(college_ID) on delete cascade,
    foreign key(scheme_ID) references scheme(scheme_ID) on delete cascade ,
    foreign key(batch_ID) references batch(year) on delete cascade,
    foreign key(marks_ID) references marks(marks_ID) on delete cascade,
    foreign key(sem,section,branch) references class(sem,section,branch) on delete cascade
);

CREATE TABLE IF NOT EXISTS personal_info(
    college_ID varchar(20),
    blood_type varchar(3),
    dob date,
    personal_phone bigint,
    parent_phone bigint,
    address varchar(255),
    validity json,
    batch_ID int,
    primary key(college_ID),
    foreign key(college_ID) references student(college_ID) on delete cascade,
    foreign key(batch_ID) references batch(year) on delete cascade,
);

