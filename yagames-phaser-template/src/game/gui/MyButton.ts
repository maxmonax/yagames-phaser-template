import { SndMng, SoundAlias } from "@/sound/SndMng";

export class MyButton extends Phaser.GameObjects.Container {
    protected _dummy: Phaser.GameObjects.Container;
    private _img: Phaser.GameObjects.Image;
    private _scale = 1;
    private hoverOn = false;

    constructor(scene, x, y, texture?, aFrame?, aScale?) {
        super(scene, x, y);
        
        this._scale = aScale || 1;

        this._dummy = new Phaser.GameObjects.Container(scene, 0, 0);
        this._dummy.scale = .01;
        this.add(this._dummy);
        
        this._img = new Phaser.GameObjects.Image(scene, 0, 0, texture, aFrame);
        this._dummy.add(this._img);
        
        this.hoverOn = false;

        this._img
            .setInteractive()
            .on('pointerover', () => {
                this._dummy.setScale(1.05 * this._scale);
                this.hoverOn = true;
            }, this)
            .on('pointerout', () => {
                this._dummy.setScale(1 * this._scale);
                this.hoverOn = false;
            }, this)
            .on('pointerdown', () => {
                // SndMng.sfxPlay(SoundAlias.Click, .2);
                // this.scene.sound.play('click', { volume: 0.5, detune: -100 * Math.random() });
                this._dummy.setScale(0.95 * this._scale);
                // pressFunction();
                this.emit('click', this);
            }, this)
            .on('pointerup', () => {
                if (this.hoverOn) {
                    this._dummy.setScale(1.05 * this._scale);
                }
                else {
                    this._dummy.setScale(1 * this._scale);
                }
            }, this);
        this._img.input.cursor = 'pointer';

        this.scene.tweens.add({
            targets: this._dummy,
            scale: this._scale,
            duration: 200,
            ease: 'Circ.Out'
        });

    }

    setNewScale(aScale) {
        this._scale = aScale;
        this._dummy.setScale(this._scale);
    }

}
