class ContextMenu {
    static menuElement;
    static viewBox;
    static contextGroup;
    static baseMenu;
    static noteContextGroup;
    static customThemeMenu;

    static noteBcPicker;

    static noteTcPicker;

    static globalPositionOpened;

    static selectedElementId;

    static {
        this.menuElement = document.getElementById("contextMenu");
        this.baseMenu = document.getElementById("baseMenu");
        this.contextGroup = document.getElementById("contextGroup");
        this.customThemeMenu = document.getElementById("customThemeMenu");
        this.noteContextGroup = document.getElementById("noteContextGroup");

        this.noteBcPicker = document.getElementById("noteBcPicker");
        this.noteTcPicker = document.getElementById("noteTcPicker");

        this.viewBox = this.menuElement.viewBox.baseVal;
        this.recalculateViewBox();

        document.getElementById("bcChanger").addEventListener("colorChange", (e) => { this.customBC = e.detail.color(); this.setCustomTheme(false); });
        document.getElementById("fcChanger").addEventListener("colorChange", (e) => { this.customFC = e.detail.color(); this.setCustomTheme(false); });
        document.getElementById("nbcChanger").addEventListener("colorChange", (e) => { this.customNoteBC = e.detail.color(); this.setCustomTheme(false); });
        document.getElementById("ntcChanger").addEventListener("colorChange", (e) => { this.customNoteTC = e.detail.color(); this.setCustomTheme(false); });

    }
    static close() {
        ContextMenu.menuElement.style.display = "none";
        ContextMenu.selectedElementId = undefined;
        ColorPicker.colorEditor.style.display = "none";

    }
    /** @param {MouseEvent} e */
    static show(e) {
        e.preventDefault();
        this.customThemeMenu.style.display = "none";
        this.baseMenu.style.display = "block";
        if (Elements.contentGroup.contains(e.target)) {
            this.selectedElementId = e.target.dataset.id;
            this.contextGroup.style.display = "none";
            this.noteContextGroup.style.display = "block";
            //theme
            if (e.target.dataset.themebc) {
                this.noteBcPicker.setAttribute("fill", e.target.dataset.themebc);
            }
            else {
                this.noteBcPicker.setAttribute("fill", this.currentNoteBC);
            }
            if (e.target.dataset.themetc) {
                this.noteTcPicker.setAttribute("fill", e.target.dataset.themetc);
            }
            else {
                this.noteTcPicker.setAttribute("fill", this.currentNoteTC);
            }
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

    static openThemeMenu() {
        this.baseMenu.style.display = "none";
        this.customThemeMenu.style.display = "block";
        this.setCustomTheme();
    }

    static customBC = "#000000";
    static customFC = "#ffffff";
    static customNoteBC = "#ffffff";
    static customNoteTC = "#000000";

    static currentBC = "#000000";
    static currentFC = "#ffffff";
    static currentNoteBC = "#ffffff";
    static currentNoteTC = "#000000";

    static themeMode = "dark";
    static theme = 'warm';
    static styleSheet = document.getElementById("dynamicCSS").sheet;

    static enableTransition(bool) {
        if (bool) {
            this.styleSheet.cssRules[0].style.transition = "background-color 0.2s ease-in-out";
            this.styleSheet.cssRules[1].style.transition = "fill 0.2s ease-in-out";
            this.styleSheet.cssRules[2].style.transition = "stroke 0.2s ease-in-out";
            this.styleSheet.cssRules[3].style.transition = "fill 0.2s ease-in-out";
            this.styleSheet.cssRules[4].style.transition = "fill 0.2s ease-in-out, color 0.2s ease-in-out";
        }
        else {
            this.styleSheet.cssRules[0].style.transition = "none";
            this.styleSheet.cssRules[1].style.transition = "none";
            this.styleSheet.cssRules[2].style.transition = "none";
            this.styleSheet.cssRules[3].style.transition = "none";
            this.styleSheet.cssRules[4].style.transition = "none";
        }
    }
    /**
     * Sets a custom theme for the application.
     * 
     * @param {boolean} [transition=true] - Whether to enable transition effects.
     * @param {string|null} [bc=null] - The background color. If null, the default custom background color is used.
     * @param {string|null} [fc=null] - The foreground color. If null, the default custom foreground color is used.
     * @param {string|null} [nbc=null] - The note background color. If null, the default custom note background color is used.
     * @param {string|null} [ntc=null] - The note text color. If null, the default custom note text color is used.
     */
    static setCustomTheme(transition = true, bc = null, fc = null, nbc = null, ntc = null) {
        this.enableTransition(transition);

        const tempBC = bc !== null ? bc : this.customBC;
        const tempFC = fc !== null ? fc : this.customFC;
        const tempNoteBC = nbc !== null ? nbc : this.customNoteBC;
        const tempNoteTC = ntc !== null ? ntc : this.customNoteTC;

        this.styleSheet.cssRules[0].style.backgroundColor = tempBC;
        this.styleSheet.cssRules[1].style.fill = tempFC;
        this.styleSheet.cssRules[2].style.stroke = tempFC;
        this.styleSheet.cssRules[3].style.fill = tempBC;
        this.styleSheet.cssRules[4].style.fill = tempNoteBC;
        this.styleSheet.cssRules[4].style.color = tempNoteTC;

        this.currentBC = tempBC;
        this.currentFC = tempFC;
        this.currentNoteBC = tempNoteBC;
        this.currentNoteTC = tempNoteTC;
    }

    static setMode(mode) {
        this.themeMode = mode;
        if (this.themeMode === "dark") {
            this.setCustomTheme(true, "#000000", "#ffffff", "#ffffff", "#000000");
        } else if (this.themeMode === "light") {
            this.setCustomTheme(true, "#ffffff", "#000000", "#000000", "#ffffff");
        }
    }
    
    static setTheme(_theme) {
        this.theme = _theme;
        if (this.themeMode === "dark") {
            if (this.theme === "warm") {
                this.setCustomTheme(true, "#0b0100", "rgb(255, 167, 0)", "rgb(255, 167, 0)", "#0b0100");
            } else if (this.theme === "cool") {
                this.setCustomTheme(true, "#00050b", "rgb(0, 110, 228)", "rgb(0, 110, 228)", "#00050b");
            } else if (this.theme === "wind") {
                this.setCustomTheme(true, "#020b00", "rgb(0, 213, 64)", "rgb(0, 213, 64)", "#020b00");
            }
        } else {
            if (this.theme === "warm") {
                this.setCustomTheme(true, "white", "#ff8300", "#ff8300", "white");
            } else if (this.theme === "cool") {
                this.setCustomTheme(true, "white", "rgb(0, 147, 255)", "rgb(0, 147, 255)", "white");
            } else if (this.theme === "wind") {
                this.setCustomTheme(true, "white", "rgb(6, 178, 0)", "rgb(6, 178, 0)", "white");
            }
        }
    }
}