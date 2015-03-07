
/**
 * 游戏逻辑层
 */
var GameLayer = cc.Layer.extend({
    map: null,
    enemyBorthKey: null, //当前敌人出生点的索引
    textureBatch: null,
    stepCount: 0, //当前关卡数
    enemySet: [], //当前关卡所有的预置敌人队列。预先生成，每隔一段时间取出一个配置并生成敌人

    ctor:function () {
        this._super();

        Game.gamelayer = this;
        
        var draw = new cc.DrawNode();
        this.addChild(draw);
        Game.container.draw = draw;

/*
        var s = new cc.Sprite("#bonus_boom.png");
        this.addChild(s);
        s.runAction(new cc.Sequence(cc.delayTime(2),cc.CallFunc(function() {
            cc.log(11);
        })));
        
        var animateSpr = Helper.createAnimationSprite(["levelup0.png","levelup1.png","levelup2.png","levelup3.png","levelup4.png","levelup5.png"], 0.1, 1);
        animateSpr.x = this.width/2;
        animateSpr.y = this.height*3/4;
        s.addChild(animateSpr);
        animateSpr.runAction(cc.sequence(cc.delayTime(0.8), cc.callFunc(function() {
            //移除
            animateSpr.removeFromParent();  
            cc.log(12); 
        }, this)));*/
        
        
        //播放音乐
//        Sound.playStartEffect();

        //我方坦克
        var tank = Tank.create(Game.GAME_TANK_PLAYER1, Game.GAME_DIRECTION_UP, Game.GAME_FACTION_PLAYER);
        var point = Game.container.map_plant[0];
        var plantPoint = cc.p(point.x + Game.maplayer.x, point.y);
        tank.setPosition(plantPoint);
        Game.user.tank = tank;
        tank.retain();
        
        //敌方坦克出生
        this.enemyPreSet();
        this.enemyBorth();
        this.enemyBorth();
        this.enemyBorth();
        this.schedule(this.enemyBorth, 0.1);

        //总部
        var home = new Home();
        var homePoint = Game.container.map_home;
        home.x = homePoint.x + Game.maplayer.x;
        home.y = homePoint.y;
        
        //启用update
        this.scheduleUpdate();

        /*
        //画图
        var container = [this.getChildren()];
        //var container = [Game.container.enemys, Game.container.bullets];
        for (var k in container) {
            var childs = container[k];
            if (typeof(childs) == 'object') {
                for (var m in childs) {
                    var child = childs[m];
                    if ('collideRect' in child) {
                        var rect = child.collideRect();
                    } else {
                        var rect = cc.rect(0, 0, child.width, child.height);
                    }
                    cc.log(child.getAnchorPoint().toSource());
                    var draw = new cc.DrawNode();
                    child.addChild(draw, 10);
                    draw.drawRect(cc.p(rect.x , rect.y), cc.p(rect.x + rect.width, rect.y +
                            rect.height), null, 1, cc.color(255, 0, 255, 128));
                }
            }
        }
         */
    },

    /**
     * 每帧更新
     * @param dt
     */
    update: function(dt) {

        //碰撞检测
        this.checkIsCollide(dt);

        //精灵更新
        this.updateSprite(dt);
        
        //胜利/失败检测
        this.checkGameStatus(dt);
    },

    /**
     * 碰撞检测
     * @param dt
     */
    checkIsCollide: function(dt) {
        //碰撞检测
        for (var k in Game.container.bullets) {
            var bullet = Game.container.bullets[k];
            if (!bullet.active) continue;

            //子弹与地图物品的碰撞检测
            var bulletPos = bullet.getPosition();
            var bulletRect = bullet.collideRect();
//          var obstacle = Game.maplayer.getObstacleByPos(bulletPos);
//            if (toolArray.inArray(obstacle, [Game.OBSTACLE_TYPE_BRICK, Game.OBSTACLE_TYPE_STONE])) {
//                bullet.hurt();
//            }
//            Game.maplayer.hurt(bulletPos, obstacle);
            
            bulletRect.x += bullet.x;
            bulletRect.y += bullet.y;
            //获取与子弹碰撞的瓦片精灵
            var tileSprs = Game.maplayer.getTileSprite(bulletRect);
            var tileSpr = tileSprs.length ? tileSprs.shift() : null;
//            if (tileSpr) {
//                //cc.log("aaa x="+tileSpr.x+",y="+tileSpr.y+",w="+tileSpr.width+",h="+tileSpr.height);
//                //cc.log("bbb x="+bullet.x+",y="+bullet.y+",w="+bullet.width+",h="+bullet.height);
//            }
            if (tileSpr && Helper.isCollide(bullet, tileSpr)) {
                var obstacle = tileSpr.obstacle;
                //判断障碍类型
                switch (obstacle) {
                case Game.OBSTACLE_TYPE_OUTSIDE:
                    //子弹受伤
                    bullet.hurt();
                    break;
                case Game.OBSTACLE_TYPE_BRICK:
                    tileSpr.setColor(cc.color(255, 0, 0, 128));
                    //子弹受伤
                    bullet.hurt();
                    //砖块受伤
                    tileSpr.hurt();
                    break;
                case Game.OBSTACLE_TYPE_GRASS:
                    break;
                case Game.OBSTACLE_TYPE_GROUND:
                    break;
                case Game.OBSTACLE_TYPE_STONE:
                    //子弹受伤
                    bullet.hurt();
                    break;
                default:
                case Game.OBSTACLE_TYPE_BLANK:
                    break;
                }
                if (bullet.hp <= 0) break;
            }

            //子弹和对方的碰撞检测（包括我方对方和敌人碰撞，敌人子弹和我方碰撞）
            for (var j in Game.container.tanks) {
                var tank = Game.container.tanks[j];
                if (!tank.active) continue;
                
                if (bullet.faction != tank.faction && Helper.isCollide(tank, bullet)) {
                    bullet.hurt();
                    tank.hurt();
                    //击毁敌人时，玩家获得经验 TODO 经验转等级
                    if (tank.hp <= 0 && tank.faction == Game.GAME_FACTION_ENEMY) {
                        Game.userModel.incrExp(tank.score);
                    }
                }
            }
            
            //子弹和总部的碰撞检测
            if (Helper.isCollide(Game.container.home, bullet)) {
                bullet.hurt();
                Game.container.home.hurt();
            }
        }
    },

    /**
     * 精灵更新
     * @param dt
     */
    updateSprite: function(dt) {
        for (var k in Game.container.tanks) {
            var tank = Game.container.tanks[k];
            if (!tank.active) continue;
            tank.update(dt);
        }
        for (var j in Game.container.bullets) {
            var bullet = Game.container.bullets[j];
            if (!bullet.active) continue;
            bullet.update(dt);
        }
        
        Game.container.home.update(dt);
    },
    
    /**
     * 胜利/失败检测
     */
    checkGameStatus: function() {
        if (Game.gameState != Game.GAME_STATE_PLAYING) {
            return;
        }
        
        //失败：
        //1、总部爆炸则
        //2、我方坦克全完
        if (Game.container.home.hp <= 0) {
            Game.user.isVictory = false;
            //显示结算场景
            cc.director.runScene(new cc.TransitionFade(1.2, new OverScene()));
        }
        
        //胜利:
        //敌人全完
        if (toolArray.count(Game.container.enemys) <=0)
        cc.log('敌人数量：'+toolArray.count(Game.container.enemys));
        if (toolArray.count(Game.container.enemys) <= 0) {
            Game.user.isVictory = true;

            //当前主题的总关卡数
            var stepCount = toolArray.count(glb_config.levelElement[Game.user.theme].steps);
            cc.log("step:"+Game.user.step);
            //解锁下一关
            if (Game.user.step < stepCount-1) {
                Game.user.step++;
                cc.log("unlock step:"+Game.user.step);
                Game.userModel.setStepUnlock(Game.user.theme, Game.user.step);
            } else {
                //如果该主题的所有关卡都通过的话，循环回到第一关
                Game.user.step = 0;
            }
            
            //显示结算场景
            cc.director.runScene(new cc.TransitionFade(1.2, new OverScene()));
        }
    },

    /**
     * 初始化本关卡的敌人
     */
    enemyPreSet: function() {
        //获取关卡敌人
        var currentLevElement = glb_config.levelElement[Game.user.theme].steps[Game.user.step]['subSteps'];

        //敌人出生的配置
        var enemys = [];
        for(var k in currentLevElement) {
            var type = currentLevElement[k].type;
            var count = currentLevElement[k].count;

            while (count > 0) {
                enemys.push({type: type});
                count--;
            }
        }
        this.enemySet = enemys;
    },
    
    /**
     * 敌人出生
     */
    enemyBorth: function () {

        //敌方坦克出生，出生点为预定的3个点的轮询
        if (toolArray.count(Game.container.enemys) < Game.enemyMaxCount && this.enemySet.length > 0) {
            var enemyBorthKey = this.enemyBorthKey || 0;
            var point = Game.container.map_enemy_plant[enemyBorthKey];
            var plantPoint = cc.p(point.x + Game.maplayer.x, point.y);

            //坦克出生
            var enemyCfg = this.enemySet.shift();
            var tank = Tank.create(enemyCfg.type, Game.GAME_DIRECTION_DOWN, Game.GAME_FACTION_ENEMY);
            tank.setPosition(plantPoint);
            tank.retain();
            
            //敌人坦克跑起来
            tank.setRandDirection();
            tank.setMoving(true);

            enemyBorthKey++;
            this.enemyBorthKey = enemyBorthKey < Game.container.map_enemy_plant.length ? enemyBorthKey : 0;
        }

    }
    
});

/**
 * 游戏主场景
 */
var GameScene = cc.Scene.extend({
    onEnter: function() {
        this._super();

        //UI层
        var layer = new GameUILayer(); 
        this.addChild(layer);

        //游戏逻辑层
        var layer = new GameLayer(); 
        this.addChild(layer);

        //奖励层
        var layer = new BonusLayer(); 
        this.addChild(layer);

        //触摸层
        var layer = new GameActionLayer(); 
        this.addChild(layer);

        //状态
        Game.gameState = Game.GAME_STATE_PLAYING;
    }
});
