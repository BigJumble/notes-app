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
        // this.text.setAttribute('fill', 'black');
        this.text.setAttribute('data-type', 'text');
        this.text.classList.add("textarea")
        this.text.textContent = "Sample Text Sample Text1 Sample Text Sample Text2 Sample Text Sample Text3 Sample Text Sample Text4 Sample Text Sample Text5 Sample Text Sample Text6";

  
        // Append the text element to the group
        this.group.appendChild(this.text);

        this.group.appendChild(this.cover);
        this.group.appendChild(this.rect);

        this.foreignObject.appendChild(this.text);
        this.group.appendChild(this.foreignObject);

        Elements.contentGroup.appendChild(this.group);
    }

}