CREATE DATABASE IF NOT EXISTS studentDB;

USE studentDB;

CREATE TABLE student (
    Name varchar(50),
    college_ID varchar(20),
    USN varchar(15),
    batch_ID int,
    password varchar(30),
    primary key(college_ID),
    foreign key(batch_ID) references batch(year) on delete cascade
);

CREATE TABLE marks(
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

CREATE TABLE batch(
    year int,
    primary key(year)
);

CREATE TABLE academic_info(
    college_ID int,
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

CREATE TABLE personal_info(
    college_ID int,
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

CREATE TABLE scheme(
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

CREATE TABLE class(
    sem int,
    section int,
    branch varchar(30),
    primary key(sem,section,branch)
);

CREATE TABLE staff(
    staff_ID varchar(20),
    department varchar(30),
    name varchar(30),
    access_data json,
    is_HOD boolean,
    is_Admin boolean,
    password varchar(30),
    primary key(staff_ID)
);