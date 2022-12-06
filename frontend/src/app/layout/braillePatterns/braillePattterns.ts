export interface BraillePatternLine {
    name: string;
    position?: number;
    pictureUrl?: string;
    audioUrl: string;
    blogContentUrl?: string;
}

export const BraillePatternLines: BraillePatternLine[] = [
    {
        position: 1,
        name: 'Tow truck',
        blogContentUrl: 'https://www.pathstoliteracy.org/strategies/tow-truck-braille-design',
        pictureUrl: 'assets/pattern-images/braille_tow_truck.png',
        audioUrl: 'https://youtu.be/qRyK6Dqu6-c',
    },
    {
        position: 1,
        name: `Valentine's heart`,
        blogContentUrl: 'https://www.pathstoliteracy.org/strategies/braille-designs-valentines-day',
        pictureUrl: 'assets/pattern-images/ValentineHeart.png',
        audioUrl: 'https://youtu.be/_zZO-N4Qsj8',
    },
    {
        position: 1,
        name: `Santa Claus`,
        blogContentUrl: 'https://www.pathstoliteracy.org/strategies/braille-designs-christmas',
        pictureUrl: 'assets/pattern-images/braille_santa.png',
        audioUrl: 'https://youtu.be/UTI7h2HeuFI',
    },
    {
        position: 1,
        name: `Hello Kitty with Santa hat`,
        blogContentUrl: 'https://www.pathstoliteracy.org/strategies/braille-design-hello-kitty',
        pictureUrl: 'assets/pattern-images/hello_kitty_braille_design.png',
        audioUrl: 'https://youtu.be/5srLaZP7q8s',
    },
    {
        position: 1,
        name: `Flower in pot`,
        blogContentUrl: 'https://www.pathstoliteracy.org/strategies/braille-designs-spring',
        pictureUrl: 'assets/pattern-images/Flowerpot.png',
        audioUrl: 'https://youtu.be/e3czv4-QUKg',
    },
];
