
//基类
var object = cc.Sprite.extend({
    sprite: null,
    draw: 0,
    id: 100, //自增ID
    ctor: function(v) {
        this._super(v);
        //this.retain();
        
        this.id = this.getNewID();
    },
    update : function(dt) {
        if (typeof(this.active) != 'undefined' && this.active) {
            var x = this.x;
            var y = this.y;
            if ((x < 0 || x > Game.w) || (y < 0 || y > Game.h)) {
                this.death();
            }
            if (this.hp <= 0) {
                this.death();
            }
        }
    },
    /**
     * 销毁
     * @param node
     */
    death: function() {
        this.active = false;
        this.visible = false;
        this.stopAllActions();
        this.unscheduleAllCallbacks();
        cc.pool.putInPool(this);
        cc.log('putInPool');
    },
    /**
     * 初始状态
     */
    sleep: function() {
        this.active = false;
        this.visible = false;
    },
    /**
     * 受攻击
     */
    hurt: function() {
        this.hp--;
    },
    hide: function() {
        this.visible = false;
    },
    show: function() {
        this.visible = true;
    },
    /**
     * 碰撞区域
     */
    collideRect: function () {
        var rect = cc.rect(- this.width/2, - this.height/2, this.width, this.height);
        //cc.log([this.x - this.width/2, this.y - this.height/2, this.wdith, this.height].toSource());
        //var draw = new cc.DrawNode();
        //draw.drawRect(cc.p(this.x - this.width/2, this.y - this.height/2), cc.p(this.x + this.width/2, this.y + this.height/2), null, 2, cc.color(255, 0, 255, 255));
        return rect;
    },
    /**
     * 绘制边框
     */
    drawBolid: function() {
        if (!glb_config.drawLine) return;
        var rect = this.collideRect();
        var rect = cc.rect(rect.x + rect.width/2, rect.y + rect.height/2, rect.width, rect.height);
        //rect = cc.rect(rect.x + rect.x, pos.y + rect.y, rect.width, rect.height);
        var draw = new cc.DrawNode();
        this.addChild(draw);
        //cc.log("test:" + [rect.x,rect.y,rect.width,rect.height].toSource() );   
        draw.drawRect(cc.p(rect.x, rect.y), cc.p(rect.x + rect.width, rect.y + rect.height), null, 1, cc.Color(0, 255, 255, 255));

        //cc.log(draw.getAnchorPoint().toSource());
        //cc.log(draw.getPosition().toSource());
        //draw.drawRect(cc.p(-30, -30), cc.p(30, 30), null, 2, cc.Color(0, 255, 255, 255));
    },
    
    /**
     * 获取全局唯一ID
     * @returns {Number}
     */
    getNewID: function() {
        return Game.guid++;
    }
});
