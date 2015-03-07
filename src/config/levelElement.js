

//关卡敌人：敌人出现的顺序和数量等
glb_config.levelElement =
{
        0:{
            themeName:"主题1",
            steps:{
                0:{ //关卡
                    stepName:"第1关",
                    stepDesc:"",
                    maxCount: 10, //场面上最多几个敌人
                    subSteps:{
                        0:{ //关卡
                            type:3,
                            count:3
                        },
                        1:{
                            type:4,
                            count:2
                        },
                        2:{
                            type:5,
                            count:3
                        }
                    }
                },
                1:{ //关卡
                    stepName:"第2关",
                    stepDesc:"",
                    maxCount: 10, //场面上最多几个敌人
                    subSteps:{
                        0:{ //关卡
                            type:3,
                            count:1
                        },
                        1:{
                            type:4,
                            count:2
                        }
                    }
                },
                2:{ //关卡
                    stepName:"第3关",
                    stepDesc:"",
                    maxCount: 10, //场面上最多几个敌人
                    subSteps:{
                        0:{ //关卡
                            type:3,
                            count:1
                        },
                        1:{
                            type:4,
                            count:2
                        },
                        1:{
                            type:5,
                            count:3
                        }
                    }
                }
            },
        },
};
