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
        pictureUrl: 'https://www.pathstoliteracy.org/sites/pathstoliteracy.perkinsdev1.org/files/uploaded-images/braille_tow_truck.png',
        audioUrl: 'https://youtu.be/qRyK6Dqu6-c',
    },
    {
        position: 1,
        name: `Valentine's heart`,
        blogContentUrl: 'https://www.pathstoliteracy.org/strategies/braille-designs-valentines-day',
        pictureUrl: 'https://www.pathstoliteracy.org/sites/pathstoliteracy.perkinsdev1.org/files/ValentineHeart.png',
        audioUrl: 'https://www.youtube.com',
    },
    {
        position: 1,
        name: `Santa Claus`,
        blogContentUrl: 'https://www.pathstoliteracy.org/strategies/braille-designs-christmas',
        pictureUrl: 'https://www.pathstoliteracy.org/sites/pathstoliteracy.perkinsdev1.org/files/braille_santa.png',
        audioUrl: 'https://www.youtube.com',
    },
    {
        position: 1,
        name: `Hello Kitty with Santa hat`,
        blogContentUrl: 'https://www.pathstoliteracy.org/strategies/braille-design-hello-kitty',
        pictureUrl: 'https://www.pathstoliteracy.org/sites/pathstoliteracy.perkinsdev1.org/files/uploaded-images/hello_kitty_braille_design.png',
        audioUrl: 'https://www.youtube.com',
    },
    {
        position: 1,
        name: `Flower in pot`,
        blogContentUrl: 'https://www.pathstoliteracy.org/strategies/braille-designs-spring',
        pictureUrl: 'https://www.pathstoliteracy.org/sites/pathstoliteracy.perkinsdev1.org/files/Flowerpot.png',
        audioUrl: 'https://www.youtube.com',
    },
];
