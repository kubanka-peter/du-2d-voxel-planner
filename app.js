class App
{
    // https://konvajs.org/docs/index.html

    constructor(backgroundImage, colorPicker, saveAndLoad, sizeController, zoom, label, containerId, buildViewId, blockViewId) {
        this.backgroundImage = backgroundImage;
        this.colorPicker = colorPicker;
        this.saveAndLoad = saveAndLoad;
        this.zoom = zoom;
        this.sizeController = sizeController;
        this.containerId = containerId;
        this.voxelMatrix = [];
        this.handlerMatrix = [];
        this.built = false;
        this.label = label;
        this.buildViewCheckbox = document.getElementById(buildViewId);
        this.blockViewCheckbox = document.getElementById(blockViewId);
    }

    setSize(sizeX, sizeY, virtualVoxelSize) {
        this.prevSizeX = this.sizeX;
        this.prevSizeY = this.sizeY;
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.virtualVoxelSize = virtualVoxelSize ?? 84;
    }

    build() {
        let self = this;

        if (this.built) {
            this.#clear();
        }

        this.#create();
        this.built = true;

        this.buildView = this.buildViewCheckbox.checked;
        this.buildViewCheckbox.onchange = function() {
            let reBuild = self.buildView !== self.buildViewCheckbox.checked;
            self.buildView = self.buildViewCheckbox.checked;

            if (!self.buildView) {
                self.blockViewCheckbox.disabled = true;
            }

            if (!self.buildView && self.blockView) {
                self.blockView = false;
                self.blockViewCheckbox.checked = false;
                self.saveAndLoad.loadData(self.saveAndLoad.loadedData);
            }

            if (self.buildView) {
                self.blockViewCheckbox.disabled = false;
            }

            if (reBuild) {
                let data = self.saveAndLoad.createData();
                self.build();
                self.saveAndLoad.loadData(data);
            }
        }

        this.blockViewCheckbox.onchange = function () {
            self.blockView = self.blockViewCheckbox.checked;

            if (self.blockView) {
                self.saveAndLoad.loadedData = self.saveAndLoad.createData();

                for (let x = 0; x < self.sizeX + 1; x++) {
                    for (let y = 0; y < self.sizeY + 1; y++) {
                        self.handlerMatrix[x][y].setOffset([0, 0]);
                    }
                }
            } else if (self.saveAndLoad.loadedData) {
                self.saveAndLoad.loadData(self.saveAndLoad.loadedData);
            }
        }
    }

    #clear() {
        this.stage.destroy();
    }

    #create() {
        const container = document.getElementById(this.containerId);
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;
        const width = this.sizeX * this.virtualVoxelSize;
        const height = this.sizeY * this.virtualVoxelSize;

        const voxelWidth = width / (this.sizeX + 2);
        const voxelHeight = height / (this.sizeY + 2);

        if (voxelWidth > voxelHeight) {
            this.voxelSize = voxelHeight;
        } else {
            this.voxelSize = voxelWidth;
        }

        this.stage = new Konva.Stage({
            container: this.containerId,
            width: containerWidth,
            height: containerHeight,
            offsetX: -this.voxelSize,
            offsetY: -this.voxelSize,
            scaleX: containerWidth / width,
            scaleY: containerHeight / height,
            draggable: true
        });

        this.stage.on('contextmenu', (e) => {
            e.evt.preventDefault();
        });

        this.voxelLayer = new Konva.Layer();
        this.handlerLayer = new Konva.Layer();
        this.imageLayer = new Konva.Layer();
        this.labelLayer = new Konva.Layer();

        this.#initialize();
        this.backgroundImage.initialize(this);
        this.colorPicker.initialize(this);
        this.zoom.initialize(this);
        this.saveAndLoad.initialize(this);
        this.label.initialize(this);

        if (!this.buildView) {
            this.stage.add(this.imageLayer);
        }

        this.stage.add(this.voxelLayer);

        if (!this.buildView) {
            this.stage.add(this.handlerLayer);
        }

        this.stage.add(this.labelLayer);
    }

    #initialize() {
        for (let x = 0; x < this.sizeX; x++) {
            for (let y = 0; y < this.sizeY; y++) {
                let voxel = new Voxel(this, x, y, "rgba(255,255,255,0.0)")
                this.voxelLayer.add(voxel.item)

                if (this.voxelMatrix[x] === undefined) {
                    this.voxelMatrix[x] = [];
                }
                this.voxelMatrix[x][y] = voxel;
            }
        }

        for (let x = 0; x < this.sizeX + 1; x++) {
            for (let y = 0; y < this.sizeY + 1; y++) {
                let handler = new Handler(this, x, y);
                handler.topLeftVoxel = this.voxelMatrix[x - 1]?.[y - 1];
                handler.topRightVoxel = this.voxelMatrix[x]?.[y - 1];
                handler.bottomRightVoxel = this.voxelMatrix[x]?.[y];
                handler.bottomLeftVoxel = this.voxelMatrix[x - 1]?.[y];

                this.handlerLayer.add(handler.item);

                if (this.handlerMatrix[x] === undefined) {
                    this.handlerMatrix[x] = [];
                }
                this.handlerMatrix[x][y] = handler;
            }
        }
    }
}