/**
 * PixiSlot
 */
(function(superClass) {
    var RAD2DEG = 180/Math.PI;
    var TextureAtlas = dragonBones.TextureAtlas;
    var PixiSlot = function() {
        superClass.call(this, this);
        this._display = null;
    };

    __extends(PixiSlot, superClass, {
        dispose: function() {
            if (this._displayList) {
                var length = this._displayList.length;
                for (var i = 0; i < length; i++) {
                    var content = this._displayList[i];
                    if (content instanceof Armature) {
                        content.dispose();
                    }
                }
            }

            superClass.prototype.dispose();
            this._display = null;
        },
        _updateDisplay: function(value) {
            this._display = value;
        },
        _getDisplayIndex: function() {
            if (this._display && this._display.parent) {
                return this._display.parent.getChildIndex(this._display);
            }
            return -1;
        },
        _addDisplayToContainer: function(container, index) {
            if (this._display && container) {
                if(index){
                    container.addChildAt(this._display, index);
                }
                else{
                    container.addChild(this._display);
                }
            }
        },
        _removeDisplayFromContainer: function() {
            if (this._display && this._display.parent) {
                this._display.parent.removeChild(this._display);
            }
        },
        _updateTransform: function() {
            if (this._display) {
                this._display.position.x = this._global.x;
                this._display.position.y = this._global.y;
                this._display.scale.x = this._global.scaleX;
                this._display.scale.y = this._global.scaleY;
                this._display.rotation = this._global.skewX;
            }
        },
        _updateDisplayVisible: function(value) {
            if (this._display && this._parent) {
                this._display.visible = this._parent._visible && this._visible && value;
            }
        },
        _updateDisplayColor: function(aOffset, rOffset, gOffset, bOffset, aMultiplier, rMultiplier, gMultiplier, bMultiplier, colorChange) {
            superClass.prototype._updateDisplayColor.call(this, aOffset, rOffset, gOffset, bOffset, aMultiplier, rMultiplier, gMultiplier, bMultiplier, colorChange);
            if (this._display) {
                this._display.alpha = aMultiplier;
            }
        },
        _updateDisplayBlendMode: function(value) {
            // if (this._display && value) {
            //     this._display.blendMode = value;
            // }
        },
        _calculateRelativeParentTransform: function() {
            this._global.scaleX = this._origin.scaleX * this._offset.scaleX;
            this._global.scaleY = this._origin.scaleY * this._offset.scaleY;
            this._global.skewX = this._origin.skewX + this._offset.skewX;
            this._global.skewY = this._origin.skewY + this._offset.skewY;
            this._global.x = this._origin.x + this._offset.x + this._parent._tweenPivot.x;
            this._global.y = this._origin.y + this._offset.y + this._parent._tweenPivot.y;

            if (this._displayDataList &&
                this._currentDisplayIndex >= 0 &&
                this._displayDataList[this._currentDisplayIndex] &&
                TextureAtlas.rotatedDic[this._displayDataList[this._currentDisplayIndex].name] == 1) {
                this._global.skewX -= 1.57;
                this._global.skewY -= 1.57;
            }
        }
    });

    dragonBones.PixiSlot = PixiSlot;
})(dragonBones.Slot);

/**
 * PixiFactory
 */
(function(superClass){
    var Armature = dragonBones.Armature;
    var PixiSlot = dragonBones.PixiSlot;

    var PixiFactory = function(){
        superClass.call(this, this);
    };
    __extends(PixiFactory, superClass, {
        _generateArmature:function(){
            var armature = new Armature(new PIXI.Container);
            return armature;
        },
        _generateSlot:function(){
            var slot = new PixiSlot();
            return slot;
        },
        _generateDisplay:function(textureAtlas, fullName, pivotX, pivotY){
            var texture = textureAtlas.getTexture(fullName);
            var region = texture.region;

            this._textureCache = this._textureCache || {};
            if(!this._textureCache[textureAtlas.texture.src]){
                this._textureCache[textureAtlas.texture.src] = new PIXI.BaseTexture(textureAtlas.texture);
            }
            var pixiTexture = new PIXI.Texture(
                this._textureCache[textureAtlas.texture.src],
                new PIXI.Rectangle(region.x, region.y, region.width, region.height)
            );
            var bitmap = new PIXI.Sprite(pixiTexture);

            if(isNaN(pivotX)||isNaN(pivotY))
            {
                var subTextureFrame = textureAtlas.getFrame(fullName);
                if(subTextureFrame != null)
                {
                    pivotX = subTextureFrame.width/2;
                    pivotY = subTextureFrame.height/2;
                }
                else
                {
                    pivotX = texture.region.width/2;
                    pivotY = texture.region.height/2;
                }
            }
            bitmap.pivot.x = pivotX;
            bitmap.pivot.y = pivotY;
            return bitmap;
        }
    });

    dragonBones.PixiFactory = PixiFactory;
}(dragonBones.BaseFactory));