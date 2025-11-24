
export class PreloaderBar extends Phaser.GameObjects.Container {
    private _useSimple = false;
    private _borderColor: number;
    private _lineColor: number;
    private _lineMask: Phaser.GameObjects.Graphics;
    private _barWidth = 0;
    private _barHeight = 0;

    constructor(scene, x, y, aUseSimpleGraphics: boolean, aBorderColor = 0x00bc77, aLineColor = 0x00ffa2) {
        super(scene, x, y);

        this._useSimple = aUseSimpleGraphics;
        this._borderColor = aBorderColor;
        this._lineColor = aLineColor;

        if (this._useSimple) {

            const w = 600;
            const h = 50;
            const border = 4;

            let bg = new Phaser.GameObjects.Graphics(this.scene, {
                x: 0,
                y: 0,
                lineStyle: {
                    color: this._borderColor,
                    width: border
                },
                fillStyle: {
                    alpha: 0,
                    color: this._borderColor
                }
            });
            bg.strokeRect(-w / 2 - border, -h / 2 - border, w + border * 2, h + border * 2);
            this.add(bg);

            let line = new Phaser.GameObjects.Graphics(this.scene, {
                x: 0,
                y: 0,
                lineStyle: {
                    color: this._lineColor,
                    width: 2
                },
                fillStyle: {
                    alpha: 1,
                    color: this._lineColor
                }
            });
            line.fillRect(-w / 2, -h / 2, w, h);
            this.add(line);

            this._barWidth = w;
            this._barHeight = h;

            this._lineMask = new Phaser.GameObjects.Graphics(this.scene);
            this._lineMask.clear();
            this._lineMask.fillStyle(0xFFFFFF, 1);
            this._lineMask.fillRect(0, 0, this._barWidth, this._barHeight);

            line.mask = this._lineMask.createGeometryMask();

        }
        else {

            let bg = new Phaser.GameObjects.Sprite(this.scene, 0, 0, 'preloader', 'bar_bg');
            this.add(bg);

            let line = new Phaser.GameObjects.Sprite(this.scene, 0, 0, 'preloader', 'bar_line');
            this.add(line);

            this._barWidth = line.width;
            this._barHeight = line.height;

            this._lineMask = new Phaser.GameObjects.Graphics(this.scene);
            this._lineMask.clear();
            this._lineMask.fillStyle(0xFFFFFF, 1);
            this._lineMask.fillRect(0, 0, this._barWidth, this._barHeight);

            line.mask = this._lineMask.createGeometryMask();

            let front = new Phaser.GameObjects.Sprite(this.scene, 0, 0, 'preloader', 'bar_front');
            this.add(front);

        }

        this.progress = 0;
    }

    public set progress(v: number) {
        // if (this.useSimple) {
        //     this.lineMask.clear();
        //     this.lineMask.fillRect(-this.barWidth / 2, -this.barHeight / 2, this.barWidth * v, this.barHeight);
        // }
        // else {
        this._lineMask.x = this.x - this._barWidth / 2 - this._barWidth + this._barWidth * v;
        this._lineMask.y = this.y - this._barHeight / 2;
        // }
    }

    showAnim() {
        this.scene.tweens.add({
            targets: this,
            alpha: 1,
            duration: 500,
            ease: Phaser.Math.Easing.Sine.InOut
        })
    }


}