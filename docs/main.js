"use strict";


function load()
{
    BackgroundGrid.setPosition(Camera.position());
    BackgroundGrid.setTheme(ContextMenu.theme());
    BackgroundGrid.draw();

    Helper.setDynamicTheme(ContextMenu.theme());
}
load();



// Less garbage collection after each frame (probably)
const updateState = {
    moveSpeed: 10,
    colorSpeed: 5,
    updating: false,
    lastTimestamp: 0,
    deltaTime: 0,
    isMoveAnimationComplete: true,
    isColorTransitionAnimationComplete: true
};


/**Called from events*/
function update()
{
    if (updateState.updating) return;

    updateState.updating = true;
    updateState.lastTimestamp = performance.now();
    requestAnimationFrame(smoothUpdate);
}
/**Screen refresh rate update*/
function smoothUpdate(timestamp)
{
    updateState.deltaTime = (timestamp - updateState.lastTimestamp)/1000;
    updateState.lastTimestamp = timestamp;
    updateState.isMoveAnimationComplete = Camera.isMoveAnimationFinished();
    updateState.isColorTransitionAnimationComplete = ContextMenu.isColorTransitionAnimationFinished();

    if(!updateState.isMoveAnimationComplete)
    {
        Camera.doMoveAnimationStep(updateState.deltaTime * updateState.moveSpeed);
        BackgroundGrid.setPosition(Camera.position());

        Content.elements.forEach(element => {
            Content.repositionElement(element);
        });
    }
    if(!updateState.isColorTransitionAnimationComplete)
    {
        ContextMenu.doColorTransitionAnimationStep(updateState.deltaTime * updateState.colorSpeed);
        const newTheme = ContextMenu.theme();
        BackgroundGrid.setTheme(newTheme);
        Helper.setDynamicTheme(newTheme);

    }


    if(!updateState.isMoveAnimationComplete || !updateState.isColorTransitionAnimationComplete)
    {
        BackgroundGrid.draw();
    }

    if (updateState.isMoveAnimationComplete && updateState.isColorTransitionAnimationComplete) {
        updateState.updating = false;
        return;
    }

    requestAnimationFrame(smoothUpdate);
}