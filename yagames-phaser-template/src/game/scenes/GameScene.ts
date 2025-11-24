import { LocalData } from "@/data/LocalData"
import { SceneName } from "./Scenes"
import { SndMng } from "@/sound/SndMng"
import { Config } from "@/data/Config";
import { MyButton } from "../gui/MyButton";
import { GameData } from "@/data/GameData";
import { Params } from "@/data/Params";
import { FrontEvents } from "../events/FrontEvents";
import { YaGamesApi } from "@/api/YaGamesApi";
import { DeviceInfo } from "@/utils/DeviceInfo";
import { AdMng } from "../mng/AdMng";
import { AdShower, AdShowerEvent } from "../gui/AdShower";

const CURT_DUR = 750;

export default class GameScene extends Phaser.Scene {
    private _dummy: Phaser.GameObjects.Container;
    private _bg: Phaser.GameObjects.Image;
    private _title: Phaser.GameObjects.Text;
    private _text: Phaser.GameObjects.Text;
    private blackCurtain: Phaser.GameObjects.Graphics;
    private _adShower: AdShower;
    private _currPageId = 0;
    private _isTransit = false;

    private _btnScale = 1.4;
    private _btnDx = 220;
    private _btnLeft: MyButton;
    private _btnRight: MyButton;

    private _keyA: Phaser.Input.Keyboard.Key;
    private _keyD: Phaser.Input.Keyboard.Key;
    private _keyLeft: Phaser.Input.Keyboard.Key;
    private _keyRight: Phaser.Input.Keyboard.Key;
    
    constructor() {
        super(SceneName.Game);
    }

    create() {

        this._isTransit = true;

        this._currPageId = GameData.getInstance().getAnekdotId();

        SndMng.scene = this;

        this.cameras.main.centerOn(0, 0);

        this._dummy = this.add.container();
        
        this._bg = new Phaser.GameObjects.Image(this, 0, 0, 'game', 'bg');
        this._bg.scale = (Config.GH + 170) / this._bg.height;
        this._dummy.add(this._bg);

        this._title = new Phaser.GameObjects.Text(this, 0, -Config.GH_HALF + 66,
            '1',
            { font: "90px Ubuntu", align: 'center' })
            .setOrigin(0.5)
            .setColor('#dddddd');
        this._title.setStroke('#111111', 8);
        this._dummy.add(this._title);

        this._text = new Phaser.GameObjects.Text(this, 0, -30,
            '',
            { font: "100px Ubuntu", align: 'left' })
            .setOrigin(0.5)
            .setColor('#dddddd');
        this._text.setStroke('#111111', 8);
        this._text.setWordWrapWidth(Params.gameWidth - 100);
        this._dummy.add(this._text);

        let btnBotY = Config.GH_HALF - 100;
        let sc = this.getBtnScale();

        this._btnLeft = new MyButton(this, -this._btnDx, btnBotY, 'game', 'Button_024', sc);
        this._btnLeft.on('click', this.onLeftClick, this);
        this._dummy.add(this._btnLeft);

        this._btnRight = new MyButton(this, this._btnDx, btnBotY, 'game', 'Button_016', sc);
        this._btnRight.on('click', this.onRightClick, this);
        this._dummy.add(this._btnRight);

        if (DeviceInfo.getInstance().desktop) {
            this._keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
            this._keyA.on('down', this.onLeftClick, this);
            this._keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
            this._keyD.on('down', this.onRightClick, this);

            this._keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
            this._keyLeft.on('down', this.onLeftClick, this);
            this._keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
            this._keyRight.on('down', this.onRightClick, this);
        }

        this.updateButtons();
        this.updateContent();

        this.blackCurtain = this.add.graphics();
        this.blackCurtain.fillStyle(0x111111);
        this.blackCurtain.fillRect(-Config.GW_HALF, -Config.GH_HALF, Config.GW, Config.GH);
        this.hideBlackCurtain(() => {
            this._isTransit = false;
        });

        this._adShower = new AdShower(this, 0, 0);
        this._adShower.on(AdShowerEvent.onShow, this.onAdShow, this);
        this._adShower.visible = false;
        this.add.existing(this._adShower);

        FrontEvents.getInstance().addListener(FrontEvents.EVENT_WINDOW_RESIZE, this.onResize, this);

        YaGamesApi.getInstance().gameReady();

    }

