
/**
 * 用户测试
 */
var UserTest = {
    
    /**
     * 解锁关卡测试
     */
    testExp: function() {
        
        var userModel = new UserModel();
        userModel.clearAll();
        
        var a = userModel.getStepUnlock(0);
        cc.assert(a == 0, "testExp1");
            
        userModel.setStepUnlock(0, 0);
        var a = userModel.getStepUnlock(0);
        cc.assert(a == 0, "testExp2");

        userModel.setStepUnlock(0, 0);
        var a = userModel.getStepUnlock(0);
        cc.assert(a == 0, "testExp3");
    }

};

