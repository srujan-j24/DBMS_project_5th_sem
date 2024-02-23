

const buttons = document.querySelectorAll('.sem-btn');
const root = document.documentElement;

buttons.forEach(button =>{
    button.addEventListener('click',()=> {
        const targetColor = window.getComputedStyle(button).backgroundColor;

       
        root.style.setProperty('--header-color', targetColor);
        console.log(targetColor);
    });
});

       


  