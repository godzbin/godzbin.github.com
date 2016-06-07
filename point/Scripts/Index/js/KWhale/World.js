(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
        || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

function World(){

}
World.FPS=0;
World.isShowFPS = false;
World.ISTEST = false;
World.STAT;
World.init=function() {
    window["initKW"]();
};
World.Go=function(fuc){
    if(World.isShowFPS){
        World.STAT = new Stats();
        document.body.appendChild(World.STAT.domElement);
    }
    (function go(){
        if(World.isShowFPS){
            World.STAT.begin();
            window.requestAnimationFrame(go);
            World.STAT.end();
            fuc();
        }else{
            window.requestAnimationFrame(go);
            fuc();
        }
    }());
}