var demo = {
    initArmature:function(textureImg, textureData, skeletonData){
        var dragonbonesFactory = this.dragonbonesFactory = new dragonBones.DomFactory();
        dragonbonesFactory.addTextureAtlas(new dragonBones.TextureAtlas(textureImg, textureData));
        dragonbonesFactory.addDragonBonesData(dragonBones.DataParser.parseDragonBonesData(skeletonData));

        var armature = this.armature = dragonbonesFactory.buildArmature(skeletonData.armature[0].name);
        var armatureDisplay = this.armatureDisplay = armature.getDisplay();
        document.getElementById('animContainer').appendChild(armatureDisplay);

        console.log(armature.animation._animationList);
        dragonBones.WorldClock.clock.add(armature);

        setInterval(function(){
            dragonBones.WorldClock.clock.advanceTime(0.04);
        }, 41);

        this.play();
    },
    play:function(){
        this.armature.animation.gotoAndPlay(this.getNextAnimationName(), -1, -1, 0);
    },
    bindEvent:function(){
        var that = this;
        window.onclick = window.ontouchstart = function(){
            if(that.armature.animation._animationList.length > 1){
                that.play();
            }
        };
    },
    getNextAnimationName:function(){
        this._index = this._index||0;
        var list = this.armature.animation._animationList;
        return list[(this._index++)%list.length];
    },
    load:function(path){
        var that = this;
        var loadNum = 3;
        var img = new Image;
        img.onload = onload;
        img.src = path + '/texture.png';

        ['skeleton.js', 'texture.js'].forEach(function(jsName){
            var scriptElem = document.createElement('script');
            scriptElem.onload = onload;
            scriptElem.src = path + '/' + jsName;
            document.body.appendChild(scriptElem);
        });

        function onload(){
            loadNum --;
            if(loadNum === 0){
                that.initArmature(img, textureData, skeletonData);
            }
        }
    }
};

demo.bindEvent();