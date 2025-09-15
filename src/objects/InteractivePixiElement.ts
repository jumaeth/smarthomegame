export class InteractivePixiElement {
  constructor(public x: number,
              public y: number,
              public width: number,
              public height: number,
              public name: string,
              public interaction: () => void) {}
}