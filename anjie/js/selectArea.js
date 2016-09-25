/**
 * Created by GodzBin on 2016/9/25.
 */
$(document).ready(function () {
    $(".selectAreaInput").click(function () {
        if ($(".selectAreaShow").css("display") == "none") {
            $(".selectAreaShow").show();
            var province_link = $(".selectAreaShow-main-box1 .action").attr("value");
            getProvince(province_link);
        }
    });
    $(".selectAreaShow-main-box1 a").click(function () {
        initProvince();
        if (!$(this).hasClass("action")) {
            $(".selectAreaShow-main-box1 a").removeClass("action");
            var province_link = $(this).addClass("action").attr("value");
            getProvince(province_link);
        }
    });
    $(".selectAreaShow-main-box2 .all").click(function(){
        initProvince();
        var province_link = $(".selectAreaShow-main-box1 a.action").attr("value");
        getProvince(province_link);
    });
    $(".selectAreaShow-main-box2 .province").click(setProvince);
    $(".selectAreaShow-main-box2 .city").click(setCity);
});
function initProvince(){
    $(".selectAreaShow-main-box2 a").removeClass("action");
    $(".selectAreaShow-main-box2 .all").addClass("action");
    $(".selectAreaShow-main-box2 .province").text("");
    $(".selectAreaShow-main-box2 .city").text("");
    $(".selectAreaShow-main-box2 .area").text("");
    $(".selectAreaInput input").val("");
};
function getProvince(province_link) {
    var provinceList;
    if (province_link == "1") {
        provinceList = provinceListMain;
    } else {
        provinceList = provinceListOther;
    }
    var length = provinceList.length;
    var provinces_a = [];
    for (var i = 0; i < length; i++) {
        var a = "<a href='javascript:void(0)' data='" + JSON.stringify(provinceList[i]) + "' >" + provinceList[i].name + "</a>";
        provinces_a.push(a);
    }
    $(".selectAreaShow-main-box3").html(provinces_a.join(""));
    $(".selectAreaShow-main-box3 a").click(setProvince);
}
function setProvince() {
    var data = $(this).attr("data");
    var provinceData = JSON.parse(data);
    var cityList = provinceData.cityList;
    var length = cityList.length;
    $(".selectAreaShow-main-box2 a").removeClass("action");
    $(".selectAreaShow-main-box2 .province").addClass("action").text(provinceData.name).attr("data", data);
    $(".selectAreaShow-main-box2 .city").text("");
    $(".selectAreaShow-main-box2 .area").text("");
    $(".selectAreaInput input").val("");
    var city_a = [];
    for (var i = 0; i < length; i++) {
        var a = "<a href='javascript:void(0)' data='" + JSON.stringify(cityList[i]) + "' >" + cityList[i].name + "</a>";
        city_a.push(a);
    }
    $(".selectAreaShow-main-box3").html(city_a.join(""));
    $(".selectAreaShow-main-box3 a").click(setCity);
}
function setCity() {
    var data = $(this).attr("data");
    var cityData = JSON.parse(data);
    var areaList = cityData.areaList;
    var length = areaList.length;
    $(".selectAreaShow-main-box2 a").removeClass("action");
    $(".selectAreaShow-main-box2 .city").addClass("action").text(cityData.name).attr("data", data);
    $(".selectAreaShow-main-box2 .area").text("");
    $(".selectAreaInput input").val("");
    var area_a = [];
    for (var i = 0; i < length; i++) {
        var a = "<a href='javascript:void(0)' data='" + JSON.stringify(areaList[i]) + "' >" + areaList[i] + "</a>";
        area_a.push(a);
    }
    $(".selectAreaShow-main-box3").html(area_a.join(""));
    $(".selectAreaShow-main-box3 a").click(setArea);
}
function setArea() {
    var areaName = $(this).text();
    $(".selectAreaShow-main-box3 a").removeClass("action");
    $(this).addClass("action");
    $(".selectAreaShow-main-box2 a").removeClass("action");
    $(".selectAreaShow-main-box2 .area").addClass("action").text(areaName);
    var province = $(".selectAreaShow-main-box2 .province").text();
    var city = $(".selectAreaShow-main-box2 .city").text();
    var area = $(".selectAreaShow-main-box2 .area").text();
    $(".selectAreaInput input").val(province + "-" + city + "-" + area);
}