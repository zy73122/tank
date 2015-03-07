
//奖励物品
var Bonus = object.extend({
    active: true,
    type: 0, //类型
    textureNames: null, //纹理
    ctor: function (type) {
        this._super();

        this.reuse(type);
    },
    
    /**
     * 停用
     */
    unuse: function () {
        //this.retain();//if in jsb  
        this.stopAllActions();
        this.setVisible(false);
        this.removeFromParent(true);
        
        delete Game.container.bonuss[this.id];
    },

    /**
     * 复用
     */
    reuse: function (type) {
        var bonusType = glb_config.bonusType[type];
        var textureNames = bonusType.textureNames;
        var probability = bonusType.probability;
        
        this.type = type;
        this.textureNames = textureNames;
        this.probability = probability;
        
        this.active = true;
        this.visible = true;

        //先设置皮肤，用于sprite计算自己的大小 （this._super()带来的无法得到sprite的宽高的问题）
        this.setSpriteFrame(this.textureNames[0]);
        
        //动画
        var animate = Helper.createAnimationWidthFrame(this.textureNames);
        this.runAction(animate);

        //闪速
        var action = cc.blink(1, 1).repeatForever();
        this.runAction(action);

        //添加到层
        Game.bonuslayer.addChild(this);
        Game.container.bonuss[this.id] = this;
    },
    
    /**
     * 碰撞区域
     */
    collideRect: function () {
        var rect = cc.rect(- this.width/2, - this.height/2, this.width, this.height);
        return rect;  
    }
    
});


/**
 * 创建可复用的奖励物品
 */
Bonus.create = function (type) {
    if (cc.pool.hasObject(Bonus)) {
        return cc.pool.getFromPool(Bonus, type);
    }
    var bonus = new Bonus(type);
    bonus.retain();
    return bonus;
}

/**
 * 判断是否出现奖励物品，根据概率配置
 * @param rand
 * @returns
 */
Bonus.isAppear = function(bonusType, rand) {

    //读取配置
    var cfgBonus = glb_config.bonusType[bonusType];
    var probability = cfgBonus.probability;

    if (rand <= probability) {
        return true;
    }
    return false;
}
