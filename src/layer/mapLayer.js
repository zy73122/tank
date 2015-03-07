var MapLayer = cc.LayerColor.extend({
    map: null,
    map_w: null, //地图宽
    map_w: null, //地图高
    map_wc: null, //地图宽 格子数
    map_hc: null, //地图高 格子数
    tile_w: 0, //瓦片宽
    tile_h: 0, //瓦片高

    bg: null, //背景层
    spr: null, //砖块层
    objects: null, //对象层

    ctor:function () {
        //父类构造函数 （黑色背景）
        this._super(cc.color(0, 0, 0, 255), Game.h, Game.h);

        //this.setPosition(Game.w/6, 0);
        this.setPosition(0, 0);

        //加载Tile地图
        this.preLoadMap();

        this.preDefineTile();

        //画出瓦片的边框
        //this.drawTiledBorder();

        //画出瓦片坐标
        //this.drawTiledSpace();

        Game.map = this.map;
        Game.map_w = this.map_w;
        Game.map_h = this.map_h;
        Game.tile_w = this.tile_w;
        Game.tile_h = this.tile_h;

        Game.maplayer = this;
    },

    preLoadMap: function() {

        //创建TileMap地图
        var mapname = res.map_tmx[Game.user.step];
        cc.assert(mapname, "地图关卡不存在："+Game.user.step);
        var map = this.map = new cc.TMXTiledMap(mapname);
        this.addChild(map);
        
        //设置地图位置、描点
//      map.setPosition(Game.w/2, Game.h/2);
//      map.setAnchorPoint(0.5, 0.5);

        //获取该层中的所有对象
        var objs_plant = []; //玩家出生点
        var objs_enemy_plant = []; //敌人出生点
        var objs_t = []; //??
        var objs_home = {}; //总部
        var objs_grass=[];//草地
        var objs_ice = [];//冰面
        
        /*
        //获取对象层 方式1. 废弃，改为方式2
        var group = map.getObjectGroup("objects");
        var objs = group.getObjects();
        for (var i in objs) {
            var object = objs[i]; 
            var name = object.name;
            var fix_x = 32 / 2;
            var fix_y = 32 / 2;
            //出手点
            if (name.indexOf("plant") == 0) {
                objs_plant.push({
                    x : object.x + fix_x,
                    y : object.y + fix_y,
                    index : name.substring(name.indexOf("pl") + 2)
                });

                //敌人出手点
            } else if (name.indexOf("enemy") == 0) {
                objs_enemy_plant.push({
                    x : object.x + fix_x,
                    y : object.y + fix_y
                });

                //总部
            } else if (name.indexOf("base") == 0) {
                objs_home.x = object.x + fix_x;
                objs_home.y = object.y + fix_y;

            } else if (name.indexOf("grass") == 0) {
            	objs_grass.push({
            		x : object.x + fix_x,
            		y : object.y + fix_y
            	});
            }
        }
        objs_plant.sort(function(a, b){
            return a.index - b.index;
        });

        Game.container.map_plant = objs_plant;
        Game.container.map_enemy_plant = objs_enemy_plant;
        Game.container.map_t = objs_t;
        Game.container.map_home = objs_home;
        Game.container.map_grass=objs_grass;
        */

        //cc.log(objs_plant.toSource());

        //地图横纵格子数
        this.map_wc = map.getMapSize().width;
        this.map_hc = map.getMapSize().height;

        //瓦片大小
        this.tile_w = map.getTileSize().width;
        this.tile_h = map.getTileSize().height;

        //获取该层中的指定对象
        this.bg = this.map.getLayer("bg");
        this.spr = this.map.getLayer("spr");
        this.objects = this.map.getLayer("objects");
        this.objects.setVisible(false);

        //获取地图大小
        var map = this.map;
        var map_w = this.map_wc * this.tile_w;
        var map_h = this.map_hc * this.tile_h;
        this.map_w = map_w;
        this.map_h = map_h;

        //获取对象层 方式2
        for (var x = 0; x < this.map_wc; x++) {
            for (var y = 0; y < this.map_hc; y++) {
                //获取tile坐标
                var tileCoord = cc.p(x, y);
                
                //获取tile坐标的gid
                var gid = this.objects.getTileGIDAt(tileCoord);
                if (!gid) {
                    gid = this.spr.getTileGIDAt(tileCoord);
                    if (!gid) continue;
                }

                var properties = map.getPropertiesForGID(gid);
                if (!properties) continue;

                var fix_x = 64 / 2;
                var fix_y = 64 / 2;
                
                //瓦片坐标转为地图坐标
                var point = this.rectForTileCoord(tileCoord);
                
                //自定义属性：物体类型
                var otype = properties.otype; 
                if (!otype) continue;
                
                //判断障碍类型
                switch (otype) {
                case 'plant1':
                case 'plant2':
                    //出手点
                    objs_plant.push({
                        x : point.x + fix_x,
                        y : point.y + fix_y,
                        index : otype.substring(otype.indexOf("plant") + 5)
                    });
                    
                    break;
                case 'enemy':
                    //敌人出手点
                    objs_enemy_plant.push({
                        x : point.x + fix_x,
                        y : point.y + fix_y
                    });

                    break;
                case 'home':
                    //总部
                    objs_home.x = point.x + fix_x;
                    objs_home.y = point.y + fix_y;

                    break;
                case 'grass':
                    //草地
                    objs_grass.push({
                        x : point.x + fix_x/2,
                        y : point.y + fix_y/2
                    });

                    break;
                case 'ice':
                    //特殊地形（冰面）
                    objs_ice.push({
                        x : point.x + fix_x/2,
                        y : point.y + fix_y/2
                    });

                    break;
                default:
                    break;
                }
            }
        }
        objs_plant.sort(function(a, b){
            return a.index - b.index;
        });

        Game.container.map_plant = objs_plant;
        Game.container.map_enemy_plant = objs_enemy_plant;
        Game.container.map_home = objs_home;
        Game.container.map_grass = objs_grass;
        Game.container.map_ice = objs_ice;
//        
//        cc.log('plant:'+objs_plant.toSource());
//        cc.log('enemy:'+objs_enemy_plant.toSource());
//        cc.log('home:'+objs_home.toSource());
//        cc.log('grass:'+objs_grass.toSource());
    },

    /**
     * 定义瓦片的碰撞区域
     */
    preDefineTile: function() {
        var map = this.map;
        var tile_w = this.tile_w;
        var tile_h = this.tile_h;

        for (var x = 0; x < this.map_wc; x++) {
            for (var y = 0; y < this.map_hc; y++) {
                //获取tile坐标
                var tileCoord = cc.p(x, y);

                //获取障碍类型
                var obstacle = this.getObstacleByTileCoord(tileCoord);
                //获取tile坐标上的精灵
                var spr = this.spr.getTileAt(tileCoord);
                //获取tile坐标的gid
                var gid = this.spr.getTileGIDAt(tileCoord);

                if (!gid) continue;
                if (spr) {
                    spr.obstacle = obstacle;
                    /**
                     * 碰撞区域
                     */
                    spr.collideRect = function () {
                        var rect = cc.rect(0, 0, tile_w, tile_h);
                        //cc.log("xx"+this.getBoundingBox().toSource());
                        return rect;  
                    }

                    /**
                     * 受攻击
                     */
                    spr.hurt = function() {
                        //cc.log('222:' + obstacle);
                        //砖块被消除
                        this.removeFromParent();
                    }
                }
            }
        }
    },

    /**
     * 画出瓦片的边框
     */
    drawTiledBorder: function()
    {
        //debug
        var map = this.map;
        for (var x = 0; x < this.map_wc; x++) {
            for (var y = 0; y < this.map_hc; y++) {
                //var gid = this.bg.getTileGIDAt(cc.p(x, y));
                var gid = this.spr.getTileGIDAt(cc.p(x, y));
                //删除tile
                //this.spr.removeTileAt(cc.p(x, y));
                if (gid > 0) {
                    //rect的原点
                    var rect = this.rectForTileCoord(cc.p(x, y));
                    //cc.log(JSON.stringify(rect));
                    var draw = new cc.DrawNode();
                    Game.gamelayer.addChild(draw, 10);
                    draw.drawRect(cc.p(rect.x, rect.y), cc.p(rect.x+rect.width, rect.y+rect.height), null, 1, cc.color(255, 0, 255, 255));
                }
            }
        } 
    },

    /**
     * 画出瓦片坐标
     */
    drawTiledSpace: function()
    {
        //debug
        var map = this.map;
        for (var x = 0; x < this.map_wc; x++) {
            for (var y = 0; y < this.map_hc; y++) {
                var gid = this.bg.getTileGIDAt(cc.p(x, y));

                //Game.gamelayer.addChild(draw, 10);
                if (x%4==0 && y%4==0) {
                    //显示瓦片背景
                    var layer = new cc.LayerColor(cc.color(90, 90, 0, 128), 31, 31);
                    layer.x = x * this.tile_w;
                    layer.y = Game.map_h - y * this.tile_h;
                    layer.ignoreAnchorPointForPosition(false); //瓦片的的原点是左上角，而图片的原点默认是左下角。所以重设图层的原点为左上角
                    layer.setAnchorPoint(0, 1);
                    this.addChild(layer);

                    //显示瓦片坐标
                    var label = new cc.LabelTTF("("+x+","+y+")", "Arial", 9);
                    label.setPosition(layer.width / 2, layer.height / 2);
                    layer.addChild(label);
                }
            }
        } 
        //this.bg.visible= false;
    },

    /**
     * 将地图坐标点转换成瓦片坐标点
     * @param position
     */
    tileCoordForPosition: function(position)
    {
        //转为相对坐标（tilemap在实际gamelayer中是有偏移量的）
        //var positionInMap = cc.p(position.x-Game.w/6, position.y);
        var positionInMap = this.map.convertToNodeSpace(position);

        var map = this.map;
        var x = Math.floor(positionInMap.x / this.tile_w);
        var y = Math.floor((this.map_h - positionInMap.y) / this.tile_h);
        return cc.p(x, y);
    },

    /**
     * 将瓦片坐标点转换成地图坐标区域
     * @param tilepos
     */
    rectForTileCoord: function(tilepos)
    {
        var map = this.map;
        var x = tilepos.x * this.tile_w;
        var y = (this.map_hc - tilepos.y) * this.tile_h;
        //(x,y)默认是表示瓦片的左上角的点，需再转为左下角
        y -= this.tile_h;
        var pos = cc.p(x, y);
        //需要转为世界坐标（tilemap在实际gamelayer中是有偏移量的）
        pos = this.map.convertToWorldSpace(pos); //作用等同于 //x += Game.w/6;
        return cc.rect(pos.x, pos.y, this.tile_w, this.tile_h);
    },

    /**
     * 获取某个区域内的瓦片精灵
     * 比如：有个子弹穿过地图，假设子弹是一个矩形，然后我们在地图上面查找跟这个矩形相交的第一个瓦片。然后这个瓦片可能被子弹给击毁
     */
    getTileSprite: function (rect) {
        //画出矩形
        if (glb_config.drawLine) {
            Game.gamelayer.removeChildByTag(126);
            var draw = new cc.DrawNode();
            Game.gamelayer.addChild(draw, 10, 126);
            draw.drawRect(cc.p(rect.x, rect.y), cc.p(rect.x + rect.width, rect.y + rect.height), null, 2, cc.color(255, 0, 255, 255));
        }
        
        var map = this.map;
        var tile_w = this.tile_w;
        var tile_h = this.tile_h;

        //取矩形区域上的间隔为瓦片大小的点。 先 把矩形按切分成瓦片大小的小矩形，所有小矩形的四个角所在的点就是我们想要的点。然后再获取点所在的位置上的瓦片精灵 
        var points = []; 
        
        var w = rect.width;
        var h = rect.height;
        var x = y = 0;
        for (var i=0; i<Math.ceil(w/tile_w)+1; i++) {
            x = rect.x + i * tile_w;
            if (w % tile_w != 0 && i == Math.floor(w/tile_w)+1) {
                x -= tile_w - w%tile_w;
            } 
            for (var j=0; j<Math.ceil(h/tile_h)+1; j++) {
                y = rect.y + j * tile_h;
                if (h % tile_h != 0 && j == Math.floor(h/tile_h)+1) {
                    y -= tile_h - h%tile_h;
                }
                points.push(cc.p(x, y));
            }
        }
        //cc.log(points.length + ',i=' + w + ',j=' + h);
        
        //画出点
        if (glb_config.drawLine) {
            Game.gamelayer.removeChildByTag(125);
            var draw = new cc.DrawNode();
            Game.gamelayer.addChild(draw, 10, 125);
            for (var k in points) {
                draw.drawDot(points[k], 5, cc.color(0, 0, 255, 128));
            }
        }

        //获取上面点所在的位置上的瓦片精灵 
        var sprs = [];
        for (var k in points) {
            var p = points[k];
            //转为瓦片坐标
            var tileCoord = this.tileCoordForPosition(p);
            var x = tileCoord.x;
            var y = tileCoord.y;
            
            //地图外的
            if (x < 0 || x >= this.map_wc || y < 0 || y >= this.map_hc) {
                continue;
            }
            
            //获取tile坐标上的精灵
            var spr = this.spr.getTileAt(tileCoord);
            if (spr) {

                //画出被碰到的瓦片
//                Game.gamelayer.removeChildByTag(124);
//                var draw = new cc.DrawNode();
//                Game.gamelayer.addChild(draw, 10, 124);
//                var rect = this.rectForTileCoord(tileCoord);
//                draw.drawRect(cc.p(rect.x, rect.y), cc.p(rect.x + rect.width, rect.y + rect.height), null, 2, cc.color(255, 0, 255, 255));

                
                sprs.push(spr);
            }
        }

        return sprs;
    },

    /**
     * 获取某个瓦片坐标的瓦片精灵
     */
    getTileSpritePoint: function (tileCoord) {
        return this.spr.getTileAt(tileCoord);
    },

    /**
     * 改变某瓦片坐标的瓦片精灵的GID
     * 比如：砖块变为石头
     */
    setTileGID: function (gid, tileCoord) {
        return this.spr.setTileGID(gid, tileCoord);
    },

    /**
     * 检测是否障碍点，返回障碍信息
     * @param tileCoord
     * @returns int  障碍类型 OBSTACLE_TYPE_BLANK,...
     */
    getObstacleByTileCoord: function(tileCoord)
    {
        /*
        //debug
        Game.gamelayer.removeChildByTag(123);
        var draw = new cc.DrawNode();
        Game.gamelayer.addChild(draw, 10, 123);
        draw.drawDot(position, 10, cc.color(0, 0, 255, 128));
         */

        var x = tileCoord.x;
        var y = tileCoord.y;
        var map = this.map; 

//      var rect = this.rectForTileCoord(cc.p(37, 50));
//      var draw = new cc.DrawNode();
//      Game.gamelayer.addChild(draw, 10);
//      draw.drawRect(cc.p(rect.x, rect.y), cc.p(rect.x+rect.width, rect.y+rect.height), null, 3, cc.color(255, 255, 255, 255));

        //地图外的，相当于碰到障碍
        if (x < 0 || x >= this.map_wc || y < 0 || y >= this.map_hc)
            return Game.OBSTACLE_TYPE_OUTSIDE;

        //除了gid=0（透明）的和草等，其他都是障碍
        var gid = this.spr.getTileGIDAt(tileCoord);

        //根据tileGID，=0是为透明
        //if (gid != 0 && gid != 9 && gid != 10 && gid != 37 && gid != 38 ) 
        //    return true;

        //根据自定义属性判断是否碰撞
        if (gid) {
            var properties = map.getPropertiesForGID(gid);
            if (properties) { //collision: 0=地图外， 1=砖块， 2=草丛， 3=地面，4=石头
                //cc.log("x:" + properties.toSource()); 
                return parseInt(properties.collision); 
            }
        }

        //未碰到障碍
        return Game.OBSTACLE_TYPE_BLANK;

    },

    /**
     * 检测是否障碍点，返回障碍信息
     * @param position
     * @returns int  障碍类型 OBSTACLE_TYPE_BLANK,...
     */
    getObstacleByPos: function(position)
    {
        //转为瓦片坐标
        var tileCoord = this.tileCoordForPosition(position);
        return this.getObstacleByTileCoord(tileCoord);
    },

    /**
     * 检测是否"移动"障碍点
     * 比如：砖块和石头
     * @param position
     * @returns boolean true=是障碍， false=不是障碍
     */
    checkObstacleMove: function(position)
    {
        var obstacle = this.getObstacleByPos(position);

        //地图外、砖块、石头、河流是障碍
        switch (obstacle) {
        case Game.OBSTACLE_TYPE_OUTSIDE:
        case Game.OBSTACLE_TYPE_BRICK:
        case Game.OBSTACLE_TYPE_STONE:
        case Game.OBSTACLE_TYPE_RIVER:
            return true;
            break;
        default:
            break;
        }

        //未碰到障碍
        return false;
    },

    /**
     * 检测是否"移动"障碍点
     * 比如：砖块和石头
     * @param position
     * @returns boolean true=是障碍， false=不是障碍
     */
    checkObstacleMoveByObstacle: function(obstacle)
    {
        //地图外、砖块、石头、河流是障碍
        switch (obstacle) {
        case Game.OBSTACLE_TYPE_OUTSIDE:
        case Game.OBSTACLE_TYPE_BRICK:
        case Game.OBSTACLE_TYPE_STONE:
        case Game.OBSTACLE_TYPE_RIVER:
            return true;
            break;
        default:
            break;
        }

        //未碰到障碍
        return false;
    }

});