"use strict";
class ColorPicker // everything is static because there is only one color picker
{
    static element = document.getElementById("colorSliderWindow");
    static #colorWindow = document.getElementById('colorWindow');
    static #hueSlider = document.getElementById('hueSlider');
    static #alphaSlider = document.getElementById('alphaSlider');
    static #colorInputHex = document.getElementById('colorInputHex');
    static #ctx = this.#colorWindow.getContext('2d', { willReadFrequently: true});
    static #colorPointer = document.getElementById('colorPointer');
    static #colorWindowRect = this.#colorWindow.getBoundingClientRect();
    static #colorPointerRect = this.#colorPointer.getBoundingClientRect();

    static #clampedX = 255;
    static #clampedY = 255;
    static #calledBy = null;


    static #samplePoint()
    {
        const imageData = this.#ctx.getImageData(this.#clampedX, this.#clampedY, 1, 1);

        const red = imageData.data[0];
        const green = imageData.data[1];
        const blue = imageData.data[2];
        const alpha = this.#alphaSlider.value;

        this.#colorInputHex.value = Helper.rgbaToHexa({r:red, g:green, b:blue, a:alpha});
        this.#calledBy.dataset.value = this.#colorInputHex.value;
        this.#calledBy.dataset.x = this.#clampedX;
        this.#calledBy.dataset.y = this.#clampedY;
        this.#calledBy.dataset.h = this.#hueSlider.value;
        this.#calledBy.dataset.a = this.#alphaSlider.value;
        this.#calledBy.style.backgroundColor = this.#colorInputHex.value;
        this.#calledBy.dispatchEvent(new Event("input"));
    }

    static #colorCtx()
    {
        this.#ctx.imageSmoothingEnabled = false;
        const gradient = this.#ctx.createLinearGradient(0, 0, this.#colorWindowRect.width, 0);
        gradient.addColorStop(0, '#fff');
        gradient.addColorStop(1/256, '#fff'); // not 0 cuz chrome blurs edges a bit
        gradient.addColorStop(255/256, `hsl(${this.#hueSlider.value}, 100%, 50%)`);
        gradient.addColorStop(1, `hsl(${this.#hueSlider.value}, 100%, 50%)`);
        this.#ctx.fillStyle = gradient;
        this.#ctx.fillRect(0, 0, this.#colorWindowRect.width, this.#colorWindowRect.height);

        const gradient2 = this.#ctx.createLinearGradient(0, 0, 0, this.#colorWindowRect.height);
        gradient2.addColorStop(0, '#00000000');
        gradient2.addColorStop(1/256, '#00000000');
        gradient2.addColorStop(255/256, `#000`);
        gradient2.addColorStop(1, `#000`);
        this.#ctx.fillStyle = gradient2;
        this.#ctx.fillRect(0, 0, this.#colorWindowRect.width, this.#colorWindowRect.height);
    }

    static #close(e2)
    {
        if (!ColorPicker.element.contains(e2.target)) {
            ColorPicker.element.style.display = "none";
            document.removeEventListener("mousedown", ColorPicker.#close);
        }
    }

    static #mouseMove(e)
    {
        e.preventDefault();
        const x = e.clientX - ColorPicker.#colorWindowRect.left;
        const y = e.clientY - ColorPicker.#colorWindowRect.top;

        ColorPicker.#clampedX = Math.round(Math.min(Math.max(x, 0), ColorPicker.#colorWindowRect.width - 1));
        ColorPicker.#clampedY = Math.round(Math.min(Math.max(y, 0), ColorPicker.#colorWindowRect.height - 1));

        ColorPicker.#colorPointer.style.left = ColorPicker.#clampedX + 'px';
        ColorPicker.#colorPointer.style.top = ColorPicker.#clampedY + 'px';

        ColorPicker.#samplePoint();
    }
    static #mouseUp(e)
    {
        e.preventDefault();
        document.removeEventListener("mousemove", ColorPicker.#mouseMove);
        document.removeEventListener("mouseup", ColorPicker.#mouseUp);
    }

    /**Color picker popup */
    static show(e)
    {
        this.#calledBy = e.target;
        this.element.style.display = "grid";
        const pos = e.target.getBoundingClientRect();

        let cliX = pos.left;
        let cliY = pos.top;

        if(pos.x > window.innerWidth - this.element.offsetWidth-30)
            cliX-=this.element.offsetWidth+30;

        if(e.clientY > window.innerHeight - this.element.offsetHeight-30)
            cliY-=this.element.offsetHeight+30;

        this.element.style.left = `${cliX+30}px`;
        this.element.style.top = `${cliY+30}px`;


        this.#colorWindowRect = this.#colorWindow.getBoundingClientRect();
        this.#colorPointerRect = this.#colorPointer.getBoundingClientRect();
        this.#colorPointer.style.transform = `translate(${-this.#colorPointerRect.width / 2}px, ${-this.#colorPointerRect.height / 2}px)`;


        this.#clampedX = this.#calledBy.dataset.x;
        this.#clampedY = this.#calledBy.dataset.y;
        this.#hueSlider.value = this.#calledBy.dataset.h;
        this.#alphaSlider.value = this.#calledBy.dataset.a;

        this.#colorPointer.style.left = this.#clampedX + 'px';
        this.#colorPointer.style.top = this.#clampedY + 'px';


        this.#alphaSlider.style.background = `linear-gradient(to right, #00000000, hsl(${this.#hueSlider.value}, 100%, 50%))`;
        this.#colorCtx();


        document.addEventListener("mousedown", this.#close);
    }

    static {

        this.#colorPointer.addEventListener("mousedown", (e) =>
        {
            e.preventDefault();
            document.addEventListener("mousemove", ColorPicker.#mouseMove);
            document.addEventListener("mouseup", ColorPicker.#mouseUp);
        });
        this.#colorWindow.addEventListener("mousedown", (e) =>
        {
            e.preventDefault();
            document.addEventListener("mousemove", ColorPicker.#mouseMove);
            document.addEventListener("mouseup", ColorPicker.#mouseUp);
        });

        this.#hueSlider.addEventListener("input", () =>
        {
            ColorPicker.#colorCtx();
            ColorPicker.#samplePoint();
            ColorPicker.#alphaSlider.style.background = `linear-gradient(to right, #00000000, hsl(${ColorPicker.#hueSlider.value}, 100%, 50%))`;
        });

        this.#alphaSlider.addEventListener("input", () =>
        {
            ColorPicker.#samplePoint();
        });

        this.#colorCtx();
    }
}