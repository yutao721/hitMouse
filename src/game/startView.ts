import { ui } from '../ui/layaMaxUI';
import GameView from './game'
import Text = Laya.Text;
import Tween = Laya.Tween;
import Ease = Laya.Ease;
export default class StartViewUI extends ui.startViewUI {
  private gameView: GameView;
  constructor() {
    super();

    this.gameView = new GameView();

  }

  onEnable(): void {
    this.startGame.on(Laya.Event.CLICK, this, this.start);

    var w: number = 480;
    var offset: number = Laya.stage.width - w >> 1;
    console.log(offset);

    var endY: number = Laya.stage.height / 2 - 180;
    var demoString: string = "打地鼠";

    for (var i: number = 0, len: number = demoString.length; i < len; ++i) {
      var letterText: Text = this.createLetter(demoString.charAt(i));
      letterText.x = w / len * i + offset;
      Tween.to(letterText, { y: endY }, 1000, Ease.elasticOut, null, i * 1000);
    }
  }

  public start(): void {
    this.removeSelf();                  //移除游戏结束界面
    Laya.stage.addChild(this.gameView); //添加游戏开始界面
  }

  private createLetter(char: string): Text {
    var letter: Text = new Text();
    letter.text = char;
    letter.color = "#1b7518";
    letter.font = "Impact";
    letter.fontSize = 100;
    letter.bold = true;
    Laya.stage.addChild(letter);
    return letter;
  }

  onAwake(): void {

  }

}
