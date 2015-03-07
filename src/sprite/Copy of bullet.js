
//子弹基类
var Bullet = object.extend({
    sprite: null,
    active: true, 
    speed: 1, //速度
    hpMax:1, //生命
    hp:1, //生命
    ctor: function (type, speed) {
        var bulletType = glb_config.bulletType[type];
        var textureNames = bulletType.textureNames;
        var spriteName = "#"+bulletType.textureNames[0];
        this._super(spriteName);
        this.active = true;
        this.visible = true;
        this.type = type;
        this.speed = speed;

        //动画
        var animate = Helper.createAnimationWidthFrame(textureNames);
        this.runAction(animate); 

        //画边框
        this.drawBolid();

        //添加到游戏层中
        Game.gamelayer.addChild(this, 2);
        Game.container.bullets.push(this);
    },
    /**
     * 射向指定点
     * @param targetPos 目标点
     * @param length 射程
     */
    shootToPoint: function(targetPos, length) {
        var length = length || cc.winSize.width; //射击距离
        var shootVector = cc.pSub(targetPos, this.getPosition());
        var normalizedVector = cc.pNormalize(shootVector);
        //var farthestPoint = normalizedVector * cc.winSize.width;
        var farthestPoint = cc.pAdd(this.getPosition(), cc.pMult(normalizedVector, length));
        //cc.log((normalizedVector).toSource());
        var bulletSpeed = this.speed;
        var duration = cc.pDistance(farthestPoint, this.getPosition()) / bulletSpeed;
        //this.stopAllActions();
        this.runAction(cc.sequence(cc.moveTo(duration, farthestPoint), cc.callFunc(this.death, this)));
    },
    /**
     * 射向指定方向（暂时没用）
     * @param normalizedVector
     * @param length 射程
     */
    shootToDirection: function(normalizedVector, length) {
        var length = length || cc.winSize.width; //射击距离
        var farthestPoint = cc.pAdd(this.getPosition(), cc.pMult(normalizedVector, length));
        var bulletSpeed = this.speed;
        var duration = cc.pDistance(farthestPoint, this.getPosition()) / bulletSpeed;
        this.runAction(cc.sequence(cc.moveTo(duration, farthestPoint), cc.callFunc(this.death, this)));
    },
    /**
     * 多重箭
     * @param targetPos 目标点
     * @param length 射程
     */
    shootArrow: function(targetPos, length) {
        var length = length || cc.winSize.width; //射击距离
        var shootVector = cc.pSub(targetPos, this.getPosition());
        var normalizedVector = cc.pNormalize(shootVector);
        var farthestPoint = cc.pAdd(this.getPosition(), cc.pMult(normalizedVector, length));
        var bulletSpeed = this.speed;
        var duration = cc.pDistance(farthestPoint, this.getPosition()) / bulletSpeed;
        this.stopAllActions();
        this.runAction(cc.sequence(cc.moveTo(duration, farthestPoint), cc.callFunc(this.death, this)));
    },
    /**
     * 碰撞区域
     */
    collideRect: function () {
        //var rect = cc.rect(this.x - this.width/2, this.y - this.height/2, this.wdith, this.height);
        //var rect = cc.rect(this.x + 28, this.y + 14, 26, 52);
        //var rect = cc.rect(28, 14, 26, 52);
        var rect = cc.rect(0, 0, this.width, this.height);
        //cc.log(this.getBoundingBox().toSource());
        return rect;  
    }
});



/**
 * 创建可复用的子弹
 */
Bullet.senseCreate = function(type, speed) {
    if (Game.container.bullets.length > 0) {
        for (var k in Game.container.bullets) {
            var bullet = Game.container.bullets[k];
            if (!bullet.active && bullet.type == type) {
                bullet.active = true;
                bullet.visible = true;
                bullet.hp = bullet.hpMax;
                //bullet.speed = 100;

                //添加到游戏层中
                Game.gamelayer.addChild(bullet, 2);
                
                cc.log('reuse bullet, total:'+Game.container.bullets.length);
                return bullet;
            }
        }
    }

    var bullet = new Bullet(type, speed);
    bullet.retain();
    return bullet;
}


/**
 * 创建新的子弹
 */
Bullet.preCreate = function(type, count) {
    for (var i=0; i<count; i++) {
        var bullet = new Bullet(type);
        bullet.retain();
    }
}
