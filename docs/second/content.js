class Content
{

    static defaultText = "Hello, write something!";
    static defaultSizeX = 5;
    static defaultSizeY = 3;

    /**@type {HTMLElement[]} */
    static elements = [];

    static nextID = 0;

    /** @param {object} e data from loader */
    static makeNote(e)
    {
        const position = Camera.position();

        const newDiv = document.createElement('div');
        const txt = document.createElement('textarea');

        newDiv.className = 'container FCb BCbg FCbs';

        if (!!e) {
            if (this.nextID <= e.id) this.nextID = e.id + 1;

            newDiv.id = 'text-' + e.id;
            newDiv.dataset.posX = e.posX;
            newDiv.dataset.posY = e.posY;
            newDiv.dataset.sizeX = e.sizeX;
            newDiv.dataset.sizeY = e.sizeY;
            txt.textContent = e.content;
            if (e.colors !== "default")
                newDiv.dataset.colors = e.colors;
        }
        else {
            newDiv.id = 'text-' + this.nextID;
            this.nextID++;

            newDiv.dataset.posX = Helper.snap((-position.x + ContextMenu.cliX) / position.z, BackgroundGrid.tileSize);
            newDiv.dataset.posY = Helper.snap((-position.y + ContextMenu.cliY) / position.z, BackgroundGrid.tileSize);
            newDiv.dataset.sizeX = this.defaultSizeX;
            newDiv.dataset.sizeY = this.defaultSizeY;

            txt.textContent = this.defaultText;
        }

        newDiv.draggable = false;

        txt.spellcheck = false;

        txt.className = 'textarea TCc';
        newDiv.append(txt);

        document.body.appendChild(newDiv);

        // txt.addEventListener("change", () =>
        // {
        //     let data = JSON.parse(localStorage.getItem(newDiv.id));
        //     data.text = this.value;
        //     localStorage.setItem(newDiv.id, JSON.stringify(data));
        // });

        newDiv.addEventListener("mouseenter", this.#handleMoveResize);

        ContextMenu.hide();
        this.elements.push(newDiv);
        this.repositionElement(newDiv);
        this.resizeElement(newDiv);
        this.themeElement(newDiv);
    }

    /**@param {HTMLElement} el  */
    static getElementData(el)
    {
        return {
            posX: el.dataset.posX,
            posY: el.dataset.posY,
            sizeX: el.dataset.sizeX,
            sizeY: el.dataset.sizeY,
            colors: el.dataset.colors ? el.dataset.colors : "default",
            content: el.firstChild.value
        };
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
            if (e2.button !== 0) return;
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

            const relsToMoveFTemp = currentElement.dataset.firstAnchor ? JSON.parse(currentElement.dataset.firstAnchor) : [];
            const relsToMoveSTemp = currentElement.dataset.secondAnchor ? JSON.parse(currentElement.dataset.secondAnchor) : [];
            const relsToMoveF = [];
            const relsToMoveS = [];
            const datasetRelsToMoveF = [];
            const datasetRelsToMoveS = [];

            for (const el of relsToMoveFTemp) {
                const elem = document.getElementById(el);
                relsToMoveF.push(elem);
                const coord = {
                    posX: JSON.parse(elem.dataset.posX),
                    posY: JSON.parse(elem.dataset.posY),
                    endX: JSON.parse(elem.dataset.endX),
                    endY: JSON.parse(elem.dataset.endY),
                };
                datasetRelsToMoveF.push(coord);
            }
            for (const el of relsToMoveSTemp) {
                const elem = document.getElementById(el);
                relsToMoveS.push(elem);
                const coord = {
                    posX: JSON.parse(elem.dataset.posX),
                    posY: JSON.parse(elem.dataset.posY),
                    endX: JSON.parse(elem.dataset.endX),
                    endY: JSON.parse(elem.dataset.endY),
                };
                datasetRelsToMoveS.push(coord);
            }

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

                for (let i = 0; i < relsToMoveF.length; i++) {
                    const data = datasetRelsToMoveF[i];
                    Content.recalculateRelPos(relsToMoveF[i],data.posX+deltaX,data.posY+deltaY,data.endX-deltaX,data.endY-deltaY)
                }

                for (let i = 0; i < relsToMoveS.length; i++) {
                    const data = datasetRelsToMoveS[i];
                    Content.recalculateRelPos(relsToMoveS[i],data.posX,data.posY,data.endX+deltaX,data.endY+deltaY)
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

                const deltaX = -posX + Number(currentElement.dataset.posX);
                const deltaY = -posY + Number(currentElement.dataset.posY);

                for (let i = 0; i < relsToMoveF.length; i++) {
                    const relPosX = Number(relsToMoveF[i].dataset.posX);
                    const relPosY = Number(relsToMoveF[i].dataset.posY);
                    const relEndX = Number(relsToMoveF[i].dataset.endX);
                    const relEndY = Number(relsToMoveF[i].dataset.endY);
                    Content.recalculateRelPos(relsToMoveF[i],relPosX+deltaX,relPosY+deltaY,relEndX-deltaX,relEndY-deltaY);
                }

                for (let i = 0; i < relsToMoveS.length; i++) {
                    const relPosX = Number(relsToMoveS[i].dataset.posX);
                    const relPosY = Number(relsToMoveS[i].dataset.posY);
                    const relEndX = Number(relsToMoveS[i].dataset.endX);
                    const relEndY = Number(relsToMoveS[i].dataset.endY);
                    Content.recalculateRelPos(relsToMoveS[i],relPosX,relPosY,relEndX+deltaX,relEndY+deltaY);
                }

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

    static setNoteTheme(el, { fc, bc, tc })
    {
        el.dataset.colors = JSON.stringify({ fc, bc, tc });
    }

    /**@param {HTMLElement} el  */
    static themeElement(el)
    {
        if (!el.dataset.colors) return;
        const colors = JSON.parse(el.dataset.colors);

        if (el.id.includes("text")) {
            el.style.backgroundColor = colors.bc;
            el.style.borderColor = colors.fc;
            el.style.boxShadow = `0px 0px 20px -10px ${colors.fc}`;
            el.firstChild.style.color = colors.tc;
            el.style.transition = "background-color 0.3s ease-out, border-color 0.3s ease-out, box-shadow 0.3s ease-out";
            el.firstChild.style.transition = "color 0.3s ease-out";
        }


        if (el.id.includes("rel")) {
            el.childNodes.forEach((elem) =>
            {
                elem.style.backgroundColor = colors.tc;
                elem.style.borderColor = colors.fc;
                elem.style.boxShadow = `0px 0px 20px -10px ${colors.fc}`;
                elem.style.transition = "background-color 0.3s ease-out, border-color 0.3s ease-out, box-shadow 0.3s ease-out";
            });

        }

    }

    /** @param {MouseEvent} e */
    static deleteElement(e)
    {
        const removedID = ContextMenu.noteTarget.id;
        if (!!ContextMenu.noteTarget.dataset?.fa) {
            const fa = document.getElementById(ContextMenu.noteTarget.dataset.fa);
            let anchors = JSON.parse(fa.dataset.firstAnchor);
            anchors = anchors.filter(item => item !== removedID);
            fa.dataset.firstAnchor = JSON.stringify(anchors);
        }
        if (!!ContextMenu.noteTarget.dataset?.sa) {
            const sa = document.getElementById(ContextMenu.noteTarget.dataset.sa);
            let anchors = JSON.parse(sa.dataset.secondAnchor);
            anchors = anchors.filter(item => item !== removedID);
            sa.dataset.secondAnchor = JSON.stringify(anchors);
        }

        const oldNoteTarget = ContextMenu.noteTarget;
        if (!!ContextMenu.noteTarget.dataset?.firstAnchor) {
            let toRemove = JSON.parse(ContextMenu.noteTarget.dataset.firstAnchor);
            for (const elem of toRemove) {
                ContextMenu.noteTarget = document.getElementById(elem);
                this.deleteElement();
            }
        }
        if (!!ContextMenu.noteTarget.dataset?.secondAnchor) {
            let toRemove = JSON.parse(ContextMenu.noteTarget.dataset.secondAnchor);
            console.log(toRemove);
            for (const elem of toRemove) {
                ContextMenu.noteTarget = document.getElementById(elem);
                this.deleteElement();
            }
        }
        ContextMenu.noteTarget = oldNoteTarget;

        const index = this.elements.indexOf(ContextMenu.noteTarget);
        if (index !== -1) {
            this.elements.splice(index, 1);
            ContextMenu.noteTarget.remove();
        }
        ContextMenu.hide();
    }

    static recalculateRelPos(rel, startX, startY, endX, endY, first = false)
    {
        const line = rel.childNodes[0];
        const point1 = rel.childNodes[1];
        const point2 = rel.childNodes[2];

        rel.dataset.posX = startX;
        rel.dataset.posY = startY;
        rel.dataset.endX = endX;
        rel.dataset.endY = endY;

        Content.repositionElement(rel);

        if (first) return;

        const mag = Math.sqrt(endX * endX + endY * endY);

        const angle = Math.atan2(endY, endX);
        line.style.transform = `rotate(${angle}rad)`;

        line.style.width = `${mag}px`;
        point2.style.transform = `translate(${endX}px, ${endY}px)`;

    }
    static addRelation()
    {
        const firstAnchor = ContextMenu.noteTarget;
        ContextMenu.hide();

        let pos = Camera.position();
        let startX = -pos.x / pos.z + ContextMenu.cliX / pos.z;
        let startY = -pos.y / pos.z + ContextMenu.cliY / pos.z;

        const newDiv = document.createElement('div');
        newDiv.id = 'rel-' + this.nextID;
        this.nextID++;
        newDiv.className = 'relation';

        newDiv.dataset.posX = startX;
        newDiv.dataset.posY = startY;
        newDiv.draggable = false;

        const point1 = document.createElement('div');
        const line = document.createElement('div');
        const point2 = document.createElement('div');

        point1.className = "point TCbg FCb FCbs";
        line.className = "line TCbg FCb FCbs";
        point2.className = "point TCbg FCb FCbs";


        newDiv.appendChild(line);
        newDiv.appendChild(point1);
        newDiv.appendChild(point2);
        document.body.appendChild(newDiv);
        this.elements.push(newDiv);

        // this.repositionElement(newDiv);
        this.themeElement(newDiv);


        let endX = startX;
        let endY = startY;

        this.recalculateRelPos(newDiv, startX, startY, endX, endY, true);

        if (!firstAnchor.dataset.firstAnchor)
            firstAnchor.dataset.firstAnchor = JSON.stringify([newDiv.id]);
        else {
            const anchors = JSON.parse(firstAnchor.dataset.firstAnchor);
            firstAnchor.dataset.firstAnchor = JSON.stringify([...anchors, newDiv.id]);
        }

        newDiv.dataset.fa = firstAnchor.id;

        /** @param {MouseEvent} e  */
        function handleMouseMove(e)
        {
            const moved = Camera.position();
            moved.x -= pos.x;
            moved.y -= pos.y;

            endX = -startX + (-pos.x + e.clientX - moved.x) / moved.z;
            endY = -startY + (-pos.y + e.clientY - moved.y) / moved.z;

            Content.recalculateRelPos(newDiv, startX, startY, endX, endY);
        }
        /** @param {MouseEvent} e  */
        function handleMouseDown(e)
        {
            if (e.button !== 0) return;
            newDiv.style.display = "none";
            const esNew = document.elementsFromPoint(e.clientX, e.clientY);
            const eNew = esNew.find(element => element.id && !element.id.includes('rel'));
            const secondAnchor = eNew.id ? eNew : eNew.parentElement;
            newDiv.style.display = "";
            console.log(eNew);
            if (secondAnchor.id) {
                newDiv.dataset.sa = secondAnchor.id;
                if (!secondAnchor.dataset.secondAnchor)
                    secondAnchor.dataset.secondAnchor = JSON.stringify([newDiv.id]);
                else {
                    const anchors = JSON.parse(secondAnchor.dataset.secondAnchor);
                    secondAnchor.dataset.secondAnchor = JSON.stringify([...anchors, newDiv.id]);
                }
            }
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mousedown", handleMouseDown);
        }


        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mousedown", handleMouseDown);
    }
}