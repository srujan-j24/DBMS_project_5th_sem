/*const headers = document.querySelectorAll('.header');*/

const buttons = document.querySelectorAll('.sem-btn');
const root = document.documentElement;

buttons.forEach(button =>{
    button.addEventListener('click',()=> {
        const targetColor = button.getAttribute('background-color');
        root.style.setProperty('--header-color', 'targetColor');
    });
});

       /* headers.forEach(header =>{
            const headerColor = header.getAttribute('data-color');
            if(headerColor !== targetColor) {
                header.style.backgroundColor = `var(--${targetColor})`;
            }
        });
    });
});*/

 /*function toggleColor() {
    var div = document.getElementById('toggleDiv');
    var root = document.documentElement;
  
   // Toggle the color value
    if (root.style.getPropertyValue('--div-color') === 'red') {
      root.style.setProperty('--div-color', '#ccc'); // Change to default color
    } else {
      root.style.setProperty('--div-color', 'red'); // Change to desired color
    }*/
  