const WidgetTypes = Object.freeze({
    Note: "note",
    Draw: "draw",
    Line: "line",
});
class Widget {

    /**
     * 
     * @param {WidgetTypes} widgetType
     */
    constructor(widgetType, pos, id) {
        if (widgetType === "note") {
            this.createNote(pos, id);
        }
    }

    createNote({ x, y }, id) {
        this.cx0 = Helper.snap(x, 50) - 25;
        this.cx1 = Helper.snap(x, 50) - 25 + 350;
        this.cy0 = Helper.snap(y, 50) - 25;
        this.cy1 = Helper.snap(y, 50) - 25 + 250;

        this.x0 = Helper.snap(x, 50);
        this.x1 = Helper.snap(x, 50) + 300;
        this.y0 = Helper.snap(y, 50);
        this.y1 = Helper.snap(y, 50) + 200;

        this.group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        this.group.setAttribute("id", id);
        this.group.setAttribute('data-type', 'content');

        this.rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        this.rect.setAttribute('data-type', 'background');
        this.rect.setAttribute('data-id', id);
        this.rect.setAttribute('class', 'dynamicPattern4');

        this.cover = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        this.cover.setAttribute('data-type', 'cover');
        this.cover.setAttribute('data-id', id);
        this.cover.setAttribute('class', 'dynamicPattern3');

        this.foreignObject = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
        this.foreignObject.setAttribute('data-id', id);


        this.p = document.createElement('p');
        this.p.setAttribute('data-type', 'p');
        this.p.setAttribute('data-id', id);
        this.p.classList.add("textarea");
        this.p.classList.add("dynamicPattern4");
        this.p.style.display = 'block';
        this.p.textContent = "Sample Text Sample Text1 Sample Text Sample Text2 Sample Text Sample Text3 Sample Text Sample Text4 Sample Text Sample Text5";

        this.text = document.createElement('textarea');
        this.text.setAttribute('data-type', 'textarea');
        this.text.setAttribute('data-id', id);
        this.text.setAttribute('placeholder', "Type something...");
        this.text.classList.add("textarea");
        this.text.style.display = 'none';
        this.text.classList.add("dynamicPattern4");
        this.text.textContent = "Sample Text Sample Text1 Sample Text Sample Text2 Sample Text Sample Text3 Sample Text Sample Text4 Sample Text Sample Text5";

        this.group2 = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        this.group2.setAttribute('data-type', 'transform');

        this.mover = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        this.mover.setAttribute('data-type', 'mover');
        this.mover.setAttribute('data-id', id);
        this.mover.setAttribute('stroke', '#666666');
        this.mover.setAttribute('stroke-width', '2.5');
        this.mover.setAttribute('fill', 'transparent');
        this.mover.classList.add("mover");

        this.resizer1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        this.resizer1.setAttribute('r', 6);
        this.resizer1.setAttribute('data-type', 'resizer1');
        this.resizer1.setAttribute('data-id', id);
        this.resizer1.setAttribute('stroke', '#666666');
        this.resizer1.setAttribute('stroke-width', '2.5');
        this.resizer1.setAttribute('class', 'dynamicPattern nwse');

        this.resizer2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        this.resizer2.setAttribute('r', 6);
        this.resizer2.setAttribute('data-type', 'resizer2');
        this.resizer2.setAttribute('data-id', id);
        this.resizer2.setAttribute('stroke', '#666666');
        this.resizer2.setAttribute('stroke-width', '2.5');
        this.resizer2.setAttribute('class', 'dynamicPattern nesw');

        this.resizer3 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        this.resizer3.setAttribute('r', 6);
        this.resizer3.setAttribute('data-type', 'resizer3');
        this.resizer3.setAttribute('data-id', id);
        this.resizer3.setAttribute('stroke', '#666666');
        this.resizer3.setAttribute('stroke-width', '2.5');
        this.resizer3.setAttribute('class', 'dynamicPattern nesw');

        this.resizer4 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        this.resizer4.setAttribute('r', 6);
        this.resizer4.setAttribute('data-type', 'resizer4');
        this.resizer4.setAttribute('data-id', id);
        this.resizer4.setAttribute('stroke', '#666666');
        this.resizer4.setAttribute('stroke-width', '2.5');
        this.resizer4.setAttribute('class', 'dynamicPattern nwse');

        this.group2.style.display = "none";
        this.updateTransform();

        this.group.appendChild(this.rect);
        this.foreignObject.appendChild(this.p);
        this.foreignObject.appendChild(this.text);
        this.group.appendChild(this.foreignObject);

        this.group2.appendChild(this.mover);
        this.group2.appendChild(this.resizer1);
        this.group2.appendChild(this.resizer2);
        this.group2.appendChild(this.resizer3);
        this.group2.appendChild(this.resizer4);
        this.group.appendChild(this.group2);
        Elements.gridCoverGroup.appendChild(this.cover);
        Elements.contentGroup.appendChild(this.group);
    }

