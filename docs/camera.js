class Camera
{


    static x = window.innerWidth/2;
    static y = window.innerHeight/2;
    static z = 1;

    static targetX = this.x;
    static targetY =this. y;
    static targetZ = this.z;

    static cursorX = 0;
    static cursorY = 0;

    static isDragging = false;

    static {
        this.onMouseDragEvent();
    }

    static position()
    {
        return { x: this.x, y: this.y, z: this.z };
    }
    static onMouseDragEvent()
    {
        /** @param {MouseEvent} e */
        const startDrag = (e) =>
        {
            if (e.button !== 1) return; // middle click
            e.preventDefault();

            let oldX = e.clientX;
            let oldY = e.clientY;
            this.isDragging = true;

            /** @param {MouseEvent} e2 */
            const dragMove = (e2) =>
            {
                e2.preventDefault();

                this.targetX += e2.clientX - oldX;
                this.targetY += e2.clientY - oldY;
                oldX = e2.clientX;
                oldY = e2.clientY;

                update(); // in main.js :D
            };

            /** @param {MouseEvent} e2 */
            const endDrag = (e2) =>
            {
                e2.preventDefault();
                this.isDragging = false;
                document.removeEventListener('mousemove', dragMove);
                document.removeEventListener('mouseup', endDrag);
            };

            document.addEventListener('mousemove', dragMove);
            document.addEventListener('mouseup', endDrag);

        };

        /** @param {MouseEvent} e */
        const mousePosition = (e) =>
        {
            this.cursorX = e.clientX;
            this.cursorY = e.clientY;
        };

        /** @param {MouseEvent} e */
        const handleScroll = (e) =>
        {
            this.targetZ += e.deltaY > 0 ? -0.1 : 0.1;
            this.targetZ = Math.max(0.3, Math.min(1, this.targetZ));

            update();
        };
        document.addEventListener('mousemove', mousePosition);
        document.addEventListener('wheel', handleScroll);
        document.addEventListener("mousedown", startDrag);
    }

    // /**@param {BackgroundGrid} bcGrid*/
    // static onWindowResize(bcGrid)
    // {
    //     window.addEventListener('resize', () => { bcGrid.setSize(), bcGrid.draw(); });
    // }

    /**
     * @param {number} deltaTime last frame time taken.
     * @returns {boolean} is animation is completed.
     */
    static doMoveAnimationStep(deltaTime)
    {
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
    }

    /**@returns {boolean} is camera in target position*/
    static isMoveAnimationFinished()
    {
        return (this.x === this.targetX && this.y === this.targetY && this.z === this.targetZ);
    }


    static #zoomCorrection(oldZ, newZ)
    {
        const deltaZoom = newZ - oldZ;

        this.targetX += (this.x - this.cursorX) / oldZ * deltaZoom;
        this.targetY += (this.y - this.cursorY) / oldZ * deltaZoom;

        this.x += (this.x - this.cursorX) / oldZ * deltaZoom;
        this.y += (this.y - this.cursorY) / oldZ * deltaZoom;
    }

    static recenter()
    {
        this.targetX = window.innerWidth/2;
        this.targetY = window.innerHeight/2;
        update();
    }

}