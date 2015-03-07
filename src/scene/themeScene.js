/**
 * 主题关卡界面
 */
var ThemeLayer = cc.Layer.extend({
    themeName: null, //主题名
    stepsCount: null, //关卡数
    stepMax: 0, //已解锁的最大关卡
    
    ctor:function () {
        this._super();
        
        //初始化配置数据
        var themeId = Game.user.theme || 0;
        this.themeName = glb_config.levelElement[themeId].themeName;
        this.stepsCount = toolArray.count(glb_config.levelElement[themeId].steps);
        this.stepMax = Game.userModel.getStepUnlock(themeId);
        
        //文字
        var lable = new cc.LabelTTF(this.themeName, "Arial", 38);
        lable.x = Game.w / 2;
        lable.y = Game.h - 50;
        this.addChild(lable);
        
        //关卡列表
        var wc = 5; //横向6列
        var hc = 4; //纵向4行
        var girdW = 120;
        var girdH = 120;
        //左下角
        var x0 = (Game.w - girdW * wc) / 2 + girdW/2; 
        var y0 = (Game.h - girdH * hc) / 2 + girdH/2;
        //左上角起始点
        var x3 = x0; 
        var y3 = y0 + girdH*(hc-1);
        //画图
        if (glb_config.drawLine) {
            var draw = new cc.DrawNode();
            this.addChild(draw, 10);
        }
        var items = [];
        for (var i=0; i<hc; i++) {
            for (var j=0; j<wc; j++) {
                //格子背景
                var gridBg = new cc.Sprite("#grid.png");
//                gridBg.x = x3 + j * girdW;
//                gridBg.y = y3 - i * girdH;
                gridBg.opacity = 70;
                //this.addChild(gridBg);

                var step = i*wc+j+1; //关卡数字 1,2,3...
                var item = new cc.MenuItemSprite(gridBg, gridBg, gridBg, this.onStepGame, this);
                item.x = x3 + j * girdW;
                item.y = y3 - i * girdH;
                item.userDataStep = step;
                item.setEnabled(false);
                items.push(item);
                
                //画图
                if (glb_config.drawLine) {
                    draw.drawDot(cc.p(x0,y0), 5, cc.color(0, 0, 255, 128));
                }
                
                //关卡数字 1,2,3...
//                var step = i*wc+j+1;
//                var item = new cc.MenuItemFont(""+step, this.onStepGame, this);
//                item.x = gridBg.x;
//                item.y = gridBg.y;
//                item.userDataStep = step;
//                item.setEnabled(false);
//                items.push(item);
                var stepLabel = new cc.LabelTTF(""+step, "Arial", 38);
                stepLabel.x = item.x;
                stepLabel.y = item.y;
                this.addChild(stepLabel);

                
                //未开放的关卡
                if (step > this.stepsCount) {
                    var lable = new cc.LabelTTF("未开放", "Arial", 12);
                    lable.x = item.x;
                    lable.y = item.y - 25;
                    this.addChild(lable);
                }
                //未解锁的关卡
                else if (step - 1 > this.stepMax) {
                    var lable = new cc.LabelTTF("未解锁", "Arial", 12);
                    lable.x = item.x;
                    lable.y = item.y - 25;
                    this.addChild(lable);
                }
                //剩下的才是可玩的关卡
                else {
                    item.setEnabled(true);
                }
            }
        }
        
        //关卡菜单
        var menu = new cc.Menu(items);
        menu.x = 0;
        menu.y = 0;
        this.addChild(menu);

        cc.MenuItemFont.setFontName("Arial");
        cc.MenuItemFont.setFontSize(30);
        
    },
    
    /**
     * 响应开始游戏
     */
    onStepGame: function(node) {
        Game.user.step = node.userDataStep - 1;
        cc.director.runScene(new cc.TransitionFade(1.2, new GameScene()));
    }
});

/**
 * 主题关卡场景
 */
var ThemeScene = cc.Scene.extend({
    onEnter: function() {
        this._super();
        
        //主题关卡层
        var layer = new ThemeLayer(); 
        this.addChild(layer);
        
        //状态
        Game.gameState = Game.GAME_STATE_THEME;
    }
});
