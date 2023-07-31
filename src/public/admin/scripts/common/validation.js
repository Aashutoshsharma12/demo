//Not allowed space first time 
function validate(input) {
    if (/^\s/.test(input.value))
        input.value = '';
}

//phone number validation
function mobileNum(phoneNumber) {
    let numberRegex = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z!@^#$%&*? "])[a-zA-Z0-9^!@#$*%&?]{6,20}$/;
    if (numberRegex.test(phoneNumber)) {
        document.getElementById("phoneNumber").value = phoneNumber
    } else {
        document.getElementById("numberError").innerHTML = ""
    }
}
$(function () {
    $("input[name='phoneNumber']").on('input', function (e) {
        $(this).val($(this).val().replace(/[^0-9]/g, ''));
    });
});