export interface DialogueLine {
    text: string;
    characterImage?: string;
    imageSize?: { width: number; height: number } // in percentages
    durationMs?: number;
    position?: { x: number; y: number } // Character image, in percentages
    textPosition?: { x: number; y: number } // Text, relative to the image, in percentages
    textColor?: string;
    textBackgroundColor?: string;
    animateIn?: boolean;
}

export interface Dialogue {
    dialogueLines: DialogueLine[];
    characterImage?: string;
    imageSize?: { width: number; height: number } // in percentages
    durationMs?: number;
    position?: { x: number; y: number } // Character image, in percentages
    textPosition?: { x: number; y: number } // Text, relative to the image, in percentages
    textColor?: string;
    textBackgroundColor?: string;
    animateIn?: boolean;
}

export const DrunkWizardSplittingPathDialogue: Dialogue = {
    position: { x: 50, y: 70 },
    imageSize: { width: 55, height: 55 },
    textPosition: { x: 0, y: 0 },
    characterImage: 'characters/misc/drunk_wizard_1.png',
    animateIn: true,
    dialogueLines: [
        {
            imageSize: { width: 50, height: 50 },
            position: { x: 45, y: 65 },
            text: '"Ah, a weary traveler! Care to join me for a drink?"',
            durationMs: 4000,
            animateIn: true,
        }
    ]
};

