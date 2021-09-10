import GameConfig from './GameConfig';
import Mouse from './Mouse';
import GameUI from "./game";
import Hammer from './Hammer';
import ScoreFloat from './ScoreFloat';
var keyScoreHighest = "keyScoreHighest";
export default class GameManager extends Laya.Script {

  /** @prop {name:prefabMouse, tips:"老鼠预制体", type:prefab}*/
  prefabMouse: Laya.Prefab;

  /** @prop {name:scoreFloat, tips:"分数预制体", type:prefab}*/
  scoreFloat: Laya.Prefab;

  // 老鼠成员
  private arrMouse: any[];
  private nCountDown: any;
  private isPlaying: boolean;
  private nScore: number;

  constructor() {
    super();
    this.arrMouse = [];
    this.nCountDown = 0;
    this.isPlaying = false;
    this.nScore = 0;
    this.prefabMouse = null;
    this.scoreFloat = null;
  }

  onAwake(): void {
    console.log('GameManager', 'onAwake');

  }

  // 游戏开始
  startGame(): void {
    this.isPlaying = true;
    this.nCountDown = 5;
    this.nScore = 0;
    this.arrMouse.length = 0;
    for (let i = 0; i < 9; i++) {
      this.arrMouse.push(null);
    }

    GameUI.instance.lblCountDwonValue.text = '' + this.nCountDown;
    GameUI.instance.lblScoreValue.text = '' + this.nScore;

    Laya.timer.loop(1000, this, this.onOneSecond);
    // 创建老鼠
    Laya.timer.once(1000, this, this.generateMouse, [this.getRandomInt(1, this.arrMouse.length)])
  }

  // 创建老鼠
  generateMouse(numMouse: number): void {
    if (!this.isPlaying) {
      return;
    }

    for (let i = 0; i < numMouse; i++) {
      // 随机一个洞
      let indexPosMouse = this.getRandomInt(0, this.arrMouse.length - 1);

      if (this.arrMouse[indexPosMouse]) {
        continue;
      }


      // 通过预制体创建
      let mouse = this.prefabMouse.create();
      GameUI.instance.containerMouse.addChild(mouse);

      let posMouse = GameConfig.arrPosMouse[indexPosMouse];
      // 设置xy坐标
      mouse.pos(posMouse.x, posMouse.y);

      this.arrMouse[indexPosMouse] = mouse;

      let typeMouse = this.getRandomInt(1, 2);
      let compMouse = mouse.getComponent(Mouse);
      compMouse.show(this, typeMouse, indexPosMouse);
    }
    Laya.timer.once(3000, this, this.generateMouse, [this.getRandomInt(1, this.arrMouse.length)]);
  }


  // 倒计时回调
  onOneSecond(): void {
    this.nCountDown--;
    GameUI.instance.lblCountDwonValue.text = "" + this.nCountDown;
    if (this.nCountDown <= 0) {
      this.gameOver();
    }
  }

  // 游戏结束
  gameOver(): void {
    this.isPlaying = false;
    GameUI.instance.dialogGameOver.visible = true;
    // 清除定时器
    Laya.timer.clear(this, this.onOneSecond);

    // 弹窗分数
    GameUI.instance.lblScoreCurrentValue.text = "" + this.nScore;

    var nScoreHighest = 0;
    if (window.localStorage[keyScoreHighest]) {
      if (window.localStorage[keyScoreHighest] > this.nScore) {
        nScoreHighest = window.localStorage[keyScoreHighest];
      } else {
        nScoreHighest = this.nScore;
      }
    } else {
      nScoreHighest = this.nScore;
    }
    window.localStorage[keyScoreHighest] = nScoreHighest;
    GameUI.instance.lblScoreHighestValue.text = "" + nScoreHighest;
  }

  /**
   * 生成指定闭区间的整数   如[1, 5]
   * @param lsection 
   * @param rsection 
   * @returns 
   */
  getRandomInt(lsection: number, rsection: number) {
    if (lsection > rsection) {
      console.error("getRandomInt: can not lsection > rsection");
      return -1;
    }
    return Math.floor(Math.random() * (rsection - lsection + 1)) + lsection
  }

  onMouseHited(indexPosMouse: number, typeMouse: number) {
    if (!this.isPlaying) {
      return;
    }

    // 锤子逻辑
    var posMouse = GameConfig.arrPosMouse[indexPosMouse];
    GameUI.instance.hammer.pos(posMouse.x + 60, posMouse.y - 60);

    var compHammer = GameUI.instance.hammer.getComponent(Hammer);
    compHammer.show();

    // 分数逻辑
    var scoreFloat = this.scoreFloat.create();
    GameUI.instance.containerScoreFloat.addChild(scoreFloat);
    scoreFloat.pos(posMouse.x - 60, posMouse.y - 60);

    var compScoreFloat = scoreFloat.getComponent(ScoreFloat);
    compScoreFloat.show(typeMouse);

    if (typeMouse == 2) {
      this.nScore += 100;
    } else {
      this.nScore -= 100;
      if (this.nScore < 0) {
        this.nScore = 0;
      }
    }

    GameUI.instance.lblScoreValue.text = "" + this.nScore;
  }

  onEnable(): void {


  }

  onDisable(): void {
  }
}