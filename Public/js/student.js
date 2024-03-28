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
        if(data == -1){
            new_div.innerText=" ";
        }
        else{
            new_div.innerText = data;
        }
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
        let {as1,as2,credits,ia1,ia2,ia3,name,q1,sub_code,see} = data_array[i]
        table.appendChild(create_data_div(sub_code,name));
        table.appendChild(create_data_div(credits));
       
        table.appendChild(create_data_div(ia1));
        
        
        table.appendChild(create_data_div(ia2));
        table.appendChild(create_data_div(ia3));
        let avg = -1;
        if(ia1!= -1 && ia2!=-1 && ia3!=-1) {
            ia_avg = Math.round((ia1+ia2+ia3)/3);
            table.appendChild(create_data_div(ia_avg));
        }
        else {
            table.appendChild(create_data_div(" "));
        }
        table.appendChild(create_data_div(as1));
        table.appendChild(create_data_div(as2));
        if(as1!=-1 && as2!=-1) {
            as_avg = Math.round((as1+as2)/2);
            table.appendChild(create_data_div(as_avg));
        }
        else {
            table.appendChild(create_data_div(" "));
        }
        if(q1==-1) {
            table.appendChild(create_data_div(" ")); 
        }
        else {
            table.appendChild(create_data_div(q1));
        }
        CIE = calculateCIE(ia_avg,as_avg,q1);
        if(CIE != -1) {
            table.appendChild(create_data_div(CIE));
        }
        else {
            table.appendChild(create_data_div(" ")); 
        }
        if(see != -1){
          table.appendChild(create_data_div(see));
          gradeobj = calculate_gradepoint(CIE,see);
          table.appendChild(create_data_div(gradeobj.grade_point));
          table.appendChild(create_data_div(gradeobj.grade));  
        }
        else{
            table.appendChild(create_data_div(" ")); 
            table.appendChild(create_data_div(" "));
            table.appendChild(create_data_div(" "));
        }

      
    }
}

function calculate_gradepoint(CIE,SEE){
    let total = CIE+SEE;
    let grade = "";
    let grade_point = "";
    if(total<=100 || total>=90){
        grade = "O";
        grade_point = "10";
    }
    else if(total<=89 || total>=80){
        grade = "A+";
        grade_point = "9";
    }
    else if(total<=79 || total>=70){
        grade = "A";
        grade_point = "8";
    }
    else if(total<=69 || total>=60){
        grade = "B+";
        grade_point = "7";
    }
    else if(total<59 || total>=55){
        grade = "B";
        grade_point = "6";
    }
    else if(total<50 || total>=54){
        grade = "C";
        grade_point = "5";
    }
    else if(total<40 || total>=49){
        grade = "P";
        grade_point = "4";
    }
    else if(total<39 || total>=0){
        grade = "F";
        grade_point = "0";
    }
    return {grade_point,grade}

}

function calculateCIE(ia_avg,as_avg,q1) {
    if(ia_avg != -1 && as_avg != -1 && q1 != -1){
        cie = ia_avg+as_avg+q1;
        return cie;
    }
    else {
        return -1;
    }
}




buttons.forEach((button,index) =>{
    button.addEventListener('click',()=> {
        
        
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
        let del_array = document.getElementsByClassName("td")
        del_array = Array.from(del_array)
            for(let i=0;i<del_array.length;i++) {
                del_array[i].remove();

            }
            console.log(del_array)
        $.ajax({type:"POST",url:"/sem",data:{sem:index}})
        .done((response)=>{
            const targetColor = window.getComputedStyle(button).backgroundColor;
            root.style.setProperty('--header-color', targetColor);
            let light_color = (targetColor.replace(")",", 0.15)")).replace("b","ba");
            root.style.setProperty('--header-color-light',light_color);
            root.style.setProperty('--table-display', 'flex');
            root.style.setProperty('--personal-display', 'none');
            console.log(response)
            append_data(response)
            
        })
        .fail((response)=>{
            console.log("error")
        })
    })
   
})
  