    updateTransform() {
        this.rect.setAttribute('width', this.x1 - this.x0);
        this.rect.setAttribute('height', this.y1 - this.y0);
        this.rect.setAttribute('x', this.x0);
        this.rect.setAttribute('y', this.y0);

        this.cover.setAttribute('width', this.cx1 - this.cx0);
        this.cover.setAttribute('height', this.cy1 - this.cy0);
        this.cover.setAttribute('x', this.cx0);
        this.cover.setAttribute('y', this.cy0);

        this.foreignObject.setAttribute('width', this.x1 - this.x0);
        this.foreignObject.setAttribute('height', this.y1 - this.y0);
        this.foreignObject.setAttribute('x', this.x0);
        this.foreignObject.setAttribute('y', this.y0);

        this.mover.setAttribute('width', this.x1 - this.x0);
        this.mover.setAttribute('height', this.y1 - this.y0);
        this.mover.setAttribute('x', this.x0);
        this.mover.setAttribute('y', this.y0);

        this.resizer1.setAttribute('cx', this.x0);
        this.resizer1.setAttribute('cy', this.y0);

        this.resizer2.setAttribute('cx', this.x1);
        this.resizer2.setAttribute('cy', this.y0);

        this.resizer3.setAttribute('cx', this.x0);
        this.resizer3.setAttribute('cy', this.y1);

        this.resizer4.setAttribute('cx', this.x1);
        this.resizer4.setAttribute('cy', this.y1);
    }

    openTransformMenu() {
        this.group2.style.display = "block";
    }

    onMove(type, { deltaX, deltaY }) {
        deltaX/=Camera.z;
        deltaY/=Camera.z;
        switch (type) {
            case "mover":
                this.x0 += deltaX;
                this.x1 += deltaX;
                this.y0 += deltaY;
                this.y1 += deltaY;
                break;
            case "resizer1":
                this.x0 += deltaX;
                if (this.x0 + 100 > this.x1) this.x0 = this.x1 - 100;
                this.y0 += deltaY;
                if (this.y0 + 100 > this.y1) this.y0 = this.y1 - 100;
                break;
            case "resizer2":
                this.x1 += deltaX;
                if (this.x1 < this.x0 + 100) this.x1 = this.x0 + 100;
                this.y0 += deltaY;
                if (this.y0 + 100 > this.y1) this.y0 = this.y1 - 100;
                break;
            case "resizer4":
                this.x1 += deltaX;
                if (this.x1 < this.x0 + 100) this.x1 = this.x0 + 100;
                this.y1 += deltaY;
                if (this.y1 < this.y0 + 100) this.y1 = this.y0 + 100;
                break;
            case "resizer3":
                this.x0 += deltaX;
                if (this.x0 + 100 > this.x1) this.x0 = this.x1 - 100;
                this.y1 += deltaY;
                if (this.y1 < this.y0 + 100) this.y1 = this.y0 + 100;
                break;
        }
        this.updateTransform();

    }

    /** @param {MouseEvent} e */
    snap(e) {
        this.cover.style.display = "block";
        this.cx0 = Helper.snapRound(this.x0, 50) - 25;
        this.cx1 = Helper.snapRound(this.x1, 50) + 25;
        this.cy0 = Helper.snapRound(this.y0, 50) - 25;
        this.cy1 = Helper.snapRound(this.y1, 50) + 25;

        this.x0 = Helper.snapRound(this.x0, 50);
        this.x1 = Helper.snapRound(this.x1, 50);
        this.y0 = Helper.snapRound(this.y0, 50);
        this.y1 = Helper.snapRound(this.y1, 50);

        this.updateTransform();
    }

    transforming(e) {
        this.cover.style.display = "none"; // hide cover when moving
    }
    cancel() {
        this.group2.style.display = "none"; // hide transform menu
    }

    /**
     * Retrieves the bounding box coordinates of the cover.
     *
     * @returns {{cx0: number, cx1: number, cy0: number, cy1: number}} An object containing the coordinates of the cover's bounding box:
     * - `cx0`: The start x-coordinate.
     * - `cx1`: The end x-coordinate.
     * - `cy0`: The start y-coordinate.
     * - `cy1`: The end y-coordinate.
     */
    getCoverBBox() {
        return { cx0: this.cx0, cx1: this.cx1, cy0: this.cy0, cy1: this.cy1 };
    }

    stopEditingText(e, listener) {
        if (!this.group.contains(e.target)) {
            this.p.style.display = 'block';
            this.p.innerText = this.text.value;
            this.text.style.display = 'none';

            document.removeEventListener("mousedown", listener);
        }
    }
    editText() {
        this.text.style.display = 'block';
        this.p.style.display = 'none';
        const listener = (e) => this.stopEditingText(e, listener);
        document.addEventListener("mousedown", listener);
    }

    delete() {
        this.cover.remove();
        this.group.remove();
    }

}