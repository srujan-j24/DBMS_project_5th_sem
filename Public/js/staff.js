


$('#logout').click(()=>{
     
    $.ajax({type:"POST",url:"/logout",data:""})
        .done((response)=>{
            console.log(response)
            window.location.href = response
        })
})