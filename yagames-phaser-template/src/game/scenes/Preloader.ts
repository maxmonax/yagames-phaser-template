import { Params } from "@/data/Params";
import { PreloaderBar } from "../gui/preloader/PreloaderBar";
import { Config } from "@/data/Config";
import { YaGamesApi } from "@/api/YaGamesApi";
import { SceneName } from "./Scenes";
import { SOUND_LOAD_DATA } from "@/sound/SndMng";
import { AdMng } from "../mng/AdMng";

enum Texts {
    Title = 'Loading complete',
    Message = 'Click anywhere to start',
    YaSDKError = 'Yandex SDK Initialization Error\nPlease, try to refresh the page...'
}

enum Styles {
    Color = '#AAAAAA',
    ErrorColor = '#ff0000'
}

enum Fonts {
    Arial = 'Arial',
    Ubuntu = 'Ubuntu'
}

export default class Preloader extends Phaser.Scene {
    private _dummy: Phaser.GameObjects.Container;
    private _title: Phaser.GameObjects.Text;
    private _subTitle: Phaser.GameObjects.Text;
    private bar: PreloaderBar;

    private _yaStatus: {
        loaded: boolean,
        error?: boolean
    }

    private _loaded = false;
    private _checking = true;

    constructor() {
        super(SceneName.Preloader);
    }

    init() {
        this._dummy = this.add.container();

        this._title = new Phaser.GameObjects.Text(this, Config.GW_HALF, Config.GH_HALF - 170,
            'Анекдоты',
            { font: "100px Ubuntu", align: 'center' })
            .setOrigin(0.5)
            .setColor('#dddddd');
        this._title.setStroke('#111111', 8);
        this._dummy.add(this._title);

        this._subTitle = new Phaser.GameObjects.Text(this, Config.GW_HALF, this._title.y + 110,
            'чёрный юмор',
            { font: "60px Ubuntu", align: 'center' })
            .setOrigin(0.5)
            .setColor('#dddddd');
        this._subTitle.setStroke('#111111', 8);
        this._dummy.add(this._subTitle);

        // this.add.image(Config.GW_HALF, Config.GH_HALF, 'background');
        this.bar = new PreloaderBar(this, Config.GW_HALF, Config.GH_HALF + 100, true, 0xdddddd, 0xaaaaaa);
        this.add.existing(this.bar);

        YaGamesApi.getInstance().init().then(isOk => {
            isOk ? this.onYaSDKLoaded() : this.onYaSDKError()
        })

    }

    private onYaSDKLoaded() {
        this._yaStatus = {
            loaded: true
        }
    }

    private onYaSDKError() {
        this._yaStatus = {
            loaded: false,
            error: true
        }
    }

    preload() {

        this.load.setPath('./assets/atlases/');
        this.load.atlas("game", "game.png", "game.json")

        // audio
        this.load.setPath('./assets/audio/');
        for (let i = 0; i < SOUND_LOAD_DATA.length; i++) {
            const sndData = SOUND_LOAD_DATA[i];
            this.load.audio(sndData.alias, sndData.file);
        }

        this.load.on('progress', function (value) {
            this.bar.progress = value;
        }, this);

    }

    create() {
        this._loaded = true;
        this._checking = true;
    }

   private onSuccess() {
       if (Config.TAP_TO_START) {

           this.add.text(Config.GW_HALF, Config.GH_HALF - 100,
               Texts.Title,
               {
                   font: `90px ${Fonts.Ubuntu}`,
                   color: Styles.Color
               })
               .setOrigin(0.5);

           this.add.text(Config.GW_HALF, Config.GH_HALF + 20,
               Texts.Message,
               {
                   font: `50px ${Fonts.Ubuntu}`,
                   color: Styles.Color
               })
               .setOrigin(0.5);

           this.input.once('pointerdown', () => {
               this.starGame();
           });

       }
       else {
           this.starGame();
       }
   }

    private onYaError() {
        this.add.text(Config.GW_HALF, Config.GH_HALF + 250,
            Texts.YaSDKError,
            {
                font: `50px ${Fonts.Ubuntu}`,
                color: Styles.ErrorColor,
                align: 'center'
            })
            .setOrigin(0.5);
    }

    private starGame() {
        this.sound.unlock();
        AdMng.getInstance().refreshTimer();
        this.scene.start(SceneName.Game);
    }

    update() {

        if (this._loaded && this._checking) {
            if (this._yaStatus?.loaded) {
                this._checking = false;
                this.onSuccess();
            }
            else if (this._yaStatus?.error) {
                this._checking = false;
                this.onYaError();
            }
        }

    }

}



