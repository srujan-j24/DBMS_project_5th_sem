CREATE DATABASE IF NOT EXISTS studentdb;

USE studentdb;

CREATE TABLE IF NOT EXISTS branch(
    id varchar(5) primary key,
    name varchar(50)
);



CREATE TABLE IF NOT EXISTS sem(
    id int primary key
);

CREATE TABLE IF NOT EXISTS scheme(
    id varchar(10),
    year int,
    branch_ID varchar(5),
    primary key(id),
    foreign key(branch_ID) references branch(id) ON DELETE CASCADE ON UPDATE CASCADE 
);

CREATE TABLE IF NOT EXISTS batch(
    id int,
    scheme_ID varchar(10),
    primary key(id,scheme_ID),
    foreign key(scheme_ID) references scheme(id) ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS subjects(
    sub_code varchar(10),
    scheme_ID varchar(10),
    name varchar(70),
    credits int,
    sem_ID int,
    primary key(sub_code,scheme_ID),
    foreign key(scheme_ID) references scheme(id) ON DELETE CASCADE ON UPDATE CASCADE,
    foreign key(sem_ID) references sem(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS class(
    id varchar(10),
    sem_ID int,
    section varchar(1),
    branch_ID varchar(5),
    primary key(id),
    foreign key(sem_ID) references sem(id) ON DELETE CASCADE ON UPDATE CASCADE,
    foreign key(branch_ID) references branch(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS student(
    college_ID int primary key,
    name varchar(100),
    USN varchar(20),
    batch_ID int,
    branch_ID varchar(5),
    cur_class_ID varchar(10),
    password varchar(16),
    logged_in boolean,
    foreign key(batch_ID) references batch(id) ON DELETE CASCADE ON UPDATE CASCADE,
    foreign key(branch_ID) references branch(id) ON DELETE CASCADE ON UPDATE CASCADE,
    foreign key(cur_class_ID) references class(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS personal_info(
    college_ID int primary key,
    blood_type varchar(3),
    DOB date,
    personal_phone bigint,
    parent_phone bigint,
    address varchar(255),
    validity int,
    foreign key(college_ID) references student(college_ID) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS marks(
    college_ID int, 
    sub_code varchar(10),
    ia1 float default -1,
    ia2 float default -1,
    ia3 float default -1,
    as1 float default -1,
    as2 float default -1,
    q1 float default -1,
    primary key(college_ID, sub_code),
    foreign key(college_ID) references student(college_ID) ON DELETE CASCADE ON UPDATE CASCADE,
    foreign key(sub_code) references subjects(sub_code)  ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS staff(
    ID varchar(7) primary key,
    name varchar(50),
    is_hod boolean,
    is_admin boolean,
    password varchar(16),
    branch_ID varchar(10),
    logged_in boolean,
    foreign key(branch_ID) references branch(id) ON DELETE CASCADE 
);

CREATE TABLE IF NOT EXISTS staff_access(
    staff_id varchar(7),
    sub_code varchar(10),
    class_ID varchar(10),
    primary key(staff_id,sub_code,class_ID),
    foreign key(staff_id) references staff(ID) ON DELETE CASCADE ON UPDATE CASCADE,
    foreign key(sub_code) references subjects(sub_code) ON DELETE CASCADE ON UPDATE CASCADE,
    foreign key(class_ID) references class(id) ON DELETE CASCADE ON UPDATE CASCADE
);

