/**
 * 结算界面
 */
var OverLayer = cc.Layer.extend({

    ctor:function () {
        this._super();

        //播放音乐 TODO
        
        //子菜单项
        var items = [];

        if (!Game.user.isVictory) {
            var lable = new cc.LabelTTF("很抱歉，游戏失败了！", "Arial", 38);

            var item = new cc.MenuItemFont("重新开始", this.onGame, this);
            var item3 = new cc.MenuItemFont("关卡选择", this.onTheme, this);
            items = [item, item3];
        } else {
            var lable = new cc.LabelTTF("恭喜你，游戏过关了！", "Arial", 38);

            var item = new cc.MenuItemFont("重新开始", this.onGame, this);
            var item2 = new cc.MenuItemFont("下一关", this.onNext, this);
            var item3 = new cc.MenuItemFont("关卡选择", this.onTheme, this);
            items = [item, item2, item3];
        }
        
        //文字
        lable.x = Game.w / 2;
        lable.y = Game.h / 2;
        this.addChild(lable);
        
        //菜单
        var menu = new cc.Menu(items);
        menu.x = Game.w / 2;
        menu.y = Game.h / 2 - 150;
        menu.alignItemsVerticallyWithPadding(15); //垂直间距
        this.addChild(menu);

        cc.MenuItemFont.setFontName("Arial");
        cc.MenuItemFont.setFontSize(30);
        //menu.addChild(item);

    },
    
    /**
     * 响应重新开始游戏
     */
    onGame: function() {
        cc.director.runScene(new cc.TransitionFade(1.2, new GameScene()));
    },

    /**
     * 响应进入下一关
     */
    onNext: function() {
        //进入下一关
        cc.director.runScene(new cc.TransitionFade(1.2, new GameScene()));
    },

    /**
     * 响应主题关卡界面
     */
    onTheme: function() {
        cc.director.runScene(new cc.TransitionFade(1.2, new ThemeScene()));
    },

    /**
     * 响应返回主菜单
     */
    onStart: function() {
        cc.director.runScene(new cc.TransitionFade(1.2, new StartScene()));
    }
    
});

/**
 * 结算界面场景
 */
var OverScene = cc.Scene.extend({
    onEnter: function() {
        this._super();

        //结算层
        var layer = new OverLayer(); 
        this.addChild(layer);

        //状态
        Game.gameState = Game.GAME_STATE_OVER;
    }
});
