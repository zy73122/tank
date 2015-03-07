
/**
 * 用户数据模型
 */
var UserModel = cc.Class.extend({
    ls: null,
    
    ctor: function () {
        this.ls = cc.sys.localStorage;
    },
    
    _set: function(key, value) {
        this.ls.setItem(key, value);
    },

    _get: function(key) {
        return this.ls.getItem(key);
    },
    
    clearAll: function() {
        this.ls.removeItem('exp');
        this.ls.removeItem('lev');
        this.ls.removeItem('stepUnlock:0');
        this.ls.removeItem('stepUnlock:1');
        this.ls.removeItem('stepUnlock:2');
    },

    /**
     * 经验
     */
    initExp: function(val) {
        return this._set('exp', val || 0);
    },
    
    incrExp: function(count) {
        var data = this.getExp();
        return this._set('exp', data + count);
    },

    getExp: function() {
        return parseInt(this._get('exp') || 0);
    },

    /**
     * 等级
     */
    initLev: function(val) {
        return this._set('lev', val || 1);
    },

    incrLev: function(count) {
        var data = this.getLev();
        return this._set('lev', data + count);
    },

    getLev: function() {
        return parseInt(this._get('lev') || 1);
    },
    
    /**
     * 存储已解锁的关卡
     * @param themeId 主题ID
     * @param stepId 解锁的关卡ID
     */
    setStepUnlock: function(themeId, stepId) {
        var data = this.getStepUnlock(themeId);//已解锁的最大关卡
        if (data < stepId) {
            this._set('stepUnlock:'+themeId, stepId);
        }
    },

    /**
     * 获取已解锁的关卡
     */
    getStepUnlock: function(themeId) {
        //this.ls.removeItem('stepUnlock');
        return parseInt(this._get('stepUnlock:'+themeId) || 0);
    }


});

