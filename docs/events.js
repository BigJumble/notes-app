// events.js will run after main

setCanvasSize();
LoadElements();

window.addEventListener('resize', setCanvasSize);

canvas.addEventListener('mousedown', startDrag);
document.addEventListener('mousemove', mousePosition);
canvas.addEventListener('wheel', handleScroll);

Coloris( {
    theme: 'default',
    themeMode: 'dark',
    alpha: true,
    forceAlpha: true,
  });

colorPicker.addEventListener('input', update);
colorPicker2.addEventListener('input', update);
colorPicker3.addEventListener('input', update);

colorPicker4.addEventListener('input', update);
colorPicker5.addEventListener('input', update);
colorPicker6.addEventListener('input', update);

document.addEventListener('contextmenu', popMenu);
document.addEventListener('mousedown', offMenu);

document.getElementById("dragpan").addEventListener("mousedown", moveElement);
document.getElementById("settings2").addEventListener("mousedown", changeSizeElement);

// canvas.addEventListener('touchstart', startDrag);