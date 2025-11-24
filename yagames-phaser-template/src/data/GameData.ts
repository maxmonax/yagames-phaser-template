
const ANEKDOTS = [
    // 1
    {
        text: `
    — Мам, смотри голубь! У тебя есть хлеб?
    — Без хлеба ешь!
        `
    },
    {
        text: `
        Кинолог пришел в гости в семью, где родилась недавно тройня, долго смотрел на малышей и сказал, показав пальцем:
        - Я думаю, оставить надо этого.
        `
    },
    {
        text: `
    - Папа, я хочу быть патологоанатом.
    - Только чеpез мой труп!
        `
    },
    {
        text: `
        Винни-Пух приходит в гости к Пятачку и видит у него на стене схему разделки туши. Изумленный, спрашивает:
        — Пятачок, что это?
        — Мой портрет, — отвечает Пятачок.
        — Странный какой-то.
        — Художник… Он так видит.
        `
    },
    {
        text: `
        Мужик похоронил тёщу, только зарыли, ему птичка на плечо, хоп, какнула.
        Он поднимает голову и говорит,
        - Мама, вы уже там?
        `
    },
    // 5
    {
        text: `
        Сидит маньяк (М) у психиатра (П) на приёме.
        (П) Отгадайте загадку:
        “Два кольца два конца, а по середине гвоздик?”
        (М) подумал и говорит: "В очки студента вбили гвоздь."
        - (П) Нет, ножницы!
        - (М) Ножницы вбили?! Обалдеть.
        `
    },
]

export class GameData extends Phaser.Events.EventEmitter {

    private static instance: GameData = null;

    private constructor() {
        super();
    }

    static getInstance(aLang?: string): GameData {
        if (!GameData.instance) {
            GameData.instance = new GameData();
        }
        return GameData.instance;
    }

    getAnekdotId(): number {
        let num = localStorage.getItem('anekdotNum') || '0';
        return Number(num);
    }

    setAnekdotId(v: number) {
        localStorage.setItem('anekdotNum', v.toFixed(0));
    }

    getAnekdotCount(): number {
        return ANEKDOTS.length;
    }

    getAnektod(aNumber: number): any {
        while (aNumber > ANEKDOTS.length) aNumber -= ANEKDOTS.length;
        let data = ANEKDOTS[aNumber - 1];
        if (!data) return null;
        return data.text;
    }

}