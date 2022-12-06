$(function () {
    CKEDITOR.replace('en_title', { 
      
        toolbarGroups: [
          { name: 'basicstyles'},
          { name: 'styles' },
          { name: 'colors' },
        ]
    });
    CKEDITOR.replace('pt_title', { 
      
        toolbarGroups: [
          { name: 'basicstyles'},
          { name: 'styles' },
          { name: 'colors' },
        ]
    });
});


$('#submitButton').on('click', function() {
    var hasError = 0;
    $('.required').each(function() {
        var AttrId = $(this).attr('id');
        var AttrVal = $(this).val();
        if($(this).attr('data-attr')) {
            var splitLanguage = AttrId.split('_');
            if($(this).is('input')) {
                if(AttrVal=="") {
                    $('#'+splitLanguage[0]+'_tag').click();
                    $('#'+AttrId+'_error').html("<i class='fa fa-exclamation-triangle'>This field is required</i>");
                    hasError++;
                    return false;
                } else {
                    $('#'+AttrId+'_error').html("");
                }
                
            } else {
                if(CKEDITOR.instances[AttrId].getData()=="") {
                    $('#'+splitLanguage[0]+'_tag').click();
                    $('#'+AttrId+'_error').html("<i class='fa fa-exclamation-triangle'>This field is required</i>");
                    hasError++;
                    return false;
                } else {
                    $('#'+AttrId+'_error').html("");
                }
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
        console.log("Hiiii");
        $('#submitButton').removeAttr("type").attr("type", "submit");
    }
});

function goBack() {
    window.location.href = '/bannerType';
}

