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
        this.p.setAttribute('data-type', 'text');
        this.p.setAttribute('data-id', id);
        this.p.classList.add("textarea");
        this.p.classList.add("dynamicPattern4");
        this.p.style.display = 'block';
        this.p.textContent = "Sample Text Sample Text1 Sample Text Sample Text2 Sample Text Sample Text3 Sample Text Sample Text4 Sample Text Sample Text5";

        this.text = document.createElement('textarea');
        this.text.setAttribute('data-type', 'text');
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

        this.resizer1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        this.resizer1.setAttribute('r', 6);
        this.resizer1.setAttribute('data-type', 'resizer1');
        this.resizer1.setAttribute('data-id', id);
        this.resizer1.setAttribute('stroke', '#666666');
        this.resizer1.setAttribute('stroke-width', '2.5');
        this.resizer1.setAttribute('class', 'dynamicPattern');

        this.resizer2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        this.resizer2.setAttribute('r', 6);
        this.resizer2.setAttribute('data-type', 'resizer2');
        this.resizer2.setAttribute('data-id', id);
        this.resizer2.setAttribute('stroke', '#666666');
        this.resizer2.setAttribute('stroke-width', '2.5');
        this.resizer2.setAttribute('class', 'dynamicPattern');

        this.resizer3 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        this.resizer3.setAttribute('r', 6);
        this.resizer3.setAttribute('data-type', 'resizer3');
        this.resizer3.setAttribute('data-id', id);
        this.resizer3.setAttribute('stroke', '#666666');
        this.resizer3.setAttribute('stroke-width', '2.5');
        this.resizer3.setAttribute('class', 'dynamicPattern');

        this.resizer4 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        this.resizer4.setAttribute('r', 6);
        this.resizer4.setAttribute('data-type', 'resizer4');
        this.resizer4.setAttribute('data-id', id);
        this.resizer4.setAttribute('stroke', '#666666');
        this.resizer4.setAttribute('stroke-width', '2.5');
        this.resizer4.setAttribute('class', 'dynamicPattern');

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

    transform() {
        this.group2.style.display = "block";
        const listener = (e) => this.translate(e, listener, this);
        // this.text.setAttribute("disabled",'');
        // this.text.setAttribute("draggable",'false');
        document.addEventListener("mousedown", listener);

    }

    /** @param {MouseEvent} e */
    translate(e, listener, me) {

        let oldX = e.clientX;
        let oldY = e.clientY;
        /** @param {MouseEvent} e2 */
        function onMove(e2) {
            let deltaX = (e2.clientX - oldX) / Camera.z;
            let deltaY = (e2.clientY - oldY) / Camera.z;
            oldX = e2.clientX;
            oldY = e2.clientY;
            switch (e.target.dataset.type) {
                case "mover":
                    me.x0 += deltaX;
                    me.x1 += deltaX;
                    me.y0 += deltaY;
                    me.y1 += deltaY;
                    break;
                case "resizer1":
                    me.x0 += deltaX;
                    if (me.x0 + 100 > me.x1) me.x0 = me.x1 - 100;
                    me.y0 += deltaY;
                    if (me.y0 + 100 > me.y1) me.y0 = me.y1 - 100;
                    break;
                case "resizer2":
                    me.x1 += deltaX;
                    if (me.x1 < me.x0 + 100) me.x1 = me.x0 + 100;
                    me.y0 += deltaY;
                    if (me.y0 + 100 > me.y1) me.y0 = me.y1 - 100;
                    break;
                case "resizer4":
                    me.x1 += deltaX;
                    if (me.x1 < me.x0 + 100) me.x1 = me.x0 + 100;
                    me.y1 += deltaY;
                    if (me.y1 < me.y0 + 100) me.y1 = me.y0 + 100;
                    break;
                case "resizer3":
                    me.x0 += deltaX;
                    if (me.x0 + 100 > me.x1) me.x0 = me.x1 - 100;
                    me.y1 += deltaY;
                    if (me.y1 < me.y0 + 100) me.y1 = me.y0 + 100;
                    break;
            }
            me.updateTransform();

        }
        /** @param {MouseEvent} e2 */
        function snap(e2) {
            me.cover.style.display = "block";
            me.cx0 = Helper.snapRound(me.x0, 50) - 25;
            me.cx1 = Helper.snapRound(me.x1, 50) + 25;
            me.cy0 = Helper.snapRound(me.y0, 50) - 25;
            me.cy1 = Helper.snapRound(me.y1, 50) + 25;

            me.x0 = Helper.snapRound(me.x0, 50);
            me.x1 = Helper.snapRound(me.x1, 50);
            me.y0 = Helper.snapRound(me.y0, 50);
            me.y1 = Helper.snapRound(me.y1, 50);

            me.updateTransform();
            document.removeEventListener("mousemove", onMove);
            document.removeEventListener("mouseup", snap);
        }

        if (me.group2.contains(e.target)) {
            me.cover.style.display = "none";

            document.addEventListener("mousemove", onMove);
            document.addEventListener("mouseup", snap);

        }
        else {
            // me.text.removeAttribute("disabled");
            // me.text.removeAttribute("draggable",'true');
            me.group2.style.display = "none";
            document.removeEventListener("mousedown", listener);
        }
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