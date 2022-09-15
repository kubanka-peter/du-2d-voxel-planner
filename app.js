class App
{
    // https://konvajs.org/docs/index.html

    constructor(backgroundImage, colorPicker, saveAndLoad, sizeController, zoom, label, containerId) {
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
    }

    setSize(sizeX, sizeY, virtualVoxelSize) {
        this.prevSizeX = this.sizeX;
        this.prevSizeY = this.sizeY;
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.virtualVoxelSize = virtualVoxelSize ?? 84;
    }

    build() {
        if (this.built) {
            this.#clear();
        }

        this.#create();
        this.built = true;
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

        this.stage.add(this.imageLayer);
        this.stage.add(this.voxelLayer);
        this.stage.add(this.handlerLayer);
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