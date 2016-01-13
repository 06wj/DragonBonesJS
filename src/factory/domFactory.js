/**
 * DomSlot
 */
(function(superClass) {
    var TextureAtlas = dragonBones.TextureAtlas;
    var DomSlot = function() {
        superClass.call(this, this);
        this._display = null;
    };

    __extends(DomSlot, superClass, {
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
            if (this._display && this._display.parentNode) {
                return Array.prototype.indexOf.call(this._display.parentNode.childNodes, this._display);
            }
            return -1;
        },
        _addDisplayToContainer: function(container, index) {
            if (this._display && container) {
                container.appendChild(this._display);
                this._display.style.zIndex = index||container.childNodes.length;
            }
        },
        _removeDisplayFromContainer: function() {
            if (this._display && this._display.parentNode) {
                this._display.parentNode.removeChild(this._display);
            }
        },
        _updateTransform: function() {
            if (this._display) {
                var m = this._globalTransformMatrix;
                this._display.style.webkitTransform = 'matrix3d(' + m.a + ',' + m.b + ',0,0,' + m.c + ',' + m.d + ',0,0,0,0,1,0,' +(m.tx-this._display.pivotX) + ',' + (m.ty-this._display.pivotY) + ',0,1)';
            }
        },
        _updateDisplayVisible: function(value) {
            if (this._display && this._parent) {
                var visible = this._parent._visible && this._visible && value;
                this._display.style.display = visible?'block':'none';
            }
        },
        _updateDisplayColor: function(aOffset, rOffset, gOffset, bOffset, aMultiplier, rMultiplier, gMultiplier, bMultiplier, colorChange) {
            superClass.prototype._updateDisplayColor.call(this, aOffset, rOffset, gOffset, bOffset, aMultiplier, rMultiplier, gMultiplier, bMultiplier, colorChange);
            if (this._display) {
                this._display.style.opacity = aMultiplier;
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

    dragonBones.DomSlot = DomSlot;
})(dragonBones.Slot);

/**
 * DomFactory
 */
(function(superClass){
    var Armature = dragonBones.Armature;
    var DomSlot = dragonBones.DomSlot;

    var DomFactory = function(){
        superClass.call(this, this);
    };
    __extends(DomFactory, superClass, {
        _generateArmature:function(){
            var container = document.createElement('div');
            container.style.position = 'relative';
            var armature = new Armature(container);
            return armature;
        },
        _generateSlot:function(){
            var slot = new DomSlot();
            return slot;
        },
        _generateDisplay:function(textureAtlas, fullName, pivotX, pivotY){
            var bitmap = document.createElement('div');
            var texture = textureAtlas.getTexture(fullName);
            bitmap.style.background = 'url(' + textureAtlas.texture.src + ')';
            bitmap.style.width = texture.region.width + 'px';
            bitmap.style.height = texture.region.height + 'px';
            bitmap.style.backgroundPosition = -texture.region.x + 'px -' + texture.region.y + 'px';
            bitmap.style.position = 'absolute';
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
            bitmap.style.webkitTransformOrigin = pivotX + 'px ' + pivotY + 'px';
            bitmap.pivotX = pivotX;
            bitmap.pivotY = pivotY;
            return bitmap;
        }
    });

    dragonBones.DomFactory = DomFactory;
}(dragonBones.BaseFactory));