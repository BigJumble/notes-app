class Loader {
    static dotGrid;

    static {
        this.dotGrid = document.getElementById("grid");
        this.gridPosition(Camera.x, Camera.y);
    }

    static gridPosition(x, y) {
        this.dotGrid.setAttribute('x', -100 * Math.trunc(x / 100) - 125);
        this.dotGrid.setAttribute('y', -100 * Math.trunc(y / 100) - 125);
    }
}