/**
 * 敌人管理
 */
var EnemyManager = cc.Sprite.extend({
    
    ctor: function (f1, f2, f3) {
        this._super(s_grossini);
        this.reuse(f1, f2, f3);
    },
    
    update: function(dt) {
    }
    
});

