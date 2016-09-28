/**
 * Created by GodzBin on 2016/9/25.
 */
function selectArea(id) {
    this.id = id;
    var $id = "#" + this.id;
    this.init = function () {
        $($id + " .selectAreaInput input").click(function () {
            if ($($id + " .selectAreaShow").css("display") == "none") {
                $($id + " .selectAreaShow").show();
                var province_link = $($id + " .selectAreaShow-main-box1 .action").attr("value");
                if ($(this).val()) {

                } else {
                    getProvince(province_link);
                }
            }
            return false;
        });
        $($id + " .selectAreaShow-main-box1 a").click(function () {
            initProvince();
            if (!$(this).hasClass("action")) {
                $($id + " .selectAreaShow-main-box1 a").removeClass("action");
                var province_link = $(this).addClass("action").attr("value");
                getProvince(province_link);
            }
            return false;
        });
        $($id + " .selectAreaShow-main-box2 .all").click(function () {
            initProvince();
            var province_link = $($id + " .selectAreaShow-main-box1 a.action").attr("value");
            getProvince(province_link);
            return false;
        });
        $($id + " .selectAreaShow-main-box2 .province").click(setProvince);
        $($id + " .selectAreaShow-main-box2 .city").click(setCity);
    };
    this.init();
    function initProvince() {
        $($id + " .selectAreaShow-main-box2 a").removeClass("action");
        $($id + " .selectAreaShow-main-box2 .all").addClass("action");
        $($id + " .selectAreaShow-main-box2 .province").text("");
        $($id + " .selectAreaShow-main-box2 .city").text("");
        $($id + " .selectAreaShow-main-box2 .area").text("");
        $($id + " .selectAreaInput input").val("");
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
        $($id + " .selectAreaShow-main-box3").html(provinces_a.join(""));
        $($id + " .selectAreaShow-main-box3 a").click(setProvince);
        return false;
    }

    function setProvince() {
        var data = $(this).attr("data");
        var provinceData = JSON.parse(data);
        var cityList = provinceData.cityList;
        var length = cityList.length;
        $($id + " .selectAreaShow-main-box2 a").removeClass("action");
        $($id + " .selectAreaShow-main-box2 .province").addClass("action").text(provinceData.name).attr("data", data);
        $($id + " .selectAreaShow-main-box2 .city").text("");
        $($id + " .selectAreaShow-main-box2 .area").text("");
        $($id + " .selectAreaInput input").val("");
        var city_a = [];
        for (var i = 0; i < length; i++) {
            var a = "<a href='javascript:void(0)' data='" + JSON.stringify(cityList[i]) + "' >" + cityList[i].name + "</a>";
            city_a.push(a);
        }
        $($id + " .selectAreaShow-main-box3").html(city_a.join(""));
        $($id + " .selectAreaShow-main-box3 a").click(setCity);
        return false;
    }

    function setCity() {
        var data = $(this).attr("data");
        var cityData = JSON.parse(data);
        var areaList = cityData.areaList;
        var length = areaList.length;
        $($id + " .selectAreaShow-main-box2 a").removeClass("action");
        $($id + " .selectAreaShow-main-box2 .city").addClass("action").text(cityData.name).attr("data", data);
        $($id + " .selectAreaShow-main-box2 .area").text("");
        $($id + " .selectAreaInput input").val("");
        var area_a = [];
        for (var i = 0; i < length; i++) {
            var a = "<a href='javascript:void(0)' data='" + JSON.stringify(areaList[i]) + "' >" + areaList[i] + "</a>";
            area_a.push(a);
        }
        $($id + " .selectAreaShow-main-box3").html(area_a.join(""));
        $($id + " .selectAreaShow-main-box3 a").click(setArea);
        return false;
    }

    function setArea() {
        var areaName = $(this).text();
        $($id + " .selectAreaShow-main-box3 a").removeClass("action");
        $(this).addClass("action");
        $($id + " .selectAreaShow-main-box2 a").removeClass("action");
        $($id + " .selectAreaShow-main-box2 .area").addClass("action").text(areaName);
        var province = $($id + " .selectAreaShow-main-box2 .province").text();
        var city = $($id + " .selectAreaShow-main-box2 .city").text();
        var area = $($id + " .selectAreaShow-main-box2 .area").text();
        $($id + " .selectAreaInput input").val(province + "-" + city + "-" + area);
        $($id + " .selectAreaShow").hide();
        return false;
    }
    return this;
}
