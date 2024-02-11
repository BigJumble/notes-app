class Content
{
    /**@type {HTMLElement[]} */
    static elements = [];
    static makeNote(e)
    {
        const newDiv = document.createElement('div');
        const txt = document.createElement('textarea');

        newDiv.id = 'text-' + elements.length;
        newDiv.className = 'container';
        newDiv.dataset.posX = posX;
        newDiv.dataset.posY = posY;
        newDiv.dataset.sizeX = sizeX;
        newDiv.dataset.sizeY = sizeY;
        newDiv.draggable = false;

        txt.spellcheck = false;
        txt.textContent = text;
        txt.className = 'text';
        newDiv.append(txt);

        document.body.appendChild(newDiv);

        txt.addEventListener("change", (e) =>
        {
            let data = JSON.parse(localStorage.getItem(e.target.parentNode.id));
            data.text = e.target.value;
            localStorage.setItem(e.target.parentNode.id, JSON.stringify(data));
        });
    
        elements.push(newDiv);
    }
}