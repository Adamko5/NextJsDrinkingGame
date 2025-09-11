export interface DialogueLine {
    text?: string;
    characterImage?: string;
    imageSize?: { width: number; height: number } // in percentages
    durationMs?: number;
    position?: { x: number; y: number } // Character image, in percentages
    textPosition?: { x: number; y: number } // Text, relative to the image, in percentages
    textColor?: string;
    textBackgroundColor?: string;
    animateInText?: boolean;
    animateInImage?: boolean;
    textSize?: number; // in pixels
}

export interface Dialogue {
    dialogueLines: DialogueLine[];
    keepLastDisplayed?: boolean;
}

const textSizes = {
    small: 16,
    medium: 20,
    large: 24,
    xlarge: 28,
    xxlarge: 32,
    huge: 40,
    massive: 48,
}

const colors = {
    red: 'red',
    red_slightly_dark: '#eb1b1bff',
    blue: 'blue',
    green: 'green',
    yellow: 'yellow',
    white: 'white',
    black: 'black',
    gray: 'gray',
    darkGray: '#333',
    lightGray: '#ccc',
}

// DrunkWizardSplittingPathDialogueCommon provides shared defaults that are spread into each DialogueLine
const DrunkWizardSplittingPathDialogueCommon: DialogueLine = {
    textPosition: { x: 0, y: 0 },
    characterImage: 'characters/misc/drunk_wizard_1.png',
    animateInText: true,
    textSize: textSizes.xlarge,
};
export const DrunkWizardSplittingPathDialogue: Dialogue = {
    dialogueLines: [
        {
            ...DrunkWizardSplittingPathDialogueCommon,
            imageSize: { width: 50, height: 50 },
            position: { x: 45, y: 65 },
            text: '"I know what you\'re thinking..."',
            durationMs: 3000,
            animateInImage: true,
        },
        {
            ...DrunkWizardSplittingPathDialogueCommon,
            imageSize: { width: 51, height: 51 },
            position: { x: 46, y: 66 },
            text: '"You want to know if this path leads out of the forest."',
            durationMs: 5000,
        },
        {
            ...DrunkWizardSplittingPathDialogueCommon,
            imageSize: { width: 52, height: 52 },
            position: { x: 47, y: 67 },
            text: '"I will tell you, but on one condition!"',
            durationMs: 4000,
        },
        {
            ...DrunkWizardSplittingPathDialogueCommon,
            imageSize: { width: 53, height: 53 },
            position: { x: 48, y: 68 },
            text: '"WE MUST HAVE A DRINK TOGETHER!"',
            textSize: textSizes.xxlarge,
            textColor: colors.red_slightly_dark,
            durationMs: 5000,
        }
    ],
    keepLastDisplayed: true
};

const DrunkWizardSplittingPathDialogue2Common: DialogueLine = {
    textPosition: { x: 0, y: 0 },
    characterImage: 'characters/misc/DrunkWizardSplittingPath2.png',
    animateInText: true,
    textSize: textSizes.xlarge,
    imageSize: { width: 35, height: 35 },
    position: { x: 30, y: 54 },
};
export const DrunkWizardSplittingPathDialogue2: Dialogue = {
    dialogueLines: [
        {
            ...DrunkWizardSplittingPathDialogue2Common,
            text: '"Ahahah... Thank you... I needed that!"',
            durationMs: 3000,
            animateInImage: true,
        },
        {
            ...DrunkWizardSplittingPathDialogue2Common,
            text: '"You ARE on the right path."',
            durationMs: 4000,
        },
        {
            ...DrunkWizardSplittingPathDialogue2Common,
            text: '"I have to warn you though..."',
            durationMs: 4000,
        },
        {
            ...DrunkWizardSplittingPathDialogue2Common,
            text: '"That witch... is very deceptive."',
            durationMs: 4000,
        },
    ],
    keepLastDisplayed: true
};

const WitchitaDeceptia1DialogueCommon: DialogueLine = {
    textPosition: { x: 0, y: 0 },
    characterImage: 'characters/witchita_deceptia/WitchitaDeceptia.png',
    animateInText: true,
    textSize: textSizes.large,
    imageSize: { width: 35, height: 35 },
    position: { x: 30, y: 54 },
};
export const WitchitaDeceptia1Dialogue: Dialogue = {
    dialogueLines: [
        {
            ...WitchitaDeceptia1DialogueCommon,
            text: '"Ooooh, who do we have here?"',
            durationMs: 3000,
            animateInImage: true,
            imageSize: { width: 15, height: 15 },
            position: { x: 50, y: 50 },
            textSize: textSizes.small,
            textPosition: { x: -1, y: -7 },
        },
        {
            ...WitchitaDeceptia1DialogueCommon,
            text: '"My name is Witchita Deceptia!"',
            durationMs: 5000,
            animateInImage: true,
            imageSize: { width: 20, height: 20 },
            position: { x: 50, y: 50 },
            textSize: textSizes.xxlarge,
            textPosition: { x: -1, y: -8 },
            textColor: colors.red_slightly_dark,
        },
        {
            ...WitchitaDeceptia1DialogueCommon,
            text: '"You look strong... have you come to challenge me?"',
            durationMs: 5000,
            imageSize: { width: 25, height: 25 },
            position: { x: 50, y: 50 },
            textSize: textSizes.medium,
            textPosition: { x: -1, y: -10 },
        },
        {
            ...WitchitaDeceptia1DialogueCommon,
            text: '"You will have to beat me, by combining alcoholic attacks!"',
            durationMs: 5000,
            imageSize: { width: 30, height: 30 },
            position: { x: 50, y: 50 },
            textSize: textSizes.large,
            textPosition: { x: -1, y: -12 },
        },
        {
            ...WitchitaDeceptia1DialogueCommon,
            text: '"Pick the strongest among you..."',
            durationMs: 4000,
            imageSize: { width: 35, height: 35 },
            position: { x: 50, y: 50 },
            textSize: textSizes.xlarge,
            textPosition: { x: -2, y: -15 },
        },
        {
            ...WitchitaDeceptia1DialogueCommon,
            text: '"TO FACE ME!"',
            durationMs: 4000,
            imageSize: { width: 45, height: 45 },
            position: { x: 50, y: 50 },
            textColor: colors.red_slightly_dark,
            textSize: textSizes.massive,
            textPosition: { x: -2, y: 0 },
        },
    ],
    keepLastDisplayed: true
};