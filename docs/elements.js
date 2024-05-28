class Elements {
    static dotGrid;
    static gridCoverGroup;
    static contentGroup;

    static dotPattern;
    static plusPattern;

    static listOfWidgets = [];

    static {
        this.dotGrid = document.getElementById("grid");
        this.gridCoverGroup = document.getElementById("gridCover");
        this.contentGroup = document.getElementById("content");

        this.dotPattern = document.getElementById("dotPattern");
        this.plusPattern = document.getElementById("plusPattern");

        this.gridPosition(Camera.x, Camera.y);

        this.contentGroup.addEventListener("mousedown", (e) => { console.log(e); });

        setTimeout(()=>{
            for (let i = 0; i < 15; i++) {
                for (let a = 0; a < 15; a++) {
                    Elements.createNote({x:i*350,y:a*250})
                }
            }
        },100)

    }

    static setPlusPattern() {
        this.dotPattern.style.display = "none";
        this.plusPattern.style.display = "block";
    }
    static setDotPattern() {
        this.dotPattern.style.display = "block";
        this.plusPattern.style.display = "none";
    }
    static setNonePattern() {
        this.dotPattern.style.display = "none";
        this.plusPattern.style.display = "none";
    }

    static gridPosition(x, y) {
        this.dotGrid.setAttribute('x', -100 * Math.trunc(x / 100) - 125);
        this.dotGrid.setAttribute('y', -100 * Math.trunc(y / 100) - 125);
    }

    static createNote(pos) {
        const obj = new Widget(WidgetTypes.Note, pos);
        Elements.listOfWidgets.push(obj);
    }
}