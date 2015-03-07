
var StartLayer = cc.Layer.extend({
    
    ctor:function () {
        this._super();
        
        //Logo
        var logoSprite = new cc.Sprite("#battlecity.png");
        logoSprite.x = Game.w / 2;
        logoSprite.y = Game.h / 2;
        this.addChild(logoSprite);
        
        
        //菜单：开始游戏
        var menu = new cc.Menu();
        menu.x = Game.w / 2;
        menu.y = Game.h / 2 - 150;
        this.addChild(menu);

        cc.MenuItemFont.setFontName("Arial");
        cc.MenuItemFont.setFontSize(30);
        var item = new cc.MenuItemFont("开始游戏", this.onStartGame, this);
        var item2 = new cc.MenuItemFont("关卡选择", this.onTheme, this);
        menu.addChild(item);
        menu.addChild(item2);
        menu.alignItemsVerticallyWithPadding(15); //垂直间距
        
    },
    
    /**
     * 响应开始游戏
     */
    onStartGame: function() {
        cc.director.runScene(new cc.TransitionFade(1.2, new GameScene()));
    },

    /**
     * 响应主题关卡界面
     */
    onTheme: function() {
        cc.director.runScene(new cc.TransitionFade(1.2, new ThemeScene()));
    }

});

/**
 * 菜单场景
 */
var StartScene = cc.Scene.extend({
    onEnter: function() {
        this._super();
        
        //菜单层
        var layer = new StartLayer(); 
        this.addChild(layer);
        
        //状态
        Game.gameState = Game.GAME_STATE_START;
    }
});
