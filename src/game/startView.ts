import { ui } from '../ui/layaMaxUI';
import GameView from './game'
import Text = Laya.Text;
import Tween = Laya.Tween;
import Ease = Laya.Ease;
import ComboBox = Laya.ComboBox;
import Handler = Laya.Handler;

export default class StartViewUI extends ui.startViewUI {
  private gameView: GameView;
  private skin: string = 'comp/combobox.png';
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


    this.createComboBox();
    // this.comboBox.on(Laya.Event.CHANGE, this, this.onSelect)

  }


  // 设置ComboBox组件的值
  private createComboBox(): void {
    this.comboBox.labelSize = 36;
    this.comboBox.itemSize = 36;
    this.comboBox.labels = "5,10,15,20,25,30";
    this.comboBox.labelPadding = '10, 10 ,10 ,10';
    this.comboBox.selectedLabel = '15';
    Laya.LocalStorage.setItem('nCountDown', '15')
    this.comboBox.selectHandler = new Handler(this, this.onSelect, [this.comboBox]);
  }

  private onSelect(cb: ComboBox): void {
    console.log("选中了： " + cb.selectedLabel);
    Laya.LocalStorage.setItem('nCountDown', cb.selectedLabel)
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
    this.addChild(letter);
    return letter;
  }

  onAwake(): void {

  }

}
