class Elements {
    static dotGrid;
    static gridCoverGroup;
    static contentGroup;

    static {
        this.dotGrid = document.getElementById("grid");
        this.gridCoverGroup = document.getElementById("gridCover");
        this.contentGroup = document.getElementById("content");
        
        this.gridPosition(Camera.x, Camera.y);

    }

    static gridPosition(x, y) {
        this.dotGrid.setAttribute('x', -100 * Math.trunc(x / 100) - 125);
        this.dotGrid.setAttribute('y', -100 * Math.trunc(y / 100) - 125);
    }

    static createNote({x, y})
    {
        const rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
        rect.setAttribute('width', 300);   // width of the rectangle
        rect.setAttribute('height', 200);  // height of the rectangle
        rect.setAttribute('x', Helper.snap(x, 50));        // x-coordinate
        rect.setAttribute('y', Helper.snap(y, 50));        // y-coordinate

        rect.setAttribute('fill', 'blue'); // fill color
    
        Elements.contentGroup.appendChild(rect);
    }
}