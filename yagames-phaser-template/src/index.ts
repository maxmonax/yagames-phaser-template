import "./html/css/main.css";
import * as Phaser from "phaser";
import { Config } from "./data/Config";
import { Params } from "./data/Params";
import { FrontEvents } from "./game/events/FrontEvents";
import MenuScene from "./game/scenes/MenuScene";
import GameScene from "./game/scenes/GameScene";
import Preloader from "./game/scenes/Preloader";
import Boot from "./game/scenes/Boot";

let isLandscape = true;

function startGame(aParent: HTMLElement) {
    new Phaser.Game({
        parent: aParent,
        type: Phaser.AUTO,
        backgroundColor: 0x1e1058,
        transparent: true,
        width: 2400,
        height: 1080,
        scale: {
            mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            width: Config.GW,
            height: Config.GH
        },
        scene: [Boot, Preloader, MenuScene, GameScene],
    });
    
}

function windowResizeCalculate() {
    const gw = Config.GW;
    const gh = Config.GH;
    const ww = window.innerWidth;
    const wh = window.innerHeight;
    const scale = wh / gh; // scale by height
    Params.gameWidth = Math.min(gw, ww / scale);
}

function checkOrientation() {
    if (!Config.checkOrientation) return;

    const rotClassName = 'rotate-image-container';
    const imgId = 'rotate__image';
    const ar = Config.GW_SAFE / Config.GH_SAFE;
    const ww = window.innerWidth;
    const wh = window.innerHeight;

    if (isLandscape && ww / wh < ar) {

        // LogMng.debug('show rotate img');
        isLandscape = false;
        let divGame = document.getElementById('game');
        let divRotate = document.getElementsByClassName(rotClassName)[0] as any;
        divGame.style.display = 'none';
        divRotate.style.display = 'flex';


        // Get references to the image and container
        if (!document.getElementById(imgId)) {
            // Create a new Image object
            // LogMng.debug('Create a new Image object');
            var img = new Image();
            img.id = imgId;
            img.alt = 'Rotate device to landscape orientation';
            img.src = './assets/images/rotate-phone-icon-white.png';
            divRotate.appendChild(img);
        }

    }
    else if (!isLandscape && ww / wh >= ar) {
        // LogMng.debug('hide rotate img');
        isLandscape = true;
        let divGame = document.getElementById('game');
        let divRotate = document.getElementsByClassName(rotClassName)[0] as any;
        divGame.style.display = 'flex';
        divRotate.style.display = 'none';
    }
}

window.addEventListener('resize', () => {
    checkOrientation();
    windowResizeCalculate();
    FrontEvents.getInstance().emit(FrontEvents.EVENT_WINDOW_RESIZE);
}, false);

window.addEventListener('load', () => {

    const gameContainerId = 'game';
    let gameContainer = document.getElementById(gameContainerId);
    if (!gameContainer) {
        let error = `ERROR: game container ${gameContainerId} not found!`;
        alert(error);
        throw error;
    }
    else {

        window.addEventListener('resize', () => {
            checkOrientation();
            windowResizeCalculate();
            FrontEvents.getInstance().emit(FrontEvents.EVENT_WINDOW_RESIZE);
        }, false);

        checkOrientation();
        windowResizeCalculate();
        startGame(gameContainer);

    }

}, false);