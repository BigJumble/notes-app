class ContextMenu {
    static menuElement;
    static viewBox;
    static contextGroup;

    static globalPositionOpened;

    static {
        this.menuElement = document.getElementById("contextMenu");
        this.contextGroup = document.getElementById("contextGroup");
        this.viewBox = this.menuElement.viewBox.baseVal;
        this.recalculateViewBox();
        window.addEventListener('resize', () => { ContextMenu.recalculateViewBox(); });
        document.addEventListener("contextmenu", ContextMenu.show);
    }
    static close(e = null) {
        if (e === null || !ContextMenu.contextGroup.contains(e.target) || e.button !== 0 || e.type==="wheel") {
            ContextMenu.menuElement.style.display = "none";
            document.removeEventListener("mousedown", ContextMenu.close);
            document.removeEventListener("wheel", ContextMenu.close);
        }
    }
    static show(e) {
        e.preventDefault();
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

    }

    static createNote() {

        Elements.createNote(ContextMenu.globalPositionOpened);
        ContextMenu.close();
    }

    static createDrawNote() {

        ContextMenu.close();
    }
}