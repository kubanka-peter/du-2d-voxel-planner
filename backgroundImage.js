class BackgroundImage
{
    constructor(fileInputId, lockId, hideId) {
        this.fileInputId = fileInputId;
        this.lockId = lockId;
        this.lockImage = document.getElementById(this.lockId).checked;
        this.hideId = hideId;
    }

    /**
     * @param app App
     */
    initialize(app) {
        let self = this;
        this.app = app;

        document.getElementById(this.hideId).onchange = function (event) {
            if (event.target.checked) {
                self.app.imageLayer.hide();
            } else {
                self.app.imageLayer.show();
            }
        }

        document.getElementById(this.lockId).onchange = function (event) {
            self.lockImage = event.target.checked;
            self.#updateImageState();
        }

        document.getElementById(this.fileInputId).onchange = function (event) {
            let files = event.target.files;

            if (files.length !== 1) {
                return;
            }

            const reader = new FileReader();

            reader.addEventListener("load", function () {
                let imageTag = new Image();

                imageTag.onload = function() {
                    self.#updateBackgroundImage(imageTag);
                };

                imageTag.src = reader.result;
            })

            reader.readAsDataURL(files[0]);
        }
    }

    #updateBackgroundImage(imageTag) {
        let imageWidth = this.app.sizeX * app.voxelSize / 2;

        let imageHeight = imageTag.height / imageTag.width * imageWidth;
        let image = new Konva.Image({
            x: 0,
            y: 0,
            image: imageTag,
            width: imageWidth,
            height: imageHeight,
            draggable: true,
            id: "background"
        });

        this.app.imageLayer.find("#background").forEach(function (item) {
            item.destroy();
        });

        this.app.imageLayer.add(image);

        this.#updateImageState();
    }

    #updateImageState()
    {
        this.app.imageLayer.zIndex(this.lockImage ? 0 : 2);

        this.app.imageLayer.find("#transformer").forEach(function (item) {
            item.destroy();
        });

        if (!this.lockImage) {
            let transformer = new Konva.Transformer({id: "transformer"});
            this.app.imageLayer.add(transformer);

            this.app.imageLayer.find("#background").forEach(function (item) {
                transformer.nodes([item]);
            });
        }
    }
}