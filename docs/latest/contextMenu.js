class ContextMenu {
    static menuElement;
    static viewBox;
    static contextGroup;
    static noteContextGroup;

    static globalPositionOpened;

    static selectedElementId;

    static {
        this.menuElement = document.getElementById("contextMenu");

        this.contextGroup = document.getElementById("contextGroup");
        this.noteContextGroup = document.getElementById("noteContextGroup");
        this.viewBox = this.menuElement.viewBox.baseVal;
        this.recalculateViewBox();

    }
    static close() {
        ContextMenu.menuElement.style.display = "none";
        ContextMenu.selectedElementId = undefined;
        
    }
    /** @param {MouseEvent} e */
    static show(e) {
        e.preventDefault();
        if (Elements.contentGroup.contains(e.target)) {
            this.selectedElementId = e.target.dataset.id;
            this.contextGroup.style.display = "none";
            this.noteContextGroup.style.display = "block";
        }
        else {
            this.contextGroup.style.display = "block";
            this.noteContextGroup.style.display = "none";
        }
        this.viewBox.x = -e.clientX;
        this.viewBox.y = -e.clientY;
        this.menuElement.style.display = "block";

        this.globalPositionOpened = Camera.screenToGlobalPosition();

    }
    static recalculateViewBox() {
        this.viewBox.width = window.innerWidth;
        this.viewBox.height = window.innerHeight;
    }

    static createNote() {

        Elements.createNote(ContextMenu.globalPositionOpened);
        ContextMenu.close();
    }

    static createDrawNote() {

        ContextMenu.close();
    }
}