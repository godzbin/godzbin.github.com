window.onload = function(){
    var textarea = document.getElementsByClassName("model-table-form-textarea")[0];
    var placeholder = document.getElementsByClassName("model-table-form-textarea-placeholder")[0];
    textarea.addEventListener("focus", function(){
        placeholder.style.display = "none";
    });
    textarea.addEventListener("blur", function(){
        var new_textarea = document.getElementsByClassName("model-table-form-textarea")[0];
        if(new_textarea.value == ""){
            placeholder.style.display = "block";
        }
    });
};