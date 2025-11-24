import { MyButton } from "./MyButton";

export class LevelButton extends MyButton {
    private _num = -1;
    private _numText: Phaser.GameObjects.Text;
    private _lock: Phaser.GameObjects.Image;

    constructor(scene, x, y, aNum: number, aScale = 1) {
        super(scene, x, y, 'game', 'GUI element_020', aScale);
        this._num = aNum;

        this._numText = new Phaser.GameObjects.Text(this.scene, 0, 0,
            this._num.toFixed(0),
            { font: "100px Ubuntu", align: 'center' })
            .setOrigin(0.5)
            .setColor('#dddddd');
        this._numText.setStroke('#111111', 16);
        this._dummy.add(this._numText);

    }

    

}