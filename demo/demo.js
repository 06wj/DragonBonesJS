var demo = {
    init:function(animName){
        var that = this;
        utils.loadRes(
            './data/' + animName + '/texture.png',
            './data/' + animName + '/texture.js',
            './data/' + animName + '/skeleton.js',
            function(textureImage, textureData, skeletonData){
                var width = 1200;
                var height = 900;
                var scale = 0.7;
                switch(factoryType){
                    case 'pixi':
                        that.initArmature(textureImage, textureData, skeletonData, dragonBones.PixiFactory);
                        that.initForPixi(width, height, scale);
                        break;
                    case 'hilo':
                        that.initArmature(textureImage, textureData, skeletonData, dragonBones.HiloFactory);
                        that.initForHilo(width, height, scale);
                        break;
                    case 'createjs':
                        that.initArmature(textureImage, textureData, skeletonData, dragonBones.CreatejsFactory);
                        that.initForCreatejs(width, height, scale);
                        break;
                    case 'dom':
                    default:
                        that.initArmature(textureImage, textureData, skeletonData, dragonBones.DomFactory);
                        that.initForDom(width, height, scale);
                        break;
                }
            }
        );
    },
    initArmature:function(textureImage, textureData, skeletonData, Factory){
        var dragonbonesFactory = this.dragonbonesFactory = new Factory();
        dragonbonesFactory.addTextureAtlas(new dragonBones.TextureAtlas(textureImage, textureData));
        dragonbonesFactory.addDragonBonesData(dragonBones.DataParser.parseDragonBonesData(skeletonData));

        var armature = this.armature = dragonbonesFactory.buildArmature(skeletonData.armature[0].name);
        var armatureDisplay = this.armatureDisplay = armature.getDisplay();
        armatureDisplay.x = demo.pos[0];
        armatureDisplay.y = demo.pos[1];

        armature.addEventListener(dragonBones.AnimationEvent.START, function(e){
            console.log(dragonBones.AnimationEvent.START);
        }, armature);

        armature.addEventListener(dragonBones.AnimationEvent.COMPLETE, function(e){
            console.log(dragonBones.AnimationEvent.COMPLETE);
        }, armature);

        armature.addEventListener(dragonBones.AnimationEvent.LOOP_COMPLETE, function(e){
            console.log(dragonBones.AnimationEvent.LOOP_COMPLETE);
        }, armature);

        dragonBones.WorldClock.clock.add(armature);
        this.play();
    },
    initForPixi:function(gameWidth, gameHeight, scale){
        console.log('initForPixi');
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
    initForHilo:function(gameWidth, gameHeight, scale){
        console.log('initForHilo');
        var stage = this.stage = new Hilo.Stage({
            renderType:'webgl',
            width:gameWidth,
            height:gameHeight,
            scaleX:scale,
            scaleY:scale,
            container:'animContainer'
        });

        stage.addChild(this.armatureDisplay);

        var ticker = new Hilo.Ticker(60);
        ticker.addTick(stage);
        ticker.addTick({
            tick:function(dt){
                dragonBones.WorldClock.clock.advanceTime(dt * 0.001);
            }
        });
        ticker.start();
    },
    initForCreatejs:function(gameWidth, gameHeight, scale){
        console.log('initForCreatejs');
        var canvas = document.createElement('canvas');
        canvas.width = gameWidth * scale;
        canvas.height = gameHeight * scale;
        var stage = this.stage = new createjs.Stage(canvas);

        stage.scaleX = scale;
        stage.scaleY = scale;
        stage.addChild(this.armatureDisplay);
        document.getElementById('animContainer').appendChild(canvas);

        createjs.Ticker.addEventListener("tick", function(e){
            dragonBones.WorldClock.clock.advanceTime(e.delta * 0.001);
            stage.update();
        });

    },
    initForDom:function(gameWidth, gameHeight, scale){
        console.log('initForDom');
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
    createBtns:function(){
        var that = this;
        var keys = utils.getUrlKey();
        var factoryTypeBtn = document.createElement('div');
        document.body.appendChild(factoryTypeBtn);
        var factoryTypes = ['dom', 'pixi', 'hilo', 'createjs'];
        factoryTypes.forEach(function(type){
            var typeElem = document.createElement('div');
            typeElem.innerHTML = '<input type="radio" data-type="{type}">{type}</input>'.replace(/{type}/g, type);
            typeElem.setAttribute('data-type', type);
            typeElem.style.cssText = 'display:inline;margin-left:10px;line-height:20px;cursor:pointer;height:40px;';
            typeElem.input = typeElem.children[0];
            factoryTypeBtn.appendChild(typeElem);
            if(type === keys.type){
                typeElem.input.checked = true;
            }
            typeElem.onclick = function(){
                if(keys.type !== type){
                    keys.type = type;
                    utils.setUrlKey();
                }
            }
        });
        factoryTypeBtn.style.cssText = 'position:absolute;right:10px;top:5px;';
    }
};

demo.bindEvent();
demo.createBtns();