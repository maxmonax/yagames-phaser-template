import { UAParser } from "ua-parser-js";

export class DeviceInfo {
    private static instance: DeviceInfo = null;
    private parserResult: UAParser.IResult;
    // desktop or mobile
    private _desktop = false;

    private constructor() {
        this.parserResult = new UAParser().getResult();
        let devTypes = ['console', 'mobile', 'tablet', 'smarttv', 'wearable', 'embedded'];
        this._desktop = devTypes.indexOf(this.parserResult.device.type) < 0;
    }

    static getInstance(): DeviceInfo {
        if (!DeviceInfo.instance) {
            DeviceInfo.instance = new DeviceInfo();
        }
        return DeviceInfo.instance;
    }

    public get desktop(): boolean {
        return this._desktop;
    }

    /**
     * is iOS?
     */
    public get iOS(): boolean {
        return this.parserResult.os.name == 'iOS';
    }

    /**
     * is Android
     */
    public get android(): boolean {
        return this.parserResult.os.name.indexOf('Android') >= 0;
    }

    public get safari(): boolean {
        return this.parserResult.browser.name == 'Safari';
    }

    public get devicePixelRatio(): number {
        return window.devicePixelRatio || 1;
    }


}