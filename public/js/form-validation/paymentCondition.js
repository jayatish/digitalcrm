$(function () {
    //Initialize Select2 Elements
    $('.select2').select2()
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
                if(AttrVal==""){
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
        $('#submitButton').removeAttr("type").attr("type", "submit");
    }
});

function goBack() {
    window.location.href = '/paymentCondition';
}