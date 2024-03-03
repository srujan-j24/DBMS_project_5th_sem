insert into batch values(2021),(2022);

insert into branch values("CSE","Computer science and engineering"),
                        ("ISE","Information science and engineering"),
                        ("ADE","Artificial intelligence engineering"),
                        ("ECE","Electronics and communication engineering"),
                        ("EEE","Electrical and electronics engineering"),
                        ("Civil","Civil engineering");

insert into sem values(1),(2),(3),(4),(5),(6),(7),(8);

insert into scheme values("2021_CSE",2021,"CSE"),
                        ("2021_ISE",2021,"ISE"),

insert into class values("CSE_1_A",1,'A',"CSE"),
                        ("CSE_1_B",1,'B',"CSE");

insert into subjects values("21MAT11",2021,"Calculus and differential equation",3,1),
                            ("21PHY12",2021,"Engineering physics",3,1),
                            ("21ELE13",2021,"Basic electrical engineering",3,1),
                            ("21CIV14",2021,"Elements of civil engineering and mechanics",3,1);

insert into student values(20210001,"Vinod",null,2021,"CSE","CSE_1_A","vin@123",0),
                        (20210002,"Vihaan",null,2021,"CSE","CSE_1_A","vih@123",0),
                        (20210003,"Anita",null,2021,"CSE","CSE_1_B","ani@123",0),
                        (20210004,"Aditi",null,2021,"CSE","CSE_1_B","adi@123",0);

insert into personal_info values(20210001,"B+","2002-12-02",9876543218,9876543211,"Ujire",4),
                                (20210002,"O-","2003-02-22",7778889995,8886667779,"Bangalore",4),
                                (20210003,"B+","2003-12-23",8888777798,8787789886,"Hubli",4),
                                (20210004,"O+","2003-03-22",8888999976,7575897698,"Mysore",4);
                                
