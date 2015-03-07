
//坦克
var Tank = object.extend({

    active: true,
    hp:1, //生命
    hpMax:100, //生命最大值
    direction:Game.GAME_DIRECTION_UP, //方向
    isMoving: 0, //是否在移动

    type: 0, //坦克类型
    level: 1, //当前等级
    levelMax: 3, //等级最大值
    protectName: null, //保护套
    blastName: null, //死亡爆炸
    levelUpName: null, //升级效果
    lifeAddName: null, //生命增加效果
    score: 0, //被消灭时，对方得到的分数
    textureNames: null, //纹理
    bulletType: null, //子弹类型
    bulletSpeed: null, //子弹速度
    shootType: 1, //发射类型 0=瞄准发射 
    onceCount: 1, //每次同时发射几颗 
    speed: 4, //速度
    faction: 0, //阵营
    moveAction:null,
    isArrive:true,//缓动是否已经完成
    oldDirection:null,//旧方向

    isProtect: false, //是否处于保护状态
    isCollision: false, //是否处于碰撞状态

    ctor: function(type, direction, faction) {
        this._super();

        this.reuse(type, direction, faction);


        //画边框
        //this.drawBolid();

        //画序号
        var idLable = new cc.LabelTTF(this.id, "Arial", 20);
        idLable.x = this.width/2;
        idLable.y = this.height/2;
        this.addChild(idLable); 
    },

    update: function(dt) {
        this._super();
        if (this.isMoving && this.isArrive && (this.direction.x || this.direction.y)) {
            this.setDirection(this.direction);
            
            //坦克位于冰面上时，速度加快
            var speed = this.speed;
            for (var k in Game.container.map_ice) {
                if (cc.pDistance(Game.container.map_ice[k], this.getPosition()) < 32) {
                    speed *= 1.5;
                }
            }

            var nextX = this.x + this.direction.x * speed; //
            var nextY = this.y + this.direction.y * speed;
            //cc.log(this.x +' ' +this.y);
            //cc.log('speed' + this.speed);
            //cc.log('ismoving' + this.isMoving);

            //坦克之间的碰撞
            for (var k in Game.container.tanks) {
                var tank = Game.container.tanks[k];
                if (!tank.active) continue;

                if (tank.isCollision) {
                    continue;
                }

                if (tank == this) continue; 

                //两辆坦克是否在靠近
                var s0 = Math.round(cc.pLength(cc.pSub(this.getPosition(), tank.getPosition())));
                var s1 = Math.round(cc.pLength(cc.pSub(cc.pAdd(this.getPosition(), this.direction), cc.pAdd(tank.getPosition(), tank.direction))));
                var isCloseto = s1 < s0 ? true : false;

                //cc.log("iscloseto1:" + isCloseto + ",s0:" + s0 + ",s1:" + s1);     
                //坦克之间距离太近的话，需要分开
                if (isCloseto && cc.pDistance(tank.getPosition(), this.getPosition()) < this.width) {

                    //碰撞后，如果是玩家坦克则停下来，如果是敌人则转向
                    if (this.isPlayer()) {
                        this.isMoving = 0;

                    } else {

                        //this.setDirection(cc.pNeg(this.direction));
                        //tank.setDirection(cc.pNeg(tank.direction));
                        this.setRandDirection();
                        tank.setRandDirection();

                        //方向变了，重新计算下一个位置坐标
                        nextX = this.x + this.direction.x * speed; //
                        nextY = this.y + this.direction.y * speed;

                    }
                    tank.setIsCollion(true);
                    this.setIsCollion(true);
                    return;
                } 
                tank.setIsCollion(false);

            }

            //获取下一时刻坦克的外壳那点checkPoint
            var distrance;
            var fixX;
            var fixY;
            var time;
            var gridTime=0.5;

            var checkPoints = [];
            if (this.direction.x < 0) {
                /*
                 * 如果坦克是向左行驶，则获取坦克左边外壳上的3个点
                 * 这三个点分别是：
                 * 1、左边中点
                 * 2、左边最上面一个图块的中点。 由于一个坦克是由4x4的图块组成，所以这个点的Y坐标 = 左边中点Y坐标 + 坦克高度 * 3/8
                 * 3、左边左下面一个图块的中点 
                 */
                checkPoints.push(cc.p(nextX - this.width/2, nextY));
                checkPoints.push(cc.p(nextX - this.width/2, nextY + this.height*3/8));
                checkPoints.push(cc.p(nextX - this.width/2, nextY - this.height*3/8));

                distrance=nextX%32;
                fixX=Math.floor(nextX/32)*32;
                fixY=nextY;
            } else if (this.direction.x > 0) {
                checkPoints.push(cc.p(nextX + this.width/2, nextY));
                checkPoints.push(cc.p(nextX + this.width/2, nextY + this.height*3/8));
                checkPoints.push(cc.p(nextX + this.width/2, nextY - this.height*3/8));

                distrance=Math.ceil(nextX/32)*32-nextX;
                fixX=Math.ceil(nextX/32)*32;
                fixY=nextY;
            } else if (this.direction.y < 0) {
                checkPoints.push(cc.p(nextX, nextY - this.height/2));
                checkPoints.push(cc.p(nextX + this.width*3/8, nextY - this.height/2));
                checkPoints.push(cc.p(nextX - this.width*3/8, nextY - this.height/2));

                distrance=nextY%32;;
                fixX=nextX;
                fixY=Math.floor(nextY/32)*32;
            } else if (this.direction.y > 0) {
                checkPoints.push(cc.p(nextX, nextY + this.height/2));
                checkPoints.push(cc.p(nextX + this.width*3/8, nextY + this.height/2));
                checkPoints.push(cc.p(nextX - this.width*3/8, nextY + this.height/2));

                distrance=Math.ceil(nextY/32)*32-nextY;
                fixX=nextX;
                fixY=Math.ceil(nextY/32)*32;
            }

            for (var k in checkPoints) {
                var checkPoint = checkPoints[k];
                
                //检测外壳上的点是否障碍点，非障碍点才可以移动
                if (Game.maplayer.checkObstacleMove(checkPoint)) {

                    //碰撞后，如果是玩家坦克则停下来，如果是敌人则转向
                    if (this.isPlayer()) {
                        this.isMoving = 0;
                    } else {
                        this.setRandDirection();
                    }
                    this.setIsCollion(true);
                    return;
                }
            }

            this.x = nextX;
            this.y = nextY;
            this.setIsCollion(false);
            //缓动（坦克坐标始终保持与格子一致）
            time=gridTime*distrance/32;
            if(this.moveAction!=null){
                this.stopAllActions();
                this.moveAction=null;
            }
            this.isArrive=false;
            this.setMoveAction(this.runAction(new cc.Sequence(cc.MoveTo(time,cc.p(fixX,fixY)),cc.CallFunc(this.moveComplete.bind(this)))));
        }
    },
    moveComplete:function(){
        //cc.log("move complete")
        this.isArrive=true;
        this.setMoveAction(null);
    },
    setMoveAction:function(action){
        this.moveAction=action;
    },
    /**
     * 停用
     */
    unuse: function () {
        cc.log("unuse tank:"+this.id);
        this.hp = 1;
        this.level = 1;
        this.active = false;
        this.visible = false;

        /**
         * TOTO 注释掉这行后，下面的问题不再出现：
         * 原先在不管运行程序的情况，如果多次编辑该文件会出现错误提示：js_cocos2dx_Node_getPositionX : Invalid Native Object
         */
        //this.retain();//if in jsb
        this.stopAllActions();
        this.removeFromParent(true);

        if (this.isPlayer()) {
            delete Game.container.players[this.id];
        } else {
            delete Game.container.enemys[this.id];
        }
        delete Game.container.tanks[this.id];
        cc.log('杀死敌人：'+ this.id);

//      cc.log('剩余坦克：');
//      for (var k in Game.container.tanks) {
//      cc.log(Game.container.tanks[k].id);
//      }
    },

    /**
     * 复用
     */
    reuse: function (type, direction, faction) {
        //cc.log("reuse tank");
        //类型
        this.type = type;
        this.active = true;
        this.visible = true;
        this.faction = faction;
        this.isArrive = true;

        //方向
        this.setDirection(direction);

        //初始等级
        this.setLevel(1);

        //出生动画 TODO

        //设置保护套
        this.setToProtect(5);

        //this.setScale(0.4);

        //添加到层
        Game.gamelayer.addChild(this);
        if (this.isPlayer()) {
            Game.container.players[this.id] = this;
        } else {
            Game.container.enemys[this.id] = this;
        }
        Game.container.tanks[this.id] = this;
    },

    /**
     * 碰撞区域
     */
    collideRect: function () {
        //var rect = cc.rect(this.x - this.width/2, this.y - this.height/2, this.wdith, this.height);
        var rect = cc.rect(- this.width/2, - this.height/2, this.width, this.height);
        //cc.log(this.getBoundingBox().toSource());
        return rect;  
    },

    /**
     * 创建基础动画
     */
    createBase : function(frameFiles) {
//      if (this.getChildByTag(this.baseTag)) {
//      this.removeChildByTag(this.baseTag);
//      }
        this.stopAllActions();

        //先设置皮肤，用于sprite计算自己的大小 （this._super()带来的无法得到sprite的宽高的问题）
        this.setSpriteFrame(this.textureNames[0]);

        var animate = Helper.createAnimationWidthFrame(frameFiles);
        //animate.x = this.width/2;
        // animate.y = this.height/2;
        this.runAction(animate);
    },

    /**
     * 射击
     */
    shoot: function(node, value) {
        //cc.log("shoot");

        //射击方向
        var normalizedVector = cc.pNormalize(this.direction);

        //目标点
        var targetPos = cc.pMult(normalizedVector, Game.w);

        //发射类型 0=瞄准发射（子弹） 
        switch (this.shootType) {
        case 0:
            //装弹
            var bullet = this.fillBullet();
            bullet.shootToDirection(normalizedVector, Game.w);
            break;
        }

    },

    /**
     * 装弹
     */
    fillBullet: function() {
        //装弹
        var bullet = Bullet.create(this.bulletType, this.bulletSpeed, this.faction);
        bullet.setPosition(cc.pAdd(this.getPosition(), cc.pMult(this.direction, this.width/2))); //子弹在炮口位置
        //cc.log(bullet.getAnchorPoint().toSource());

        //调整子弹的方向 ，使其与坦克方向一致（初始方向是向上）
        var radians = cc.pToAngle(this.direction) - Math.PI/2;
        bullet.rotation = cc.radiansToDegrees(-radians);
        return bullet;
    },

    /**
     * 设置等级
     * @param lev
     */
    setLevel: function(lev) {

        var tankType = glb_config.tankType[this.type];
        var levstr = 'levels_' + lev;
        var levelMax = tankType.levelMax;
        var protectName = tankType.protectName;
        var blastName = tankType.blastName;
        var levelUpName = tankType.levelUpName;
        var lifeAddName = tankType.lifeAddName;
        var score = tankType.score;
        var textureNames = tankType[levstr].textureNames;
        var bulletType = tankType[levstr].bulletType;
        var bulletSpeed = tankType[levstr].bulletSpeed;
        var shootType = tankType[levstr].shootType;
        var onceCount = tankType[levstr].onceCount;
        var speed = tankType[levstr].speed;

        this.levelMax = levelMax;
        this.protectName = protectName;
        this.blastName = blastName;
        this.levelUpName = levelUpName;
        this.lifeAddName = lifeAddName;
        this.score = score;
        this.textureNames = textureNames;
        this.bulletType = bulletType;
        this.bulletSpeed = bulletSpeed;
        this.shootType = shootType;
        this.onceCount = onceCount;
        this.speed = speed;

        this.level = lev;

        //创建基础动画
        if (this.textureNames) {
            this.createBase(this.textureNames);
        }
    },

    /**
     * 升级
     */
    levelUp: function() {
        if (this.level < this.levelMax) {

            //升级动画
            if (this.levelUpName) {
                var animateSpr = Helper.createAnimationSprite(this.levelUpName, 0.1, 1);
                animateSpr.x = this.width/2;
                animateSpr.y = this.height;
                this.addChild(animateSpr);
                animateSpr.runAction(cc.sequence(cc.delayTime(0.8), cc.callFunc(function() {
                    //移除
                    animateSpr.removeFromParent();  
                    this.setLevel(this.level + 1);
                }, this)));
            }
        }
    },

    /**
     * 生命增加
     */
    lifeAdd: function() {
        if (this.hp < this.hpMax) {

            //升级动画
            if (this.lifeAddName) {
                var animateSpr = Helper.createAnimationSprite(this.lifeAddName, 0.1, 1);
                animateSpr.x = this.width/2;
                animateSpr.y = this.height;
                this.addChild(animateSpr);
                animateSpr.runAction(cc.sequence(cc.delayTime(0.8), cc.callFunc(function() {
                    //移除
                    animateSpr.removeFromParent();
                    Game.user.life++;
                }, this)));
            }
        }
    },

    /**
     * 设置方向
     */
    setDirection: function(direction) {
        var radians = cc.pAngle(direction, Game.GAME_DIRECTION_UP);
        if (direction.x < 0) {
            radians = - radians;   
        }
        this.rotation = cc.radiansToDegrees(radians);
        //cc.log(this.rotation);
//      cc.log([ 
//      direction, 
//      radians
//      ].toSource());
        this.direction = direction;
    },

    /**
     * 设置为移动状态
     */
    setMoving: function(ret) {
        //由于可能存在多个方向同时按下的情况，其中一个键松开时并不表示不再移动
        //this.isMoving = ret ? true : false;
        if (ret) {
            this.isMoving++;
        } else {
            this.isMoving--;
        }
    },

    /**
     * 设置随机方向
     */
    setRandDirection: function() {

        var rand = Helper.randRange(0, 3);
        var dirs = [
                    Game.GAME_DIRECTION_UP,
                    Game.GAME_DIRECTION_DOWN,
                    Game.GAME_DIRECTION_LEFT,
                    Game.GAME_DIRECTION_RIGHT
                    ];
        this.setDirection(dirs[rand]);
    },

    /**
     * 设置碰撞状态
     */
    setIsCollion: function(ret) {

        this.isCollision = ret;
    },

    /**
     * 是否是玩家的坦克 
     */
    isPlayer: function() {

        if (this.type == Game.GAME_TANK_PLAYER1 || this.type == Game.GAME_TANK_PLAYER2) {
            return true;
        }
        return false;
    },

    death: function() {
        //爆炸
        if (this.blastName) {
            this.active = false;
            //this.visible = false;
            this.stopAllActions();
            this.unscheduleAllCallbacks();

            var animate = Helper.createAnimationWidthFrame(this.blastName, 0.1, 1);
            animate.x = this.width/2;
            animate.y = this.height/2;

            cc.log('death:'+this.id);
            this.runAction(cc.sequence(animate, cc.delayTime(0.1), cc.callFunc(function(node) {

                cc.pool.putInPool(node);
                cc.log('putInPool tank'); 

                //TODO
                //Sound.playBlast();
            }, this)));
        }
    },

    /**
     * 设置保护套
     * @param time
     */
    setToProtect: function(time) {

        var time = time || 5;

        if (this.protectName) {
            if (this.getChildByTag(101)) {
                this.removeChildByTag(101);
            }
            var sprite = Helper.createAnimationSprite(this.protectName);
            sprite.x = this.width/2;
            sprite.y = this.height/2;
            this.addChild(sprite, 1, 101);
            this.isProtect = true;
            sprite.runAction(cc.sequence(cc.delayTime(time), cc.callFunc(function (node, data) {
                //移除保护套
                sprite.removeFromParent();
                node.isProtect = false;
            }, this)));
        }
    },

    /**
     * 吸收奖励物品
     * @param bonus
     */
    obtainBonus: function(bonus) {
        switch (bonus.type) {
        case Game.BONUS_TYPE_BOOM:
            //炸弹：杀死所有敌人
            var _this = this;
            toolArray.map(function(v) {
                v.death();
            }, Game.container.enemys);

            break;
        case Game.BONUS_TYPE_CLOCK:
            //时钟：暂停所有敌人10秒
            var _this = this;
            toolArray.map(function(v) {
                if (!v.active) return;
                v.pause();
                _this.runAction(cc.sequence(cc.delayTime(10), cc.callFunc(function (node, data) {
                    v.resume();
                }, _this)));
            }, Game.container.enemys);

            break;
        case Game.BONUS_TYPE_HELMET:
            //铁盔：保护自己10秒
            this.setToProtect(10);

            break;
        case Game.BONUS_TYPE_SHOVEL:
            //铁盔：保护总部15秒
            Game.container.home.protect(15);

            break;
        case Game.BONUS_TYPE_STAR:
            //星星：升一级
            this.levelUp();

            break;
        case Game.BONUS_TYPE_TANK:
            //坦克：奖励一个坦克
            this.lifeAdd();

            break;

        default:
            break;
        }
    }

});


