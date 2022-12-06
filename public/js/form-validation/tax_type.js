$('#submitButton').on('click', function() {
    var hasError = 0;
    $('.required').each(function() {
        var AttrType = $(this).attr('type');
        var AttrId = $(this).attr('id');
        var AttrVal = $(this).val();
        // For text input
        if(AttrType=='text') {
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
        // For checkbox
        if(AttrType=='checkbox') {
            var attr = $(this).attr('data-checkbox');
            if($('.tax_calculation_type_id').is(":checked")==false) {
                $('#'+attr+'_error').html("<i class='fa fa-exclamation-triangle'>Please select at least one</i>");
                hasError++;
                return false;
            }else {
                console.log("Checkbox valid successfully");
                $('#'+attr+'_error').html("");
            }
        }
    });
    if(hasError==0) {
        // if()
        $('#submitButton').removeAttr("type").attr("type", "submit");
    }
});

function goBack() {
    window.location.href = '/tax_type';
}