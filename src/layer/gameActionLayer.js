var GameActionLayer = cc.Layer.extend({

    ctor:function () {
        this._super();

        //键盘事件
//        this.onKeyboardListener(this);

        //添加摇杆控制层
       this.addJoystickA();
       this.addJoystickB();
    },
    
    onKeyboardListener: function(bg) {
        //添加键盘事件
        var listener = new cc.EventListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function(keyCode, event){
                //cc.log("Key " + keyCode.toString() + " was pressed!");
                var target = event.getCurrentTarget();
                if (cc.KEY["a"] == keyCode) {
                    cc.log("A is pressed");
                }
                //通过判断keyCode来确定用户按下了哪个键
                var direction = null;
                switch (keyCode - 3) { //TODO BUG
                case cc.KEY.up:
                case cc.KEY.w:
                    direction = Game.GAME_DIRECTION_UP;
                    break;
                case cc.KEY.down:
                case cc.KEY.s:
                    direction = Game.GAME_DIRECTION_DOWN;
                    break;
                case cc.KEY.left:
                case cc.KEY.a:
                    direction = Game.GAME_DIRECTION_LEFT;
                    break;
                case cc.KEY.right:
                case cc.KEY.d:
                    direction = Game.GAME_DIRECTION_RIGHT;
                    break;
                }
                
                if (direction) {
                    Game.user.tank.setDirection(direction);
                    Game.user.tank.setMoving(1);
                }
            },
            onKeyReleased: function(keyCode, event){
                Game.user.tank.setDirection(cc.p(0,0));
                Game.user.tank.setMoving(0);
            }

        });
        
        cc.eventManager.addListener(listener, this);
    },
    
    addJoystickA: function() {

        //添加摇杆A
        var ajs = new cc.Sprite("res/joystick/1/control_center.png");
        var ajsBg = new cc.Sprite("res/joystick/1/control_bg.png");
        //ajs.setScale(0.5);
        //ajsBg.setScale(0.5);
       // cc.log("ajsBgWidth:"+radius)
        var joystick = new JoystickA(cc.p(100, 100), 100, ajs, ajsBg);
        this.addChild(joystick, 100);
        joystick.radius = ajsBg.getContentSize().width*ajsBg.getScale()>>1;
        
        //绑定回调
        //cc.log('aa'+Game.user.tank.toSource());
        joystick.bindCallback(Tank.onJoystickAUpdate, Game.user.tank);
        joystick.bindTouchBeganCallback(Tank.onJoystickATouchBegan, Game.user.tank);

        //激活摇杆
        joystick.jsActive();
    },

    addJoystickB: function() {
        //添加摇杆B
        var btnPress = new cc.Sprite("res/joystick/1/fire_button_press.png");
        var btnDefault = new cc.Sprite("res/joystick/1/fire_button_default.png");
        //btnPress.setScale(0.5);
        //btnDefault.setScale(0.5);
        var radius = 38;
        var joystick = new JoystickB(cc.p(cc.winSize.width - 80, 80), radius, btnPress, btnDefault);
        this.addChild(joystick, 100);

        joystick.bindCallback(Tank.onJoystickBUpdate, Game.user.tank);
        joystick.jsActive();
    }


});