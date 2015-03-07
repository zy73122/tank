//帮助类
var Helper = {
        
        /**
         * 创建动画精灵
         * @param names ["frameNmae01.png", "frameNmae02.png", ...]
         * @returns sprite
         */
        createAnimationSprite : function(names, delay, repeat) {
            var animate = this.createAnimationWidthFrame(names, delay, repeat);

            var firstname = names.slice(0, 1);
            var sprite = new cc.Sprite("#"+firstname);
            sprite.runAction(animate);

            return sprite;
        },
        
        /**
         * 以多个图片为帧，生成CCAnimation对象
         * @param names ["frameNmae01.png", "frameNmae02.png", ...]
         * @param delay
         * @param repeat 重复次数，为-1表示一直重复
         * @returns animate
         */
        createAnimationWidthFrame: function(names, delay, repeat) {
            var delay = delay || 0.2;
            if (typeof(repeat) == 'undefined') {
                repeat = -1;
            }

            var firstname = null;
            var frames = [];
            for (var k in names) {
                var frame = cc.spriteFrameCache.getSpriteFrame(names[k]);
                if (!frame) {
                    continue;
                    cc.log('error: frame not defined');
                }
                frames.push(frame);
                if (!firstname) {
                    firstname = names[k];
                }
            }
            var animation = new cc.Animation(frames, delay, repeat);
            //animation.setDelayPerUnit(delay);

            var animate = cc.animate(animation);

            //var sprite = new cc.Sprite("#"+firstname);
            //sprite.runAction(animate.repeatForever());
//
//            if (repeat == true) {
//                return animate.repeatForever();
//            } else {
//                return animate;
//            }
            return animate;
        },
        
        // 碰撞检测
        isCollide : function(a, b) {
            var ax = a.x, ay = a.y;
            var bx = b.x, by = b.y;
            // cc.log(22222 + [a.getPositionX(), a.getPositionY(),
            // b.getPositionX(), b.getPositionY()].toSource());
            // if (Math.abs(ax - bx) > 80 || Math.abs(ay - by) > 80)
            // return false;

            var aRect = a.collideRect();
            var bRect = b.collideRect();
            aRect.x += ax;
            aRect.y += ay;
            bRect.x += bx;
            bRect.y += by;

            // cc.log("aa:" + a.width + " bb" + b.width);
            // cc.log('|||'+ aRect.toSource() + bRect.toSource());
            // cc.log('hit');
//            
//            //画出矩形
//            Game.gamelayer.removeChildByTag(127);
//            var draw = new cc.DrawNode();
//            Game.gamelayer.addChild(draw, 10, 127);
//            var rect = aRect;
//            draw.drawRect(cc.p(rect.x, rect.y), cc.p(rect.x + rect.width, rect.y + rect.height), null, 2, cc.color(0, 0, 255, 255));
//            var rect = bRect;
//            draw.drawRect(cc.p(rect.x, rect.y), cc.p(rect.x + rect.width, rect.y + rect.height), null, 2, cc.color(0, 0, 255, 255));

            
            return cc.rectIntersectsRect(aRect, bRect);
        },
        
        // 产生随机数 [m, n]
        randRange: function(m, n) {
            return Math.floor(Math.random()*(n-m+1)+m);
        },
        
        /**
         * 获取向量 （startPpoint, centerPoint）的方向
         * @param startPpoint
         * @param centerPoint
         */
        getDirection4: function(startPpoint, centerPoint) {

            var direction = cc.pNormalize(cc.pSub(startPpoint, centerPoint));

            //与x轴的夹角弧度 方式2
            var angle = cc.radiansToDegrees(Math.atan2(direction.y, direction.x));
            if (angle < 0) {
                angle += 360;
            }
            //cc.log(angle.toSource());

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
        }

}; 