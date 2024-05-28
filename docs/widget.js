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
        this.rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
        this.rect.setAttribute('width', 300);   // width of the rectangle
        this.rect.setAttribute('height', 200);  // height of the rectangle
        this.rect.setAttribute('x', Helper.snap(x, 50));        // x-coordinate
        this.rect.setAttribute('y', Helper.snap(y, 50));        // y-coordinate
        this.rect.setAttribute('fill', 'blue'); // fill color
    
        Elements.contentGroup.appendChild(this.rect);

        this.cover = document.createElementNS('http://www.w3.org/2000/svg','rect');
        this.cover.setAttribute('width', 350);   // width of the rectangle
        this.cover.setAttribute('height', 250);  // height of the rectangle
        this.cover.setAttribute('x', Helper.snap(x, 50)-25);        // x-coordinate
        this.cover.setAttribute('y', Helper.snap(y, 50)-25);        // y-coordinate
        this.cover.setAttribute('fill', 'black'); // fill color
    
        Elements.gridCoverGroup.appendChild(this.cover);
    }

}