/**
 * Created by GodzBin on 2016/9/28.
 */
$(document).ready(function () {
    // new selectArea("returnAddress");
    // new selectArea("recipientAddress");

    new seleceInput("returnAddressProvince", provinceListMain, returnAddressCity);
    function returnAddressCity() {
        var province = $("#returnAddressProvince input").val();
        var length = provinceListMain.length;
        var citys = [];
        for (var i = 0; i < length; i++) {

            if (provinceListMain[i].name == province) {
                if(province == "北京" || province == "天津" || province == "上海" || province == "重庆"){
                    citys = provinceListMain[i].cityList[0].areaList.concat(provinceListMain[i].cityList[1].areaList)
                }else{
                    citys = provinceListMain[i].cityList;
                }
            }
        }
        new  seleceInput("returnAddressCity", citys, null);
        return false;
    }
    new seleceInput("recipientAddressProvince", provinceListMain, recipientAddressCity);
    function recipientAddressCity(){
        var province = $("#recipientAddressProvince input").val();
        var length = provinceListMain.length;
        var citys = [];
        for (var i = 0; i < length; i++) {
            if (provinceListMain[i].name == province) {
                if(province == "北京" || province == "天津" || province == "上海" || province == "重庆"){
                    citys = provinceListMain[i].cityList[0].areaList.concat(provinceListMain[i].cityList[1].areaList)
                }else{
                    citys = provinceListMain[i].cityList;
                }
            }
        }
        new  seleceInput("recipientAddressCity", citys, null);
        return false;
    }
    // $("body").click(function () {
    //     $(".selectList").hide();
    // });
});