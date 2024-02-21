let form = $("#login-form");
console.log(form);
form.submit((event)=>{
    event.preventDefault();
    let formData ={
        username: $("#username").val(),
        password:$("#password").val()
    };
    $.ajax({type:"POST",url:"/login",data:formData})
        .done((response)=>{
            console.log(response)
        })


})