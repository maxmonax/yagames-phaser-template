import { Params } from "@/data/Params";

export class StatsPlugin extends Phaser.Plugins.ScenePlugin {
  stats: Stats;

  boot() {
    if (!Params.isDebugMode) return;
    
    this.stats = new Stats();
    document.body.appendChild(this.stats.dom);

    this.systems.events.on('preupdate', () => this.stats.begin());
    this.systems.events.on('postupdate', () => this.stats.end());
  }
}