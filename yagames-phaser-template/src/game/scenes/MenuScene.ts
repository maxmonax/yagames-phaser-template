// import Button from './Button.js'

import { Config } from "@/data/Config";
import { FrontEvents } from "../events/FrontEvents";
import { MyButton } from "../gui/MyButton";
import { SceneName } from "./Scenes";
import { SndMng, SoundAlias } from "@/sound/SndMng";
import { LevelButton } from "../gui/LevelButton";
import { Params } from "@/data/Params";
import { GameData } from "@/data/GameData";
import { LogMng } from "@/utils/LogMng";
import { DeviceInfo } from "@/utils/DeviceInfo";
import { ScrollList } from "../gui/ScrollList";

const CELL_SIZE = {
    w: 180,
    h: 150
}

export default class MenuScene extends Phaser.Scene {
    private _dummyScroll: Phaser.GameObjects.Container;
    private _dummyGui: Phaser.GameObjects.Container;
    private _dummyBot: Phaser.GameObjects.Container;
    private _title: Phaser.GameObjects.Text;
    private _subTitle: Phaser.GameObjects.Text;
    private _titleWidth = 0;
    private _btns: LevelButton[];
    private _scroolList: ScrollList;

    private _field = {
        colCount: 4,
        rowCount: 6,
        pages: 1,
        border: {
            top: 200,
            bot: 150
        }
    }

    private _currPageId = 0;


    constructor() {
        super(SceneName.Menu);
    }

    create() {
        this._btns = [];

        SndMng.scene = this;
        // if (!SndMng.getMusic(SoundAlias.MainMusic)) SndMng.playMusic(SoundAlias.MainMusic, 0, 1, 1000);

        this.cameras.main.centerOn(0, 0);

        this._dummyScroll = this.add.container();
        this._dummyGui = this.add.container();
        this._dummyBot = this.add.container();

        this._title = new Phaser.GameObjects.Text(this, 0, -Config.GH_HALF + 80,
            'Анекдоты',
            { font: "90px Ubuntu", align: 'center' })
            .setOrigin(0.5)
            .setColor('#dddddd');
        this._title.setStroke('#111111', 16);
        this._dummyGui.add(this._title);

        this._titleWidth = this._title.width;

        this._subTitle = new Phaser.GameObjects.Text(this, 0, this._title.y + 100,
            'чёрный юмор',
            { font: "60px Ubuntu", align: 'center' })
            .setOrigin(0.5)
            .setColor('#dddddd');
        this._subTitle.setStroke('#111111', 16);
        this._dummyGui.add(this._subTitle);

        let anekdotCount = 50;// GameData.getInstance().getAnekdotCount();
        for (let i = 0; i < anekdotCount; i++) {
            let pos = this.getBtnPos(i);
            let btn = new LevelButton(this, pos.x, pos.y, i + 1, .6);
            btn.on('click', () => {
                this.scene.start(SceneName.Game);
            })
            this._dummyScroll.add(btn);
            this._btns.push(btn);
        }

        let btn = new MyButton(this, -180, Config.GH_HALF - 100, 'game', 'Button_024', 1.);
        btn.on('click', () => {
            // to left
            if (this._currPageId > 0) {
                this._currPageId--;
                this.updateLevelButtons();
            }
        })
        this._dummyBot.add(btn);

        btn = new MyButton(this, 180, Config.GH_HALF - 100, 'game', 'Button_016', 1.);
        btn.on('click', () => {
            // to right
            if (this._currPageId < this._field.pages - 1) {
                this._currPageId++;
                this.updateLevelButtons();
            }
        })
        this._dummyBot.add(btn);

        this.updateFieldSize();
        this.updateLevelButtons();


        // this._scroolList = new ScrollList(this, 0, 0, null, this._dummyScroll);

        // this._btnSettings = new MyButton(this, 0, 380, () => {
        // }, 'menu', 'btnSettings');

        FrontEvents.getInstance().addListener(FrontEvents.EVENT_WINDOW_RESIZE, this.onResize, this);

    }

    private getFieldSize(): {w, h} {
        return {
            w: Params.gameWidth - 50,
            h: Config.GH - this._field.border.top - this._field.border.bot
        }
    }

    private getPageValue(): number {
        return this._field.colCount * this._field.rowCount;
    }

    private getBtnPos(id: number): {x, y} {
        // private getItemPos(x0, y0, cw: number, ch: number, cid: number, scalex = 1, scaley = 1): Phaser.Math.Vector2 {
        let x0 = 0;
        let y0 = 0 + (this._field.border.top - this._field.border.bot);
        let cw = this._field.colCount;
        let ch = this._field.rowCount;
        let scalex = 1;
        let scaley = 1;
        let res = new Phaser.Math.Vector2(0, 0);
        let cdx = CELL_SIZE.w * scalex;
        let cdy = CELL_SIZE.h * scaley;
        res.x = x0 - (cw - 1) / 2 * cdx + id % cw * cdx;
        res.y = y0 - (ch - 1) * cdy / 2 + cdy * Math.floor(id / cw);
        return res;
    }
    
    private updateFieldSize() {
        let fSize = this.getFieldSize();
        this._field.colCount = 3; // Math.max(3, Math.min(3, Math.trunc(fSize.w / CELL_SIZE.w)));
        this._field.rowCount = 4; // Math.trunc(fSize.h / CELL_SIZE.h);
        let pageValue = this.getPageValue();
        let anekdotCount = 50;// GameData.getInstance().getAnekdotCount();
        this._field.pages = Math.trunc(anekdotCount / pageValue);
        if (anekdotCount > pageValue) this._field.pages++;
    }

    private updateLevelButtons() {
        let pageValue = this.getPageValue();
        let startId = this._currPageId * pageValue;
        let endId = startId + pageValue - 1;
        let k = 0;
        for (let i = 0; i < this._btns.length; i++) {
            const btn = this._btns[i];
            if (i < startId || i > endId) {
                btn.visible = false;
                continue;
            }
            let pos = this.getBtnPos(i);
            let posy = this.getBtnPos(k);
            btn.x = pos.x;
            btn.y = posy.y;
            btn.visible = true;
            k++;
        }
    }

    onResize() {
        // this.buttonClose.x = Params.GAMEWIDTH / 2 - 90;
        // this.buttonSettings.x = Params.GAMEWIDTH / 2 - 90;
        this.updateFieldSize();
        this.updateLevelButtons();

        let titleScale = Math.min(1, (Params.gameWidth - 100) / this._titleWidth);
        this._title.scale = this._subTitle.scale = titleScale;
    }


    update(t, dtMs) {
        let dt = dtMs * 0.001;
        // this._scroolList.update(dt);
    }

}