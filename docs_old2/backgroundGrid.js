class BackgroundGrid
{

    static x;
    static y;
    static z;

    static tileSize = 50;
    static backgroundColor;
    static dotsColor;

    /** @type {HTMLCanvasElement} */
    static canvas;
    // static osc;
    static ctx;

    // static worker = new Worker("backgroundWorker.js");

    static {

        this.#createCanvas();
        // this.osc = this.canvas.transferControlToOffscreen();
        this.ctx = this.canvas.getContext("2d");
        window.addEventListener('resize', () => { this.setSize(), this.draw(); });

        // this.worker.postMessage({
        //     msg:"load",
        //     osc:this.osc,
        // },[this.osc])

    }


    static setSize()
    {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    /**
     * 
     * @param {Theme} theme 
     */
    static setTheme(theme)
    {
        this.backgroundColor = theme.BackC;
        this.dotsColor = theme.DotC;
    }

    /**
     * Called on init
     * @returns {HTMLCanvasElement} - The created canvas element
     */
    static #createCanvas()
    {
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = "absolute"
        this.setSize();

        document.body.appendChild(this.canvas);
    }

    /**
     * @param {number} x horizontal position
     * @param {number} y vertical position
     * @param {number} z zoom
     */
    static setPosition({ x, y, z })
    {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    static draw()
    {
        // this.worker.postMessage({
        //     msg:"newFrame",
        //     tileSize:this.tileSize,
        //     z:this.z,
        //     backgroundColor:this.backgroundColor,
        //     width:this.canvas.width,
        //     height:this.canvas.height,
        //     dotsColor:this.dotsColor,
        //     x:this.x,
        //     y:this.y,
        // })

        // return;
        const cellSize = this.tileSize * this.z;
        this.ctx.fillStyle = this.backgroundColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = this.dotsColor;
        const rows = Math.ceil(this.canvas.height / cellSize) + 1;
        const cols = Math.ceil(this.canvas.width / cellSize) + 1;

        const dotSize = Math.max(0.9, Math.min(2, this.z * 2));

        for (let row = -1; row < rows; row++) {
            for (let col = -1; col < cols; col++) {

                let x = col * cellSize + this.x % cellSize;
                let y = row * cellSize + this.y % cellSize;

                this.ctx.beginPath();
                this.ctx.fillRect(x, y, dotSize, dotSize);
                this.ctx.fill();
            }
        }
    }
}