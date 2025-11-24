import { MyMath } from "./MyMath";

export class InterpolationUtils {

    /**
     * Calculates the Bernstein basis from the three factorial coefficients.
     * @param {number} n - The first value.
     * @param {number} i - The second value.
     *
     * @return {number} The Bernstein basis of Factorial(n) / Factorial(i) / Factorial(n - i)
     */
    static bernstein(n, i) {
        return MyMath.factorial(n) / MyMath.factorial(i) / MyMath.factorial(n - i);
    };

    /**
     * Linear Interpolation
     * @param a - Start value
     * @param b - Finish value
     * @param t - time in [0..1]
     * @returns Result value between [a..b] by time
     */
    public static linear(a: number, b: number, t: number): number {
        return a + (b - a) * t;
    }

    /**
    * Bezier interpolation method.
    * @param {number[]} v - The input array of values to interpolate between.
    * @param {number} k - The percentage of interpolation, between 0 and 1.
    *
    * @return {number} The interpolated value.
    */
    public static bezier(v: number[], k: number) {
        var b = 0;
        var n = v.length - 1;
        for (var i = 0; i <= n; i++) {
            b += Math.pow(1 - k, n - i) * Math.pow(k, i) * v[i] * this.bernstein(n, i);
        }
        return b;
    }

}


export class MySpline {
    private _points: { val, t }[];
    private _interpolateFunc: Function;

    constructor(aInterpolateFunc?: Function) {
        this._points = [];
        if (aInterpolateFunc) {
            this._interpolateFunc = aInterpolateFunc;
        }
        else {
            this._interpolateFunc = InterpolationUtils.linear;
        }
    }

    addPoint(val, t: number) {
        this._points.push({ val: val, t: t });
    }

    get(t: number) {

        let id1 = 0;

        for (let i = 0; i < this._points.length; i++) {
            id1 = i;
            if (this._points[i].t >= t) break;

        }

        let id2 = id1;

        for (let i = this._points.length - 1; i >= 0; i--) {
            id2 = i;
            if (this._points[i].t <= t) break;
        }

        if (id1 == id2) {
            return this._points[id1].val;
        }

        // example:
        // [ 0.1, 0.3, 0.5, 0.8 ]
        // t = 0.05
        // id1 = 0, id2 = 0
        // t = 0.5
        // id1 = 2, id2 = 2

        return this._interpolateFunc(
            this._points[id1].val,
            this._points[id2].val,
            (t - this._points[id1].t) / (this._points[id2].t - this._points[id1].t)
        );

    }

}