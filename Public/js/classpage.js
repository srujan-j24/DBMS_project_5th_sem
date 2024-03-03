
let save_btn=document.getElementById("edit-btn");

save_btn.addEventListener("click",()=>{
    let no_values = document.getElementById("table1").getAttribute("len");
    console.log(no_values);
    let data_values = [];
    try{
        for(let i = 1; i <= no_values; i++){
            let val = {
                college_ID : parseInt(document.getElementById(`name${i}`).innerText),
                aij: parseFloat(document.getElementById(`ia1${i}`).innerText),
                ai2: parseFloat(document.getElementById(`ia2${i}`).innerText),
                ai3: parseFloat(document.getElementById(`ia3${i}`).innerText),
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
    $.ajax({type:"POST",url:`/class/${class_ID}/${sub_code}/edit`,data:{updatedvalues:data_values}})
    .done((response)=>{
        console.log(response);
    
    })
})
