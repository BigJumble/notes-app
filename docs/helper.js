class Helper
{
    /**
     * @param {object} param0 {r, g, b, a}
     * @returns 
     */
    static rgbaToHexa({ r, g, b, a })
    {
        r = Math.round(r).toString(16);
        g = Math.round(g).toString(16);
        b = Math.round(b).toString(16);
        a = Math.round(a * 255).toString(16);

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

    /**
     * @param {string} hex hex with alpha
     * @returns {object} RGB (0-255), A (0-1)
     */
    static hexaToRgba(hex)
    {
        hex = hex.replace(/^#/, '');

        let bigint = parseInt(hex, 16);
        if (hex.length === 8) {
            let r = (bigint >> 24) & 255;
            let g = (bigint >> 16) & 255;
            let b = (bigint >> 8) & 255;
            let a = (bigint & 255) / 255;
            return { r, g, b, a };
        }
        else {
            let r = (bigint >> 16) & 255;
            let g = (bigint >> 8) & 255;
            let b = bigint & 255;
            let a = 1;
            return { r, g, b, a };
        }
    }

    /**
     * 
     * @param {number} start starting number
     * @param {number} end target number
     * @param {number} t timestep
     * @returns 
     */
    static lerp(start, end, t)
    {
        return start * (1 - t) + end * t;
    }

    /**
     * @param {object} currentColor RGBA color
     * @param {object} targetColor RGBA color
     * @param {number} t timestep
     * @returns 
     */
    static lerpColor(currentColor, targetColor, t)
    {
        const lerped = {
            r: this.lerp(currentColor.r, targetColor.r, t),
            g: this.lerp(currentColor.g, targetColor.g, t),
            b: this.lerp(currentColor.b, targetColor.b, t),
            a: this.lerp(currentColor.a, targetColor.a, t),
        };

        return lerped;
    }

    /**
     * 
     * @param {number} num 
     * @param {number} snapSize
     * @returns {number} snapped number
     */
    static snap(num, snapSize)
    {
        return Math.floor(num/snapSize)*snapSize;
    }

    /**@type {StyleSheet}*/
    static styleSheet = document.getElementById("stylesheet").sheet;

    /**
     * 
     * @param {Theme} newTheme 
     */
    static setDynamicTheme(newTheme)
    {
        this.styleSheet.cssRules[0].style.color = newTheme.TC;
        this.styleSheet.cssRules[1].style.color = newTheme.FC;
        this.styleSheet.cssRules[2].style.color = newTheme.BC;
        this.styleSheet.cssRules[3].style.borderColor = newTheme.FC;
        this.styleSheet.cssRules[4].style.backgroundColor = newTheme.BC;
        this.styleSheet.cssRules[5].style.boxShadow = `0 0 20px 0px ${newTheme.FC}`;
        this.styleSheet.cssRules[6].style.boxShadow = `0 0 20px 0px ${newTheme.BackC}`;
    }
}