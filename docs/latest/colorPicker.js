class ColorPicker {

    static hueSelector;
    static alphaSelector;
    static mainSelector;

    static colorEditor;

    static colorPickerText;
    static text;

    static startX = 0;
    static startY = 0;
    static hueDrag = false;
    static alphaDrag = false;
    static mainDrag = false;
    static huePosition = 18;
    static alphaPosition = 198;

    static mainPositionX = 208;
    static mainPositionY = 8;



    static selectedObject;
    static selectedAttribute;
    static colorChangeEvent = new CustomEvent("colorChange", { detail: { color: () => ColorPicker.colorPickerText.value } });

    static styleSheet = document.getElementById("dynamicCSS").sheet;

    static {
        this.colorEditor = document.getElementById("colorEditor");
        this.hueSelector = document.getElementById("huePicker");
        this.alphaSelector = document.getElementById("alphaPicker");
        this.mainSelector = document.getElementById("mainPicker");
        this.colorPickerText = document.getElementById("colorPickerText");

        this.hueSelector.addEventListener("mousedown", (e) => { this.hueDrag = true; this.startX = e.clientX - this.huePosition; });
        this.alphaSelector.addEventListener("mousedown", (e) => { this.alphaDrag = true; this.startX = e.clientX - this.alphaPosition; });
        this.mainSelector.addEventListener("mousedown", (e) => { this.mainDrag = true; this.startX = e.clientX - this.mainPositionX; this.startY = e.clientY - this.mainPositionY; });

        document.addEventListener("mouseup", (e) => { this.hueDrag = false; this.alphaDrag = false; this.mainDrag = false; });
        document.addEventListener("mousemove", (e) => { this.mouseMove(e); });

        this.colorPickerText.addEventListener("input", (e) => this.nameToHSLA(e.target.value));
        this.setColor();
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

        if (this.mainDrag || this.alphaDrag || this.hueDrag) {

            this.setColor();
        }
    }

    static setColor() {
        const hue = (this.huePosition - 18) * 2 % 360;
        const saturation = (this.mainPositionX - 8) / 2;
        const lightness = Math.round(Helper.lerp(100 - (this.mainPositionY - 8) / 1.5, 50 - (this.mainPositionY - 8) / 3, saturation / 100) * 100) / 100;
        const alpha = Math.round((this.alphaPosition - 18) / 1.80) / 100;

        this.styleSheet.cssRules[5].style.stopColor = `hsl(${hue}, 100%, 50%)`;
        this.styleSheet.cssRules[5].style.fill = `hsl(${hue}, 100%, 50%)`;
        this.styleSheet.cssRules[6].style.fill = `hsla(${hue}, 100%, 50%, ${alpha})`;
        this.styleSheet.cssRules[7].style.fill = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        this.styleSheet.cssRules[7].style.stroke = `hsl(${(hue + 120) % 360}, 100%, 50%)`;



        // const finalColor = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
        const hexa = this.HSLAToHexa(hue, saturation, lightness, alpha);
        this.colorPickerText.value = hexa;
        this.selectedObject?.setAttribute(this.selectedAttribute, hexa);
        this.selectedObject?.dispatchEvent(this.colorChangeEvent);
    }

    /**https://css-tricks.com/converting-color-spaces-in-javascript/*/
    static nameToHSLA(name) {
        let fakeDiv = document.createElement("div");
        fakeDiv.style.color = name;
        document.body.appendChild(fakeDiv);

        let cs = window.getComputedStyle(fakeDiv),
            pv = cs.getPropertyValue("color");

        document.body.removeChild(fakeDiv);

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


        this.HSLAtoPositions(h, s, l, a);
        this.setColor();
        return { h, s, l, a };
    }

    static HSLAtoPositions(h, s, l, a) {
        this.huePosition = h / 2 + 18;
        this.hueSelector.setAttribute("cx", this.huePosition);

        this.alphaPosition = a * 180 + 18;
        this.alphaSelector.setAttribute("cx", this.alphaPosition);

        this.mainPositionX = s * 2 + 8;
        this.mainPositionY = (300 * (l - 100 + 0.5 * s)) / (s - 200) + 8;

        this.mainSelector.setAttribute("cx", this.mainPositionX);
        this.mainSelector.setAttribute("cy", this.mainPositionY);
    }

    static HSLAToHexa(h, s, l, a) {
        s /= 100;
        l /= 100;

        let c = (1 - Math.abs(2 * l - 1)) * s,
            x = c * (1 - Math.abs((h / 60) % 2 - 1)),
            m = l - c / 2,
            r = 0,
            g = 0,
            b = 0;

        if (0 <= h && h < 60) {
            r = c; g = x; b = 0;
        } else if (60 <= h && h < 120) {
            r = x; g = c; b = 0;
        } else if (120 <= h && h < 180) {
            r = 0; g = c; b = x;
        } else if (180 <= h && h < 240) {
            r = 0; g = x; b = c;
        } else if (240 <= h && h < 300) {
            r = x; g = 0; b = c;
        } else if (300 <= h && h < 360) {
            r = c; g = 0; b = x;
        }
        // Having obtained RGB, convert channels to hex
        r = Math.round((r + m) * 255).toString(16);
        g = Math.round((g + m) * 255).toString(16);
        b = Math.round((b + m) * 255).toString(16);
        a = Math.round(a * 255).toString(16);

        // Prepend 0s, if necessary
        if (r.length == 1)
            r = "0" + r;
        if (g.length == 1)
            g = "0" + g;
        if (b.length == 1)
            b = "0" + b;
        if (a.length == 1)
            a = "0" + a;

        return "#" + r + g + b + a;
    }

    static open(caller, attribute) {
        this.selectedObject = caller;
        this.selectedAttribute = attribute;
        this.colorEditor.style.display = "block";
        const { h, s, l, a } = this.nameToHSLA(this.selectedObject.getAttribute(attribute));
        this.colorPickerText.value = this.HSLAToHexa(h, s, l, a);
    }
}