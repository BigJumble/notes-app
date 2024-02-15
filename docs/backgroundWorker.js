
let osc;
let ctx;

onmessage=(e)=>{
    
    switch(e.data.msg)
    {
        case "load":
            osc = e.data.osc;
            ctx = osc.getContext("2d");

            break;
        case "newFrame":


            const cellSize = e.data.tileSize * e.data.z;
            ctx.fillStyle = e.data.backgroundColor;
            ctx.fillRect(0, 0, e.data.width, e.data.height);
    
            ctx.fillStyle = e.data.dotsColor;
            const rows = Math.ceil(e.data.height / cellSize) + 1;
            const cols = Math.ceil(e.data.width / cellSize) + 1;
    
            const dotSize = Math.max(0.9, Math.min(2, e.data.z * 2));
    
            for (let row = -1; row < rows; row++) {
                for (let col = -1; col < cols; col++) {
    
                    let x = col * cellSize + e.data.x % cellSize;
                    let y = row * cellSize + e.data.y % cellSize;
    
                    ctx.beginPath();
                    ctx.fillRect(x, y, dotSize, dotSize);
                    ctx.fill();
                }
            }



        break;
        default:
            break;
    }
}