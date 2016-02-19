var demo = {
    init:function(textureImg, textureData, skeletonData){
        switch(factoryType){
            case 'pixi':
                this.initArmature(textureImg, textureData, skeletonData, dragonBones.PixiFactory);
                this.initForPixi(1200, 900, 0.7);
                break;
            case 'dom':
            default:
                this.initArmature(textureImg, textureData, skeletonData, dragonBones.DomFactory);
                this.initForDom(1200, 900, 0.7);
                break;
        }

    },
    initArmature:function(textureImg, textureData, skeletonData, Factory){
        var dragonbonesFactory = this.dragonbonesFactory = new Factory();
        dragonbonesFactory.addTextureAtlas(new dragonBones.TextureAtlas(textureImg, textureData));
        dragonbonesFactory.addDragonBonesData(dragonBones.DataParser.parseDragonBonesData(skeletonData));

        var armature = this.armature = dragonbonesFactory.buildArmature(skeletonData.armature[0].name);
        var armatureDisplay = this.armatureDisplay = armature.getDisplay();
        armatureDisplay.x = demo.pos[0];
        armatureDisplay.y = demo.pos[1];

        dragonBones.WorldClock.clock.add(armature);
        this.play();
    },
    initForPixi:function(gameWidth, gameHeight, scale){
        var container = this.container = new PIXI.Container();
        var renderer = PIXI.autoDetectRenderer(gameWidth*scale, gameHeight*scale, {
            transparent:true
        });
        container.scale.x = scale;
        container.scale.y = scale;
        container.addChild(this.armatureDisplay);
        document.getElementById('animContainer').appendChild(renderer.view);

        var t = new Date().getTime();
        function tick(){
            renderer.render(container);
            var now = new Date().getTime();
            dragonBones.WorldClock.clock.advanceTime((now - t)*0.001);
            t = now;
            requestAnimationFrame(tick);
        }
        tick();
    },
    initForDom:function(gameWidth, gameHeight, scale){
        var armatureDisplay = this.armatureDisplay;

        armatureDisplay.style.webkitTransform = 'scale(' + scale + ',' + scale + ') ' + 'translate(' + armatureDisplay.x + 'px,' + armatureDisplay.y + 'px)';
        armatureDisplay.style.webkitTransformOrigin = 'left top';
        document.getElementById('animContainer').appendChild(this.armatureDisplay);

        var t = new Date().getTime();
        function tick(){
            var now = new Date().getTime();
            dragonBones.WorldClock.clock.advanceTime((now - t)*0.001);
            t = now;
            requestAnimationFrame(tick);
        }
        tick();
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
        img.src = './data/' + path + '/texture.png';

        ['skeleton.js', 'texture.js'].forEach(function(jsName){
            var scriptElem = document.createElement('script');
            scriptElem.onload = onload;
            scriptElem.src = './data/' + path + '/' + jsName;
            document.body.appendChild(scriptElem);
        });

        function onload(){
            loadNum --;
            if(loadNum === 0){
                that.init(img, textureData, skeletonData);
            }
        }
    },
    getUrlKey:function(){
        var that = this;
        if(this.keys){
            return this.keys;
        }

        var search = location.search.slice(1);
        this.keys = {};
        if(search){
            var arr = search.split('&');
            arr.forEach(function(kv){
                var kvs = kv.split('=');
                if(kvs.length === 2){
                    that.keys[kvs[0]] = kvs[1];
                }
            });
        }
        this.keys.type = this.keys.type||'dom';
        this.keys.anim = this.keys.anim||'dragon';

        return this.keys;
    },
    setUrlKey:function(){
        var search = '?';
        for(var k in this.keys){
            search += k + '=' + this.keys[k] + '&';
        }
        location.search = search.slice(0, -1);
    },
    createBtns:function(){
        var that = this;
        var factoryTypeBtn = document.createElement('div');
        document.body.appendChild(factoryTypeBtn);
        var factoryTypes = ['dom', 'pixi'];
        factoryTypes.forEach(function(type){
            var typeElem = document.createElement('div');
            typeElem.innerHTML = '<input type="radio" data-type="{type}">{type}</input>'.replace(/{type}/g, type);
            typeElem.setAttribute('data-type', type);
            typeElem.style.cssText = 'display:inline;margin-left:10px;line-height:20px;cursor:pointer;height:40px;';
            typeElem.input = typeElem.children[0];
            factoryTypeBtn.appendChild(typeElem);
            if(type === that.keys.type){
                typeElem.input.checked = true;
            }
            typeElem.onclick = function(){
                if(that.keys.type !== type){
                    that.keys.type = type;
                    that.setUrlKey();
                }
            }
        });
        factoryTypeBtn.style.cssText = 'position:absolute;right:10px;top:5px;';
    }
};

demo.bindEvent();
demo.getUrlKey();
demo.createBtns();