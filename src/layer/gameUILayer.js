
/**
 * 游戏战斗界面UI
 */
var GameUILayer = cc.Layer.extend({
    lifeLabel: null, //当前生命数
    stepLabel: null, //当前关卡数
    expLabel: null, //当前经验
    
    ctor:function () {
        this._super();
        
        Game.bonuslayer = this;

        //背景层
        this.backgroundUI();

        //界面UI
        //this.fragmentUI();

        //界面更新
        this.schedule(this.updateUI, 1);
    },

    /**
     * 背景UI
     */
    backgroundUI: function() {

        //地图层
        var mapLayer = new MapLayer();
        this.addChild(mapLayer, -1);

        //灰色边框背景层
        var bg = new cc.LayerColor(cc.color(192, 192, 192, 255));
        this.addChild(bg, -2);

    },
    
    /**
     * 界面UI
     */
    fragmentUI: function() {

        //IP
        var lifeTitle = new cc.Sprite("#icon_ip1.png");
        lifeTitle.setPosition(cc.p(30*2, Game.h - 50*2));
        lifeTitle.setScale(2);
        this.addChild(lifeTitle);

        //塔克图标
        var tankIcon = new cc.Sprite("#icon_tank1.png");
        tankIcon.setPosition(cc.p(40, Game.h - 70*2));
        tankIcon.setScale(1);
        this.addChild(tankIcon);

        //旗
        var flag = new cc.Sprite("#flag.png");
        flag.setPosition(cc.p(Game.w - 100, Game.h - 200*2));
        flag.setScale(2);
        this.addChild(flag);

        //显示生命
        this.lifeUI(Game.user.life);

        //显示关卡
        this.stepUI(Game.user.step);
    },

    /**
     * 界面更新
     * @param dt
     */
    updateUI: function() {
        //显示生命
        this.lifeUI(Game.user.life);

        //显示关卡
        this.stepUI(Game.user.step+1);

        //经验、等级 TODO
        this.expUI(Game.userModel.getExp());

    },

    lifeUI: function(life) {
        if (!this.lifeLabel) {
            //生命
            var lifeTxtLabel = new cc.LabelTTF("生命：", "Arial", 24);
            lifeTxtLabel.setPosition(100, Game.h - 32);
            this.addChild(lifeTxtLabel);
            //生命值
            var lifeLabel = new cc.LabelTTF(life, "Arial", 24);
            lifeLabel.setColor(cc.color(0, 0, 0, 255));
            lifeLabel.setPosition(lifeTxtLabel.width, lifeTxtLabel.height/2);
            lifeTxtLabel.addChild(lifeLabel);
            this.lifeLabel = lifeLabel;
        }
        this.lifeLabel.setString(life);
    },

    stepUI: function(step) {
        if (!this.stepLabel) {
            //关卡
            var stepTxtLabel = new cc.LabelTTF("关卡：", "Arial", 24);
            stepTxtLabel.setPosition(200, Game.h - 32);
            this.addChild(stepTxtLabel);
            //关卡数
            var stepLabel = new cc.LabelTTF(step, "Arial", 24);
            stepLabel.setColor(cc.color(0, 0, 0, 255));
            stepLabel.setPosition(stepTxtLabel.width, stepTxtLabel.height/2);
            stepTxtLabel.addChild(stepLabel);
            this.stepLabel = stepLabel;
        }
        this.stepLabel.setString(step);
    },

    expUI: function(exp) {
        if (!this.expLabel) {
            //关卡
            var expTxtLabel = new cc.LabelTTF("经验：", "Arial", 24);
            expTxtLabel.setPosition(300, Game.h - 32);
            this.addChild(expTxtLabel);
            //关卡数
            var expLabel = new cc.LabelTTF(exp, "Arial", 24);
            expLabel.setColor(cc.color(0, 0, 0, 255));
            expLabel.setPosition(expTxtLabel.width, expTxtLabel.height/2);
            expTxtLabel.addChild(expLabel);
            this.expLabel = expLabel;
        }
        this.expLabel.setString(exp);
    }

});