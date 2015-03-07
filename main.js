/**
 * 知识点：
 * 
 * 自定义加载进度界面
 * 精灵复用 cc.pool
 * 虚拟摇杆
 * 放大资源素材（原地图是比较小的）
 * 
 */

cc.game.onStart = function(){
    cc.view.adjustViewPort(true);
    
    //设计分辨率 DW,DH
    //cc.view.setDesignResolutionSize(960, 640, cc.ResolutionPolicy.SHOW_ALL);
    
    //保持传入的设计分辨率高度不变，根据屏幕分辨率修正设计分辨率的宽度。这边 放大资源素材（原地图是比较小的）
    //cc.view.setDesignResolutionSize(960, 416, cc.ResolutionPolicy.FIXED_HEIGHT);
    cc.view.setDesignResolutionSize(960, 640, cc.ResolutionPolicy.SHOW_ALL);
    
    cc.view.resizeWithBrowserSize(true);
    
    //原资源图片太小，需要放大 RH/DH
    //cc.director.setContentScaleFactor(416/640);
    
    //资源预加载
    cc.LoaderScene.preload(g_resources, function () {
        //自定义加载进度界面
        //Loading.preload(g_resources, function () {
        Game.start();
    }, this); 
    
};

cc.game.run();