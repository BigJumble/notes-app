class ContextMenu {
    static menuElement;
    static viewBox;
    static contextGroup;
    static noteContextGroup;
    static contextWrap;
    static globalPositionOpened;

    static selectedElementId;

    static {
        this.menuElement = document.getElementById("contextMenu");
        this.contextWrap = document.getElementById("contextWrap");
        this.contextGroup = document.getElementById("contextGroup");
        this.noteContextGroup = document.getElementById("noteContextGroup");
        this.viewBox = this.menuElement.viewBox.baseVal;
        this.recalculateViewBox();
        window.addEventListener('resize', () => { ContextMenu.recalculateViewBox(); });
        document.addEventListener("contextmenu", ContextMenu.show);
    }
    static close(e = null) {
        if (e === null || !ContextMenu.contextWrap.contains(e.target) || e.button !== 0 || e.type === "wheel") {
            ContextMenu.menuElement.style.display = "none";
            ContextMenu.selectedElementId = undefined;
            document.removeEventListener("mousedown", ContextMenu.close);
            document.removeEventListener("wheel", ContextMenu.close);
        }
    }
    static show(e) {
        e.preventDefault();
        if (Elements.contentGroup.contains(e.target)) {
            ContextMenu.selectedElementId = e.target.dataset.id;
            ContextMenu.contextGroup.style.display = "none";
            ContextMenu.noteContextGroup.style.display = "block";
        }
        else {

            ContextMenu.contextGroup.style.display = "block";
            ContextMenu.noteContextGroup.style.display = "none";
        }
        ContextMenu.viewBox.x = -Camera.cursorX;
        ContextMenu.viewBox.y = -Camera.cursorY;
        ContextMenu.menuElement.style.display = "block";
        document.addEventListener("mousedown", ContextMenu.close);
        document.addEventListener("wheel", ContextMenu.close);

        ContextMenu.globalPositionOpened = Camera.screenToGlobalPosition();

    }
    static recalculateViewBox() {
        this.viewBox.width = window.innerWidth;
        this.viewBox.height = window.innerHeight;
        Elements.hideOffscreen();
    }

    static createNote() {

        Elements.createNote(ContextMenu.globalPositionOpened);
        ContextMenu.close();
    }

    static createDrawNote() {

        ContextMenu.close();
    }
}