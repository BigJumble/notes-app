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

        txt.addEventListener("change", (e) =>
        {
            let data = JSON.parse(localStorage.getItem(e.target.parentNode.id));
            data.text = e.target.value;
            localStorage.setItem(e.target.parentNode.id, JSON.stringify(data));
        });

        ContextMenu.hide();
        this.elements.push(newDiv);
        this.repositionElement(newDiv);
        this.resizeElement(newDiv);
    }




    /**@param {HTMLElement} el  */
    static repositionElement(el)
    {
        const position = Camera.position();
        
        const newX = position.x + (Number)(el.dataset.posX) * position.z - 5 * position.z;
        const newY = position.y + (Number)(el.dataset.posY) * position.z - 5 * position.z;

        el.style.transform = `translate(${newX}px, ${newY}px)`;

        el.style.transform += ` scale(${position.z})`;
    }

    /**@param {HTMLElement} el  */
    static resizeElement(el)
    {
        el.style.width = `${el.dataset.sizeX * BackgroundGrid.tileSize + 10}px`;
        el.style.height = `${el.dataset.sizeY * BackgroundGrid.tileSize + 10}px`;
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