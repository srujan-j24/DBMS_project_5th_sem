
let save_btn=document.getElementById("edit-btn");

save_btn.addEventListener("click",()=>{
    let no_values = document.getElementById("table1").getAttribute("len");
    console.log(no_values);
    let data_values = [];
    try{
        for(let i = 1; i <= no_values; i++){
            let val = {
                college_ID : parseInt(document.getElementById(`name${i}`).getAttribute("data")),
                ia1: parseFloat(document.getElementById(`ia1${i}`).innerText),
                ia2: parseFloat(document.getElementById(`ia2${i}`).innerText),
                ia3: parseFloat(document.getElementById(`ia3${i}`).innerText),
                as1: parseFloat(document.getElementById(`as1${i}`).innerText),
                as2: parseFloat(document.getElementById(`as2${i}`).innerText),
                q1: parseFloat(document.getElementById(`q${i}`).innerText)
            }
            data_values.push(val);
        }
    }catch(err){
        alert("some values are invalid. Please recheck.");
        return;
    }
    let class_ID = document.getElementById("logo-txt").getAttribute("class-ID");
    let sub_code = document.getElementById("logo-txt").getAttribute("sub-code");
    $.ajax({type:"POST",url:`/class/${class_ID}/${sub_code}/edit`,data:{updatedvalues:data_values}})
    .done((response)=>{
        console.log(response);
        window.location.href=response;
    
    })
})
