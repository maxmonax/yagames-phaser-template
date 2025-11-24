import { LogMng } from "../utils/LogMng";
import { MyMath } from "../utils/MyMath";

// sounds
export enum SoundAlias {

    Click = 'Click',

}

// loading sounds
export const SOUND_LOAD_DATA = [

    { alias: SoundAlias.Click, file: 'click.mp3' },
    
];

export class SndMng {

    // local params
    private static musicVolume = 1;
    private static sfxVolume = 1;
    private static musics: any[] = []; // of { name: str, mus: Phaser.Sound }
    private static enabled = true;

    // global vars
    static scene: Phaser.Scene = null;

    static getMusicVolume(): number {
        return SndMng.musicVolume;
    }

    static setMusicVolume(v: number) {
        SndMng.musicVolume = v;
        for (let i = 0; i < SndMng.musics.length; i++) {
            let data = SndMng.musics[i];
            let music: any = data.mus;
            let twObj = { val: music.volume };
            SndMng.scene.tweens.add({
                targets: twObj,
                val: v,
                // targets: music,
                // volume: aVol,
                duration: 250,
                ease: Phaser.Math.Easing.Linear,
                // callbackScope: SndMng,
                onUpdate: (atr1) => {
                    // let vol = aVolFrom + (aVol - aVolFrom) * twObj.t;
                    // music.setVolume(twObj.val);
                    music.volume = twObj.val;
                }
            });
        }
    }

    static getMusic(aName: string): any {
        for (var i = 0; i < SndMng.musics.length; i++) {
            var data = SndMng.musics[i];
            if (data.name == aName)
                return data.mus;
        }
        return null;
    }

    static getSoundFileByName(aAlias: string): string {
        for (let i = 0; i < SOUND_LOAD_DATA.length; i++) {
            const element = SOUND_LOAD_DATA[i];
            if (element.alias == aAlias) return element.file;
        }
        return '';
    }

    static playMusic(aName: string, aVolFrom = 0, aVolEnd = 1, aDuration: number = 500) {
        if (!SndMng.enabled) return;
        LogMng.debug(`playMusic: ${aName}`);
        aVolEnd = SndMng.musicVolume;
        // create music
        let music: any = SndMng.scene.sound.add(aName, {
            volume: aVolFrom,
            loop: true
        });
        music.play();
        let twObj = { t: 0 };
        SndMng.scene.tweens.add({
            targets: twObj,
            t: 1,
            duration: aDuration,
            ease: Phaser.Math.Easing.Linear,
            callbackScope: SndMng,
            onUpdate: () => {
                let vol = aVolFrom + (aVolEnd - aVolFrom) * twObj.t;
                music.setVolume(vol);
            }
        });
        SndMng.musics.push({ name: aName, mus: music });
    }

    static changeMusicVol(aName: string, aVol: number, aTweenScene: Phaser.Scene, aDuration = 500) {
        aVol = SndMng.musicVolume;
        for (let i = 0; i < SndMng.musics.length; i++) {
            let data = SndMng.musics[i];
            if (data.name == aName) {
                let music: any = data.mus;
                let twObj = { val: music.volume };
                aTweenScene.tweens.add({
                    targets: twObj,
                    val: aVol,
                    // targets: music,
                    // volume: aVol,
                    duration: aDuration,
                    ease: Phaser.Math.Easing.Linear,
                    // callbackScope: SndMng,
                    onUpdate: (atr1) => {
                        // let vol = aVolFrom + (aVol - aVolFrom) * twObj.t;
                        // music.setVolume(twObj.val);
                        music.volume = twObj.val;
                    }
                });
            }
        }
    }

    static stopMusicById(id: number, aVol: number = 0, aDuration: number = 500) {
        LogMng.debug(`stopMusicById: ${id}`);
        try {
            let data = SndMng.musics[id];
            let music = data.mus;
            let volFrom = music.volume;

            let twObj = { t: 1 };
            SndMng.scene.tweens.add({
                targets: twObj,
                t: 0,
                duration: aDuration,
                ease: "Linear.None",
                callbackScope: this,
                onUpdate: () => {
                    let vol = volFrom * twObj.t;
                    music.setVolume(vol);
                },
                onComplete: () => {
                    music.stop();
                    SndMng.musics.splice(id, 1);
                }
            });
        } catch (e) {
            LogMng.error('SndMng.stopMusicById: ' + e);
        }
    }

    static stopMusicByName(aName: string, aVol: number = 0, aDuration: number = 500) {
        LogMng.debug(`stopMusicByName: ${aName}`);
        for (let i = SndMng.musics.length - 1; i >= 0; i--) {
            let data = SndMng.musics[i];
            if (data.name == aName) {
                SndMng.stopMusicById(i, aVol, aDuration);
            }
        }
    }

    static stopAllMusic(aVol: number = 0, aDuration: number = 500) {
        for (var i = SndMng.musics.length - 1; i >= 0; i--) {
            SndMng.stopMusicById(i);
        }
    }

    static setEnabled(aEnabled: boolean) {
        SndMng.enabled = aEnabled;
        if (SndMng.enabled) {
            //fadeInMusic();
        }
        else {
            SndMng.stopAllMusic();
        }
    }

    static getEnabled(): boolean {
        return SndMng.enabled;
    }

    static setVolume(): boolean {
        return SndMng.enabled;
    }

    static sfxPlay(aName: string, aVol = 1, aDelay = 0): any {
        if (!SndMng.enabled) return;
        var snd = SndMng.scene.sound.add(aName, {
            volume: aVol
        });
        if (aDelay > 0) {
            setTimeout(() => {
                snd.play();
            }, aDelay);
        }
        else {
            snd.play();
        }
        return snd;
    }

    static playRandomSfx(aNames: string[], aVol = 1): any {
        if (!SndMng.enabled) return;
        let name = aNames[MyMath.randomIntInRange(0, aNames.length - 1)];
        // let snd = game.add.audio(name, aVol);
        // snd.play();
        return null;
    }

    static getPageSoundAlias(aPageId: number): string {
        return 'page_audio_' + aPageId;
    }

    static update(dt: number) {

    }

}