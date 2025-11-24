import { ILogger } from "@/interfaces/ILogger";
import { LogMng } from "@/utils/LogMng";

export class MyContainer extends Phaser.GameObjects.Container implements ILogger {
    protected _className = 'MyContainer';

    constructor(scene, x?, y?, children?) {
        super(scene, x, y, children);
    }

    logDebug(aMsg: string, aData?: any): void {
        LogMng.debug(`${this._className}: ${aMsg}`, aData);
    }
    logWarn(aMsg: string, aData?: any): void {
        LogMng.warn(`${this._className}: ${aMsg}`, aData);
    }
    logError(aMsg: string, aData?: any): void {
        LogMng.error(`${this._className}: ${aMsg}`, aData);
    }
    
}