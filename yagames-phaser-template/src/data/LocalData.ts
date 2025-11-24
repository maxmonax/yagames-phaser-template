
enum Fields {
    inputByKeys = 'NB_inputByKeys',
    records = 'NB_records'
}

export class LocalData {
    
    private static instance: LocalData = null;
    // data cache
    private _inputBySides = false;
    private _records = 0;

    private constructor() {
        this._inputBySides = this.readInputByKeys();
        this._records = this.readRecords();
    }

    private readInputByKeys(): boolean {
        let val = localStorage.getItem(Fields.inputByKeys);
        return val == '1';
    }

    private readRecords(): number {
        let val = localStorage.getItem(Fields.records) || '0';
        return Number(val);
    }

    static getInstance(): LocalData {
        if (!LocalData.instance) LocalData.instance = new LocalData();
        return LocalData.instance;
    }

    public set inputBySides(v: boolean) {
        this._inputBySides = v;
        let val = v ? '1' : '0';
        localStorage.setItem(Fields.inputByKeys, val);
    }

    public get inputBySides(): boolean {
        return this._inputBySides;
    }
    
    public set recordScores(v: number) {
        this._records = v;
        let val = String(v);
        localStorage.setItem(Fields.records, val);
    }

    public get recordScores(): number {
        return this._records;
    }
    

}