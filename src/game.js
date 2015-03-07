
var Game = {

        /**
         * 游戏常量配置
         */

        //游戏状态
        GAME_STATE_START : 0,
        GAME_STATE_PLAYING : 1,
        GAME_STATE_OVER : 2,
        GAME_STATE_THEME : 3,

        //方向
        GAME_DIRECTION_UP : cc.p(0, 1),
        GAME_DIRECTION_DOWN : cc.p(0, -1),
        GAME_DIRECTION_LEFT : cc.p(-1, 0),
        GAME_DIRECTION_RIGHT : cc.p(1, 0),
        GAME_DIRECTION_ZERO : cc.p(0, 0),

        //坦克类型
        GAME_TANK_PLAYER1 : 1,
        GAME_TANK_PLAYER2 : 2,
        GAME_TANK_ENEMY1 : 3,
        GAME_TANK_ENEMY2 : 4,
        GAME_TANK_ENEMY3 : 5,
        GAME_TANK_ENEMY4 : 6,
        
        //阵营
        GAME_FACTION_PLAYER : 0,
        GAME_FACTION_ENEMY : 1,

        //障碍类型
        OBSTACLE_TYPE_BLANK : -1, //空白，没有任何障碍
        OBSTACLE_TYPE_OUTSIDE : 0, //地图外
        OBSTACLE_TYPE_BRICK : 1, //砖块
        OBSTACLE_TYPE_GRASS : 2, //草丛
        OBSTACLE_TYPE_GROUND : 3, //地面
        OBSTACLE_TYPE_STONE : 4, //石头
        OBSTACLE_TYPE_RIVER : 5, //河流
        OBSTACLE_TYPE_ICE : 6, //冰河
        
        //奖励物品
        BONUS_TYPE_BOOM : 0, //炸弹
        BONUS_TYPE_CLOCK : 1, //时钟
        BONUS_TYPE_HELMET : 2, //铁盔
        BONUS_TYPE_SHOVEL : 3, //铁铲
        BONUS_TYPE_STAR : 4, //星星
        BONUS_TYPE_TANK : 5, //炸弹

        /**
         * 用户数据（内存）
         */
        user: {
            //内存
            tank: null, //当前玩家坦克
            theme: 0, //当前主题
            step: 0, //当前玩到第几关
            life: 3, //当前剩余坦克数
            isVictory: 0 //是否胜利
            //killeds: [] //杀死的敌人计数 
        },
        
        /**
         * 游戏数据
         */

        //屏幕宽高
        w: 0,
        h: 0,
        
        //地图宽高
        map_w: null,
        map_h: null,
        tile_w: null,
        tile_h: null,

        //容器
        container: {
            draw : null,
            players : [], //玩家
            enemys : [], //战场上的所有敌人
            tanks : [], //战场上的所有坦克，包括敌我双方
            bullets : [], //子弹
            bonuss : [], //奖励
            map_plant : [], //玩家出生点
            map_enemy_plant : [],
            map_t : [],
            map_home : {}, //总部位置
            map_grass:[],
            map_ice:[], //冰面
            home : null
        },

        //游戏状态
        gameState: null,
        
        //地图
        map: null, 
        
        //游戏层
        gamelayer: null, 
        maplayer: null, 
        bonuslayer: null,

        enemyMaxCount: 30, //场面上最多多少敌人
        
        //全局位移的ID
        guid: 1000,
        
        //用户
        userModel: null,

        /**
         * 整个游戏的真正入口
         */
        start: function() {
            //UserTest.testExp();
            
            this.w = cc.winSize.width;
            this.h = cc.winSize.height;
            //资源预加载
            this.preLoadResource();
            //清空
            Game.container.players = [];
            Game.container.bullets = [];
            Game.container.enemys = [];
            Game.container.tanks = [];
            Game.container.map_plant = [];
            Game.container.map_enemy_plant = [];
            Game.container.map_t = [];
            
            Game.user.theme = 0;
            Game.user.step = 0;
            
            //获取用户存档数据
            var userModel = new UserModel();
            //userModel.clearAll(); //清空存档
            this.userModel = userModel;

            //显示菜单场景
            cc.director.runScene(new StartScene());
        },

        preLoadResource: function() {
        	
            cc.spriteFrameCache.addSpriteFrames(res.images_plist, res.images_png);

        }
}