import { Config } from "@/data/Config";
import { DeviceInfo } from "@/utils/DeviceInfo";
import { LogMng } from "@/utils/LogMng";

export class ScrollList extends Phaser.Events.EventEmitter {
    private _scene: Phaser.Scene;
    private _parent: Phaser.GameObjects.Container;
    private _dummyScroll: Phaser.GameObjects.Container;

    private dummyLinesMinX = 0;
    private dummyLinesMaxX = 0;
    private dummyLinesTargetPosX = 0;
    private isMoveToTarget = false;

    private touchLayer: Phaser.GameObjects.Graphics;
    private p1: Phaser.Input.Pointer;
    private p1down = false;
    private p1TargetPosX: number;
    private p1TargetPosY: number;
    private mouseSpdVector: Phaser.Math.Vector2;
    private prevMousePos: Phaser.Math.Vector2;

    constructor(scene, x, y, aParent: Phaser.GameObjects.Container, aDummyScroll: Phaser.GameObjects.Container) {
        super();

        this._scene = scene;
        this._parent = aParent;
        this._dummyScroll = aDummyScroll;

        const size = { w: Config.GW, h: Config.GH };

        this.touchLayer = new Phaser.GameObjects.Graphics(scene);
        this.touchLayer.fillStyle(0, 0.3);
        this.touchLayer.fillRect(-size.w / 2, -size.h / 2, size.w, size.h);
        this._scene.add.existing(this.touchLayer);

        // let hitArea = new Phaser.Geom.Rectangle(-size.w / 2, -size.h / 2, size.w, size.h);
        this.touchLayer.setInteractive({
            useHandCursor: true,
            hitArea: new Phaser.Geom.Rectangle(-size.w / 2, -size.h / 2, size.w, size.h),
            hitAreaCallback: Phaser.Geom.Rectangle.Contains
        });
        this.touchLayer.input.cursor = 'pointer';
        this.touchLayer.on('pointerdown', this.onTouchLayerInputDown, this);
        this.touchLayer.on('pointerup', this.onTouchLayerInputUp, this);

    }

    private onTouchLayerInputDown(p: Phaser.Input.Pointer, x, y) {
        if (DeviceInfo.getInstance().desktop) {
            // scroll or click
            this.p1 = p; //this._scene.game.input.mousePointer;
            this.p1TargetPosX = this._dummyScroll.x;
            this.p1TargetPosY = this._dummyScroll.y;
            this.p1down = true;
            this.prevMousePos = this.p1.position.clone();
        }
        else {
            // mobile
            // if (p == this.game.input.pointer1) {
            //     this.p1 = this.game.input.pointer1;
            //     this.p1TargetPosX = this._dummyScroll.x;
            //     this.p1down = true;
            //     this.prevMousePos = this.p1.position.clone();
            // }
        }
    }

    private onTouchLayerInputUp(p: Phaser.Input.Pointer, x, y) {
        if (DeviceInfo.getInstance().desktop) {
            // DESKTOP
            // is it click?
            let clickDist = 10;
            let pDown = new Phaser.Math.Vector2(this.p1.downX, this.p1.downY);
            let pUp = new Phaser.Math.Vector2(x, y);
            let dist = pDown.distance(pUp);
            //LogMng.debug('dist = ' + dist);
            let isClick = dist <= clickDist;

            if (isClick) {
                LogMng.debug('It is click!');
                let cli_x = pUp.x;
                let cli_y = pUp.y;
                // this.onListClick(cli_x, cli_y);
            }
            else {
                //this.checkScrollOutOfBorders(false, 100);
            }
            this.p1down = false;
            this.p1 = null;
        }
        else {
            // MOBILE
            // if (p == this.game.input.pointer1) {
            //     // check for tap to cell
            //     let clickDist = 10;
            //     let dist = this.p1.positionDown.distance(this.p1.positionUp, true);
            //     //LogMng.debug('dist = ' + dist);
            //     let isClick = dist <= clickDist;

            //     if (isClick) {
            //         LogMng.debug('It is tap!');
            //         let cli_x = this.p1.positionUp.x;
            //         let cli_y = this.p1.positionUp.y;
            //         this.onListClick(cli_x, cli_y);
            //     }
            //     else {
            //         //this.checkScrollOutOfBorders(false, 100);
            //     }
            //     this.p1down = false;
            //     this.p1 = null;
            // }
        }
    }

    private updatePanelDrag(dt: number) {
        // mouse\touch scroll and mobile scale
        var inertMinVal = 0.1;

        if (this.p1down) {

            let pDown = new Phaser.Math.Vector2(this.p1.downX, this.p1.downY);
            // let pUp = new Phaser.Math.Vector2(x, y);

            this.isMoveToTarget = false;
            // touch\mouse scroll
            let p0 = pDown.clone();
            let p = this.p1.position.clone();
            this.mouseSpdVector = p.clone().subtract(this.prevMousePos);
            this.prevMousePos = p.clone();
            p.subtract(p0);
            // by x
            // let dx = this.p1TargetPosX + p.x;
            // this._dummyScroll.x = dx;
            // by y
            let dy = this.p1TargetPosY + p.y;
            this._dummyScroll.y = dy;

        }
        else {

            if (this._dummyScroll.x > this.dummyLinesMaxX) {
                if (Math.abs(this._dummyScroll.x - this.dummyLinesMaxX) > inertMinVal) {
                    this._dummyScroll.x = this._dummyScroll.x + (this.dummyLinesMaxX - this._dummyScroll.x) / 4;
                }
                else {
                    this._dummyScroll.x = this.dummyLinesMaxX;
                }
                this.mouseSpdVector.x = 0;
                this.mouseSpdVector.y = 0;
            }
            else if (this._dummyScroll.x < this.dummyLinesMinX) {
                if (Math.abs(this._dummyScroll.x - this.dummyLinesMinX) > inertMinVal) {
                    this._dummyScroll.x = this._dummyScroll.x + (this.dummyLinesMinX - this._dummyScroll.x) / 4;
                }
                else {
                    this._dummyScroll.x = this.dummyLinesMinX;
                }
                this.mouseSpdVector.x = 0;
                this.mouseSpdVector.y = 0;
            }
            else {
                if (this.mouseSpdVector && Math.abs(this.mouseSpdVector.x) > inertMinVal) {
                    // инерционное торможение скрола камеры
                    this.mouseSpdVector.scale(0.80);
                    let dx = this.mouseSpdVector.x;
                    let ct_x = this._dummyScroll.x;
                    if (ct_x < 0) this._dummyScroll.x += dx;
                }
            }
        }

        if (this.isMoveToTarget) {
            this.dummyLinesTargetPosX = this.dummyLinesMaxX;
            if (Math.abs(this._dummyScroll.x - this.dummyLinesTargetPosX) > inertMinVal) {
                this._dummyScroll.x = this._dummyScroll.x + (this.dummyLinesTargetPosX - this._dummyScroll.x) / 4;
            }
            else {
                this._dummyScroll.x = this.dummyLinesTargetPosX;
                this.isMoveToTarget = false;
            }
        }

    }

    update(dt: number) {
        this.updatePanelDrag(dt);
    }

}