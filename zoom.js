class Zoom
{
    constructor() {
    }

    /**
     * @param app App
     */
    initialize(app) {
        let scaleBy = 1.03;

        app.stage.on('wheel', (e) => {
            // stop default scrolling
            e.evt.preventDefault();

            let oldScale = app.stage.scaleX();
            let pointer = app.stage.getPointerPosition();

            let mousePointTo = {
                x: (pointer.x - app.stage.x()) / oldScale,
                y: (pointer.y - app.stage.y()) / oldScale,
            };

            // how to scale? Zoom in? Or zoom out?
            let direction = e.evt.deltaY > 0 ? -1 : 1;

            // when we zoom on trackpad, e.evt.ctrlKey is true
            // in that case lets revert direction
            if (e.evt.ctrlKey) {
                direction = -direction;
            }

            let newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

            app.stage.scale({ x: newScale, y: newScale });

            let newPos = {
                x: pointer.x - mousePointTo.x * newScale,
                y: pointer.y - mousePointTo.y * newScale,
            };
            app.stage.position(newPos);
        });
    }


}