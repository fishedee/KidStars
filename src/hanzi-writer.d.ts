declare module 'hanzi-writer' {
  interface WriterOptions {
    width?: number;
    height?: number;
    padding?: number;
    showOutline?: boolean;
    showCharacter?: boolean;
    strokeAnimationSpeed?: number;
    delayBetweenStrokes?: number;
    strokeColor?: string;
    outlineColor?: string;
    drawingColor?: string;
  }

  export default class HanziWriter {
    static create(target: HTMLElement, character: string, options?: WriterOptions): HanziWriter;
    animateCharacter(): Promise<unknown>;
    showCharacter(options?: { duration?: number }): Promise<unknown>;
    hideCharacter(options?: { duration?: number }): Promise<unknown>;
    showOutline(options?: { duration?: number }): Promise<unknown>;
    hideOutline(options?: { duration?: number }): Promise<unknown>;
    quiz(options?: Record<string, unknown>): Promise<unknown>;
    cancelQuiz(): void;
  }
}
