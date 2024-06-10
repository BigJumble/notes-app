class ActionManager {

    static mouseStartX;
    static mouseStartY;
    static mouseOldX;
    static mouseOldY;

    static cursorX;
    static cursorY;

    static elementType = Object.freeze({
        none: 0,
        background: 1,
        transform: 2,
        text: 3,
        unknown: 4,
    });

    static controls = {
        mainMouseDown: false,
        mainMouseDownCtrl: false,
        selectedElementType: this.elementType.none,
        hoverElementType: this.elementType.none,
        /** @type {Widget} */
        selectedWidget: null,
    };

    // actions:
    /*
    open menu   (right click)
    camera move (mouse drag)
    camera zoom (mouse wheel (not text) / ctrl + wheel)
    text scroll (mouse wheel / not ctrl + wheel)
    transform   (mouse drag (prevent camera move))
    */

    static {
        document.addEventListener("mousedown", (e) => { this.#handleMouseDown(e); });
        document.addEventListener("mouseup", (e) => { this.#handleMouseUp(e); });
        document.addEventListener("mousemove", (e) => { this.#handleMouseMove(e); });
        document.addEventListener("wheel", (e) => { this.#mouseWheelHandler(e); }, { passive: false });
        window.addEventListener('resize', () => { this.#handleWindowResize(); });
        document.addEventListener("contextmenu", (e) => { this.#handleContextmenu(e); });


    }

    /** @param {MouseEvent} e */
    static #handleMouseDown(e) {
        if (e.button === 0) {
            if (e.ctrlKey) this.controls.mainMouseDownCtrl = true;
            else this.controls.mainMouseDown = true;
        }

        this.mouseStartX = e.clientX;
        this.mouseStartY = e.clientY;
        this.mouseOldX = e.clientX;
        this.mouseOldY = e.clientY;
        this.#getSelectedElementType(e);

        this.clickStart(e);
    }

    /** @param {MouseEvent} e */
    static #getSelectedElementType(e) {
        switch (e.target.dataset?.type) {
            case "p":
            case "textarea":
                this.controls.selectedElementType = this.elementType.text;
                break;

            case "transform":
            case "mover":
            case "resizer1":
            case "resizer2":
            case "resizer3":
            case "resizer4":
                this.controls.selectedElementType = this.elementType.transform;
                break;

            case "background":
            case "content":
                this.controls.selectedElementType = this.elementType.background;
                break;

            default:
                this.controls.selectedElementType = this.elementType.unknown;
                break;
        }
    }

    /** @param {MouseEvent} e */
    static #handleMouseUp(e) {
        if (e.button === 0) {
            this.controls.mainMouseDown = false;
            this.controls.mainMouseDownCtrl = false;
            this.controls.selectedElementType = this.elementType.none;
        }

        this.clickEnd(e);
    }

    /** @param {MouseEvent} e */
    static #handleMouseMove(e) {
        this.cursorX = e.clientX;
        this.cursorY = e.clientY;
        const deltaX = this.cursorX - this.mouseOldX;
        const deltaY = this.cursorY - this.mouseOldY;
        this.mouseOldX = this.cursorX;
        this.mouseOldY = this.cursorY;

        const tempType = this.controls.selectedElementType;
        this.#getSelectedElementType(e);
        this.controls.hoverElementType = this.controls.selectedElementType;
        this.controls.selectedElementType = tempType;

        this.mouseDrag(e, { deltaX, deltaY });
    }

    /** @param {MouseEvent} e */
    static #mouseWheelHandler(e) {
        this.wheel(e);
    }




    // interactions with scene =====================================================

    static #handleWindowResize() {
        
        Camera.recalculateViewBox();
        ContextMenu.recalculateViewBox();
        Elements.hideOffscreen();
    }

    /** @param {MouseEvent} e */
    static #handleContextmenu(e) {
        ContextMenu.show(e);
    }

    /** @param {MouseEvent} e */
    static clickStart(e) {
        if (e.target === ContextMenu.menuElement) {
            ContextMenu.close();
            return;
        }
        if (this.controls.selectedElementType === this.elementType.transform) {
            if (this.controls.mainMouseDown) {
                if (this.controls.selectedWidget) {
                    this.controls.selectedWidget.transforming();
                    this.controls.widgetTransformType = e.target.dataset.type;
                }
            }
        }
        else {
            if (this.controls.mainMouseDown) {
                if (this.controls.selectedWidget) {
                    this.controls.selectedWidget.cancel();
                    this.controls.selectedWidget = null;
                }
            }
        }

        if (this.controls.selectedElementType === this.elementType.text) {
            Elements.userSelectHandler(e, true);
        }
        else { Elements.userSelectHandler(e, false); }
        if (this.controls.mainMouseDownCtrl) e.preventDefault();


    }

    /** @param {MouseEvent} e */
    static clickEnd(e) {
        if (e.button === 0) {
            if (this.controls.selectedWidget) {
                this.controls.selectedWidget.snap();
            }

        }
    }

    /** @param {MouseEvent} e */
    static mouseDrag(e, delta) {
        if (this.controls.mainMouseDown) {
            if (this.controls.selectedElementType === this.elementType.background) {
                Camera.dragMove(e, delta);
            }
            if (this.controls.selectedElementType === this.elementType.transform) {
                if (!!this.controls.selectedWidget) {
                    this.controls.selectedWidget.onMove(this.controls.widgetTransformType, delta);
                }
            }
        }
        else if (this.controls.mainMouseDownCtrl) {
            e.preventDefault(); // don't select text
            Camera.dragMove(e, delta);
        }
    }

    /** @param {WheelEvent} e */
    static wheel(e) {
        if (e.ctrlKey) {
            e.preventDefault(); // disable text scroll
            Camera.handleScroll(e);
        }
        else {
            if (this.controls.hoverElementType !== this.elementType.text) {
                Camera.handleScroll(e);
            }
        }
    }
}