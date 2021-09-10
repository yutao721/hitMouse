export default class ScoreFloat extends Laya.Script {


  constructor() { super(); }

  onEnable(): void {
  }

  onDisable(): void {
  }

  show(type) {
    let owner: Laya.Sprite = this.owner as Laya.Sprite;
    (owner as Laya.Image).skin = `res/score_100_${type}.png`;

    var timeLine = Laya.TimeLine
      .to(this.owner, { y: owner.y - 150 }, 300, Laya.Ease.backOut)
      .to(owner, { alpha: 0 }, 150, null, 1000);
    timeLine.play(0, false);
    timeLine.on(Laya.Event.COMPLETE, this, function () {
      owner.removeSelf();
    });
  }
}