const locationDetails = $(location).attr('href').split('/');
var getLocationLastIndex = locationDetails[(locationDetails.length)-1];
var getLocationPreLastIndex = locationDetails[(locationDetails.length)-2];

if(getLocationLastIndex!='add' || getLocationPreLastIndex!='edit') {
    $(document).ready(function () {
        $('#example1').DataTable({
            "aoColumnDefs": [
               {'bSortable': false, 'aTargets': [1]},
    //              //{"aTargets": [3], "sClass": "text-justify"},
    //              {"sClass": "center", "aTargets": [1, 2]},
                {"width": "9%", "targets": [0]},
                {"width": "15%", "targets": [2]},
    //              {"width": "8%", "targets": [8]},
    //                  //{"width": "9%", "targets": [7]},
            ],
            "paging": true,
            "lengthChange": true,
            "searching": true,
            "ordering": true,
            "info": true,
            "autoWidth": false,
            "stateSave": true
        });
    });
    
    $(document).ready(function () {
        $(document).on('click', ".delete_confirmation", function (e) {
            e.preventDefault();
            if (confirm("Do you want delete this item")) {
                //alert($(this).attr('href'));
                window.location.href = $(this).attr('href');
            }
        });
    });
}


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
            if(AttrVal==""){
                $('#'+AttrId+'_error').html("<i class='fa fa-exclamation-triangle'>This field is required</i>");
                hasError++;
                return false;
            }else{
                $('#'+AttrId+'_error').html("");
            }
        }
    });
    if(hasError==0) {
        $('#submitButton').removeAttr("type").attr("type", "submit");
    }
});

function goBack() {
    window.location.href = '/country';
}