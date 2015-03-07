
//子弹基类
var Bullet = object.extend({
    sprite: null,
    active: true,
    type: 0, //子弹类型
    speed: 1, //速度
    hpMax:1, //生命
    hp:1, //生命
    faction: 0, //阵营
    blastName: null, //死亡爆炸
    textureNames: null, //纹理
    ctor: function (type, speed, faction) {
        var bulletType = glb_config.bulletType[type];
        var textureNames = bulletType.textureNames;
        var spriteName = "#"+bulletType.textureNames[0];
        this._super(spriteName);

        this.reuse(type, speed, faction);

        //画边框
        this.drawBolid();

    },
    
    /**
     * 停用
     */
    unuse: function () {
        //this.retain();//if in jsb  
        this.stopAllActions();
        this.setVisible(false);
        this.removeFromParent(true);
        
        delete Game.container.bullets[this.id];
    },

    /**
     * 复用
     */
    reuse: function (type, speed, faction) {
        var bulletType = glb_config.bulletType[type];
        var blastName = bulletType.blastName;
        var textureNames = bulletType.textureNames;

        this.type = type;
        this.blastName = blastName;
        this.textureNames = textureNames;
        
        this.active = true;
        this.visible = true;
        this.hp = this.hpMax;
        this.type = type;
        this.speed = speed;
        this.faction = faction;
        
        //动画
        var animate = Helper.createAnimationWidthFrame(this.textureNames);
        this.runAction(animate); 

        //添加到层
        Game.gamelayer.addChild(this, 2);
        Game.container.bullets[this.id] = this;
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
     * 射向指定方向
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
     * 多重箭（暂时没用）
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
        var rect = cc.rect(- this.width/2, - this.height/2, this.width, this.height);
        //cc.log(this.getBoundingBox().toSource());
        return rect;  
    },

    /**
     * 死亡
     */
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

            this.runAction(cc.sequence(animate, cc.delayTime(0.01), cc.callFunc(function(node) {

                cc.pool.putInPool(node);
                //cc.log('putInPool bullet'); 

                //Sound.playBlast(); TODO 声音
            }, this)));
        }
    }
});


/**
 * 创建可复用的子弹
 */
Bullet.create = function (type, speed, faction) {
    if (cc.pool.hasObject(Bullet)) {
        cc.log('reuse bullet, total:'+toolArray.count(Game.container.bullets));
        return cc.pool.getFromPool(Bullet, type, speed, faction);
    }
    var bullet = new Bullet(type, speed, faction);
    bullet.retain();
    return bullet;
}