    private showBlackCurtain(cb?: Function, ctx?: any) {
        this.tweens.killTweensOf(this.blackCurtain);
        this.blackCurtain.alpha = 0;
        this.blackCurtain.visible = true;
        this.tweens.add({
            targets: this.blackCurtain,
            alpha: 1,
            duration: CURT_DUR,
            ease: Phaser.Math.Easing.Sine.InOut,
            onComplete: () => {
                if (cb) cb.call(ctx);
            }
        });
    }

    private hideBlackCurtain(cb?: Function, ctx?: any) {
        this.tweens.killTweensOf(this.blackCurtain);
        this.tweens.add({
            targets: this.blackCurtain,
            alpha: 0,
            duration: CURT_DUR,
            ease: Phaser.Math.Easing.Sine.InOut,
            onComplete: () => {
                this.blackCurtain.visible = false;
                if (cb) cb.call(ctx);
            }
        });
    }

    private onLeftClick() {
        if (this._isTransit) return;
        if (this._currPageId > 0) {
            this._currPageId--;
            this.showNextPage();
        }
    }

    private onRightClick() {
        if (this._isTransit) return;
        this._currPageId++;
        this.showNextPage();
    }

    private onResize() {
        this.updateButtons();
        this.updateContent();
    }

    private onAdShow() {
        this._adShower.visible = false;
        AdMng.getInstance().showInterstitial(this.game, () => {
        }, () => {
            this.showNextPage2();
        }, this)
    }

    private getBtnScale(): number {
        return Math.min(this._btnScale, Params.gameWidth / 400);
    }

    private updateButtons() {
        // let realDx = Math.min(this._btnDx, (Params.gameWidth - 200) / 2);
        let realDx = Math.min(this._btnDx, Params.gameWidth / 4);
        this._btnLeft.x = -realDx;
        this._btnRight.x = realDx;

        let sc = this.getBtnScale();
        this._btnLeft.setNewScale(sc);
        this._btnRight.setNewScale(sc);
    }

    private updateContent() {
        const frameSize = 80;
        let wrapWidth = Math.min(1600, Params.gameWidth - frameSize);
        this._text.setWordWrapWidth(wrapWidth);

        this._title.text = (this._currPageId + 1).toFixed(0);

        let fontSize = 100;
        this._text.text = GameData.getInstance().getAnektod(this._currPageId + 1);
        this._text.setFontSize(fontSize);

        let hLimit = Config.GH - 270;

        if (this._text.height > hLimit) {
            wrapWidth = Params.gameWidth - frameSize;
            this._text.setWordWrapWidth(wrapWidth);
        }

        while (this._text.height > hLimit || this._text.width > wrapWidth) {
            fontSize -= Math.max(2, Math.trunc(this._text.height / hLimit));
            this._text.setFontSize(fontSize);
        }
    }

    private showNextPage() {
        if (this._isTransit) return;
        this._isTransit = true;
        
        // show fog
        this.showBlackCurtain(() => {
            if (AdMng.getInstance().isInterstitialReady()) {
                this._adShower.showTimer(3);
                this._adShower.visible = true;
            }
            else {
                this.showNextPage2();
            }
        });
    }

    private showNextPage2() {
        GameData.getInstance().setAnekdotId(this._currPageId);
        this.updateContent();
        // remove fog
        this.hideBlackCurtain(() => {
            this._isTransit = false;
        });
    }

    update(allTime: number, dtMs: number) {
        // get dt in Sec
        let dt = dtMs * 0.001;
        this._adShower.update(dt);
    }
}