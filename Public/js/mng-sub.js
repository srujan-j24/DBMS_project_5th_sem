let dig = document.getElementById("dialog-sub");
let add_btn = document.getElementById("add-btn");
let dig_visible = false;
function toggleDialog(){
    if (dig_visible == false){
        dig.showModal();
        dig_visible = true;
    }
    else{
        dig.close();
        dig_visible = false;
    }
}

add_btn.addEventListener("click",(e)=>{
    e.preventDefault();
    let sub_new = {
        name:document.getElementById("sub_name").value,
        scheme:document.getElementById("sub_scheme").value,
        subcode:document.getElementById("sub_code").value,
        credits:document.getElementById("sub_credits").value,
        sem:document.getElementById("sub_sem").value
    }
    console.log(sub_new);
    $.ajax({type:"POST",url:`/subject/add`,data:sub_new})
        .done(()=>{
            window.location.reload();
        })
        .fail((xhr,status,error)=>{
            alert("Something went wrong");
        })
})

function delete_sub(sub_code,scheme_ID){
    $.ajax({type:"POST",url:`/subject/delete/${sub_code}/${scheme_ID}`})
    .done(()=>{
        window.location.reload();
    })
    .fail((xhr,status,error)=>{
        alert("Something went wrong");
    })

}