declare module egret{
    function getString(code:number, ...params:any[]):string;
    class EventDispatcher{
        constructor(target:IEventDispatcher);
        addEventListener(type:string, listener:Function, thisObject:any, useCapture?:boolean, priority?:number):void;
        once(type:string, listener:Function, thisObject:any, useCapture?:boolean, priority?:number):void;
        removeEventListener(type:string, listener:Function, thisObject:any, useCapture?:boolean):void;
        hasEventListener(type:string):boolean;
        dispatchEvent(event:Event):boolean;
        willTrigger(type:string):boolean;
    }

    interface IEventDispatcher{
        addEventListener(type:string, listener:Function, thisObject:any, useCapture?:boolean, priority?:number):void;
        once(type:string, listener:Function, thisObject:any, useCapture?:boolean, priority?:number):void;
        removeEventListener(type:string, listener:Function, thisObject:any, useCapture?:boolean):void;
        hasEventListener(type:string):boolean;
        dispatchEvent(event:Event):boolean;
        willTrigger(type:string):boolean;
    }

    class Event{
        target:any;
        currentTarget:any;
        data:any;
        type:string;
        bubbles:boolean;
        cancelable:boolean;
        eventPhase:number;
        isDefaultPrevented():boolean;
        stopImmediatePropagation():void;
        preventDefault():void;
        stopPropagation():void;
        clean():void;
        constructor(type:string, bubbles?:boolean, cancelable?:boolean, data?:any);
    }
}