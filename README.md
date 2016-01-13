# DragonBonesJS
> DragonBones Library JavaScript Version

## Info
官方的[DragonBones](https://github.com/egret-labs/egret-core/tree/master/src/extension/dragonbones)只支持egret而且和egret强耦合
这里把dragonbones单独抽出来，可以和任意js渲染库结合，可参考[domFactpry](./src/factory/domFactory.js)写自己的工厂

## Demo

[Demo](http://06wj.github.io/DragonBonesJS/demo/?dragon)


## Usage

```
//create factory
var dragonbonesFactory = new dragonBones.DomFactory();

//add texture data and skeleton data
dragonbonesFactory.addTextureAtlas(new dragonBones.TextureAtlas(textureImg, textureData));
dragonbonesFactory.addDragonBonesData(dragonBones.DataParser.parseDragonBonesData(skeletonData));

//create armature
var armature = dragonbonesFactory.buildArmature(skeletonData.armature[0].name);

//play
armature.animation.gotoAndPlay('walk');
```

see [tutorial](http://edn.egret.com/cn/docs/page/392) for more

## Compile and build

Built by gulp:

* run `npm install -g gulp` to install gulp.
* run `npm install` to install all dependencies.
* run `gulp` to build source.