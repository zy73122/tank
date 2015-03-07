
/**
 * 摇杆 攻击按钮
 */

/*


        //添加摇杆B
        var btnPress = cc.Sprite("res/joystick/2/fire_button_press.png");
        var btnDefault = cc.Sprite("res/joystick/2/fire_button_default.png");
        var addRadius = 0;
//        var btnPress = cc.Sprite("res/joystick/1/fire_button_press.png");
//        var btnDefault = cc.Sprite("res/joystick/1/fire_button_default.png");
//        var addRadius = 0;
        var joystick = new JoystickB(cc.p(cc.winSize.width - 80, 80), radius, btnPress, btnDefault);
        this.addChild(joystick, 100);

        joystick.bindCallback(function(dt, target, isHitOn) {
            if (isHitOn) {
                target.runAction(cc.tintBy(0.5, 0, 255, 0));
                cc.log('fire now!');
            }
        }, helloLabel);
        joystick.jsActive();



 */
var JoystickB = cc.Layer.extend({

    centerPoint: null,    //中心点
    isActive: false,      //是否激活
    btnPress: null,       //按钮被按下
    btnDefault: null,     //按钮
    touchListener: null,  //触摸事件
    isHitOn: null,        //是否被按下

    target: null,         //
    callfun: null,        //攻击按钮回调函数

    /**
     * 初始化 point是摇杆中心 addRadius是摇杆半径附加值 aJsBg是摇杆背景
     */
    ctor: function(point, addRadius, btnPress, btnDefault) {
        this._super();

        this.centerPoint = point;
        this.isActive = false;
        this.isHitOn = false;
        //this.radius = radius;

        this.btnDefault = btnDefault;
        this.btnDefault.setPosition(this.centerPoint);
        this.addChild(btnDefault, 1);

        this.btnPress = btnPress;
        this.btnPress.setPosition(this.centerPoint);
        this.addChild(btnPress, 2);
        
        this.radius = this.btnDefault.width + addRadius;

        //触摸事件
        var _this = this;
        this.touchListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget();
                if (!_this.isActive) {
                    return false;
                }

                var touchPoint = target.convertToNodeSpace(touch.getLocation());
                //var touchPoint = cc.director.convertToGL(touch.getLocation());
                
                //触摸点在合理范围内
                if (cc.pDistance(touchPoint, _this.centerPoint) < _this.radius) {

                    _this.btnPress.runAction(cc.fadeTo(0.05, 255));
                    _this.btnDefault.runAction(cc.fadeTo(0.05, 0));

                    _this.isHitOn = true;

                    cc.log('捏到了');
                    return true;
                }   

                return false;
            },
            onTouchMoved: function (touch, event) {
                var target = event.getCurrentTarget();
                var touchPoint = target.convertToNodeSpace(touch.getLocation());

//                _this.btnPress.runAction(cc.fadeTo(0.05, 255));
//                _this.btnDefault.runAction(cc.fadeTo(0.05, 0));

                //触摸点最大不超过摇杆区域的半径
                if (cc.pDistance(touchPoint, _this.centerPoint) < _this.radius) {
                    _this.isHitOn = true;
                }
            },
            onTouchEnded: function (touch, event) {

                _this.btnPress.runAction(cc.fadeTo(0.05, 0));
                _this.btnDefault.runAction(cc.fadeTo(0.5, 100));

                _this.isHitOn = false;
            }
        });
        
        return true;
    },

    /**
     * 绑定回调
     * @param callfun update时回调函数
     */
    bindCallback: function(callfun, target) {
        this.target = target;
        this.callfun = callfun;
    },

    /**
     * 启动摇杆
     */
    jsActive: function() {
        if (!this.isActive) {
            this.isActive = true;

            this.btnPress.runAction(cc.fadeTo(0.5, 0));
            this.btnDefault.runAction(cc.fadeTo(0.5, 100));

            //添加触摸委托
            cc.eventManager.addListener(this.touchListener, this);
            
            //添加更新函数
            this.schedule(this.upDatePos, 0.1);
        }
    },

    /**
     * 解除摇杆
     */
    jsUnActive: function() {
        if (this.isActive) {
            this.isActive = false;

            this.btnDefault.runAction(cc.fadeTo(0.5, 100));

            //删除触摸委托
            cc.eventManager.removeListener(this.listener);

            //删除更新函数
            this.unschedule(this.upDatePos);
        }
    },

    /**
     * 更新
     */
    upDatePos: function(dt) {

        if (this.callfun) {
            
            //回调精灵动作
            this.callfun(dt, this.target, this.isHitOn);
        }
    }

});
