
let save_btn=document.getElementById("edit-btn");

save_btn.addEventListener("click",()=>{
    let data=document.getElementsByClassName("td");
    data= Array.from(data);
    console.log(data);
    let data_values=data.map((element)=>{
        if (element.hasAttribute("data")){
            return parseInt(element.getAttribute("data"))
        }
        else {
            if (/^-?\d*\.?\d+$/.test(element.innerText)){

                return parseFloat(element.innerText)
            }
            else{
                return element.innerText
            }
        }
    })
    console.log(data_values);
    let class_ID=document.getElementById("logo-txt").getAttribute("class-ID");
    let sub_code=document.getElementById("logo-txt").getAttribute("sub-code");

    $.ajax({type:"POST",url:`/class/${class_ID}/${sub_code}`,data:{updatedvalues:data_values}})
        .done((response)=>{
            console.log(response);
    
        })
})
