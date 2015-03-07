var res = {
        
        //地图
        map_tmx : [
            "res/maps/map1.tmx",
            "res/maps/map2.tmx",
            "res/maps/map3.tmx",
            "res/maps/map4.tmx",
            "res/maps/map5.tmx"
        ],
        map_res : "res/maps/mapTiled.png",
        map_res2 : "res/maps/objects.png",

        //声音
        music_start : "res/music/start.mp3",
        music_blast : "res/music/blast.mp3",
        music_bullet : "res/music/bullet.mp3",
        
        //图片
        images_plist : "res/images.plist",
        images_png : "res/images.png"

            
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}