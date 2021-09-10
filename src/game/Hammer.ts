export default class Hammer extends Laya.Script {
  private timeLine: any;


  constructor() {
    super();
    this.timeLine = null;
  }

  onEnable(): void {

  }

  onDisable(): void {

  }

  public show() {
    let owner: Laya.Sprite = this.owner as Laya.Sprite;
    owner.alpha = 1;
    owner.rotation = 0;
    if (this.timeLine) {
      this.timeLine.destroy();
      this.timeLine = null;
    }
    this.timeLine = Laya.TimeLine.to(owner, { rotation: 10 }, 90)
      .to(owner, { rotation: -10 }, 90 * 2)
      .to(owner, { alpha: 0 }, 100, null, 150);
    this.timeLine.play(0, false);
  }
}