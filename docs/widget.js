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
    constructor(widgetType,pos) {
        if (widgetType === "note") {
            this.createNote(pos)
        }
    }

    createNote({x,y})
    {
        this.cx0 = Helper.snap(x, 50)-25;
        this.cx1 = Helper.snap(x, 50)-25 + 350;
        this.cy0 = Helper.snap(y, 50)-25;
        this.cy1 = Helper.snap(y, 50)-25 + 250;

        this.group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        this.group.setAttribute("id", Elements.listOfWidgets.length);

        this.rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
        this.rect.setAttribute('width', 300);
        this.rect.setAttribute('height', 200);
        this.rect.setAttribute('x', Helper.snap(x, 50));
        this.rect.setAttribute('y', Helper.snap(y, 50));
        this.rect.setAttribute('fill', 'blue');
        this.rect.setAttribute('data-type', 'background'); 

        this.cover = document.createElementNS('http://www.w3.org/2000/svg','rect');
        this.cover.setAttribute('width', 350);
        this.cover.setAttribute('height', 250);
        this.cover.setAttribute('x', Helper.snap(x, 50)-25);
        this.cover.setAttribute('y', Helper.snap(y, 50)-25);
        this.cover.setAttribute('fill', 'black');
        this.cover.setAttribute('data-type', 'cover');

        this.foreignObject = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
        this.foreignObject.setAttribute('width', 250);
        this.foreignObject.setAttribute('height', 150);
        this.foreignObject.setAttribute('x', Helper.snap(x, 50)+25);
        this.foreignObject.setAttribute('y', Helper.snap(y, 50)+25);

        this.text = document.createElement('textarea');
        this.text.setAttribute('data-type', 'text');
        this.text.classList.add("textarea")
        this.text.textContent = "Sample Text Sample Text1 Sample Text Sample Text2 Sample Text Sample Text3 Sample Text Sample Text4 Sample Text Sample Text5";


        this.group.appendChild(this.cover);
        this.group.appendChild(this.rect);
        this.foreignObject.appendChild(this.text);
        this.group.appendChild(this.foreignObject);

        Elements.contentGroup.appendChild(this.group);
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
    getCoverBBox()
    {
        return {cx0:this.cx0,cx1:this.cx1,cy0:this.cy0,cy1:this.cy1}
    }

}