(function(){
    var DataParser = dragonBones.DataParser;
    var TextureData = dragonBones.TextureData;

    var TextureAtlas = function(texture, textureAtlasRawData, scale){
        this._textureDatas = {};
        this.scale = scale||1;
        this.texture = texture;
        this.name = textureAtlasRawData.name;

        this.parseData(textureAtlasRawData);
    };

    TextureAtlas.rotatedDic = {};

    TextureAtlas.prototype = {
        constructor:TextureAtlas,
        getTexture:function(fullName){
            var data = this._textureDatas[fullName];
            if(data){
                data.texture = this.texture;
                if(data.rotated)
                {
                    TextureAtlas.rotatedDic[fullName] = 1;
                }
            }
            return data;
        },
        dispose:function(){
            this.texture = null;
            this._textureDatas = {};
        },
        getRegion:function(subTextureName){
            var textureData = this._textureDatas[subTextureName];
            if(textureData && textureData instanceof TextureData){
                return textureData.region;
            }
            return null;
        },
        getFrame:function(subTextureName){
            var textureData = this._textureDatas[subTextureName];
            if(textureData && textureData instanceof TextureData)
            {
                return textureData.frame;
            }
            return null;
        },
        parseData:function(textureAtlasRawData){
            this._textureDatas = DataParser.parseTextureAtlasData(textureAtlasRawData, this.scale);
        }
    };
    dragonBones.TextureAtlas = TextureAtlas;
})();