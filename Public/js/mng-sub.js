let dig = document.getElementById("dialog-sub");
let dig_visible = false;
function toggleDialog(){
    if (dig_visible == false){
        dig.showModal();
        dig_visible = true;
    }
    else{
        dig.close();
        dig_visible = false;
    }
}