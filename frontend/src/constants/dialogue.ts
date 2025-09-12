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
    animateInImage?: boolean; // TODO currently does nothing
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
    textPosition: { x: 0, y: 10 },
    characterImage: 'characters/misc/drunk_wizard_1.png',
    animateInText: true,
    textSize: textSizes.xlarge,
};
export const DrunkWizardSplittingPathDialogue: Dialogue = {
    dialogueLines: [
        {
            ...DrunkWizardSplittingPathDialogueCommon,
            imageSize: { width: 40, height: 40 },
            position: { x: 80, y: 65 },
            text: '"I know what you\'re thinking..."',
            durationMs: 3000,
            animateInImage: true,
        },
        {
            ...DrunkWizardSplittingPathDialogueCommon,
            imageSize: { width: 50, height: 50 },
            position: { x: 70, y: 75 },
            text: '"You want to know if this path leads out of the forest."',
            durationMs: 5000,
        },
        {
            ...DrunkWizardSplittingPathDialogueCommon,
            imageSize: { width: 70, height: 70 },
            position: { x: 60, y: 70 },
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
            textColor: colors.red_slightly_dark,
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
            text: '"Fresh little lambs in a thicket of lies..."',
            durationMs: 3000,
            animateInImage: true,
            imageSize: { width: 12, height: 12 },
            position: { x: 50, y: 45 },
            textSize: textSizes.small,
            textPosition: { x: -1, y: -7 },
        },
        {
            ...WitchitaDeceptia1DialogueCommon,
            text: '"Witchita Deceptia — delight for the eyes"',
            durationMs: 5000,
            animateInImage: true,
            imageSize: { width: 20, height: 20 },
            position: { x: 50, y: 46 },
            textSize: textSizes.xxlarge,
            textPosition: { x: -1, y: -8 },
            textColor: colors.red_slightly_dark,
        },
        {
            ...WitchitaDeceptia1DialogueCommon,
            text: '"A drinking battle, fierce and bold"',
            durationMs: 5000,
            imageSize: { width: 25, height: 25 },
            position: { x: 48, y: 47 },
            textSize: textSizes.medium,
            textPosition: { x: -1, y: -10 },
        },
        {
            ...WitchitaDeceptia1DialogueCommon,
            text: '"Only one steps up — the rest on hold"',
            durationMs: 5000,
            imageSize: { width: 30, height: 30 },
            position: { x: 52, y: 48 },
            textSize: textSizes.large,
            textPosition: { x: -1, y: -12 },
        },
        {
            ...WitchitaDeceptia1DialogueCommon,
            text: '"I duel alone — no groupies, clear?"',
            durationMs: 4000,
            imageSize: { width: 40, height: 40 },
            position: { x: 50, y: 50 },
            textSize: textSizes.xlarge,
            textPosition: { x: -2, y: -15 },
        },
        {
            ...WitchitaDeceptia1DialogueCommon,
            text: '"So choose your strongest, to step up here!"',
            durationMs: 4000,
            imageSize: { width: 50, height: 50 },
            position: { x: 50, y: 53 },
            textSize: textSizes.massive,
            textColor: colors.red_slightly_dark,
            textPosition: { x: -2, y: 8 },
        },
    ],
    keepLastDisplayed: true
};