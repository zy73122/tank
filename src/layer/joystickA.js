
/**
 * 摇杆
 */

/*
 * 

        //回调函数
        helloLabel.onJoystickUpdate = function(dt, target, direction, velocity) {
            //cc.log('dir:' + direction.toSource() + ', moveStep:' + velocity);

            var speed = 122;
            var moveX = direction.x * dt * speed;
            var moveY = direction.y * dt * speed;

            target.x += moveX;
            target.y += moveY;
        }
        
        //添加摇杆A
        var ajs = cc.Sprite("res/joystick/2/control_center.png");
        var ajsBg = cc.Sprite("res/joystick/2/control_bg.png");
        var addRadius = 0;
//        var ajs = cc.Sprite("res/joystick/1/control_center.png");
//        var ajsBg = cc.Sprite("res/joystick/1/control_bg.png");
//        var addRadius = 0;
        var joystick = new JoystickA(cc.p(80, 80), radius, ajs, ajsBg);
        this.addChild(joystick, 100);

        //绑定回调
        joystick.bindCallback(helloLabel.onJoystickUpdate, helloLabel);

        //激活摇杆
        joystick.jsActive();
 */

//显示方式
var SHOWTYPE_FIXED = 0; //0=固定位置
var SHOWTYPE_FOLLOW = 1; //1=跟随鼠标点击出现

