
class Handler
{
    /**
     * @param app App
     * @param x
     * @param y
     */
    constructor(app, x, y) {
        this.app = app;
        this.x = x;
        this.y = y;
        this.offset = [0, 0];


        this.item = this.#createCircle();

        this.topLeftVoxel = null;
        this.topRightVoxel = null;
        this.bottomRightVoxel = null;
        this.bottomLeftVoxel = null;

        let center = this.#getOriginalPosition();
        let maxOffsetDiff = 1.5 * app.voxelSize;
        this.minDragX = center[0] - maxOffsetDiff;
        this.maxDragX = center[0] + maxOffsetDiff;
        this.minDragY = center[1] - maxOffsetDiff;
        this.maxDragY = center[1] + maxOffsetDiff;
    }

    #getPosition() {
        return [
            app.voxelSize * this.x + this.offset[0],
            app.voxelSize * this.y + this.offset[1]
        ];
    }

    #getOriginalPosition() {
        return [
            app.voxelSize * this.x,
            app.voxelSize * this.y
        ];
    }

    #onDragEnd() {
        let currentPosition = this.item.getPosition();
        let originalPosition = this.#getOriginalPosition();

        let offsetX = currentPosition.x- originalPosition[0];
        let offsetY = currentPosition.y - originalPosition[1];

        this.offset[0] = offsetX / app.voxelSize;
        this.offset[1] = offsetY / app.voxelSize;

        if (this.topLeftVoxel) {
            this.topLeftVoxel.offset['BOTTOM_RIGHT'] = this.offset;
            this.topLeftVoxel.update();
        }

        if (this.topRightVoxel) {
            this.topRightVoxel.offset['BOTTOM_LEFT'] = this.offset;
            this.topRightVoxel.update();
        }

        if (this.bottomRightVoxel) {
            this.bottomRightVoxel.offset['TOP_LEFT'] = this.offset;
            this.bottomRightVoxel.update();
        }

        if (this.bottomLeftVoxel) {
            this.bottomLeftVoxel.offset['TOP_RIGHT'] = this.offset;
            this.bottomLeftVoxel.update();
        }
    }

    #dragBound () {
        let x = this.item.getPosition().x;
        let y = this.item.getPosition().y;

        if (x < this.minDragX) {
            this.item.x(this.minDragX);
        }

        if (x > this.maxDragX) {
            this.item.x(this.maxDragX);
        }

        if (y < this.minDragY) {
            this.item.y(this.minDragY);
        }

        if (y > this.maxDragY) {
            this.item.y(this.maxDragY);
        }
    }

    #createCircle() {
        let position = this.#getPosition();
        let self = this;

        let circle = new Konva.Circle({
            x: position[0],
            y: position[1],
            radius: app.voxelSize / 10,
            fill: 'rgba(255,255,255,0.0)',
            stroke: 'black',
            strokeWidth: app.voxelSize / 50,
            draggable: true
        });

        circle.on("dragend", function () {
            self.#onDragEnd();
        })

        circle.on("dragmove", function () {
            self.#dragBound();
            self.#onDragEnd();
        })

        return circle;
    }
}