import { Params } from "@/data/Params";
import { SceneName } from "./Scenes";
import { YaGamesApi } from "@/api/YaGamesApi";
import { Config } from "@/data/Config";
import { LogMng } from "@/utils/LogMng";
import { GameData } from "@/data/GameData";
import * as MyUtils from '@/utils/MyUtils';

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

export default class Boot extends Phaser.Scene {

    constructor() {
        super(SceneName.Boot);

        // init debug mode
        Params.isDebugMode = window.location.hash === '#debug';

        // LogMng settings
        if (!Params.isDebugMode) LogMng.setMode(LogMng.MODE_RELEASE);
        LogMng.system('Log mode: ' + LogMng.getMode());

        if (!Params.isDebugMode) {
            console.clear();
        }

        this.readGETParams();
    }

    private readGETParams() {

        const LIST = [
            {
                // test param
                keys: ['goto'],
                onReadHandler: (aValue: string) => {
                    GameData.getInstance().setAnekdotId(Number(aValue) - 1);
                }
            }
        ];

        for (let i = 0; i < LIST.length; i++) {
            const listItem = LIST[i];
            const keys = listItem.keys;
            for (let j = 0; j < keys.length; j++) {
                const getName = keys[j];
                let qValue = MyUtils.getQueryValue(getName);
                if (qValue != null && qValue != undefined) {
                    listItem.onReadHandler(qValue);
                }
            }
        }

    }

    create() {
        this.scene.start(SceneName.Preloader);
    }

}



