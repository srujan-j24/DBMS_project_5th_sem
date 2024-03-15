let dialog = document.getElementById("dialog");
let dialogAccess = document.getElementById("dialogAccess");
let classes = document.getElementById("classes");
let sub_code = document.getElementById("subjects");
let cur_staff = null;
function reqStaffaccess(staff_id){
    cur_staff = staff_id;
    $.ajax({type:"POST",url:`/staff/access/${staff_id}`})
        .done((res)=>{
            console.log("done");
            console.log(res);
            dialog.showModal()
            for(let i = 0; i < res.length; i ++){
                let newp = document.createElement("span");
                let newbtn = document.createElement("button");
                let newdiv = document.createElement("div");
                newbtn.setAttribute("onclick", `removeAccess('/staff/access/${cur_staff}/del/${res[i].class_ID}/${res[i].sub_code}')`);
                
                newdiv.classList.add("access_list");
                newdiv.appendChild(newp);
                newdiv.appendChild(newbtn);
                newbtn.innerText = "remove";
                newp.innerText = `${res[i].sub_code} ${res[i].class_ID}` 
                dialogAccess.appendChild(newdiv)
            }
        })
        .fail((a,b,c)=>{
            console.log("fail");
            console.log(a);
            console.log(b);
            console.log(c);
            alert("Something went wrong");
        })
}

function addAccess() {
    let selectedClass = classes.value;
    let selectedsubject = subjects.value;
    console.log(selectedClass);
    console.log(selectedsubject);
    $.ajax({type:"POST",url:`/staff/access/${cur_staff}/add/${selectedClass}/${selectedsubject}`})
        .done(()=>{
            location.reload();
        })
        .fail(()=>{

        })
}

function removeAccess(route){
    $.ajax({type: 'POST', url: route})
}