let dialog = document.getElementById("dialog");
let dialogActive = false;
function toggleDialog(){
   dialogActive == false?  dialog.showModal() : dialog.close();
   dialogActive = !dialogActive;
}