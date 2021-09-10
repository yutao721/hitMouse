export default class Mouse extends Laya.Script {
  gameManager: any;
  typeMouse: number;
  indexPosMouse: number;
  timeLine: Laya.TimeLine;
  isHited: boolean;


  constructor() {
    super();
    this.gameManager = null;
    this.typeMouse = 0;
    this.indexPosMouse = -1;
    this.timeLine = null;
    this.isHited = false;
    console.log(this);

  }

  onClick(e: Laya.Event): void {
    console.log('打到了老鼠:', this.indexPosMouse);

    if (this.isHited) {
      return;
    }
    this.isHited = true;

    let owner: Laya.Sprite = this.owner as Laya.Sprite;

    // 销毁存在的动画
    if (this.timeLine) {
      this.timeLine.destroy;
      this.timeLine = null;
    };

    // 换掉皮肤
    (owner as Laya.Image).skin = ("res/mouse_hited_" + this.typeMouse + ".png");
    this.timeLine = Laya.TimeLine.to(this.owner, { scaleX: 0, scaleY: 0 }, 300, null, 1000);
    this.timeLine.play(0, false);
    this.timeLine.on(Laya.Event.COMPLETE, this, function () {
      this.owner.removeSelf();
      this.gameManager.arrMouse[this.indexPosMouse] = null;
    });

    // 锤子动画
    this.gameManager.onMouseHited(this.indexPosMouse, this.typeMouse);
  }

  /**
   * 显示老鼠
   * @param gameManager 
   * @param typeMouse 
   * @param indexPosMouse 
   */
  public show(gameManager: any, typeMouse: number, indexPosMouse: number): void {
    let owner: Laya.Sprite = this.owner as Laya.Sprite
    this.gameManager = gameManager;
    this.typeMouse = typeMouse;
    this.indexPosMouse = indexPosMouse;
    (owner as Laya.Image).skin = ("res/mouse_normal_" + this.typeMouse + ".png")
    owner.scaleX = 0;
    owner.scaleY = 0;
    this.timeLine = Laya.TimeLine.to(this.owner, { scaleX: 1, scaleY: 1 }, 300)
      .to(this.owner, { scaleX: 0, scaleY: 0 }, 300, null, 2000);
    this.timeLine.play(0, false);
    this.timeLine.on(Laya.Event.COMPLETE, this, function () {
      this.owner.removeSelf();
      this.gameManager.arrMouse[this.indexPosMouse] = null;
    });
  }

  onEnable(): void {
  }

  onDisable(): void {
  }
}