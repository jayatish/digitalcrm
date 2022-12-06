
var input = document.querySelector("#phone");
var init = window.intlTelInput(input, {
    // nationalMode: true,
    // autoHideDialCode: false,
    separateDialCode: true,
    formatOnDisplay:false,
    preferredCountries: [],
    utilsScript: "/intl-tel-input/js/utils.js"
});
var countryData = window.intlTelInputGlobals.getCountryData();
if($('#countryCode').val()!='' && $('#preNumber').val()!='') {
    var selectedCountryDetails = countryData.find(x => x.iso2 === $('#countryISO2').val());
    init.setCountry(selectedCountryDetails.iso2);
    var displayNumber = '+'+selectedCountryDetails.dialCode+$('#preNumber').val();
    init.setNumber(displayNumber);
}
input.addEventListener('countrychange', function(e) {
    myFunction();
});

function myFunction() {
    var value = $("#phone").val();
    $('#phone_error').html('').hide();
    var numbers = /^[1-9]\d{9}$|^[1-9]\d{9}$/;
    if(!init.isValidNumber() || !numbers.test(value)) {
        $('#phone_error').html('<i class="fa fa-exclamation-triangle">Phone number is not valid.</i>').show();
        $('#countryISO2').val('');
        $('#countryCode').val('');
        $('#splitNumber').val('');
    }else{
        var countryCode = countryData.find(x => x.dialCode === init.getSelectedCountryData().dialCode).dialCode;
        var spliceNumber = value.slice(0,countryCode.length);
        splitMobileNumber = value;
        splitCountryCode = countryCode;
        if(spliceNumber==countryCode && value.length!=10) {
            splitMobileNumber = value.slice(countryCode.length);
        }
        var iso2 = countryData.find(x => x.iso2 === init.getSelectedCountryData().iso2).iso2;
        $('#countryISO2').val(iso2);
        $('#countryCode').val(parseInt(countryCode));
        $('#splitNumber').val(splitMobileNumber);

        $('#phone_error').html('').hide();
    }
}

function goBack() {
    window.history.back();
}
$("#signup").validate({
    errorClass: 'text-danger',
    rules: {
        name: {
            required: true,
            minlength: 3
        },
        email: {
            required: true,
            email: true
        }
    },
    messages: {
        name: {
            required: "Please provide a name",
            minlength: "Your name must be at least 3 characters long"
        },
        email: {
            required: "Please provide an email",
            minlength: "Please provide a valid email"
        }
    }
});




$('#dateOfBirth').datepicker({
    autoclose: true,
    format: 'dd/mm/yyyy',
    endDate: '+0d',
});