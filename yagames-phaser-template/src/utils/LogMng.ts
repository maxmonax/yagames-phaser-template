
const DEBUG = 'DEBUG';
const INFO = 'INFO';
const NETWORK = 'NETWORK';
const WARNING = 'WARNING';
const ERROR = 'ERROR';

export class LogMng {
    static readonly MODE_DEBUG = 'MODE_DEBUG';
    static readonly MODE_RELEASE = 'MODE_RELEASE';

    // current mode
    static mode = LogMng.MODE_DEBUG;
    // available levels
    static levels = [DEBUG, INFO, NETWORK, WARNING, ERROR];

    public static setMode(aMode: string) {
        LogMng.mode = aMode;
        switch (LogMng.mode) {
            case LogMng.MODE_DEBUG:
                LogMng.levels = [DEBUG, INFO, NETWORK, WARNING, ERROR];
                break;
            case LogMng.MODE_RELEASE:
                LogMng.levels = [WARNING, ERROR];
                break;
        }
    }

    public static getMode(): string {
        return this.mode;
    }

    private static getCSS(bgColor: string): string {
        return 'background: ' + bgColor + ';' +
            'background-repeat: no-repeat;' +
            'color: #1df9a8;' +
            'line-height: 16px;' +
            'padding: 1px 0;' +
            'margin: 0;' +
            'user-select: none;' +
            '-webkit-user-select: none;' +
            '-moz-user-select: none;';
    };

    private static getLink(color: string): string {
        return 'background: ' + color + ';' +
            'background-repeat: no-repeat;' +
            'font-size: 12px;' +
            'color: #446d96;' +
            'line-height: 14px';
    };

    private static log(aMsg: any, aLevel: string = DEBUG, aData?: any): boolean {

        if (LogMng.levels.indexOf(aLevel) < 0)
            return false;

        var css = '';
        switch (aLevel) {
            case INFO:
                css = 'background: #308AE4; color: #fff; padding: 1px 4px';
                break;

            case WARNING:
                css = 'background: #f7a148; color: #fff; padding: 1px 4px';
                break;

            case ERROR:
                css = 'background: #DB5252; color: #fff; padding: 1px 4px';
                break;

            case NETWORK:
                css = 'background: #7D2998; color: #fff; padding: 1px 4px';
                break;

            case DEBUG:
            default:
                css = 'background: #ADADAD; color: #fff; padding: 1px 4px';
        }

        aData ?
            console.log("%c%s", css, aLevel, aMsg, aData) :
            console.log("%c%s", css, aLevel, aMsg);

        return true;

    };

    public static system(aMsg: any, aLink: string = '') {
        console.log("%c %c %c %s %c %c %c %c%s",
            LogMng.getCSS('#5C6166'), LogMng.getCSS('#4F5357'),
            LogMng.getCSS('#313335'), aMsg,
            LogMng.getCSS('#4F5357'), LogMng.getCSS('#5C6166'),
            LogMng.getLink('none'), LogMng.getLink('none'), aLink
        );
    }

    public static debug(aMsg: any, aData?: any): boolean {
        return LogMng.log(aMsg, DEBUG, aData);
    }

    public static info(aMsg: any, aData?: any): boolean {
        return LogMng.log(aMsg, INFO, aData);
    }

    public static net(aMsg: any, aData?: any): boolean {
        return LogMng.log(aMsg, NETWORK, aData);
    }

    public static warn(aMsg: any, aData?: any): boolean {
        return LogMng.log(aMsg, WARNING, aData);
    }

    public static error(aMsg: any, aData?: any): boolean {
        return LogMng.log(aMsg, ERROR, aData);
    }

}