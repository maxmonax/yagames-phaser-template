
export interface ILogger {
    // logSystem(aMsg: any, aLink?: string): void;
    logDebug(aMsg: string, aData?: any): void;
    logWarn(aMsg: string, aData?: any): void;
    logError(aMsg: string, aData?: any): void;
}