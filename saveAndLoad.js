class SaveAndLoad
{
    constructor(saveId, fileId, loadId) {
        this.saveButton = document.getElementById(saveId);
        this.file = document.getElementById(fileId);
        this.loadButton = document.getElementById(loadId);
    }

    initialize(app) {
        this.app = app;
        let self = this;

        this.saveButton.onclick = function () {
            self.#save();
        }

        this.loadButton.onclick = function () {
            self.#load();
        }

        this.file.onchange = function () {
            let files = event.target.files;

            if (files.length !== 1) {
                return;
            }

            const reader = new FileReader();

            reader.addEventListener("load", function () {
                self.loadedData = JSON.parse(window.atob(reader.result.split(',')[1]));
            })

            reader.readAsDataURL(files[0]);
        }
    }

    createData() {
        let data = {
            sizeX: this.app.sizeX,
            sizeY: this.app.sizeY,
            handlers: [],
            voxels: [],
            backgroundImage: {
                image: app.backgroundImage.imageBase64,
                attrs: {
                    x: app.backgroundImage.image?.getAttr("x"),
                    y: app.backgroundImage.image?.getAttr("y"),
                    width: app.backgroundImage.image?.getAttr("width"),
                    height: app.backgroundImage.image?.getAttr("height"),
                    rotation: app.backgroundImage.image?.getAttr("rotation"),
                    scaleX: app.backgroundImage.image?.getAttr("scaleX"),
                    scaleY: app.backgroundImage.image?.getAttr("scaleY"),
                }
            }
        };

        for (let x = 0; x < app.sizeX + 1; x++) {
            for (let y = 0; y < app.sizeY + 1; y++) {
                if (!data.handlers[x]) {
                    data.handlers[x] = [];
                }

                data.handlers[x][y] = app.handlerMatrix[x][y].offset;
            }
        }

        for (let x = 0; x < app.sizeX; x++) {
            for (let y = 0; y < app.sizeY; y++) {
                if (!data.voxels[x]) {
                    data.voxels[x] = [];
                }

                data.voxels[x][y] = app.voxelMatrix[x][y].color;
            }
        }

        return data;
    }

    loadData(data) {
        this.loadedData = data;
        this.#load();
    }

    #load() {
        if (!this.loadedData) {
            return;
        }

        let data = this.loadedData;

        app.setSize(data.sizeX, data.sizeY);
        app.build();

        app.sizeController.widthTag.value = data.sizeX;
        app.sizeController.heightTag.value = data.sizeY;

        for (let x = 0; x < app.sizeX + 1; x++) {
            for (let y = 0; y < app.sizeY + 1; y++) {
                app.handlerMatrix[x][y].setOffset(data.handlers[x][y]);
            }
        }

        for (let x = 0; x < app.sizeX; x++) {
            for (let y = 0; y < app.sizeY; y++) {
                app.voxelMatrix[x][y].setColor(data.voxels[x][y])
            }
        }

        if (data.backgroundImage.image) {
            app.backgroundImage.setImage(data.backgroundImage.image, data.backgroundImage.attrs)
        }
    }

    #save() {
        let data = this.createData();

        this.#download(JSON.stringify(data), "du-voxel-plan.json", "text/plain")
    }

    #download(content, fileName, contentType) {
        let a = document.createElement("a");
        let file = new Blob([content], {type: contentType});
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(a.href)
    }
}