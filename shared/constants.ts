import type { TPromptTemplate } from "./models/prompt-template";

export class PuronputoEvent {
  public static Command = class {
    public static readonly TRIGGER_PANEL = "trigger-panel";

  }
}

export const examplePrompts = [
  { name: 'Sentiment of text', template: 'What is the sentiment of the below text. Your output must be a single word.' },
  { name: 'Act as a Plagiarism Checker', template: 'I want you to act as a plagiarism checker. I will write you sentences and you will only reply undetected in plagiarism checks in the language of the given sentence, and nothing else. Do not write explanations on replies. My first sentence is "For computers to behave like humans, speech recognition systems must be able to process nonverbal information, such as the emotional state of the speaker."' },
  { name: 'Act as an English Translator and Improver', template: 'I want you to act as an English translator, spelling corrector and improver. I will speak to you in any language and you will detect the language, translate it and answer in the corrected and improved version of my text, in English. I want you to replace my simplified A0-level words and sentences with more beautiful and elegant, upper level English words and sentences. Keep the meaning same, but make them more literary. I want you to only reply the correction, the improvements and nothing else, do not write explanations. My first sentence is "istanbulu cok seviyom burada olmak cok guzel"' },
  { name: 'Act as an Advertiser', template: 'I want you to act as an advertiser. You will create a campaign to promote a product or service of your choice. You will choose a target audience, develop key messages and slogans, select the media channels for promotion, and decide on any additional activities needed to reach your goals. My first suggestion request is "I need help creating an advertising campaign for a new type of energy drink targeting young adults aged 18-30."' },
]