class Input
{

    static mouseStartX;
    static mouseStartY;
    static mouseEndX;
    static mouseEndY;

    // actions:
    /*
    open menu   (right click)
    camera move (mouse drag)
    camera zoom (mouse wheel (not text) / ctrl + wheel)
    text scroll (mouse wheel / not ctrl + wheel)
    transform   (mouse drag (prevent camera move))
    */

    // this class used to handle various input anywhere, how the fck do I do that?? xdddd
    static {
        document.addEventListener("mousedown", (e)=>{this.#handleMouseDown(e)});
        document.addEventListener("mouseup", (e)=>{this.#handleMouseUp(e)});
        document.addEventListener("wheel", (e)=>{ this.mouseWheelHandler(e)}, { passive: false});

	
    }

    static #handleMouseDown(e)
    {
        
    }
    static #handleMouseUp(e)
    {

    }

    static cameraMove()
    {

    }

    static mouseWheelHandler(e){
        if(e.ctrlKey == true){
            this.customzoom(e);
		}	
		return false;
	}
	
	
	
	static customzoom(e){
		e.preventDefault();

	}
}