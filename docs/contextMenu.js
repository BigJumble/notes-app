class ContextMenu
{
    static menuElement = document.getElementById("contextMenu");

    static globalContextMenu = document.getElementById("globalContextMenu");
    static noteContextMenu = document.getElementById("noteContextMenu");

    static colorPickerDotC = document.getElementById("colorPickerDotC");
    static colorPickerBackC = document.getElementById("colorPickerBackC");
    static colorPickerFC = document.getElementById("colorPickerFC");
    static colorPickerBC = document.getElementById("colorPickerBC");
    static colorPickerTC = document.getElementById("colorPickerTC");

    static colorPickerFCn = document.getElementById("colorPickerFCn");
    static colorPickerBCn = document.getElementById("colorPickerBCn");
    static colorPickerTCn = document.getElementById("colorPickerTCn");
    static noteTarget;

    static DotC = Helper.hexaToRgba(this.colorPickerDotC.dataset.value);
    static BackC = Helper.hexaToRgba(this.colorPickerBackC.dataset.value);
    static FC = Helper.hexaToRgba(this.colorPickerFC.dataset.value);
    static BC = Helper.hexaToRgba(this.colorPickerBC.dataset.value);
    static TC = Helper.hexaToRgba(this.colorPickerTC.dataset.value);

    static targetDotC = Helper.hexaToRgba(this.colorPickerDotC.dataset.value);
    static targetBackC = Helper.hexaToRgba(this.colorPickerBackC.dataset.value);
    static targetFC = Helper.hexaToRgba(this.colorPickerFC.dataset.value);
    static targetBC = Helper.hexaToRgba(this.colorPickerBC.dataset.value);
    static targetTC = Helper.hexaToRgba(this.colorPickerTC.dataset.value);


    static cliX=0;
    static cliY=0;


    /**
     * @typedef {Object} Theme
     * @property {string} FC - Notes Foreground color hex with alpha
     * @property {string} BC - Notes Background color hex with alpha
     * @property {string} TC - Notes Text color hex with alpha.
     * @property {string} DotC - Background Dots color hex with alpha.
     * @property {string} BackC - Background color hex with alpha.
     * @returns {Theme} 
     */
    static theme()
    {
        return {
            FC: Helper.rgbaToHexa(this.FC),
            BC: Helper.rgbaToHexa(this.BC),
            TC: Helper.rgbaToHexa(this.TC),
            DotC: Helper.rgbaToHexa(this.DotC),
            BackC: Helper.rgbaToHexa(this.BackC)
        };
    }

    /**
     * @param {number} timestep deltaTime * speed
     */
    static doColorTransitionAnimationStep(timestep)
    {
        if (Helper.rgbaToHexa(this.DotC) !== Helper.rgbaToHexa(this.targetDotC)) {
            this.DotC = Helper.lerpColor(this.DotC, this.targetDotC, timestep);
        }
        if (Helper.rgbaToHexa(this.BackC) !== Helper.rgbaToHexa(this.targetBackC)) {
            this.BackC = Helper.lerpColor(this.BackC, this.targetBackC, timestep);
        }
        if (Helper.rgbaToHexa(this.TC) !== Helper.rgbaToHexa(this.targetTC)) {
            this.TC = Helper.lerpColor(this.TC, this.targetTC, timestep);
        }
        if (Helper.rgbaToHexa(this.FC) !== Helper.rgbaToHexa(this.targetFC)) {
            this.FC = Helper.lerpColor(this.FC, this.targetFC, timestep);
        }
        if (Helper.rgbaToHexa(this.BC) !== Helper.rgbaToHexa(this.targetBC)) {
            this.BC = Helper.lerpColor(this.BC, this.targetBC, timestep);
        }
    }

    /**@returns {boolean} true if theme finished transitioning*/
    static isColorTransitionAnimationFinished()
    {
        return (
            Helper.rgbaToHexa(this.DotC) === Helper.rgbaToHexa(this.targetDotC) &&
            Helper.rgbaToHexa(this.BackC) === Helper.rgbaToHexa(this.targetBackC) &&
            Helper.rgbaToHexa(this.TC) === Helper.rgbaToHexa(this.targetTC) &&
            Helper.rgbaToHexa(this.FC) === Helper.rgbaToHexa(this.targetFC) &&
            Helper.rgbaToHexa(this.BC) === Helper.rgbaToHexa(this.targetBC));
    }

    static #close(e)
    {
        if (!ContextMenu.menuElement.contains(e.target) && !ColorPicker.element.contains(e.target)) {
            ContextMenu.menuElement.style.display = "none";
            document.removeEventListener("mousedown", ContextMenu.#close);
        }
    }

    static hide()
    {
        ContextMenu.menuElement.style.display = "none";
        document.removeEventListener("mousedown", ContextMenu.#close);
    }

    /** @param {MouseEvent} e  Color picker popup */
    static show(e)
    {
        e.preventDefault();

        if (e.button === 2) {
            if (ContextMenu.menuElement.contains(e.target)) return;

            if(e.target === BackgroundGrid.canvas)
            {
                ContextMenu.globalContextMenu.style.display = "flex";
                ContextMenu.noteContextMenu.style.display = "none";
            }
            else
            {
                ContextMenu.noteTarget = e.target.id ? e.target : e.target.parentElement;
                ContextMenu.globalContextMenu.style.display = "none";
                ContextMenu.noteContextMenu.style.display = "flex";
            }

            ContextMenu.menuElement.style.display = "flex";

            ContextMenu.cliX = e.clientX;
            ContextMenu.cliY = e.clientY;

            if(e.clientX > window.innerWidth - ContextMenu.menuElement.offsetWidth)
            ContextMenu.cliX-=ContextMenu.menuElement.offsetWidth;

            if(e.clientY > window.innerHeight - ContextMenu.menuElement.offsetHeight)
            ContextMenu.cliY-=ContextMenu.menuElement.offsetHeight;

            ContextMenu.menuElement.style.left = `${ContextMenu.cliX}px`;
            ContextMenu.menuElement.style.top = `${ContextMenu.cliY}px`;

            ContextMenu.cliX = e.clientX;
            ContextMenu.cliY = e.clientY;
        }

        document.addEventListener("mousedown", ContextMenu.#close);
    }

    static #getNoteTheme()
    {
        return {fc: this.colorPickerFCn.dataset.value,bc: this.colorPickerBCn.dataset.value,tc: this.colorPickerTCn.dataset.value};
    }

    static {
        this.colorPickerDotC.addEventListener("input", () =>
        {
            this.targetDotC = Helper.hexaToRgba(this.colorPickerDotC.dataset.value);
            update();
        });
        this.colorPickerBackC.addEventListener("input", () =>
        {
            this.targetBackC = Helper.hexaToRgba(this.colorPickerBackC.dataset.value);
            update();
        });
        this.colorPickerFC.addEventListener("input", () =>
        {
            this.targetFC = Helper.hexaToRgba(this.colorPickerFC.dataset.value);
            update();
        });
        this.colorPickerBC.addEventListener("input", () =>
        {
            this.targetBC = Helper.hexaToRgba(this.colorPickerBC.dataset.value);
            update();
        });
        this.colorPickerTC.addEventListener("input", () =>
        {
            this.targetTC = Helper.hexaToRgba(this.colorPickerTC.dataset.value);
            update();
        });

        this.colorPickerFCn.addEventListener("input", () =>
        {
            Content.setNoteTheme(ContextMenu.noteTarget, ContextMenu.#getNoteTheme());
            Content.themeElement(ContextMenu.noteTarget);
        });
        this.colorPickerBCn.addEventListener("input", () =>
        {
            Content.setNoteTheme(ContextMenu.noteTarget, ContextMenu.#getNoteTheme());
            Content.themeElement(ContextMenu.noteTarget);
        });
        this.colorPickerTCn.addEventListener("input", () =>
        {
            Content.setNoteTheme(ContextMenu.noteTarget, ContextMenu.#getNoteTheme());
            Content.themeElement(ContextMenu.noteTarget);
        });

        document.addEventListener("contextmenu", this.show)
    }
}