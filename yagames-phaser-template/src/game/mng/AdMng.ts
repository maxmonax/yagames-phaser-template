import { YaGamesApi } from "@/api/YaGamesApi";
import { ILogger } from "@/interfaces/ILogger";
import { LogMng } from "@/utils/LogMng";

// interstitial ad period in min
const INTER_PERIOD = 1.1;

export class AdMng implements ILogger {
    private static instance: AdMng = null;
    private _prevInterTimeMin = -1;
    
    private constructor() {
    }

    static getInstance(): AdMng {
        if (!AdMng.instance) AdMng.instance = new AdMng();
        return AdMng.instance;
    }

    logDebug(aMsg: string, aData?: any): void {
        LogMng.debug(`AdMng: ${aMsg}`, aData);
    }

    logWarn(aMsg: string, aData?: any): void {
        LogMng.warn(`AdMng: ${aMsg}`, aData);
    }

    logError(aMsg: string, aData?: any): void {
        LogMng.error(`AdMng: ${aMsg}`, aData);
    }
    private getCurrTimeInMin(): number {
        return new Date().getTime() / 1000 / 60;
    }

    refreshTimer(aTime?: number) {
        // let currTimeSec = aTime != undefined ? aTime : new Date().getTime() / 1000;
        let currTimeMin = this.getCurrTimeInMin();
        this._prevInterTimeMin = currTimeMin;
    }

    isInterstitialReady(): boolean {
        let currTimeMin = this.getCurrTimeInMin();
        let dt = currTimeMin - this._prevInterTimeMin;
        this.logDebug(`isInterstitialReady: dt = ${dt}`);
        return dt > INTER_PERIOD;
    }

    showInterstitial(aGame: Phaser.Game, aOnOpen?: Function, aOnClose?: Function, aCtx?: any) {
        let show = this.isInterstitialReady();
        if (!show) {
            aOnClose.call(aCtx);
            return;
        }
        YaGamesApi.getInstance().showFullscreenAdv(
            () => {
                // open
                aGame.sound.mute = true;
                this.refreshTimer();
                aOnOpen?.call(aCtx);
            },
            () => {
                // close
                aOnClose?.call(aCtx);
                aGame.sound.mute = false;
            },
            (msg) => {
                // error
                this.logWarn(`Interstitial: ${msg}`)
                // aOnError.call(aCtx);
            },
            () => {
                // offline
                this.logWarn(`Interstitial Offline`)
                // aOnOffline.call(aCtx);
            });
    }

    showRewarded(aGame: Phaser.Game, aOnOpen?: Function, aOnRewarded?: Function, aOnClose?: Function, aCtx?: any) {
        let currTimeSec = new Date().getTime() / 1000;
        YaGamesApi.getInstance().showRewarded(
            () => {
                // open
                aGame.sound.mute = true;
                aOnOpen?.call(aCtx);
            },
            () => {
                // rewarded
                this.refreshTimer();
                aOnRewarded?.call(aCtx);
            },
            () => {
                // close
                aOnClose?.call(aCtx);
                aGame.sound.mute = false;
            }),
            (error) => {
                // error
                this.logWarn(`Rewarded: ${error}`)
                // aOnError.call(aCtx);
            };
    }

}