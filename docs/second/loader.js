class Loader{

    static saveAll()
    {
        localStorage.clear();
        localStorage.setItem("Camera",JSON.stringify(Camera.position()));

        localStorage.setItem("ContextMenu",JSON.stringify(ContextMenu.theme()));

        Content.elements.forEach(element => {
           localStorage.setItem(element.id, JSON.stringify(Content.getElementData(element)));
            
        });

    }
    static loadAll()
    {
        
        if(!!localStorage.getItem("Camera")) Camera.setPosition(JSON.parse(localStorage.getItem("Camera")));
        if(!!localStorage.getItem("ContextMenu")) ContextMenu.setTheme(JSON.parse(localStorage.getItem("ContextMenu")));

        Object.keys(localStorage).forEach(key => {

            if(key.includes("text-"))
            {
                const data = JSON.parse(localStorage.getItem(key));
                data.id = parseInt(key.match(/\d+/)[0]);
                Content.makeNote(data);
            }
            else if(key.includes("canvas-"))
            {

            }

        });

        update();
    }

    static{
        window.addEventListener("unload", this.saveAll);
    }
}