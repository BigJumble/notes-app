class ColorPicker {

    static hueSelector;
    static alphaSelector;
    static mainSelector;
    static text;

    static startX = 0;
    static startY = 0;
    static hueDrag = false;
    static alphaDrag = false;
    static mainDrag = false;
    static huePosition = 16;
    static alphaPosition = 198;

    static mainPositionX = 206;
    static mainPositionY = 6;

    static styleSheet = document.getElementById("dynamicCSS").sheet;

    static {
        this.hueSelector = document.getElementById("huePicker");
        this.alphaSelector = document.getElementById("alphaPicker");
        this.mainSelector = document.getElementById("mainPicker");

        this.hueSelector.addEventListener("mousedown", (e) => { this.hueDrag = true; this.startX = e.clientX - this.huePosition; });
        this.alphaSelector.addEventListener("mousedown", (e) => { this.alphaDrag = true; this.startX = e.clientX - this.alphaPosition; });
        this.mainSelector.addEventListener("mousedown", (e) => { this.mainDrag = true; this.startX = e.clientX - this.mainPositionX; this.startY = e.clientY - this.mainPositionY; });

        document.addEventListener("mouseup", (e) => { this.hueDrag = false; this.alphaDrag = false; this.mainDrag = false; });
        document.addEventListener("mousemove", (e) => { this.mouseMove(e); });
    }

    static oldX = 0;
    static oldY = 0;
    /** @param {MouseEvent} e */
    static mouseMove(e) {
        const deltaX = e.clientX - this.oldX;
        const deltaY = e.clientY - this.oldY;
        this.oldX = e.clientX;
        this.oldY = e.clientY;

        const relativeX = e.clientX - this.startX;
        const relativeY = e.clientY - this.startY;



        if (this.hueDrag) {
            this.huePosition = relativeX;
            if (this.huePosition < 18)
                this.huePosition = 18;
            else if (this.huePosition > 198)
                this.huePosition = 198;

            this.hueSelector.setAttribute("cx", this.huePosition);

        }
        if (this.alphaDrag) {
            this.alphaPosition = relativeX;
            if (this.alphaPosition < 18)
                this.alphaPosition = 18;
            else if (this.alphaPosition > 198)
                this.alphaPosition = 198;

            this.alphaSelector.setAttribute("cx", this.alphaPosition);

        }

        if (this.mainDrag) {
            this.mainPositionX = relativeX;
            this.mainPositionY = relativeY;
            if (this.mainPositionX < 8)
                this.mainPositionX = 8;
            else if (this.mainPositionX > 208)
                this.mainPositionX = 208;

            if (this.mainPositionY < 8)
                this.mainPositionY = 8;
            else if (this.mainPositionY > 158)
                this.mainPositionY = 158;

            this.mainSelector.setAttribute("cx", this.mainPositionX);
            this.mainSelector.setAttribute("cy", this.mainPositionY);

        }
        this.styleSheet.cssRules[5].style.stopColor = `hsl(${(this.huePosition - 18) * 2}, 100%, 50%)`;
        this.styleSheet.cssRules[5].style.fill = `hsl(${(this.huePosition - 18) * 2}, 100%, 50%)`;
        this.styleSheet.cssRules[6].style.fill = `hsla(${(this.huePosition - 18) * 2}, 100%, 50%, ${(this.alphaPosition - 18) / 180})`;
        this.styleSheet.cssRules[7].style.fill = `hsl(${(this.huePosition - 18) * 2}, ${(this.mainPositionX-8)/2}%, ${Helper.lerp(100-(this.mainPositionY-8)/1.5,50-(this.mainPositionY-8)/3,(this.mainPositionX-8)/200)}%)`;
        this.styleSheet.cssRules[7].style.stroke = `hsl(${((this.huePosition - 18) * 2 + 120)%360}, 100%, 50%)`;

        const finalColor = `hsla(${(this.huePosition - 18) * 2}, ${(this.mainPositionX-8)/2}%, ${Helper.lerp(100-(this.mainPositionY-8)/1.5,50-(this.mainPositionY-8)/3,(this.mainPositionX-8)/200)}%, ${(this.alphaPosition - 18) / 180})`;
        
    }

    /**https://css-tricks.com/converting-color-spaces-in-javascript/*/
    static nameToHSLA(name) {

        let fakeDiv = document.createElement("div");
        fakeDiv.style.color = name;
        document.body.appendChild(fakeDiv);

        let cs = window.getComputedStyle(fakeDiv),
            pv = cs.getPropertyValue("color");


        document.body.removeChild(fakeDiv);
        console.log(pv);

        let rgbaValues = pv.match(/\d+(\.\d+)?/g),
            r = rgbaValues[0] / 255,
            g = rgbaValues[1] / 255,
            b = rgbaValues[2] / 255,
            a = rgbaValues[3] ? parseFloat(rgbaValues[3]) : 1;

        let cmin = Math.min(r, g, b),
            cmax = Math.max(r, g, b),
            delta = cmax - cmin,
            h = 0,
            s = 0,
            l = 0;

        if (delta == 0) {
            h = 0;
        } else if (cmax == r) {
            h = ((g - b) / delta) % 6;
        } else if (cmax == g) {
            h = (b - r) / delta + 2;
        } else {
            h = (r - g) / delta + 4;
        }
        h = Math.round(h * 60);
        if (h < 0) h += 360;

        l = (cmax + cmin) / 2;

        s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
        s = +(s * 100).toFixed(1);
        l = +(l * 100).toFixed(1);

        return `hsla(${h}, ${s}%, ${l}%, ${a})`;
    }


}