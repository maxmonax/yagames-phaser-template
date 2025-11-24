import { LogMng } from "@/utils/LogMng";

export class YaGamesApi {

    private static instance: YaGamesApi = null;
    private _ysdk: any;

    private constructor() { }

    static getInstance(): YaGamesApi {
        if (!YaGamesApi.instance) {
            YaGamesApi.instance = new YaGamesApi();
        }
        return YaGamesApi.instance;
    }

    async init() {
        try {
            this._ysdk = await YaGames.init();
            LogMng.debug('Yandex SDK initialized');
            return await Promise.resolve(true);
        } catch (error) {
            LogMng.error('Yandex SDK NOT initialized');
            console.error(error);
            return await Promise.resolve(false);
        }
    }

    gameReady() {
        this._ysdk?.features.LoadingAPI?.ready();
    }

    async canReview(): Promise<{ value: boolean, reason: string }> {
        return this._ysdk.feedback.canReview();
    }

    async requestReview(): Promise<{ feedbackSent: any }> {
        return this._ysdk.feedback.requestReview();
    }

    showFullscreenAdv(onOpen?: Function, onCLose?: Function, onError?: Function, onOffline?: Function) {
        this._ysdk.adv.showFullscreenAdv({
            callbacks: {
                onOpen: onOpen,
                onClose: onCLose,
                onError: onError,
                onOffline: onOffline
            }
        })
    }

    showRewarded(onOpen?: Function, onRewarded?: Function, onCLose?: Function, onError?: Function) {
        this._ysdk.adv.showRewardedVideo({
            callbacks: {
                onOpen: onOpen,
                onRewarded: onRewarded,
                onClose: onCLose,
                onError: onError
            }
        })
    }

}