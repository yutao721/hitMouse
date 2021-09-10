import { ui } from '../ui/layaMaxUI';
import GameView from './game'
console.log(1);
export default class StartViewUI extends ui.startViewUI {
  private gameView: GameView;
  constructor() {
    super();

    this.gameView = new GameView();

  }

  onEnable(): void {
    this.startGame.on(Laya.Event.CLICK, this, this.start)
  }

  public start(): void {
    this.removeSelf();                  //移除游戏结束界面
    Laya.stage.addChild(this.gameView); //添加游戏开始界面
  }

  onAwake(): void {

  }

}
