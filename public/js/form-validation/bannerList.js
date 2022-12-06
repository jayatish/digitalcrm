$(function () {
    CKEDITOR.replace('en_header', { 
      
        toolbarGroups: [
          { name: 'basicstyles'},
          { name: 'styles' },
          { name: 'colors' },
        ]
    });
    CKEDITOR.replace('pt_header', { 
      
        toolbarGroups: [
          { name: 'basicstyles'},
          { name: 'styles' },
          { name: 'colors' },
        ]
    });
    CKEDITOR.replace('en_bottom', { 
      
        toolbarGroups: [
          { name: 'basicstyles'},
          { name: 'styles' },
          { name: 'colors' },
        ]
    });
    CKEDITOR.replace('pt_bottom', { 
      
        toolbarGroups: [
          { name: 'basicstyles'},
          { name: 'styles' },
          { name: 'colors' },
        ]
    });

    function previewImages() {

        let fr = new FileReader();
        fr.onload = () => { // when file has loaded
            var img = new Image();
            img.onload = () => {

                if(img.width>parseInt($('#width').val()) || img.height>parseInt($('#height').val())) {
                    $('#image_error').html("<i class='fa fa-exclamation-triangle'>Image dimension should be "+$('#width').val()+"*"+$('#height').val()+"</i>");
                    $('#image').val('');
                    $('#preview').html('')
                } else {
                    $('#image_error').html("");
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
            };
            img.src = fr.result; // This is the data URL 
        };
        fr.readAsDataURL(this.files[0]);
    }
    document.querySelector('#image').addEventListener("change", previewImages, false);
});


$('#submitButton').on('click', function() {
    var hasError = 0;
    $('.required').each(function() {
        var AttrId = $(this).attr('id');
        var AttrVal = $(this).val();
        if(AttrVal==""){
            console.log($(this).is('input'));
            console.log($(this).attr('type'));
            console.log($('#existImage').val());
            if($(this).is('input')) {
                if(($(this).attr('type')=='file') && ($('#existImage').val()=='')) {
                    $('#'+AttrId+'_error').html("<i class='fa fa-exclamation-triangle'>This field is required</i>");
                    hasError++;
                    return false;
                }
                if($(this).attr('type')=='text') {
                    $('#'+AttrId+'_error').html("<i class='fa fa-exclamation-triangle'>This field is required</i>");
                    hasError++;
                    return false;
                } 
                // else {
                //     $('#'+AttrId+'_error').html("");
                // }
                
            } else {
                $('#'+AttrId+'_error').html("<i class='fa fa-exclamation-triangle'>This field is required</i>");
                hasError++;
                return false;
            }   
            
        }else{
            $('#'+AttrId+'_error').html("");
        }
        // if($(this).attr('data-attr')) {
        //     var splitLanguage = AttrId.split('_');
        //     if($(this).is('input')) {
        //         if(AttrVal=="") {
        //             $('#'+splitLanguage[0]+'_tag').click();
        //             $('#'+AttrId+'_error').html("<i class='fa fa-exclamation-triangle'>This field is required</i>");
        //             hasError++;
        //             return false;
        //         } else {
        //             $('#'+AttrId+'_error').html("");
        //         }
                
        //     } else {
        //         if(CKEDITOR.instances[AttrId].getData()=="") {
        //             $('#'+splitLanguage[0]+'_tag').click();
        //             $('#'+AttrId+'_error').html("<i class='fa fa-exclamation-triangle'>This field is required</i>");
        //             hasError++;
        //             return false;
        //         } else {
        //             $('#'+AttrId+'_error').html("");
        //         }
        //     }
        // }else{
        //     if(typeof AttrVal!='string'){
        //         if(AttrVal.length==0) {
        //             $('#'+AttrId+'_error').html("<i class='fa fa-exclamation-triangle'>This field is required</i>");
        //             hasError++;
        //             return false;
        //         }else {
        //             $('#'+AttrId+'_error').html("");
        //         }
        //     } else {
        //         if(AttrVal==""){
        //             $('#'+AttrId+'_error').html("<i class='fa fa-exclamation-triangle'>This field is required</i>");
        //             hasError++;
        //             return false;
        //         }else{
        //             $('#'+AttrId+'_error').html("");
        //         }
        //     }
        // }
    });
    if(hasError==0) {
        console.log("Hiiii");
        $('#submitButton').removeAttr("type").attr("type", "submit");
    }
});

function goBack() {
    window.location.href = '/banner';
}

function getBannerValue(value) {
    if(value=='') {
        $('#bannerTypeId').val('');
        $('#height').val('');
        $('#width').val('');
    } else {
        var splitData = value.split('@@');
        $('#bannerTypeId').val(splitData[0]);
        $('#height').val(splitData[1]);
        $('#width').val(splitData[2]);
    }
}

