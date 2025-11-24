import { LogMng } from "@/utils/LogMng";
import { FeedbackError, SDK } from "ysdk";

export class YaGamesApi {

    private static instance: YaGamesApi = null;
    private _sdk: SDK;

    private constructor() { }

    static getInstance(): YaGamesApi {
        if (!YaGamesApi.instance) {
            YaGamesApi.instance = new YaGamesApi();
        }
        return YaGamesApi.instance;
    }

    async init() {
        try {
            this._sdk = await YaGames.init();
            LogMng.debug('Yandex SDK initialized');
            return await Promise.resolve(true);
        } catch (error) {
            LogMng.error('Yandex SDK NOT initialized');
            console.error(error);
            return await Promise.resolve(false);
        }
    }

    gameReady() {
        this._sdk?.features.LoadingAPI?.ready();
    }

    async canReview(): Promise<{ value: boolean, reason?: FeedbackError }> {
        return this._sdk.feedback.canReview();
    }

    async requestReview(): Promise<{ feedbackSent: any }> {
        return this._sdk.feedback.requestReview();
    }

    showFullscreenAdv(onOpen?, onCLose?: (wasShown: boolean) => void, onError?, onOffline?) {
        this._sdk.adv.showFullscreenAdv({
            callbacks: {
                onOpen: onOpen,
                onClose: onCLose,
                onError: onError,
                onOffline: onOffline
            }
        })
    }

    showRewarded(onOpen?, onRewarded?, onCLose?, onError?) {
        this._sdk.adv.showRewardedVideo({
            callbacks: {
                onOpen: onOpen,
                onRewarded: onRewarded,
                onClose: onCLose,
                onError: onError
            }
        })
    }

}