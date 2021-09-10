(function () {
    'use strict';

    var Scene = Laya.Scene;
    var REG = Laya.ClassUtils.regClass;
    var ui;
    (function (ui) {
        class gameSceneUI extends Scene {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.loadScene("gameScene");
            }
        }
        ui.gameSceneUI = gameSceneUI;
        REG("ui.gameSceneUI", gameSceneUI);
        class startViewUI extends Scene {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.loadScene("startView");
            }
        }
        ui.startViewUI = startViewUI;
        REG("ui.startViewUI", startViewUI);
    })(ui || (ui = {}));

    const GameConfig = {
        arrPosMouse: [
            { x: -245, y: 0 }, { x: 0, y: 0 }, { x: 245, y: 0 },
            { x: -245, y: 126 }, { x: 0, y: 126 }, { x: 245, y: 126 },
            { x: -245, y: 268 }, { x: 0, y: 268 }, { x: 245, y: 268 },
        ],
    };

    class Mouse extends Laya.Script {
        constructor() {
            super();
            this.gameManager = null;
            this.typeMouse = 0;
            this.indexPosMouse = -1;
            this.timeLine = null;
            this.isHited = false;
            console.log(this);
        }
        onClick(e) {
            console.log('打到了老鼠:', this.indexPosMouse);
            if (this.isHited) {
                return;
            }
            this.isHited = true;
            let owner = this.owner;
            if (this.timeLine) {
                this.timeLine.destroy;
                this.timeLine = null;
            }
            ;
            owner.skin = ("res/mouse_hited_" + this.typeMouse + ".png");
            this.timeLine = Laya.TimeLine.to(this.owner, { scaleX: 0, scaleY: 0 }, 300, null, 1000);
            this.timeLine.play(0, false);
            this.timeLine.on(Laya.Event.COMPLETE, this, function () {
                this.owner.removeSelf();
                this.gameManager.arrMouse[this.indexPosMouse] = null;
            });
            this.gameManager.onMouseHited(this.indexPosMouse, this.typeMouse);
        }
        show(gameManager, typeMouse, indexPosMouse) {
            let owner = this.owner;
            this.gameManager = gameManager;
            this.typeMouse = typeMouse;
            this.indexPosMouse = indexPosMouse;
            owner.skin = ("res/mouse_normal_" + this.typeMouse + ".png");
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
        onEnable() {
        }
        onDisable() {
        }
    }

    class Hammer extends Laya.Script {
        constructor() {
            super();
            this.timeLine = null;
        }
        onEnable() {
        }
        onDisable() {
        }
        show() {
            let owner = this.owner;
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

    class ScoreFloat extends Laya.Script {
        constructor() { super(); }
        onEnable() {
        }
        onDisable() {
        }
        show(type) {
            let owner = this.owner;
            owner.skin = `res/score_100_${type}.png`;
            var timeLine = Laya.TimeLine
                .to(this.owner, { y: owner.y - 150 }, 300, Laya.Ease.backOut)
                .to(owner, { alpha: 0 }, 150, null, 1000);
            timeLine.play(0, false);
            timeLine.on(Laya.Event.COMPLETE, this, function () {
                owner.removeSelf();
            });
        }
    }

    var keyScoreHighest = "keyScoreHighest";
    class GameManager extends Laya.Script {
        constructor() {
            super();
            this.arrMouse = [];
            this.nCountDown = 0;
            this.isPlaying = false;
            this.nScore = 0;
            this.prefabMouse = null;
            this.scoreFloat = null;
        }
        onAwake() {
            console.log('GameManager', 'onAwake');
        }
        startGame() {
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
            Laya.timer.once(1000, this, this.generateMouse, [this.getRandomInt(1, this.arrMouse.length)]);
        }
        generateMouse(numMouse) {
            if (!this.isPlaying) {
                return;
            }
            for (let i = 0; i < numMouse; i++) {
                let indexPosMouse = this.getRandomInt(0, this.arrMouse.length - 1);
                if (this.arrMouse[indexPosMouse]) {
                    continue;
                }
                let mouse = this.prefabMouse.create();
                GameUI.instance.containerMouse.addChild(mouse);
                let posMouse = GameConfig.arrPosMouse[indexPosMouse];
                mouse.pos(posMouse.x, posMouse.y);
                this.arrMouse[indexPosMouse] = mouse;
                let typeMouse = this.getRandomInt(1, 2);
                let compMouse = mouse.getComponent(Mouse);
                compMouse.show(this, typeMouse, indexPosMouse);
            }
            Laya.timer.once(3000, this, this.generateMouse, [this.getRandomInt(1, this.arrMouse.length)]);
        }
        onOneSecond() {
            this.nCountDown--;
            GameUI.instance.lblCountDwonValue.text = "" + this.nCountDown;
            if (this.nCountDown <= 0) {
                this.gameOver();
            }
        }
        gameOver() {
            this.isPlaying = false;
            GameUI.instance.dialogGameOver.visible = true;
            Laya.timer.clear(this, this.onOneSecond);
            GameUI.instance.lblScoreCurrentValue.text = "" + this.nScore;
            var nScoreHighest = 0;
            if (window.localStorage[keyScoreHighest]) {
                if (window.localStorage[keyScoreHighest] > this.nScore) {
                    nScoreHighest = window.localStorage[keyScoreHighest];
                }
                else {
                    nScoreHighest = this.nScore;
                }
            }
            else {
                nScoreHighest = this.nScore;
            }
            window.localStorage[keyScoreHighest] = nScoreHighest;
            GameUI.instance.lblScoreHighestValue.text = "" + nScoreHighest;
        }
        getRandomInt(lsection, rsection) {
            if (lsection > rsection) {
                console.error("getRandomInt: can not lsection > rsection");
                return -1;
            }
            return Math.floor(Math.random() * (rsection - lsection + 1)) + lsection;
        }
        onMouseHited(indexPosMouse, typeMouse) {
            if (!this.isPlaying) {
                return;
            }
            var posMouse = GameConfig.arrPosMouse[indexPosMouse];
            GameUI.instance.hammer.pos(posMouse.x + 60, posMouse.y - 60);
            var compHammer = GameUI.instance.hammer.getComponent(Hammer);
            compHammer.show();
            var scoreFloat = this.scoreFloat.create();
            GameUI.instance.containerScoreFloat.addChild(scoreFloat);
            scoreFloat.pos(posMouse.x - 60, posMouse.y - 60);
            var compScoreFloat = scoreFloat.getComponent(ScoreFloat);
            compScoreFloat.show(typeMouse);
            if (typeMouse == 2) {
                this.nScore += 100;
            }
            else {
                this.nScore -= 100;
                if (this.nScore < 0) {
                    this.nScore = 0;
                }
            }
            GameUI.instance.lblScoreValue.text = "" + this.nScore;
        }
        onEnable() {
        }
        onDisable() {
        }
    }

    class GameUI extends ui.gameSceneUI {
        constructor() {
            super();
            GameUI.instance = this;
        }
        onAwake() {
            console.log('onAwake');
        }
        onEnable() {
            console.log('onEnable');
            this.gameManger = this.getComponent(GameManager);
            this.btnPlayAgain.on(Laya.Event.MOUSE_DOWN, this, function () {
                this.gameStart();
            });
            this.gameStart();
        }
        onDisable() {
            console.log('onDisable');
        }
        gameStart() {
            this.dialogGameOver.visible = false;
            this.gameManger.startGame();
        }
    }

    var Text = Laya.Text;
    var Tween = Laya.Tween;
    var Ease = Laya.Ease;
    class StartViewUI extends ui.startViewUI {
        constructor() {
            super();
            this.gameView = new GameUI();
        }
        onEnable() {
            this.startGame.on(Laya.Event.CLICK, this, this.start);
            var w = 480;
            var offset = Laya.stage.width - w >> 1;
            console.log(offset);
            var endY = Laya.stage.height / 2 - 180;
            var demoString = "打地鼠";
            for (var i = 0, len = demoString.length; i < len; ++i) {
                var letterText = this.createLetter(demoString.charAt(i));
                letterText.x = w / len * i + offset;
                Tween.to(letterText, { y: endY }, 1000, Ease.elasticOut, null, i * 1000);
            }
        }
        start() {
            this.removeSelf();
            Laya.stage.addChild(this.gameView);
        }
        createLetter(char) {
            var letter = new Text();
            letter.text = char;
            letter.color = "#1b7518";
            letter.font = "Impact";
            letter.fontSize = 100;
            letter.bold = true;
            Laya.stage.addChild(letter);
            return letter;
        }
        onAwake() {
        }
    }

    class GameConfig$1 {
        constructor() {
        }
        static init() {
            var reg = Laya.ClassUtils.regClass;
            reg("game/game.ts", GameUI);
            reg("game/Hammer.ts", Hammer);
            reg("game/GameManager.ts", GameManager);
            reg("game/startView.ts", StartViewUI);
            reg("game/Mouse.ts", Mouse);
            reg("game/ScoreFloat.ts", ScoreFloat);
        }
    }
    GameConfig$1.width = 960;
    GameConfig$1.height = 640;
    GameConfig$1.scaleMode = "fixedheight";
    GameConfig$1.screenMode = "horizontal";
    GameConfig$1.alignV = "middle";
    GameConfig$1.alignH = "center";
    GameConfig$1.startScene = "startView.scene";
    GameConfig$1.sceneRoot = "";
    GameConfig$1.debug = false;
    GameConfig$1.stat = false;
    GameConfig$1.physicsDebug = false;
    GameConfig$1.exportSceneToJson = true;
    GameConfig$1.init();

    class Main {
        constructor() {
            if (window["Laya3D"])
                Laya3D.init(GameConfig$1.width, GameConfig$1.height);
            else
                Laya.init(GameConfig$1.width, GameConfig$1.height, Laya["WebGL"]);
            Laya["Physics"] && Laya["Physics"].enable();
            Laya["DebugPanel"] && Laya["DebugPanel"].enable();
            Laya.stage.scaleMode = GameConfig$1.scaleMode;
            Laya.stage.screenMode = GameConfig$1.screenMode;
            Laya.stage.alignV = GameConfig$1.alignV;
            Laya.stage.alignH = GameConfig$1.alignH;
            Laya.URL.exportSceneToJson = GameConfig$1.exportSceneToJson;
            if (GameConfig$1.debug || Laya.Utils.getQueryString("debug") == "true")
                Laya.enableDebugPanel();
            if (GameConfig$1.physicsDebug && Laya["PhysicsDebugDraw"])
                Laya["PhysicsDebugDraw"].enable();
            if (GameConfig$1.stat)
                Laya.Stat.show();
            Laya.alertGlobalError(true);
            Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
        }
        onVersionLoaded() {
            Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
        }
        onConfigLoaded() {
            GameConfig$1.startScene && Laya.Scene.open(GameConfig$1.startScene);
            console.log("Hello Layabox");
        }
    }
    new Main();

}());
