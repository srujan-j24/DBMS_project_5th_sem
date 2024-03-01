let form=$("#login-form")
console.log(form);
form.submit((event)=>{
    event.preventDefault();
    $("body").addClass("cursor-wait");
    let formData={
        username: $("#username").val(),
        password: $("#password").val()
    };
    $.ajax({type:"POST",url:"/login",data:formData})
        .done((response)=>{
            console.log(response)
            window.location.href = response
        })
        .fail((xhr,status,error)=>{//this function is to handle the invalid user name and password
            console.log(xhr.responseText);
            console.log(status);
            console.log(error);
            $("#username").val("");
            $("#password").val("");
            $("#username").addClass("error");
            $("#password").addClass("error");

        })
})

