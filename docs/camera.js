class Camera {
    static x = window.innerWidth / 2;
    static y = window.innerHeight / 2;
    static z = 1;

    static targetX = this.x;
    static targetY = this.y;
    static targetZ = this.z;

    static cursorX = 0;
    static cursorY = 0;

    static screenSVG;
    static viewbox;

    static {
        this.screenSVG = document.getElementById("screenSVG");
        this.viewbox = this.screenSVG.viewBox.baseVal;
        this.recalculateViewBox();
        this.screenSVG.style.display = "block";
    }

    static recalculateViewBox() {
        this.screenSVG.style.width = `${window.innerWidth}px`;
        this.screenSVG.style.height = `${window.innerHeight}px`;
        this.viewbox.x = -this.x;
        this.viewbox.y = -this.y;
        this.viewbox.width = window.innerWidth / this.z;
        this.viewbox.height = window.innerHeight / this.z;
    }

    static recenterView() {
        ContextMenu.close();
        Camera.targetX = window.innerWidth / 2 / Camera.z;
        Camera.targetY = window.innerHeight / 2 / Camera.z;
        Animator.update();

    }

    /** @param {MouseEvent} e */
    static dragMove = (e, { deltaX, deltaY }) => {
        e.preventDefault();

        this.targetX += deltaX / this.z;
        this.targetY += deltaY / this.z;

        Animator.update();
    };



    /** @param {MouseEvent} e */
    static handleScroll = (e) => {
        if (Math.abs(e.deltaY) > 50)
            Camera.targetZ += e.deltaY > 0 ? -0.05 : 0.05;
        else {
            Camera.targetZ += e.deltaY / 300;
        }
        Camera.targetZ = Math.max(0.25, Math.min(1, Camera.targetZ));

        Animator.update();
    };


    /**
     * @param {number} deltaTime last frame time taken.
     * @returns {boolean} is animation is completed.
     */
    static doMoveAnimationStep(deltaTime) {
        this.x = Helper.lerp(this.x, this.targetX, deltaTime);
        this.y = Helper.lerp(this.y, this.targetY, deltaTime);

        const oldz = this.z;
        this.z = Helper.lerp(this.z, this.targetZ, deltaTime);

        this.#zoomCorrection(oldz, this.z);

        if (Math.abs(this.x - this.targetX) < 1) this.x = this.targetX;
        if (Math.abs(this.y - this.targetY) < 1) this.y = this.targetY;
        if (Math.abs(this.z - this.targetZ) < 0.002) {
            this.#zoomCorrection(this.z, this.targetZ);
            this.z = this.targetZ;
        }

        this.recalculateViewBox();
    }

    static #zoomCorrection(oldZ, newZ) {
        const x = (window.innerWidth / newZ - window.innerWidth / oldZ) * (ActionManager.cursorX / window.innerWidth);
        const y = (window.innerHeight / newZ - window.innerHeight / oldZ) * (ActionManager.cursorY / window.innerHeight);

        this.targetX += x;
        this.targetY += y;

        this.x += x;
        this.y += y;
    }

    /**@returns {boolean} is camera in target position*/
    static isMoveAnimationFinished() {
        return (this.x === this.targetX && this.y === this.targetY && this.z === this.targetZ);
    }


    static screenToGlobalPosition(x = ActionManager.cursorX, y = ActionManager.cursorY) {

        return { x: x / this.z - this.x, y: y / this.z - this.y };
    }
    // static globalToScreenPosition(x, y) {
    //     return {x, y}

    // }
}