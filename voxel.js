const TOP_LEFT = 'TOP_LEFT';
const TOP_RIGHT = 'TOP_RIGHT';
const BOTTOM_RIGHT = 'BOTTOM_RIGHT';
const BOTTOM_LEFT = 'BOTTOM_LEFT';

class Voxel
{
    /**
     * @param app App
     * @param x
     * @param y
     * @param color
     */
    constructor(app, x, y, color) {
        this.app = app;
        this.x = x;
        this.y = y;
        this.color = color;
        this.offset = {
            TOP_LEFT: [0, 0],
            TOP_RIGHT: [0, 0],
            BOTTOM_RIGHT: [0, 0],
            BOTTOM_LEFT: [0, 0]
        };

        this.item = this.#createPolyline();
    }

    update() {
        this.item.points(this.#getPoints());
    }

    #createPolyline() {
        let line = new Konva.Line({
            points: this.#getPoints(),
            fill: this.color,
            stroke: 'black',
            strokeWidth: app.voxelSize / 50,
            closed: true,
        });

        return line;
    }

    #getPoints() {
        let topLeft = this.#getTopLeft();
        let topRight = this.#getTopRight();
        let bottomRight = this.#getBottomRight();
        let bottomLeft = this.#getBottomLeft();

        return [topLeft.x, topLeft.y, topRight.x, topRight.y, bottomRight.x, bottomRight.y, bottomLeft.x, bottomLeft.y];
    }

    #getTopLeft() {
        return {
            x: app.voxelSize * this.x + (this.offset[TOP_LEFT][0] * app.voxelSize),
            y: app.voxelSize * this.y + (this.offset[TOP_LEFT][1] * app.voxelSize)
        };
    }

    #getTopRight() {
        return {
            x: app.voxelSize * (this.x + 1) + (this.offset[TOP_RIGHT][0] * app.voxelSize),
            y: app.voxelSize * this.y + (this.offset[TOP_RIGHT][1] * app.voxelSize)
        }
    }

    #getBottomRight() {
        return {
            x: app.voxelSize * (this.x + 1) + (this.offset[BOTTOM_RIGHT][0] * app.voxelSize),
            y: app.voxelSize * (this.y + 1) + (this.offset[BOTTOM_RIGHT][1] * app.voxelSize)
        }
    }

    #getBottomLeft() {
        return {
            x: app.voxelSize * this.x + (this.offset[BOTTOM_LEFT][0] * app.voxelSize),
            y: app.voxelSize * (this.y + 1) + (this.offset[BOTTOM_LEFT][1] * app.voxelSize)
        }
    }
}