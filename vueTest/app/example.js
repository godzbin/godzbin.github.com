const http = require("http");

const hostname = "127.0.0.1";
const port = "3000";

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end("Hello World\n");
});

server.listen(port, hostname, () => {
    console.log('服务器运行 http://${hostname}: ${port}/');
});


const arrayProto = Array.prototype;
const arrayMethods = Object.create(arrayProto);
const newArrProto = [];
[
    "push",
    "pop",
    "shift",
    "unshift",
    "splice",
    "sort",
    "reverse"
].forEach(method => {
    let original = arrayMethods[method];
    newArrProto[method] = function mutator() {
        console.log("监听到数组改变拉");
        console.log(this);
        return original.apply(this, arguments);
    }
});

let list = [1, 2];

list.__proto__ = newArrProto;
list.push(3);

let list2 = [1, 2];
list2.push(3);