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
    static userSelectHandler(e, isText) {

        if (!!this.userSelectID  && !!this.userSelectID !== e.target.dataset.id) {
            window.getSelection().removeAllRanges();
            this.listOfWidgets[this.userSelectID].p.style.userSelect = 'none';
            this.userSelectID = undefined;
        }
        if (isText) {
            this.userSelectID = e.target.dataset.id;
            this.listOfWidgets[this.userSelectID].p.style.userSelect = 'auto';
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
        this.listOfWidgets[id].openTransformMenu();
        ActionManager.controls.selectedWidget = this.listOfWidgets[id];
    }
}