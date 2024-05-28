class Elements {
    static dotGrid;
    static gridCoverGroup;
    static contentGroup;

    static dotPattern;
    static plusPattern;

    /**@type {Widget[]}*/
    static listOfWidgets = [];

    static {
        this.dotGrid = document.getElementById("grid");
        this.gridCoverGroup = document.getElementById("gridCover");
        this.contentGroup = document.getElementById("content");

        this.dotPattern = document.getElementById("dotPattern");
        this.plusPattern = document.getElementById("plusPattern");

        this.gridPosition(Camera.x, Camera.y);

        this.contentGroup.addEventListener("mousedown", (e) => { console.log(e); });

        setTimeout(() => {
            for (let i = 0; i < 20; i++) {
                for (let a = 0; a < 20; a++) {
                    Elements.createNote({ x: i * 550, y: a * 450 });
                }
            }
            Elements.hideOffscreen();
        }, 100);

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

    static hideOffscreen() {
        let bbox;
        const camx1 = -Camera.x + window.innerWidth / Camera.z;
        const camy1 = -Camera.y + window.innerHeight / Camera.z;
        for (let i = 0; i < this.listOfWidgets.length; i++) {
            bbox = this.listOfWidgets[i].getCoverBBox();
            if (-Camera.x < bbox.cx1 && -Camera.y < bbox.cy1 && camx1 > bbox.cx0 && camy1 > bbox.cy0) {
                this.listOfWidgets[i].group.style.display = "block";
            }
            else {
                this.listOfWidgets[i].group.style.display = "none";
            }
        }
    }
}