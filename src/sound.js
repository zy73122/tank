
var Sound = {
        musicOff: false,
        
        init: function() {
            cc.audioEngine.setEffectsVolume(0.5);
            cc.audioEngine.setMusicVolume(0.5);
        },
        
        /**
         * 游戏开始
         */
        playStartEffect: function() {
            if (!this.musicOff) {
                cc.audioEngine.playEffect(res.music_start, false);
            }
        },
        
        /**
         * 坦克爆炸
         */
        playBlast: function() {
            if (!this.musicOff) {
                cc.audioEngine.playEffect(res.music_blast, false);
            }
        },

        /**
         * 子弹
         */
        playBullet: function() {
            if (!this.musicOff) {
                cc.audioEngine.playEffect(res.music_bullet, false);
            }
        },
        
        stopAll: function() {
            if (!this.musicOff) {
                cc.audioEngine.stopAllEffects();
                cc.audioEngine.stopMusic();
            }
        },
        
        toggleOnOff:function(){
            if(Sound.musicOff){
                Sound.musicOff = false;
                cc.audioEngine.setEffectsVolume(1);
                cc.audioEngine.setMusicVolume(1);
            }
            else{
                Sound.musicOff = true;
                cc.audioEngine.setEffectsVolume(0);
                cc.audioEngine.setMusicVolume(0);
            }
        }
        
}