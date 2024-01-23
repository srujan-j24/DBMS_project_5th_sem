use studentdb;

insert into batch(year)
values(2021);


insert into student(Name, college_ID, USN, batch_ID, password)
values
('puneeth', '2021cse01', null, 2021, 'puneeth@123'),
('shreyas b p', '2021cse02', null, 2021, 'shreybp@123'),
('shreyas', '2021cse03', null, 2021, 'shreyas@123'),
('shreya', '2021cse04', null, 2021, '#shreya123'),
('ramakrishna', '2021cse05', null, 2021, 'ramk$$692'),
('subodh', '2021cse06', null, 2021, 'sbd%92'),
('srujan', '2021cse07', null, 2021, 'srujan$81'),
('tanmay', '2021cse08', null, 2021, 'fas#$kjf'),
('sannidhi', '2021cse09', null, 2021, 'sannid$383'),
('vikyath', '2021cse10', null, 2021, 'vikyath'),
('yalguresh', '2021cse11', null, 2021, 'yalgu@858'),
('vishrutha', '2021cse12', null, 2021, 'vis@0502'),
('sumanth', '2021cse13', null, 2021, 'sumanth');

select * from student;