var JoystickA = cc.Layer.extend({

    centerPoint: null,    //中心点
    currentPoint: null,   //当前触摸位置
    currentBgPoint: null,   //当前摇杆背景位置
    radius: null,         //半径
    isActive: false,      //是否激活
    jsSprite: null,       //摇杆
    jsSpriteBg: null,     //摇杆背景
    touchListener: null,  //触摸事件
    showType: SHOWTYPE_FIXED,          //显示方式 0=固定位置， 1=跟随鼠标点击出现
    bgSpeed: 0.1,         //背景跟随摇杆运动的速度
    
    target: null,         //
    callfun: null,        //update时回调函数
    targetTouchBegan: null,         //
    callfunTouchBegan: null,        //触摸开始的回调

    /**
     * 初始化 point是摇杆中心 addRadius是摇杆半径附加值 ajs是摇杆控制点 aJsBg是摇杆背景
     */
    ctor: function(point, addRadius, ajs, ajsBg) {
        this._super();

        this.centerPoint = point;
        this.currentPoint = this.centerPoint;
        this.currentBgPoint = this.centerPoint;
        this.isActive = false;
        //this.radius = radius;

        this.jsSprite = ajs;
        this.jsSpriteBg = ajsBg;
        this.jsSprite.setPosition(this.centerPoint);
        this.jsSpriteBg.setPosition(this.centerPoint);
        this.jsSprite.opacity = 0;
        this.jsSpriteBg.opacity = 0;

        this.addChild(ajs, 2);
        this.addChild(ajsBg, 1);

        this.radius = this.jsSpriteBg.width + addRadius;

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

                switch (_this.showType) {
                
                case SHOWTYPE_FIXED:
                    //触摸点在合理范围内
                    //cc.log("range:"+cc.pDistance(touchPoint, _this.centerPoint) +"  "+_this.radius);
                    if (cc.pDistance(touchPoint, _this.centerPoint) < _this.radius) {

                        _this.jsSprite.runAction(cc.fadeTo(0.05, 255));
                        _this.jsSpriteBg.runAction(cc.fadeTo(0.05, 255));

                        _this.currentPoint = touchPoint;

                        cc.log('摸到了');
                        if (_this.callfunTouchBegan) {
                            _this.callfunTouchBegan(_this.targetTouchBegan, touchPoint);
                        }
                        return true;
                    } 
                    break;
                    
                case SHOWTYPE_FOLLOW:
                    //触摸点位于左半频幕时有效
                    //if (touchPoint.x < Game.w/2) {
                        _this.setPos(touchPoint);
    
                        _this.jsSprite.runAction(cc.fadeTo(0.05, 255));
                        _this.jsSpriteBg.runAction(cc.fadeTo(0.05, 255));

                        _this.currentPoint = touchPoint;
    
                        cc.log('摸到了');
                        if (_this.callfunTouchBegan) {
                            _this.callfunTouchBegan(_this.targetTouchBegan, touchPoint);
                        }
                        return true;
                    //}

                    break;
                }

                return false;
            },
            onTouchMoved: function (touch, event) {
                var target = event.getCurrentTarget();
                var touchPoint = target.convertToNodeSpace(touch.getLocation());

                _this.jsSprite.runAction(cc.fadeTo(0.05, 255));
                _this.jsSpriteBg.runAction(cc.fadeTo(0.05, 255));

                //控制底盘跟随摇杆
                if (_this.showType == SHOWTYPE_FOLLOW && _this.bgSpeed) {
                    _this.centerPoint = cc.pAdd(_this.centerPoint, cc.pMult(cc.pSub(touchPoint, _this.centerPoint), _this.bgSpeed));
                    _this.currentBgPoint = _this.centerPoint;
                }

                if (cc.pDistance(touchPoint, _this.centerPoint) > _this.radius) {
                    //触摸点最大不超过摇杆区域的半径
                    _this.currentPoint = cc.pAdd(_this.centerPoint, cc.pMult(cc.pNormalize(cc.pSub(touchPoint, _this.centerPoint)), _this.radius));
                } else {
                    _this.currentPoint = touchPoint;
                }
            },
            onTouchEnded: function (touch, event) {

                switch (_this.showType) {

                case SHOWTYPE_FIXED:
                    _this.jsSprite.runAction(cc.fadeTo(3, 150));
                    _this.jsSpriteBg.runAction(cc.fadeTo(3, 150));
                    break;
                    
                case SHOWTYPE_FOLLOW:
                    _this.jsSprite.runAction(cc.fadeTo(1, 0));
                    _this.jsSpriteBg.runAction(cc.fadeTo(1, 0));
                    break;
                }

                _this.currentPoint = _this.centerPoint;
            }
        });

        return true;
    },

    /**
     * 绑定回调（摇杆移动）
     * @param callfun update时回调函数
     */
    bindCallback: function(callfun, target) {
        cc.assert(callfun, 'callfun not null');
        this.target = target;
        this.callfun = callfun;

        //摇杆初始化在坦克的位置上
        if (this.showType == SHOWTYPE_FOLLOW) {
            this.setPos(target.getPosition());
        }
    },

    /**
     * 绑定回调（触摸开始）
     * @param callfun update时回调函数
     */
    bindTouchBeganCallback: function(callfun, target) {
        cc.assert(callfun, 'callfunTouchBegan not null');
        this.targetTouchBegan = target;
        this.callfunTouchBegan = callfun;
    },

    /**
     * 启动摇杆
     */
    jsActive: function() {
        if (!this.isActive) {
            this.isActive = true;


            switch (this.showType) {
            case SHOWTYPE_FIXED:
                this.jsSprite.runAction(cc.fadeTo(0.5, 100));
                this.jsSpriteBg.runAction(cc.fadeTo(0.5, 100));
                break;
                
            case SHOWTYPE_FOLLOW:
                this.jsSprite.runAction(cc.fadeTo(0.5, 0));
                this.jsSpriteBg.runAction(cc.fadeTo(0.5, 0));
                break;
            }

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

            this.jsSprite.runAction(cc.fadeTo(0.5, 100));
            this.jsSpriteBg.runAction(cc.fadeTo(0.5, 100));

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
        
        //摇杆移动。设置摇杆的位置为：触摸点和其当前位置的中点
        var curPos = this.jsSprite.getPosition();
        this.jsSprite.setPosition(cc.pAdd(curPos, cc.pMult(cc.pSub(this.currentPoint, curPos), 0.5)));

        var curPos = this.jsSpriteBg.getPosition();
        this.jsSpriteBg.setPosition(cc.pAdd(curPos, cc.pMult(cc.pSub(this.currentBgPoint, curPos), 0.5)));

        //控制精灵连续移动
        if (this.callfun) {

            //获取摇杆4个方位
            var direction = this.getDirection4();

            //获取离中心点的长度，设定移动的步长
            var velocity = this.getVelocity();

            //回调精灵动作
            this.callfun(dt, this.target, direction, velocity);
        }
    },
    
    /**
     * 获取摇杆方位
     * @returns 单位向量
     */
    getDirection: function() {
        return cc.pNormalize(cc.pSub(this.currentPoint, this.centerPoint));
    },

    /**
     * 获取摇杆4个方位 
     * @returns up, right, down, left
     */
    getDirection4: function(degrees) {

        //计算摇杆偏移的度数
        //var distanX = this.jsSprite.getPositionX() - this.centerPoint.x;
        //var distanY = this.jsSprite.getPositionY() - this.centerPoint.y;

        //与x轴的夹角弧度 方式1
        //var angle = Math.atan2(distanY, distanX)*180 / Math.PI;

        //与x轴的夹角弧度 方式2
        var angle = cc.radiansToDegrees(Math.atan2(this.getDirection().y, this.getDirection().x));
        if (angle < 0) {
            angle += 360;
        }

        //偏移度数决定上下左右
        var dir = null;
        if ((angle>0 && angle<45) || angle >= 315) {
            dir = cc.p(1, 0);
        } else if (angle >= 45 && angle<135) {
            dir = cc.p(0, 1);
        } else if (angle >= 135 && angle<215) {
            dir = cc.p(-1, 0);
        } else if (angle >= 215 && angle<315) {
            dir = cc.p(0, -1);
        } else {
            dir = cc.p(0, 0);
        }
        
        return dir;
    },
    
    /**
     * 获取摇杆力度
     * @returns {Number} 1,2,4
     */
    getVelocity: function() {
        var length = cc.pDistance(this.centerPoint, this.currentPoint);
        
        //var velocity = Math.floor(length / 20);
        var velocity = 0;
        if (length > 0 && length < 20) {
            velocity = 1;
        } else if (length >= 20 && length < 40) {
            velocity = 2;
        } else if (length > 40) {
            velocity = 4;
        }
        return velocity;
    },
    
    /**
     * 设置摇杆的位置
     * @param point
     */
    setPos: function(point) {
        this.centerPoint = point;
        this.currentPoint = point;
        this.currentBgPoint = point;
        this.jsSprite.setPosition(point);
        this.jsSpriteBg.setPosition(point);
    }
    
});
