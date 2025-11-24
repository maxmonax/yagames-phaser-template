
export class EaseUtils {

    static In = 'In';
    static Out = 'Out';
    static inOut = 'inOut';


    // Sine

    public static easeInSine(x: number): number {
        return 1 - Math.cos((x * Math.PI) / 2);
    }

    public static easeOutSine(x: number): number {
        return Math.sin((x * Math.PI) / 2);
    }

    public static easeInOutSine(x: number): number {
        return -(Math.cos(Math.PI * x) - 1) / 2;
    }

    public static easeSine(x: number, aEase = EaseUtils.inOut): number {
        switch (aEase) {
            case EaseUtils.In: return this.easeInSine(x);
            case EaseUtils.Out: return this.easeOutSine(x);
            default: return this.easeInOutSine(x);
        }
    }


    // Quad

    public static easeInQuad(x: number): number {
        return x * x;
    }

    public static easeOutQuad(x: number): number {
        return 1 - (1 - x) * (1 - x);
    }

    public static easeInOutQuad(x: number): number {
        return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
    }

    public static easeQuad(x: number, aEase = EaseUtils.inOut): number {
        switch (aEase) {
            case EaseUtils.In: return this.easeInQuad(x);
            case EaseUtils.Out: return this.easeOutQuad(x);
            default: return this.easeInOutQuad(x);
        }
    }


    // Cubic

    public static easeInCubic(x: number): number {
        return x * x * x;
    }

    public static easeOutCubic(x: number): number {
        return 1 - Math.pow(1 - x, 3);
    }

    public static easeInOutCubic(x: number): number {
        return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    }

    public static easeCubic(x: number, aEase = EaseUtils.inOut): number {
        switch (aEase) {
            case EaseUtils.In: return this.easeInCubic(x);
            case EaseUtils.Out: return this.easeOutCubic(x);
            default: return this.easeInOutCubic(x);
        }
    }

    // Quart

    public static easeInQuart(x: number): number {
        return x * x * x * x;
    }

    public static easeOutQuart(x: number): number {
        return 1 - Math.pow(1 - x, 4);
    }

    public static easeInOutQuart(x: number): number {
        return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
    }

    public static easeQuart(x: number, aEase = EaseUtils.inOut): number {
        switch (aEase) {
            case EaseUtils.In: return this.easeInQuart(x);
            case EaseUtils.Out: return this.easeOutQuart(x);
            default: return this.easeInOutQuart(x);
        }
    }

    // Quint

    public static easeInQuint(x: number): number {
        return x * x * x * x * x;
    }

    public static easeOutQuint(x: number): number {
        return 1 - Math.pow(1 - x, 5);
    }

    public static easeInOutQuint(x: number): number {
        return x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;
    }

    public static easeQuint(x: number, aEase = EaseUtils.inOut): number {
        switch (aEase) {
            case EaseUtils.In: return this.easeInQuint(x);
            case EaseUtils.Out: return this.easeOutQuint(x);
            default: return this.easeInOutQuint(x);
        }
    }

    // Expo

    public static easeInExpo(x: number): number {
        return x === 0 ? 0 : Math.pow(2, 10 * x - 10);
    }

    public static easeOutExpo(x: number): number {
        return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
    }

    public static easeInOutExpo(x: number): number {
        return x === 0
            ? 0
            : x === 1
                ? 1
                : x < 0.5
                    ? Math.pow(2, 20 * x - 10) / 2
                    : (2 - Math.pow(2, -20 * x + 10)) / 2;
    }

    public static easeExpo(x: number, aEase = EaseUtils.inOut): number {
        switch (aEase) {
            case EaseUtils.In: return this.easeInExpo(x);
            case EaseUtils.Out: return this.easeOutExpo(x);
            default: return this.easeInOutExpo(x);
        }
    }

    // Circ

    public static easeInCirc(x: number): number {
        return 1 - Math.sqrt(1 - Math.pow(x, 2));
    }

    public static easeOutCirc(x: number): number {
        return Math.sqrt(1 - Math.pow(x - 1, 2));
    }

    public static easeInOutCirc(x: number): number {
        return x < 0.5
            ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2
            : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2;
    }

    public static easeCirc(x: number, aEase = EaseUtils.inOut): number {
        switch (aEase) {
            case EaseUtils.In: return this.easeInCirc(x);
            case EaseUtils.Out: return this.easeOutCirc(x);
            default: return this.easeInOutCirc(x);
        }
    }

    // Back

    public static easeInBack(x: number): number {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return c3 * x * x * x - c1 * x * x;
    }

    public static easeOutBack(x: number): number {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
    }

    public static easeInOutBack(x: number): number {
        const c1 = 1.70158;
        const c2 = c1 * 1.525;
        return x < 0.5
            ? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
            : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
    }

    public static easeBack(x: number, aEase = EaseUtils.inOut): number {
        switch (aEase) {
            case EaseUtils.In: return this.easeInBack(x);
            case EaseUtils.Out: return this.easeOutBack(x);
            default: return this.easeInOutBack(x);
        }
    }

    // Elastic

    public static easeInElastic(x: number): number {
        const c4 = (2 * Math.PI) / 3;
        return x === 0
            ? 0
            : x === 1
                ? 1
                : -Math.pow(2, 10 * x - 10) * Math.sin((x * 10 - 10.75) * c4);
    }

    public static easeOutElastic(x: number): number {
        const c4 = (2 * Math.PI) / 3;
        return x === 0
            ? 0
            : x === 1
                ? 1
                : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
    }

    public static easeInOutElastic(x: number): number {
        const c5 = (2 * Math.PI) / 4.5;
        return x === 0
            ? 0
            : x === 1
                ? 1
                : x < 0.5
                    ? -(Math.pow(2, 20 * x - 10) * Math.sin((20 * x - 11.125) * c5)) / 2
                    : (Math.pow(2, -20 * x + 10) * Math.sin((20 * x - 11.125) * c5)) / 2 + 1;
    }

    public static easeElastic(x: number, aEase = EaseUtils.inOut): number {
        switch (aEase) {
            case EaseUtils.In: return this.easeInElastic(x);
            case EaseUtils.Out: return this.easeOutElastic(x);
            default: return this.easeInOutElastic(x);
        }
    }

    // Bounce

    public static easeInBounce(x: number): number {
        return 1 - this.easeOutBounce(1 - x);
    }

    public static easeOutBounce(x: number): number {
        const n1 = 7.5625;
        const d1 = 2.75;

        if (x < 1 / d1) {
            return n1 * x * x;
        } else if (x < 2 / d1) {
            return n1 * (x -= 1.5 / d1) * x + 0.75;
        } else if (x < 2.5 / d1) {
            return n1 * (x -= 2.25 / d1) * x + 0.9375;
        } else {
            return n1 * (x -= 2.625 / d1) * x + 0.984375;
        }
    }

    public static easeInOutBounce(x: number): number {
        return x < 0.5
            ? (1 - this.easeOutBounce(1 - 2 * x)) / 2
            : (1 + this.easeOutBounce(2 * x - 1)) / 2;
    }

    public static easeBounce(x: number, aEase = EaseUtils.inOut): number {
        switch (aEase) {
            case EaseUtils.In: return this.easeInBounce(x);
            case EaseUtils.Out: return this.easeOutBounce(x);
            default: return this.easeInOutBounce(x);
        }
    }

}