class Animator {

    static isUpdating = false;
    static lastTimestamp = 0;
    static deltaTime = 0;
    static moveSpeed = 20;
    static FPSCounter = 0;
    static {
        setInterval(() => {
            console.log("FPS:", Animator.FPSCounter);
            Animator.FPSCounter = 0;
        }, 1000);
    }
    static update() {
        if (this.isUpdating) return;

        this.isUpdating = true;
        this.lastTimestamp = performance.now();
        requestAnimationFrame(this.#smoothUpdate);
    }
    static #smoothUpdate(timestamp) {
        Animator.deltaTime = (timestamp - Animator.lastTimestamp) / 1000;
        Animator.lastTimestamp = timestamp;

        Camera.doMoveAnimationStep(Animator.deltaTime * Animator.moveSpeed);
        Loader.gridPosition(Camera.x, Camera.y);
        if (Camera.isMoveAnimationFinished()) {
            Animator.isUpdating = false;
            return;
        }

        Animator.FPSCounter++;


        requestAnimationFrame(Animator.#smoothUpdate);
    }
}