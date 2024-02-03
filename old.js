let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

let colorPicker = document.getElementById('colorPicker');
let colorPicker2 = document.getElementById('colorPicker2');

let cellSize = 20;
let dotSize = 1;
let globalOffset = {
    x: 0,
    y: 0
};
let canvasPosition = {
    x: 0,
    y: 0
};

let isDragging = false;

function setCanvasSize()
{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    drawGrid();
}

let cursorPosition = { x: 0, y: 0 };

// Update cursor position on mouse move
canvas.addEventListener('mousemove', function (event)
{
    cursorPosition = {
        x: event.clientX,
        y: event.clientY
    };
});


function drawGrid()
{

    const cellSize = cameraState.zoom*20;

    ctx.fillStyle = colorPicker2.value;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = colorPicker.value;

    const rows = Math.ceil(canvas.height / cellSize) + 1;
    const cols = Math.ceil(canvas.width / cellSize) + 1;


    for (var row = -1; row < rows; row++) {
        for (var col = -1; col < cols; col++) {

            var x = col * cellSize + cameraState.x;
            var y = row * cellSize + cameraState.y;

            ctx.beginPath();
            ctx.fillRect(x, y, 2, 2);
            ctx.fill();
        }
    }
}

function startDrag(e)
{
    isDragging = true;

    let startX = e.clientX || e.touches[0].clientX;
    let startY = e.clientY || e.touches[0].clientY;

    let initialX = globalOffset.x;
    let initialY = globalOffset.y;

    function dragMove(e)
    {
        if (isDragging) {

            let currentX = e.clientX || e.touches[0].clientX;
            let currentY = e.clientY || e.touches[0].clientY;
            globalOffset.x = initialX + (currentX - startX);
            globalOffset.y = initialY + (currentY - startY);


            globalOffset.x += cellSize;
            globalOffset.y += cellSize;
            canvasPosition.x = globalOffset.x;
            canvasPosition.y = globalOffset.y;
            canvasPosition.x %= cellSize;
            canvasPosition.y %= cellSize;

            drawGrid();
        }
    }

    function endDrag()
    {
        isDragging = false;

        document.removeEventListener('mousemove', dragMove);
        document.removeEventListener('touchmove', dragMove);
        document.removeEventListener('mouseup', endDrag);
        document.removeEventListener('touchend', endDrag);
    }


    colorPicker.addEventListener('input', drawGrid);
    colorPicker2.addEventListener('input', drawGrid);
    document.addEventListener('mousemove', dragMove);
    document.addEventListener('touchmove', dragMove);

    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchend', endDrag);
}

setCanvasSize();
window.addEventListener('resize', setCanvasSize);

canvas.addEventListener('mousedown', startDrag);
document.addEventListener('wheel', handleScroll);
canvas.addEventListener('touchstart', startDrag);

let cellSizeTarget = cellSize;
let lastTimestamp;
let timestamp = performance.now();
function handleScroll(event)
{
    cellSizeTarget += event.deltaY > 0 ? -1 : 1;
    if (cellSizeTarget < 15) cellSizeTarget = 15;
    if (cellSizeTarget > 50) cellSizeTarget = 50;
    lastTimestamp = performance.now();
    requestAnimationFrame(animateScroll);
}


function animateScroll()
{
    if (cellSizeTarget === cellSize) return;
    timestamp = performance.now();

    const deltaTime = (timestamp - lastTimestamp) / 1000; // Convert to seconds
    // console.log(deltaTime)
    const speed = 25; // Adjust as needed
    const direction = cellSizeTarget > cellSize ? 1 : -1;

    const previousCellSize = cellSize;
    cellSize += direction * speed * deltaTime;
    if (direction === 1 && cellSize > cellSizeTarget) cellSize = cellSizeTarget;
    if (direction === -1 && cellSize < cellSizeTarget) cellSize = cellSizeTarget;

    const deltaCellSize = cellSize - previousCellSize;

    // Calculate the offset needed for canvasPosition to keep the cursor centered
    const cursorOffsetX = cursorPosition.x * (deltaCellSize / previousCellSize);
    const cursorOffsetY = cursorPosition.y * (deltaCellSize / previousCellSize);

    // Adjust canvasPosition to center the zoom around the cursor
    globalOffset.x -= cursorOffsetX;
    globalOffset.y -= cursorOffsetY;

    canvasPosition.x = globalOffset.x;
    canvasPosition.y = globalOffset.y;
    canvasPosition.x %= cellSize;
    canvasPosition.y %= cellSize;

    drawGrid();
    lastTimestamp = timestamp;
    requestAnimationFrame(animateScroll);
}