const buttons = document.querySelectorAll('.sem-btn');
const personal_btn = document.getElementById("personal-btn");
const root = document.documentElement;
const personal_info_cont = document.getElementById("personal-info-cont");
const table_cont = document.getElementById("table-container");

buttons.forEach(button =>{
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



  