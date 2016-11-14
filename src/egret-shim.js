if (!window.egret) {
    var egret_strings = {
        4001: "Abstract class can not be instantiated!",
        4002: "Unnamed data!",
        4003: "Nonsupport version!"
    };

    var Event = function(type, bubbles, cancelable, data) {
        this.type = type;
        this.bubbles = bubbles || false;
        this.cancelable = cancelable || false;
        this.data = data;
    };

    var EventDispatcher = function(target) {
        this._listenerDict = {};
    };

    EventDispatcher.prototype = {
        constructor: EventDispatcher,
        addEventListener: function(type, listener, thisObject, useCapture, priority, dispatchOnce) {
            if (!this._listenerDict[type]) {
                this._listenerDict[type] = [];
            }
            this._listenerDict[type].push({
                listener: listener,
                thisObject: thisObject,
                useCapture: useCapture,
                priority: priority,
                once: dispatchOnce
            });
        },
        once: function(type, listener, thisObject, useCapture, priority) {
            this.addEventListener(type, listener, thisObject, useCapture, priority, true);
        },
        removeEventListener: function(type, listener, thisObject, useCapture) {
            if (!type) {
                this._listenerDict = {};
            } else if (!listener) {
                if (this._listenerDict[type]) {
                    this._listenerDict[type].length = 0;
                }
            } else {
                var listeners = this._listenerDict[type];
                var index = listeners.indexOf(listener);
                if (index > -1) {
                    listeners.splice(index, 1);
                }
            }
        },
        hasEventListener: function(type) {
            return this._listenerDict[type];
        },
        dispatchEvent: function(event) {
            if (event && event.type && this._listenerDict[event.type]) {
                var listeners = this._listenerDict[event.type];
                var copyListeners = listeners.slice();
                for (var i = 0; i < copyListeners.length; i++) {
                    var listenerObj = copyListeners[i];
                    if (listenerObj.dispatchOnce) {
                        var index = listeners.indexOf(listenerObj);
                        if (index > -1) {
                            listeners.splice(index, 1);
                        }
                    }
                    if (listenerObj.listener) {
                        listenerObj.listener.call(listenerObj.thisObject || this, event);
                    }
                }
            }
        },
        willTrigger: function(type) {
            return this.hasEventListener(type);
        }
    };

    window.egret = {
        getString: function(code) {
            return egret_strings[code] || 'no string code';
        },
        Event: Event,
        EventDispatcher: EventDispatcher,
        registerClass: function(classDefinition, className, interfaceNames) {
            var prototype = classDefinition.prototype;
            prototype.__class__ = className;
            var types = [className];
            if (interfaceNames) {
                types = types.concat(interfaceNames);
            }
            var superTypes = prototype.__types__;
            if (prototype.__types__) {
                var length = superTypes.length;
                for (var i = 0; i < length; i++) {
                    var name = superTypes[i];
                    if (types.indexOf(name) == -1) {
                        types.push(name);
                    }
                }
            }
            prototype.__types__ = types;
        }
    };
}

window.__extends = window.__extends || function __extends(d, b, mixin) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];

    function __() {
        this.constructor = d;
    }
    __.prototype = b.prototype;
    d.prototype = new __();

    if(mixin){
        for(var key in mixin){
            d.prototype[key] = mixin[key];
        }
    }
};

window.__define = window.__define || function(o, p, g, s) {
    Object.defineProperty(o, p, {
        configurable: true,
        enumerable: true,
        get: g,
        set: s
    });
};