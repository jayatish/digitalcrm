$(function () {
    //Initialize Select2 Elements
    $('.select2').select2();


    function previewImages() {
        var preview = document.querySelector('#preview');
        preview.innerHTML = null;
        if (this.files) {
            [].forEach.call(this.files, readAndPreview);
        }

        function readAndPreview(file) {
            var reader = new FileReader();

            reader.addEventListener("load", function () {
                var image = new Image();
                image.height = 100;
                image.title = file.name;
                image.className = "margin";
                image.src = this.result;
                preview.appendChild(image);
            }, false);

            reader.readAsDataURL(file);
        }
    }

    document.querySelector('#image').addEventListener("change", previewImages, false);
});


$('#submitButton').on('click', function() {
    var hasError = 0;
    $('.required').each(function() {
        var AttrId = $(this).attr('id');
        var AttrVal = $(this).val();
        if($(this).attr('data-attr')) {
            var splitLanguage = AttrId.split('_');
            if(AttrVal==""){
                $('#'+splitLanguage[0]+'_tag').click();
                $('#'+AttrId+'_error').html("<i class='fa fa-exclamation-triangle'>This field is required</i>");
                hasError++;
                return false;
            }else{
                $('#'+AttrId+'_error').html("");
            }
        }else if($(this).attr('data-explanation')) {
            var splitLanguage = AttrId.split('_');
            if(AttrVal==""){
                $('#'+splitLanguage[0]+'_explanation_tag').click();
                $('#'+AttrId+'_error').html("<i class='fa fa-exclamation-triangle'>This field is required</i>");
                hasError++;
                return false;
            }else{
                $('#'+AttrId+'_error').html("");
            }
        }else{
            if(typeof AttrVal!='string'){
                if(AttrVal.length==0) {
                    $('#'+AttrId+'_error').html("<i class='fa fa-exclamation-triangle'>This field is required</i>");
                    hasError++;
                    return false;
                }else {
                    $('#'+AttrId+'_error').html("");
                }
            } else {
                if(AttrVal=="" && $('#existImageLink').val()==''){
                    $('#'+AttrId+'_error').html("<i class='fa fa-exclamation-triangle'>This field is required</i>");
                    hasError++;
                    return false;
                }else{
                    $('#'+AttrId+'_error').html("");
                }
            }
        }
    });
    if(hasError==0) {
        console.log("Hiiii");
        $('#submitButton').removeAttr("type").attr("type", "submit");
    }
});

function goBack() {
    window.location.href = '/icon';
}

