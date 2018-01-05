const express = require("express");
const app = express();
app.use(express.static("public"));

app.get("/", function (req, res) {
    res.send('');
});

var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log("应用实例，访问地址微 http://%s:%s", host, port);
});