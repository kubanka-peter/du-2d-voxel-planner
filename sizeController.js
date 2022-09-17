class SizeController
{
    constructor(widthId, heightId) {
        this.widthTag = document.getElementById(widthId);
        this.heightTag = document.getElementById(heightId);
    }

    initialize(app) {
        let self = this;

        this.widthTag.onchange = function (event) {
            app.setSize(parseInt(self.widthTag.value), parseInt(self.heightTag.value))
            app.build();
        }

        this.heightTag.onchange = function (event) {
            app.setSize(parseInt(self.widthTag.value), parseInt(self.heightTag.value))
            app.build();
        }

        app.setSize(parseInt(this.widthTag.value), parseInt(this.heightTag.value))
        app.build();
    }
}