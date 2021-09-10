import { ui } from '../ui/layaMaxUI';
import GameManager from './GameManager';

export default class GameUI extends ui.gameSceneUI {


  /**设置单例的引用方式，方便其他类引用 */
  static instance: GameUI;

  // 游戏是否进行中
  public isPlaying: boolean;
  // 倒计时时间，单位S
  private nCountDown: number;
  // 游戏分数
  private nScore: number;
  // 老鼠成员
  private arrMouse: any[];
  /**游戏控制脚本引用，避免每次获取组件带来不必要的性能开销 */
  private gameManger: GameManager;

  constructor() {
    super();
    GameUI.instance = this;
  }

  /**
   * 组件被激活后执行，此时所有节点和组件均已创建完毕，此方法只会执行一次
   */
  onAwake(): void {
    console.log('onAwake');
  }

  /**
   * 组件被启用后执行，比如，节点被添加到舞台后执行
   */
  onEnable(): void {
    console.log('onEnable');

    this.gameManger = this.getComponent(GameManager);
    this.btnPlayAgain.on(Laya.Event.MOUSE_DOWN, this, function () {
      this.gameStart();
    });
    this.gameStart();
  }

  onDisable(): void {
    console.log('onDisable');
  }

  // 游戏开始
  gameStart(): void {
    // 隐藏弹窗
    this.dialogGameOver.visible = false;
    this.gameManger.startGame()
  }

}
