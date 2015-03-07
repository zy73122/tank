

glb_config.tankType = 
{
        1:{
            name:"我方坦克",
            levelMax:3, //最大等级
            protectName:["protect_0.png","protect_1.png"], //保护套
            blastName:["blast2_0.png","blast2_1.png","blast2_2.png","blast2_3.png","blast2_4.png","blast2_5.png","blast2_6.png","blast2_7.png","blast2_8.png"], //爆炸
            levelUpName:["levelup0.png","levelup1.png","levelup2.png","levelup3.png","levelup4.png","levelup5.png"], //升级
            lifeAddName:["lifeadd0.png","lifeadd1.png","lifeadd2.png","lifeadd3.png","lifeadd4.png","lifeadd5.png","lifeadd6.png"], //生命增加
            score:0, //被消灭时，对方得到的分数
            levels_1:{
                textureNames:["player1_1_0.png","player1_1_1.png"], //纹理
                bulletType:0, //子弹类型
                bulletSpeed:200, //子弹速度
                shootType:0, //发射类型 0=瞄准发射（子弹）
                onceCount:1, //每次同时发射几颗 （例如：可用在多重箭）
                speed:1.6 //移动速度
            },
            levels_2:{
                textureNames:["player1_2_0.png","player1_2_1.png"],
                bulletType:0,
                bulletSpeed:300,
                shootType:0,
                onceCount:1,
                speed:1.7
            },
            levels_3:{
                textureNames:["player1_3_0.png","player1_3_1.png"],
                bulletType:0,
                bulletSpeed:400,
                shootType:0,
                onceCount:2,
                speed:1.8
            },
            levels_4:{
                textureNames:["player1_4_0.png","player1_4_1.png"],
                bulletType:0,
                bulletSpeed:200,
                shootType:0,
                onceCount:1,
                speed:1.8
            }
        },
        2:{
            name:"我方坦克2",
            levelMax:3, //最大等级
            protectName:["protect_0.png","protect_1.png"],
            blastName:["blast2_0.png","blast2_1.png","blast2_2.png","blast2_3.png","blast2_4.png","blast2_5.png","blast2_6.png","blast2_7.png","blast2_8.png"],
            levelUpName:["levelup0.png","levelup1.png","levelup2.png","levelup3.png","levelup4.png","levelup5.png"],
            lifeAddName:["lifeadd0.png","lifeadd1.png","lifeadd2.png","lifeadd3.png","lifeadd4.png","lifeadd5.png","lifeadd6.png"], 
            score:0,
            levels_1:{
                textureNames:["player2_1_0.png","player2_1_1.png"], //纹理
                bulletType:0, //子弹类型
                bulletSpeed:200, //子弹速度
                shootType:0, //发射类型 0=瞄准发射（子弹）
                onceCount:1, //每次同时发射几颗 （例如：可用在多重箭）
                speed:1 //移动速度
            },
            levels_2:{
                textureNames:["player2_2_0.png","player2_2_1.png"],
                bulletType:0,
                bulletSpeed:200,
                shootType:0,
                onceCount:1,
                speed:1
            },
            levels_3:{
                textureNames:["player2_3_0.png","player2_3_1.png"],
                bulletType:0,
                bulletSpeed:200,
                shootType:0,
                onceCount:2,
                speed:1
            },
            levels_4:{
                textureNames:["player2_4_0.png","player2_4_1.png"],
                bulletType:0,
                bulletSpeed:200,
                shootType:0,
                onceCount:1,
                speed:1
            }
        },
        3:{
            name:"敌方坦克1",
            levelMax:1,
            blastName:["blast2_0.png","blast2_1.png","blast2_2.png","blast2_3.png","blast2_4.png","blast2_5.png","blast2_6.png","blast2_7.png","blast2_8.png"],
            score:100,
            levels_1:{
                textureNames:["enemy1_0.png","enemy1_1.png"],
                bulletType:0,
                bulletSpeed:200,
                shootType:0,
                onceCount:1,
                speed:0.6
            }
        },
        4:{
            name:"敌方坦克2",
            levelMax:1,
            blastName:["blast2_0.png","blast2_1.png","blast2_2.png","blast2_3.png","blast2_4.png","blast2_5.png","blast2_6.png","blast2_7.png","blast2_8.png"],
            score:110,
            levels_1:{
                textureNames:["enemy2_0.png","enemy2_1.png"],
                bulletType:0,
                bulletSpeed:200,
                shootType:0,
                onceCount:1,
                speed:0.7
            }
        },
        5:{
            name:"敌方坦克3",
            levelMax:1,
            blastName:["blast2_0.png","blast2_1.png","blast2_2.png","blast2_3.png","blast2_4.png","blast2_5.png","blast2_6.png","blast2_7.png","blast2_8.png"],
            score:120,
            levels_1:{
                textureNames:["enemy3_0.png","enemy3_1.png"],
                bulletType:0,
                bulletSpeed:200,
                shootType:0,
                onceCount:1,
                speed:0.8
            }
        }
};
