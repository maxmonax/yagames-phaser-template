import { IUpdatable } from "@/interfaces/IUpdatable";
import { MyContainer } from "./MyContainer";
import { MyText } from "./MyText";
import { MyMath } from "@/utils/MyMath";

export enum AdShowerEvent {
    onShow = 'onShow'
}

export class AdShower extends MyContainer implements IUpdatable {
    private _isActive = false;
    private _timer = 0;
    private _title: MyText;
    private _textTimer: MyText;

    constructor(scene, x?, y?) {
        super(scene, x, y);
        this._className = 'AdShower';

        this._title = new MyText(scene, 0, -100, 'Небольшая\nреклама\nчерез...',
            { font: "70px Ubuntu", align: 'center' })
            .setOrigin(0.5)
            .setColor('#dddddd');
        this.add(this._title);

        this._textTimer = new MyText(scene, 0, 70, '3',
            { font: "70px Ubuntu", align: 'center' })
            .setOrigin(0.5)
            .setColor('#dddddd');
        this.add(this._textTimer);

    }

    showTimer(aTimer = 3) {
        this._timer = aTimer;
        this._isActive = true;
    }

    private updateTimer() {
        let secs = MyMath.clamp(Math.round(this._timer), 0, 1000);
        this._textTimer.text = secs.toFixed(0);
    }

    update(dt: number) {

        if (!this._isActive) return;

        this._timer -= dt;
        this.updateTimer();
        if (this._timer <= 0) {
            this._isActive = false;
            this.emit(AdShowerEvent.onShow);
        }

    }

}