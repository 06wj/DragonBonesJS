# This repo is no longer updated, please use [the official library](https://github.com/DragonBones/DragonBonesJS)
>Because [the official library](https://github.com/DragonBones/DragonBonesJS) now supports other render library, i will not update this repo.



## DragonBonesJS  [![npm][npm-image]][npm-url] [![gitter][gitter-image]][gitter-url]
> DragonBones Library JavaScript Version

## Info
This is DragonBones Library JavaScript Version. Update to 4.0 version.

It now support [pixi.js](http://www.pixijs.com/), [hilo](https://github.com/hiloteam/hilo), [createjs](https://github.com/CreateJS/EaselJS) and dom mode.
you can add your own render factory like this [factory](https://github.com/06wj/DragonBonesJS/tree/master/src/factory);

[Official DragonBones](https://github.com/egret-labs/egret-core/tree/master/src/extension/dragonbones) use typescript and only support egret. I transform it and now can easily support multi render library.

## Demo

* [pixi.js Demo](http://06wj.github.io/DragonBonesJS/demo/index.html?type=pixi&anim=dragon)
* [hilo Demo](http://06wj.github.io/DragonBonesJS/demo/index.html?type=hilo&anim=dragon)
* [createjs Demo](http://06wj.github.io/DragonBonesJS/demo/index.html?type=createjs&anim=dragon)
* [dom Demo](http://06wj.github.io/DragonBonesJS/demo/index.html?type=dom&anim=dragon)


## Usage

* [dragonbones-alone.js](./build/dragonbones-alone.js) is dragonbones without factory.
* [dragonbones-pixi.js](./build/dragonbones-pixi.js) is dragonbones width pixi factory.
* [dragonbones-hilo.js](./build/dragonbones-hilo.js) is dragonbones width hilo factory.
* [dragonbones-createjs.js](./build/dragonbones-createjs.js) is dragonbones width createjs factory.
* [dragonbones-dom.js](./build/dragonbones-dom.js) is dragonbones width dom factory.

* quick start:

    ```javascript
    //create factory, now support PixiFactory, HiloFactory, CreatejsFactory and DomFactory
    var dragonbonesFactory = new dragonBones.DomFactory();

    /**
     * add texture data and skeleton data
     * textureImg is a load completed Image
     * textureData is texture json data
     * skeletonData is skeleton json data
     */
    dragonbonesFactory.addTextureAtlas(new dragonBones.TextureAtlas(textureImg, textureData));
    dragonbonesFactory.addDragonBonesData(dragonBones.DataParser.parseDragonBonesData(skeletonData));

    //create armature
    var armature = dragonbonesFactory.buildArmature(skeletonData.armature[0].name);

    //play
    armature.animation.gotoAndPlay('walk');

    //add armature to clock
    dragonBones.WorldClock.clock.add(armature);

    //you need to run dragonBones.WorldClock like this to run the armature
    var t = new Date().getTime();
    function tick(){
        var now = new Date().getTime();
        dragonBones.WorldClock.clock.advanceTime((now - t)*0.001);
        t = now;
        requestAnimationFrame(tick);
    }
    tick();
    ```

see [official tutorial](http://edn.egret.com/cn/docs/page/392) for more info.

## Compile and build

Built by gulp:

* run `npm install -g gulp` to install gulp.
* run `npm install` to install all dependencies.
* run `gulp` to build source.
* run `gulp watch` to watch and auto build source.

## License
[MIT License](http://en.wikipedia.org/wiki/MIT_License)

[npm-image]: https://img.shields.io/npm/v/dragonbones.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/dragonbones
[gitter-image]: https://img.shields.io/badge/GITTER-join%20chat-green.svg?style=flat-square
[gitter-url]: https://gitter.im/06wjin/DragonBonesJS?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge
