/**
 * Created by GodzBin on 2016/9/26.
 */
$(document).ready(function () {
    $(".networkQueryContent-result .close").click(function () {
        $(".networkQueryContent-result").hide();
    });
    $(".selectArea button").click(function () {
        var area = $(".selectAreaInput input").val();
        if (area) {
            $(".networkQueryContent-result").show();
            $(".selectArea .error").text("");
        } else {
            $(".selectArea .error").text("请选择地区");
        }
    });
    new selectArea("networkQuerySelectArea");
});