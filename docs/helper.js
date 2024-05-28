class Helper {
    /**
     * 
     * @param {number} start starting number
     * @param {number} end target number
     * @param {number} t timestep
     * @returns 
     */
    static lerp(start, end, t) {
        return start * (1 - t) + end * t;
    }

    static createCircle(cx, cy, r, fill) {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

        circle.setAttribute('cx', cx);
        circle.setAttribute('cy', cy);
        circle.setAttribute('r', r);
        circle.setAttribute('fill', fill);

        return circle;
    }
    static snap(value, size)
    {
        return Math.floor(value/size) * size;
    }
}