
/**
 * Events from front page
 * How to use: GameEvents.getInstance().addListener(GameEvents.ON_WINDOW_RESIZE, () => {}, this);
 */
export class FrontEvents extends Phaser.Events.EventEmitter {
    private static instance: FrontEvents;

    // events
    static readonly EVENT_WINDOW_RESIZE = 'EVENT_WINDOW_RESIZE';

    private constructor() {
        super();
    }

    static getInstance(): FrontEvents {
        if (!FrontEvents.instance) FrontEvents.instance = new FrontEvents();
        return FrontEvents.instance;
    }

}