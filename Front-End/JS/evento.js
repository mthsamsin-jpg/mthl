function setBackgroundColor(color)
{
    document.body.style.backgroundColor = color;
}


document.getElementById('redButton').addEventListener('click' ,function(){setBackgroundColor('red')});
document.getElementById('blueButton').addEventListener('click', function(){setBackgroundColor('blue')});
document.getElementById('pinkButton').addEventListener('click', function(){setBackgroundColor('pink')});

document.getElementById('inputBox').addEventListener('keypress' ,function(event){
    alert("Tecla pressionada:" + event.key)
});