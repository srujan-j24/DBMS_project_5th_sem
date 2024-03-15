let dialog = document.getElementById("dialog");
let dialogAccess = document.getElementById("dialogAccess");
let classes = document.getElementById("classes");
let sub_code = document.getElementById("subjects");
let cur_staff = null;
function reqStaffaccess(staff_id){
    $.ajax({type:"POST",url:`/staff/access/${staff_id}`})
        .done((res)=>{
            console.log("done");
            console.log(res);
            dialog.showModal()
            for(let i = 0; i < res.length; i ++){
                let newp = document.createElement("p");
                newp.innerText = `${res[i].sub_code} ${res[i].class_ID}` 
                dialogAccess.appendChild(newp)
            }
            cur_staff = staff_id;
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