let dialog = document.getElementById("dialog");
let dialogAccess = document.getElementById("dialogAccess");
function reqStaffaccess(staff_id){
    $.ajax({type:"POST",url:`/staff/access/${staff_id}`})
        .done((res)=>{
            console.log(res);
            dialog.showModal()
            for(let i = 0; i < res.length; i ++){
                let newp = document.createElement("p");
                newp.innerText = `${res[i].sub_code} ${res[i].class_ID}` 
                dialogAccess.appendChild(newp)
            }
        })
        .fail(()=>{

        })
}