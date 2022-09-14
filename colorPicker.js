class ColorPicker
{
    constructor(pickerId) {
        this.pickerId = pickerId;
    }

    initialize(app) {
        this.app = app;
        let self = this;

        this.color = this.#hexToRgbA(document.getElementById(this.pickerId).value, 1);

        document.getElementById(this.pickerId).onchange = function (event) {
            self.color = self.#hexToRgbA(event.target.value, 1);
        }

        for (let x = 0; x < app.sizeX; x++) {
            for (let y = 0; y < app.sizeY; y++) {
                let voxel = app.voxelMatrix[x][y];

                voxel.item.on("click", function (e) {
                    // left - set
                    if (e.evt.button === 0) {
                        self.#setColor(voxel)
                    }

                    // right - clear
                    if (e.evt.button === 2) {
                        self.#clearColor(voxel)
                    }

                    // middle - pick
                    if (e.evt.button === 1) {
                        self.#getColor(voxel)
                    }
                })
            }
        }
    }

    #getColor(voxel) {
        this.color = voxel.item.getAttr("fill");
        document.getElementById(this.pickerId).value = this.#RGBAToHex(this.color);
    }

    #clearColor(voxel) {
        voxel.item.fill("rgba(255, 255, 255, 0)")
    }

    #setColor(voxel) {
        voxel.item.fill(this.color);
    }

    #hexToRgbA(hex, alpha) {
        let color;

        color= hex.substring(1).split('');
        if(color.length === 3){
            color= [color[0], color[0], color[1], color[1], color[2], color[2]];
        }
        color= '0x'+color.join('');

        return 'rgba('+[(color>>16)&255, (color>>8)&255, color&255].join(',')+','+alpha+')';
    }

    #RGBAToHex(rgba) {
        let sep = rgba.indexOf(",") > -1 ? "," : " ";
        rgba = rgba.substr(5).split(")")[0].split(sep);

        // Strip the slash if using space-separated syntax
        if (rgba.indexOf("/") > -1)
            rgba.splice(3,1);

        for (let R in rgba) {
            let r = rgba[R];
            if (r.indexOf("%") > -1) {
                let p = r.substr(0,r.length - 1) / 100;

                if (R < 3) {
                    rgba[R] = Math.round(p * 255);
                } else {
                    rgba[R] = p;
                }
            }
        }

        let r = (+rgba[0]).toString(16),
            g = (+rgba[1]).toString(16),
            b = (+rgba[2]).toString(16),
            a = Math.round(+rgba[3] * 255).toString(16);

        if (r.length === 1)
            r = "0" + r;
        if (g.length === 1)
            g = "0" + g;
        if (b.length === 1)
            b = "0" + b;
        if (a.length === 1)
            a = "0" + a;

        return "#" + r + g + b;
    }
}