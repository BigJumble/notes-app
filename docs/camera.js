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
        this.#onMouseDragEvent();
        window.addEventListener('resize', () => { Camera.#recalculateViewBox(); });
        Camera.#recalculateViewBox();
        this.screenSVG.style.display = "block";
    }

    static #recalculateViewBox() {
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


    static #onMouseDragEvent() {
        /** @param {MouseEvent} e */
        const startDrag = (e) => {
            if (e.button !== 1) return; // middle click
            e.preventDefault();

            let oldX = e.clientX;
            let oldY = e.clientY;
            Camera.isDragging = true;

            /** @param {MouseEvent} e2 */
            const dragMove = (e2) => {
                e2.preventDefault();

                Camera.targetX += (e2.clientX - oldX) / Camera.z;
                Camera.targetY += (e2.clientY - oldY) / Camera.z;
                oldX = e2.clientX;
                oldY = e2.clientY;

                Animator.update();
            };

            /** @param {MouseEvent} e2 */
            const endDrag = (e2) => {
                e2.preventDefault();
                Camera.isDragging = false;
                document.removeEventListener('mousemove', dragMove);
                document.removeEventListener('mouseup', endDrag);
            };

            document.addEventListener('mousemove', dragMove);
            document.addEventListener('mouseup', endDrag);

        };

        /** @param {MouseEvent} e */
        const mousePosition = (e) => {
            Camera.cursorX = e.clientX;
            Camera.cursorY = e.clientY;
        };

        /** @param {MouseEvent} e */
        const handleScroll = (e) => {
            if(e.target.localName === "textarea") return;
            Camera.targetZ += e.deltaY > 0 ? -0.1 : 0.1;
            Camera.targetZ = Math.max(0.4, Math.min(1, Camera.targetZ));

            Animator.update();
        };
        document.addEventListener('mousemove', mousePosition);
        document.addEventListener('wheel', handleScroll);
        document.addEventListener("mousedown", startDrag);
    }

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

        this.#recalculateViewBox();
    }

    static #zoomCorrection(oldZ, newZ) {
        const x = (window.innerWidth / newZ - window.innerWidth / oldZ) * (this.cursorX / window.innerWidth);
        const y = (window.innerHeight / newZ - window.innerHeight / oldZ) * (this.cursorY / window.innerHeight);

        this.targetX += x;
        this.targetY += y;

        this.x += x;
        this.y += y;
    }

    /**@returns {boolean} is camera in target position*/
    static isMoveAnimationFinished() {
        return (this.x === this.targetX && this.y === this.targetY && this.z === this.targetZ);
    }


    static screenToGlobalPosition(x = Camera.cursorX, y = Camera.cursorY) {

        return { x: x / Camera.z - Camera.x, y: y / Camera.z - Camera.y };
    }
    // static globalToScreenPosition(x, y) {
    //     return {x, y}

    // }
}