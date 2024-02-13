class Content
{

    static defaultText = "Hello, write something!";
    static defaultSizeX = 5;
    static defaultSizeY = 3;

    /**@type {HTMLElement[]} */
    static elements = [];

    /** @param {MouseEvent} e */
    static makeNote(e)
    {
        const position = Camera.position();

        const newDiv = document.createElement('div');
        const txt = document.createElement('textarea');
        newDiv.id = 'text-' + this.elements.length;
        newDiv.className = 'container FCb BCbg FCbs';
        newDiv.dataset.posX = Helper.snap((-position.x + ContextMenu.cliX) / position.z, BackgroundGrid.tileSize);
        newDiv.dataset.posY = Helper.snap((-position.y + ContextMenu.cliY) / position.z, BackgroundGrid.tileSize);
        newDiv.dataset.sizeX = this.defaultSizeX;
        newDiv.dataset.sizeY = this.defaultSizeY;
        newDiv.draggable = false;

        txt.spellcheck = false;
        txt.textContent = this.defaultText;
        txt.className = 'textarea TCc';
        newDiv.append(txt);

        document.body.appendChild(newDiv);

        txt.addEventListener("change", () =>
        {
            let data = JSON.parse(localStorage.getItem(newDiv.id));
            data.text = this.value;
            localStorage.setItem(newDiv.id, JSON.stringify(data));
        });

        newDiv.addEventListener("mouseenter", this.#handleMoveResize);

        ContextMenu.hide();
        this.elements.push(newDiv);
        this.repositionElement(newDiv);
        this.resizeElement(newDiv);
    }

    /** @param {MouseEvent} e  */
    static #handleMoveResize(e)
    {
        e.stopPropagation();

        const currentElement = e.target;

        let mode = setMode(e.clientX, e.clientY);
        let isResizing = false;
        document.addEventListener("mousemove", handleMouseMove1);
        currentElement.addEventListener("mousedown", handleClick);
        currentElement.addEventListener("mouseleave", handleMouseLeave);

        function handleMouseMove1(e2)
        {
            if (isResizing) return;
            e2.stopPropagation();
            if (e2.target !== currentElement) return;
            mode = setMode(e2.clientX, e2.clientY);
        }

        function handleMouseLeave()
        {
            document.removeEventListener("mousemove", handleMouseMove1);
            currentElement.removeEventListener("mousedown", handleClick);
            currentElement.removeEventListener("mouseleave", handleMouseLeave);
            currentElement.style.cursor = "default";
        }
        function handleClick(e2)
        {
            if (e2.target !== currentElement) return;
            isResizing = true;
            const initialX = e2.clientX;
            const initialY = e2.clientY;
            const initialPosX = Number(currentElement.dataset.posX);
            const initialPosY = Number(currentElement.dataset.posY);
            const initialSizeX = Number(currentElement.dataset.sizeX);
            const initialSizeY = Number(currentElement.dataset.sizeY);

            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);

            let stopMovingX = null;
            let stopMovingY = null;

            function handleMouseMove(e3)
            {
                e3.stopPropagation();
                const deltaX = (e3.clientX - initialX) / Camera.z;
                const deltaY = (e3.clientY - initialY) / Camera.z;


                if (mode === 0 || mode === 1) {
                    currentElement.dataset.posX = initialPosX + deltaX;
                    currentElement.dataset.posY = initialPosY + deltaY;
                }
                if (mode === 1) {
                    currentElement.dataset.sizeX = initialSizeX + (mode % 2 === 0 ? 1 : -1) * deltaX / BackgroundGrid.tileSize;
                    currentElement.dataset.sizeY = initialSizeY + (mode <= 2 ? -1 : 1) * deltaY / BackgroundGrid.tileSize;
                }

                if (mode === 2) {
                    currentElement.dataset.posY = initialPosY + deltaY;

                    currentElement.dataset.sizeX = initialSizeX + (mode % 2 === 0 ? 1 : -1) * deltaX / BackgroundGrid.tileSize;
                    currentElement.dataset.sizeY = initialSizeY + (mode <= 2 ? -1 : 1) * deltaY / BackgroundGrid.tileSize;
                }

                if (mode === 3) {
                    currentElement.dataset.sizeX = initialSizeX + (mode % 2 === 0 ? -1 : 1) * deltaX / BackgroundGrid.tileSize;
                    currentElement.dataset.sizeY = initialSizeY + (mode <= 2 ? -1 : 1) * deltaY / BackgroundGrid.tileSize;
                }

                if (mode === 4) {
                    currentElement.dataset.posX = initialPosX + deltaX;

                    currentElement.dataset.sizeX = initialSizeX + (mode % 2 === 0 ? -1 : 1) * deltaX / BackgroundGrid.tileSize;
                    currentElement.dataset.sizeY = initialSizeY + (mode <= 2 ? -1 : 1) * deltaY / BackgroundGrid.tileSize;
                }

                if (Number(currentElement.dataset.sizeX) < 3) {
                    currentElement.dataset.sizeX = 3;
                    if (stopMovingX === null)
                        stopMovingX = Math.round(Number(currentElement.dataset.posX / BackgroundGrid.tileSize)) * BackgroundGrid.tileSize;
                    else
                        currentElement.dataset.posX = stopMovingX;
                }
                else {
                    stopMovingX = null;
                }

                if (Number(currentElement.dataset.sizeY) < 3) {
                    currentElement.dataset.sizeY = 3;

                    if (stopMovingY === null)
                        stopMovingY = Math.round(Number(currentElement.dataset.posY / BackgroundGrid.tileSize)) * BackgroundGrid.tileSize;
                    else
                        currentElement.dataset.posY = stopMovingY;
                }
                else {
                    stopMovingY = null;
                }

                Content.repositionElement(currentElement);
                Content.resizeElement(currentElement);
            }

            function handleMouseUp()
            {
                isResizing = false;
                const posX = Number(currentElement.dataset.posX);
                const posY = Number(currentElement.dataset.posY);
                const sizeX = Number(currentElement.dataset.sizeX);
                const sizeY = Number(currentElement.dataset.sizeY);

                currentElement.dataset.sizeX = Math.round(sizeX);
                currentElement.dataset.sizeY = Math.round(sizeY);
                currentElement.dataset.posX = Math.round(posX / BackgroundGrid.tileSize) * BackgroundGrid.tileSize;
                currentElement.dataset.posY = Math.round(posY / BackgroundGrid.tileSize) * BackgroundGrid.tileSize;

                Content.repositionElement(currentElement);
                Content.resizeElement(currentElement);

                document.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("mouseup", handleMouseUp);
            }

        }



        function setMode(posX, posY)
        {
            const rect = currentElement.getBoundingClientRect();
            const edgeSizePercentage = 0.1;
            const edgeSizeX = rect.width * edgeSizePercentage;
            const edgeSizeY = rect.height * edgeSizePercentage;

            if (posX < rect.left + edgeSizeX && posY < rect.top + edgeSizeY) {
                currentElement.style.cursor = "nwse-resize";
                return 1; // Top left corner
            } else if (posX > rect.right - edgeSizeX && posY < rect.top + edgeSizeY) {
                currentElement.style.cursor = "nesw-resize";
                return 2; // Top right corner
            } else if (posX > rect.right - edgeSizeX && posY > rect.bottom - edgeSizeY) {
                currentElement.style.cursor = "nwse-resize";
                return 3; // Bottom right corner
            } else if (posX < rect.left + edgeSizeX && posY > rect.bottom - edgeSizeY) {
                currentElement.style.cursor = "nesw-resize";
                return 4; // Bottom left corner
            } else {
                currentElement.style.cursor = "move";
                return 0; // Edges
            }
        }
    }




    /**@param {HTMLElement} el  */
    static repositionElement(el)
    {
        const position = Camera.position();

        const newX = position.x + (Number)(el.dataset.posX) * position.z - 10 * position.z;
        const newY = position.y + (Number)(el.dataset.posY) * position.z - 10 * position.z;

        el.style.transform = `translate(${newX}px, ${newY}px)`;

        el.style.transform += ` scale(${position.z})`;
    }

    /**@param {HTMLElement} el  */
    static resizeElement(el)
    {
        el.style.width = `${(Number)(el.dataset.sizeX) * BackgroundGrid.tileSize + 10}px`;
        el.style.height = `${(Number)(el.dataset.sizeY) * BackgroundGrid.tileSize + 10}px`;
    }

    /**@param {HTMLElement} el  */
    static themeElement(el)
    {
        if (!!el.dataset.colors) {
            const colors = JSON.parse(el.dataset.colors);
            el.style.backgroundColor = colors.bc;
            el.style.borderColor = colors.fc;
            el.style.boxShadow = `0px 0px 20px -5px ${colors.fc}`;
            el.firstChild.style.color = colors.tc;
        }
    }
}