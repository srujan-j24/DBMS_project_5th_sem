const buttons = document.querySelectorAll('.sem-btn');
const personal_btn = document.getElementById("personal-btn");
const root = document.documentElement;
const personal_info_cont = document.getElementById("personal-info-cont");
const table_cont = document.getElementById("table-container");
const logout = document.getElementById("logout");

function append_data(data_array) {
    let i;
    function create_data_div(data,additional_attribute){
        let new_div = document.createElement("div");
        new_div.classList.add("td");
        new_div.innerText = data;
        if(i % 2 != 0){
            new_div.classList.add("light-grey")
        }
        if(additional_attribute) {
            new_div.setAttribute("data",additional_attribute);
        }
        return new_div;
    }
    let table = document.getElementById("table");
    for(i=0;i<data_array.length;i++) {
        let {as1,as2,college_ID,credits,ia1,ia2,ia3,name,q1,sub_code} = data_array[i]
        table.appendChild(create_data_div(sub_code,name));
        table.appendChild(create_data_div(credits));
        table.appendChild(create_data_div(" "));
        table.appendChild(create_data_div(ia1));
        table.appendChild(create_data_div(ia2));
        table.appendChild(create_data_div(ia3));
        let avg = -1;
        if(ia1!= -1 && ia2!=-1 && ia3!=-1) {
            avg = sum(ia1,ia2,ia3)/3;
            table.appendChild(create_data_div(avg));
        }
        else {
            table.appendChild(create_data_div(" "));
        }
        table.appendChild(create_data_div(as1));
        table.appendChild(create_data_div(as2));
        if(as1!=-1 && as2!=-1) {
            avg = sum(as1,as2)/2;
            table.appendChild(create_data_div(avg));
        }
        else {
            table.appendChild(create_data_div(" "));
        }
        table.appendChild(create_data_div(q1));
        table.appendChild(create_data_div(" "));
        table.appendChild(create_data_div(" "));
        table.appendChild(create_data_div(" "));
        table.appendChild(create_data_div(" "));
    }
}





buttons.forEach((button,index) =>{
    button.addEventListener('click',()=> {
        const targetColor = window.getComputedStyle(button).backgroundColor;
        root.style.setProperty('--header-color', targetColor);
        console.log(targetColor);
        root.style.setProperty('--table-display', 'flex');
        root.style.setProperty('--personal-display', 'none');
    });
});

personal_btn.addEventListener("click", ()=>{
    root.style.setProperty('--table-display', 'none');
    root.style.setProperty('--personal-display', 'flex');
})


$('#logout').click(()=>{
    $.ajax({type:"POST",url:"/logout",data:""})
        .done((response)=>{
            console.log(response)
            window.location.href = response
        })
        
});


buttons.forEach((button,index)=>{
    index=index+1;
    console.log("hi")
    button.addEventListener("click",()=>{
        $.ajax({type:"POST",url:"/sem",data:{sem:index}})
        .done((response)=>{
            append_data(response)

        })
        .fail((response)=>{
            console.log("error")
        })
    })
   
})
  
