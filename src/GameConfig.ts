/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
import game from "./game/game"
import Hammer from "./game/Hammer"
import GameManager from "./game/GameManager"
import startView from "./game/startView"
import Mouse from "./game/Mouse"
import ScoreFloat from "./game/ScoreFloat"
/*
* 游戏初始化配置;
*/
export default class GameConfig{
    static width:number=1334;
    static height:number=750;
    static scaleMode:string="fixedheight";
    static screenMode:string="horizontal";
    static alignV:string="top";
    static alignH:string="left";
    static startScene:any="startView.scene";
    static sceneRoot:string="";
    static debug:boolean=false;
    static stat:boolean=false;
    static physicsDebug:boolean=false;
    static exportSceneToJson:boolean=true;
    constructor(){}
    static init(){
        var reg: Function = Laya.ClassUtils.regClass;
        reg("game/game.ts",game);
        reg("game/Hammer.ts",Hammer);
        reg("game/GameManager.ts",GameManager);
        reg("game/startView.ts",startView);
        reg("game/Mouse.ts",Mouse);
        reg("game/ScoreFloat.ts",ScoreFloat);
    }
}
GameConfig.init();