
export class ScaleManager {
    private static isDesktop = false;
    // game maximum size
    private static game_w: number;
    private static game_h: number;
    // game save area size
    private static game_sw: number;
    private static game_sh: number;

    // delta values container position from left and top of the page
    public static dtx: number = 0;
    public static dty: number = 0;

    // true current game view size
    public static gameViewW = 0;
    public static gameViewH = 0;

    // true current game scale
    public static gameScale = 1;

    // orientation
    public static isPortrait: boolean;
    //public static onOrientationChange: Phaser.Signal = new Phaser.Signal(); // orientation change event

    public static init(GW: number, GH: number, GSW: number, GSH: number) {
        this.game_w = GW;
        this.game_h = GH;
        this.game_sw = GSW;
        this.game_sh = GSH;

        //ScaleManager.SizeCalculation();

        // window.onresize = () => {
        //   ScaleManager.SizeCalculation();
        // };
    }

    private static doEventOriChange() {
        //this.onOrientationChange.dispatch(this.isPortrait);
    }

    public static SizeCalculation(aCamera: Phaser.Cameras.Scene2D.Camera) {
        var wnd = {
            w: window.innerWidth,
            h: window.innerHeight
        };

        // orientation
        var oldOri = this.isPortrait;
        this.isPortrait = wnd.h > wnd.w;

        // determine game size
        var g = {
            w: ScaleManager.game_w,
            h: ScaleManager.game_h,
            sw: ScaleManager.game_sw,
            sh: ScaleManager.game_sh
        }

        var gw: number;
        var gh: number;

        if (g.h / g.w > wnd.h / wnd.w) {
            // game compressed by HEIGHT, black borders on the LEFT and the RIGHT
            if (g.sh / g.w > wnd.h / wnd.w) {
                // A
                gh = wnd.h * g.h / g.sh;
                gw = gh * g.w / g.h;
            } else {
                // B
                gw = wnd.w;
                gh = gw * g.h / g.w;
            }
        } else {
            // game compressed by WIDTH, black borders on the TOP and the BOT
            if (g.h / g.sw > wnd.h / wnd.w) {
                // C
                gh = wnd.h;
                gw = gh * g.w / g.h;
            } else {
                // D
                gw = wnd.w * g.w / g.sw;
                gh = gw * g.h / g.w;
            }
        }

        // game scale
        var scale_x = gw / g.w;
        var scale_y = gh / g.h;
        this.gameScale = Math.min(scale_x, scale_y);
        //ScaleManager.game.scale.setUserScale(this.gameScale, this.gameScale, 0, 0);
        
        // game dt xy
        this.dtx = (wnd.w - gw) / 2;
        this.dty = (wnd.h - gh) / 2;

        this.gameViewW = this.game_w + 2 * this.dtx / this.gameScale;
        if (this.gameViewW > this.game_w) this.gameViewW = this.game_w;

        this.gameViewH = this.game_h + 2 * this.dty / this.gameScale;
        if (this.gameViewH > this.game_h) this.gameViewH = this.game_h;

        //this.dom.style.maxWidth = String(gw) + 'px';
        //this.dom.style.maxHeight = String(gh) + 'px';

        let vpx = Math.max(0, -1 * (wnd.w - this.gameViewW));
        let vpy = Math.max(0, wnd.h - this.gameViewH);
        let vpw = this.gameViewW;
        let vph = this.gameViewH;

        console.log({
            wnd: wnd,
            game: g,
            gw: gw,
            gh: gh,
            dtx: this.dtx,
            dty: this.dty,
            gViewW: this.gameViewW,
            gViewH: this.gameViewH,
            vpx: vpx,
        });
        
        
        aCamera.setViewport(100, 0, vpw, vph);

        //ScaleManager.game.scale.refresh();

        // ROTATION ICON UPDATE
        this.updateRotationIcon();

        if (this.isPortrait != oldOri) {
            this.doEventOriChange();
        }
    }

    private static isRotationLockState(): boolean {
        //if (!Config.isLockOrientation) return false;
        //if (Config.lockOrientationMobileOnly && this.isDesktop) return false;
        //if (Config.lockOrientationLand && this.isPortrait) return true;
        //if (!Config.lockOrientationLand && !this.isPortrait) return true;
        return false;
    }

    private static updateRotationIcon() {

        var isLockState = this.isRotationLockState();

        if (isLockState) {

            //   if (Config.lockOrientationLand) {
            //     this.dom.style.marginTop = '0px';
            //     this.dom.style.marginLeft = Math.round(this.dtx).toString() + 'px';
            //   }
            //   else {
            //     this.dom.style.marginTop = Math.round(this.dty).toString() + 'px';
            //     this.dom.style.marginLeft = '0px';
            //   }

            this.showRotateIcon();

        }
        else {

            //   this.dom.style.marginTop = Math.round(this.dty).toString() + 'px';
            //   this.dom.style.marginLeft = Math.round(this.dtx).toString() + 'px';

            this.hideRotateIcon();
            return;

        }

        // image padding, sizing

        var wnd = {
            w: window.innerWidth,
            h: window.innerHeight
        };

        // var rp_div = document.getElementById("rp-div");
        // var rp_img = document.getElementById("rp-img");
        // var com_h = this.dom.clientHeight + rp_div.clientHeight;

        // var imgMaxPercent = 24;

        // if (Config.lockOrientationLand) {

        //   imgMaxPercent = 20;
        //   rp_img.style.width = rp_img.style.height = String(imgMaxPercent) + '%';

        //   this.dom.style['float'] = 'left';
        //   rp_div.style.display = 'fixed';
        //   rp_div.style.paddingTop = ((wnd.h - rp_img.clientHeight) / 2) + 'px';

        // }
        // else {

        //   imgMaxPercent = 20;
        //   rp_img.style.width = rp_img.style.height = String(imgMaxPercent) + '%';

        //   //this.dom.style.display = 'inline-block';
        //   this.dom.style['float'] = 'left';
        //   rp_div.style.display = 'fixed';
        //   //rp_div.style.paddingLeft = (this.dom.clientWidth + 20) + 'px';
        //   rp_div.style.paddingTop = ((wnd.h - rp_img.clientHeight) / 2) + 'px';

        // }

    }

    private static showRotateIcon() {
        // document.getElementById("rp-div").style.display = "block";
        // if u need a game pause then rotation block, uncomment this
        //ScaleManager.game.world.isPaused = true;
    }

    private static hideRotateIcon() {
        // document.getElementById("rp-div").style.display = "none";
        //ScaleManager.game.world.isPaused = false;
    }

}

