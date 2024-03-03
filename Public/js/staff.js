const buttons = document.querySelectorAll('.item-btns');


$('#logout').click(()=>{
     
    $.ajax({type:"POST",url:"/logout",data:""})
        .done((response)=>{
            console.log(response)
            window.location.href = response
        })
})

buttons.forEach((button)=>{
    button.addEventListener("click",()=>{
       let route = button.getAttribute("data");
       window.location.href = route
    })
})