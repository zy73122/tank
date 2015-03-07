
/**
 * 总部
 */
var Home = object.extend({
    active: true,
    hpMax:1, //生命
    hp:1, //生命
    textureNames: null, //纹理
    blastName: null, //死亡爆炸
    wall: [], //总部外墙
    ctor: function (type) {
        var type = type || 0;
        var homeCfg = glb_config.home[0];
        var textureNames = homeCfg.textureNames;
        var blastName = homeCfg.blastName;
        var wall = homeCfg.wall;
        var hp = homeCfg.hp;
        this._super("#"+textureNames[0]);

        this.textureNames = textureNames;
        this.blastName = blastName;
        this.wall = wall;
        this.active = true;
        this.visible = true;
        this.hp = this.hpMax = hp;
        
        //动画
        if (textureNames.length > 0) {
            var animate = Helper.createAnimationWidthFrame(textureNames);
            this.runAction(animate);
        }

        //添加到层
        Game.gamelayer.addChild(this);
        Game.container.home = this;
    },

    /**
     * 死亡
     */
    death: function() {
        cc.log('death');
        //爆炸
        if (this.blastName) {
            this.active = false;
            //this.visible = false;
            this.stopAllActions();
            this.unscheduleAllCallbacks();

            var animate = Helper.createAnimationWidthFrame(this.blastName, 0.1, 1);
            animate.x = this.width/2;
            animate.y = this.height/2;

            this.runAction(animate);
        }
    },

    /**
     * 总部外墙变身
     * GID：砖块=1，石头=17
     */
    wallShapeChange: function(gid) {
        var _this = this;
        for (var k in this.wall) {
            var pos = this.wall[k];
            var spr = Game.maplayer.getTileSpritePoint(pos);
            if (spr) {
                Game.maplayer.setTileGID(gid, pos);
            } else {
                Game.maplayer.setTileGID(gid, pos);
            }
        }
    },
    
    /**
     * 总部外墙保护
     */
    protect: function(time) {
        var _this = this;
        //变为石头
        var actionChangeToStone = cc.callFunc(function() {
            _this.wallShapeChange(17);
        });
        //变为砖块
        var actionChangeToBrick = cc.callFunc(function() {
            _this.wallShapeChange(1);
        });
        var action = cc.sequence(actionChangeToStone, cc.delayTime(0.6), actionChangeToBrick, cc.delayTime(0.6));
        this.runAction(cc.sequence(actionChangeToStone, cc.delayTime(time), cc.repeat(action, 8)));
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