/**
 * 响应摇杆A更新
 */
Tank.onJoystickAUpdate = function(dt, target, direction, velocity) {
    //cc.log('dir:' + direction.toSource() + ', moveStep:' + velocity);

//  var speed = 122;
//  var moveX = direction.x * dt * this.speed;
//  var moveY = direction.y * dt * this.speed;

//  //target: tank
//  target.x += moveX;
//  target.y += moveY;
    if (cc.pLength(direction) > 0) {
//      target.setDirection(direction);
        //target.update(dt);
        target.direction = direction;
        target.isMoving = 1;
    } else {
        target.isMoving = 0;
    }
}

/**
 * 响应摇杆B更新
 */
Tank.onJoystickBUpdate = function(dt, target, isHitOn) {
    if (isHitOn) {
        //target.runAction(cc.tintBy(0.5, 0, 255, 0));
        //cc.log('fire now!');
        target.shoot();
    }
}

/**
 * 响应摇杆A触摸开始
 */
Tank.onJoystickATouchBegan = function(target, touchPosition) {

    var dir = Helper.getDirection4(touchPosition, target.getPosition());
    target.setDirection(dir);
}

/**
 * 创建新的坦克
 */
Tank.create = function (type, direction, faction) {
    if (cc.pool.hasObject(Tank)) {
        return cc.pool.getFromPool(Tank, type, direction, faction);
    }
    return new Tank(type, direction, faction);
}
