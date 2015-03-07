
/**
 * 随机显示的奖励物品
 */
var BonusLayer = cc.Layer.extend({
    
    ctor:function () {
        this._super();
        
        Game.bonuslayer = this;
        
        //定时生成奖励
        this.schedule(this.showRandomBonus, 20);

        //奖励碰撞
        this.schedule(this.checkTake, 0.2);
    },

    /**
     * 生成奖励物品
     * 概率计算公式： probability% * (1/bonusMaxCount)
     */
    showRandomBonus: function() {
        
        //生成随机数
        var bonusMaxCount = toolArray.count(glb_config.bonusType);
        var randType = Helper.randRange(1, bonusMaxCount) - 1;
        //cc.log('rand:'+randType);  
        
        //如果符合概率，生成奖励精灵放上舞台
        var rand = Helper.randRange(1, 100);
        //cc.log('rand2:'+rand);
        if (Bonus.isAppear(randType, rand)) {
            var sp = Bonus.create(randType);
            
            //生成点不能跟坦克、总部等重叠  TODO
            var randW = Helper.randRange(32, Game.w - 32);
            var randH = Helper.randRange(32, Game.h - 32);
            sp.x = randW - randW % Game.tile_w;
            sp.y = randH - randH % Game.tile_h;
        }
        
    },

    /**
     * 检测坦克是否获得奖励物品
     */
    checkTake: function() {
        
        for (var k in Game.container.bonuss) {
            var bonus = Game.container.bonuss[k];
            var uTank = Game.user.tank;
            if (Helper.isCollide(bonus, uTank)) {
                uTank.obtainBonus(bonus);
                bonus.death();
            }
        }
        
    }


});