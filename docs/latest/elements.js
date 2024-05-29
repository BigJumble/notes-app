class Elements {
    static dotGrid;
    static gridCoverGroup;
    static contentGroup;

    static dotPattern;
    static plusPattern;

    /**@type {Object<string, Widget>}*/
    static listOfWidgets = {};

    static availableId() {
        let lastKey = -1;
        for (let key in this.listOfWidgets) {
            if (lastKey + 1 !== Number(key)) {
                return lastKey + 1;
            }
            lastKey = Number(key);
        }

        return Object.keys(this.listOfWidgets).length;
    }

    static {
        this.dotGrid = document.getElementById("grid");
        this.gridCoverGroup = document.getElementById("cover");
        this.contentGroup = document.getElementById("content");

        this.dotPattern = document.getElementById("dotPattern");
        this.plusPattern = document.getElementById("plusPattern");

        this.gridPosition(Camera.x, Camera.y);

        document.addEventListener("mousedown", Elements.userSelectHandler);

        setTimeout(() => {
            for (let i = 0; i < 10; i++) {
                for (let a = 0; a < 10; a++) {
                    Elements.createNote({ x: i * 550, y: a * 450 });
                }
            }
            Elements.hideOffscreen();
        }, 100);

    }

    static userSelectID;
    /** @param {MouseEvent} e */
    static userSelectHandler(e) {
        if (!!Elements.userSelectID && (!!e.target.dataset.id || Elements.userSelectID !== e.target.dataset.id)) {
            window.getSelection().removeAllRanges();
            Elements.listOfWidgets[Elements.userSelectID].p.style.userSelect = 'none';
            Elements.userSelectID = undefined;
        }
        if (!!e.target.dataset.id) {
            if (e.target.dataset.type === "text" || e.target.dataset.type === "background") {
                Elements.userSelectID = e.target.dataset.id;
                Elements.listOfWidgets[Elements.userSelectID].p.style.userSelect = 'auto';
            }
        }

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
        const id = Elements.availableId();
        const obj = new Widget(WidgetTypes.Note, pos, id);
        Elements.listOfWidgets[id] = obj;
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

    static editText(id) {
        ContextMenu.close();
        this.listOfWidgets[id].editText();
    }


    static deleteNote(id) {
        this.listOfWidgets[id].delete();
        delete this.listOfWidgets[id];
        ContextMenu.close();
    }

    static moveResize(id) {
        ContextMenu.close();
        this.listOfWidgets[id].transform();
    }

    static themeMode = "dark";
    static theme = 'warm';
    static styleSheet = document.getElementById("dynamicCSS").sheet;
    static setMode(mode) {
        this.themeMode = mode;
        if (this.themeMode === "dark") {
            this.styleSheet.cssRules[0].style.backgroundColor = "#000000";
            this.styleSheet.cssRules[1].style.fill = "#ffffff";
            this.styleSheet.cssRules[2].style.stroke = "#ffffff";
            this.styleSheet.cssRules[3].style.fill = "#000000";
            this.styleSheet.cssRules[4].style.fill = "#ffffff";
            this.styleSheet.cssRules[4].style.color = "#000000";
        }
        else if (this.themeMode === "light") {
            this.styleSheet.cssRules[0].style.backgroundColor = "#ffffff";
            this.styleSheet.cssRules[1].style.fill = "#000000";
            this.styleSheet.cssRules[2].style.stroke = "#000000";
            this.styleSheet.cssRules[3].style.fill = "#ffffff";
            this.styleSheet.cssRules[4].style.fill = "#000000";
            this.styleSheet.cssRules[4].style.color = "#ffffff";
        }
    }

    static setTheme(_theme) {
        this.theme = _theme;
        if (this.themeMode === "dark") {
            if (this.theme === "warm") {
                this.styleSheet.cssRules[0].style.backgroundColor = "#0b0100";
                this.styleSheet.cssRules[1].style.fill = "rgb(255, 167, 0)";
                this.styleSheet.cssRules[2].style.stroke = "rgb(255, 167, 0)";
                this.styleSheet.cssRules[3].style.fill = "#0b0100";
                this.styleSheet.cssRules[4].style.fill = "rgb(255, 167, 0)";
                this.styleSheet.cssRules[4].style.color = "#0b0100";

            }
            else if (this.theme === "cool") {
                this.styleSheet.cssRules[0].style.backgroundColor = "#00050b";
                this.styleSheet.cssRules[1].style.fill = "rgb(0, 110, 228)";
                this.styleSheet.cssRules[2].style.stroke = "rgb(0, 110, 228)";
                this.styleSheet.cssRules[3].style.fill = "#00050b";
                this.styleSheet.cssRules[4].style.fill = "rgb(0, 110, 228)";
                this.styleSheet.cssRules[4].style.color = "#00050b";
            }
            else if (this.theme === "wind") {
                this.styleSheet.cssRules[0].style.backgroundColor = "#020b00";
                this.styleSheet.cssRules[1].style.fill = "rgb(0, 213, 64)";
                this.styleSheet.cssRules[2].style.stroke = "rgb(0, 213, 64)";
                this.styleSheet.cssRules[3].style.fill = "#020b00";
                this.styleSheet.cssRules[4].style.fill = "rgb(0, 213, 64)";
                this.styleSheet.cssRules[4].style.color = "#020b00";

            }
        }
        else {
            if (this.theme === "warm") {
                this.styleSheet.cssRules[0].style.backgroundColor = "white";
                this.styleSheet.cssRules[1].style.fill = "#ff8300";
                this.styleSheet.cssRules[2].style.stroke = "#ff8300";
                this.styleSheet.cssRules[3].style.fill = "white";
                this.styleSheet.cssRules[4].style.fill = "#ff8300";
                this.styleSheet.cssRules[4].style.color = "#white";
            }
            else if (this.theme === "cool") {
                this.styleSheet.cssRules[0].style.backgroundColor = "white";
                this.styleSheet.cssRules[1].style.fill = "rgb(0, 147, 255)";
                this.styleSheet.cssRules[2].style.stroke = "rgb(0, 147, 255)";
                this.styleSheet.cssRules[3].style.fill = "white";
                this.styleSheet.cssRules[4].style.fill = "rgb(0, 147, 255)";
                this.styleSheet.cssRules[4].style.color = "#white";
            }
            else if (this.theme === "wind") {
                this.styleSheet.cssRules[0].style.backgroundColor = "white";
                this.styleSheet.cssRules[1].style.fill = "rgb(6, 178, 0)";
                this.styleSheet.cssRules[2].style.stroke = "rgb(6, 178, 0)";
                this.styleSheet.cssRules[3].style.fill = "white";
                this.styleSheet.cssRules[4].style.fill = "rgb(6, 178, 0)";
                this.styleSheet.cssRules[4].style.color = "#white";

            }
        }
    }
}