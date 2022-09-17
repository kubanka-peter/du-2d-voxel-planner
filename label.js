class Label {
    constructor(posOffsetXId, posOffsetYId) {
        this.posOffsetXInput = document.getElementById(posOffsetXId)
        this.posOffsetYInput = document.getElementById(posOffsetYId)

        this.posOffsetX = parseInt(this.posOffsetXInput.value);
        this.posOffsetY = parseInt(this.posOffsetYInput.value);
    }
    initialize(app){
        let self = this;
        this.app = app;
        this.x = 0;
        this.y = 0;

        let tooltip = new Konva.Label({
            x: 0,
            y: 0,
            opacity: 0.75,
        });

        tooltip.add(
            new Konva.Tag({
                fill: 'black',
                pointerDirection: 'down',
                pointerWidth: 10,
                pointerHeight: 10,
                lineJoin: 'round',
                shadowColor: 'black',
                shadowBlur: 10,
                shadowOffsetX: 10,
                shadowOffsetY: 10,
                shadowOpacity: 0.5,
                stroke: 'white'
            })
        );

        this.posOffsetXInput.onchange = function () {
            self.posOffsetX = parseInt(self.posOffsetXInput.value);
            self.posOffsetY = parseInt(self.posOffsetYInput.value);
        }

        this.posOffsetYInput.onchange = function () {
            self.posOffsetX = parseInt(self.posOffsetXInput.value);
            self.posOffsetY = parseInt(self.posOffsetYInput.value);
        }

        this.text = new Konva.Text({
            text: '',
            fontFamily: 'Calibri',
            fontSize: app.voxelSize / 3,
            padding: app.voxelSize / 8,
            fill: 'white',
        });

        tooltip.add(this.text);

        this.tooltip = tooltip;
        this.app.labelLayer.add(this.tooltip);

        let container = this.app.stage.container();
        container.tabIndex = 1;
        container.focus();

        this.#update();

        if (!container.keyDownEventAdded) {
            container.keyDownEventAdded = true;
            container.addEventListener('keydown', function (e) {
                if (e.keyCode === 37) {
                    self.x--;
                } else if (e.keyCode === 38) {
                    self.y--;
                } else if (e.keyCode === 39) {
                    self.x++;
                } else if (e.keyCode === 40) {
                    self.y++;
                } else {
                    return;
                }
                e.preventDefault();
                self.#update();
            });
        }
    }

    #update() {
        if (this.x < 0) {
            this.x = 0;
        }

        if (this.x > this.app.sizeX) {
            this.x = this.app.sizeX;
        }

        if (this.y < 0) {
            this.y = 0;
        }

        if (this.y > this.app.sizeY) {
            this.y = this.app.sizeY;
        }

        let x = this.x;
        let y = this.y;

        let offsetX = Math.round(this.app.handlerMatrix[x][y].offset[0] * 84);
        let offsetY = Math.round(this.app.handlerMatrix[x][y].offset[1] * 84);

        this.tooltip.x(this.app.handlerMatrix[x][y].getOriginalPosition()[0] + this.app.voxelSize * this.app.handlerMatrix[x][y].offset[0]);
        this.tooltip.y(this.app.handlerMatrix[x][y].getPosition()[1] + this.app.voxelSize * this.app.handlerMatrix[x][y].offset[1]);

        this.text.text("pos: " + (x + this.posOffsetX) + ", " + (y + this.posOffsetY) + " offset: " + offsetX + ", " + offsetY)
    }
}