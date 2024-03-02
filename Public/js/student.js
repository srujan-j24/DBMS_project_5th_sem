const buttons = document.querySelectorAll('.sem-btn');
const personal_btn = document.getElementById("personal-btn");
const root = document.documentElement;
const personal_info_cont = document.getElementById("personal-info-cont");
const table_cont = document.getElementById("table-container");
const logout = document.getElementById("logout");

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
            console.log(response)
        })
        .fail((response)=>{
            console.log("error")
        })
    })
   
})
  