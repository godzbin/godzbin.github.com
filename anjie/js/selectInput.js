/**
 * Created by GodzBin on 2016/9/26.
 */
function seleceInput(id, data ,changeFn) {
    this.data = data;
    var $id = "#" + id;
    this.init = function () {
        $($id+ " input").val("");
        var main = $($id + " .selectList");
        main.html("");
        for (var i = 0, l = this.data.length; i < l; i++) {
            var node= $("<div class='selectNode'></div>").text(this.data[i].name || this.data[i] );
            main.append(node);
        }
        $($id + " .select-icon").click(function(){
            $($id+ " input").focus();
            return false;
        });
        $($id+" input").focus(function(){
            $($id+ " .selectList").show();
            return false;
        });
        $($id+ " .selectList .selectNode").click( function(){
            $($id+ " .selectList").hide();
            $($id+ " .selectList .selectNode").removeClass("action");
            $(this).addClass("action");
            $($id + " input").val($(this).text());
            if(changeFn){
                changeFn();
            }
            return false;
        });
        $($id+ " input").change(function(){
            if(changeFn){
                changeFn();
            }
        });
        $($id+ " input").blur(function(){
            setTimeout(function(){
                $($id+ " .selectList").hide();
            },200);
        });
    };
    this.init();
}