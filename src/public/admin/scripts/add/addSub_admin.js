//view Sub_Admin
function detail() {
    var currentLocation = window.location.href;
    var url = new URL(currentLocation);
    var c = url.searchParams.get("id");
    $.ajax({
        url: `${host}/api/v1/admin/sub_Admin/details/${c}`,
        type: 'Get',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
    }).done(function (data) {
        if (data.code == 200) {
            // If successful
            function mobileNoselect() {
                if ($('#form').length) {
                    $(".mobile").intlTelInput();
                    $(".mobile").intlTelInput("setNumber", document.getElementById('phoneCountryCode').value);
                };
            };
            //* Select js
            function nice_Select() {
                if ($('.product_select').length) {
                    $('select').niceSelect();
                };
            };
            document.getElementById('name').value = data.data.name
            document.getElementById('email').value = data.data.email
            document.getElementById('phoneNumber').value = data.data.phoneNumber
            document.getElementById('phoneCountryCode').value = data.data.countryCode
            document.getElementById('password').value = data.data.password
            document.getElementById('confirmPassword').value = data.data.confirmPassword
            document.getElementById('isActive').value = data.data.isActive
            document.getElementById('Id').value = data.data._id
            document.getElementById('password').value = "......"
            document.getElementById('confirmPassword').value = "......"
            mobileNoselect();
            nice_Select();
            var permission = data.data.permission
            for (let i = 0; i < permission.length; i++) {
                if (permission[i] == "Dashboard") {
                    document.getElementById("c1").checked = true
                } if (permission[i] == "User Management") {
                    document.getElementById("c2").checked = true
                } if (permission[i] == "Vendor Management") {
                    document.getElementById("c3").checked = true
                } if (permission[i] == "Category Management") {
                    document.getElementById("c4").checked = true
                } if (permission[i] == "Notification") {
                    document.getElementById("c5").checked = true
                } if (permission[i] == "Admin Setting") {
                    document.getElementById("c6").checked = true
                } if (permission[i] == "Payment Management") {
                    document.getElementById("c7").checked = true
                }
            }
        } else {
            alert("Some Thing Went Wrong")
        }

    }).fail(function (jqXHR, textStatus, errorThrown) {
        // If fail
        alert(jqXHR.responseJSON.error)

    })

}
//edit Sub_Admin
function editSub_admin() {
    const currentLocation = window.location.href
    const url = new URL(currentLocation)
    const Id = url.searchParams.get('id')
    var number_withcounrtCode = document.getElementById('phoneCountryCode').value + "" + document.getElementById('phoneNumber').value
    var email = document.getElementById('email').value
    if ((/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) == true) {
        if ((document.getElementById('phoneNumber').value).length > 3) {
            if (libphonenumber.parsePhoneNumber(number_withcounrtCode).isValid() == true) {
                if (document.getElementById("c1").checked) {
                    var c1 = document.getElementById("c1").value
                } else {
                    var c1 = null
                }
                if (document.getElementById("c2").checked) {
                    var c2 = document.getElementById("c2").value
                } else {
                    var c2 = null
                }
                if (document.getElementById("c3").checked) {
                    var c3 = document.getElementById("c3").value
                } else {
                    var c3 = null
                }
                if (document.getElementById("c4").checked) {
                    var c4 = document.getElementById("c4").value
                } else {
                    var c4 = null
                }
                if (document.getElementById("c5").checked) {
                    var c5 = document.getElementById("c5").value
                } else {
                    var c5 = null
                }
                if (document.getElementById("c6").checked) {
                    var c6 = document.getElementById("c6").value
                } else {
                    var c6 = null
                }
                if (document.getElementById("c7").checked) {
                    var c7 = document.getElementById("c7").value
                } else {
                    var c7 = null
                }
                var array = [c1, c2, c3, c4, c5, c6, c7]
                var array1 = []
                for (let i = 0; i < array.length; i++) {
                    if (array[i] != null) {
                        array1.push(array[i])
                    }
                }
                if (array1 == 0) {
                    alert("Please select Permission type")
                } else {
                    var obj = {
                        name: document.getElementById("name").value,
                        email: document.getElementById("email").value,
                        phoneNumber: document.getElementById("phoneNumber").value,
                        isActive: document.getElementById("isActive").value,
                        countryCode: document.getElementById('phoneCountryCode').value,
                        permission: array1,
                        subAdminId: Id
                    }
                    $.ajax({
                        url: `${host}/api/v1/admin/sub_Admin/edit_subAdmin`,
                        type: 'Put',
                        data: obj,
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader('Authorization', token);
                        },
                    }).done(function (data) {
                        // console.log(data, "lll")
                        // alert('sucess')
                        window.location.replace('/admin/sub_admin')
                    }).fail(function (jqXHR, textStatus, errorThrown) {
                        // If fail
                        console.log(textStatus,"errrrrrrrrrrrrrrrrrrrr");
                        if(textStatus == 'timeout') {
                            alert('Connection seems dead!');
                        }
                        alert(jqXHR.responseJSON.error)
                    })
                }
            } else {
                alert('Invalid Phone Number Please enter valid Phone Number')
            }
        } else {
            alert('Invalid Phone Number Please enter valid Phone Number')
        }
    } else {
        alert("Please Enter Valid Email")
    }
}
// //add Sub_Admin
// function addSub_admin() {
//     console.log("enter")
//     var number_withcounrtCode = document.getElementById('phoneCountryCode').value + "" + document.getElementById('phoneNumber').value
//    var email = document.getElementById('email').value
//     if((/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) == true){
//         if (libphonenumber.parsePhoneNumber(number_withcounrtCode).isValid() == true) {
//             var password = document.getElementById('password').value
//             let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/
//             if (passwordRegex.test(password)) {
//                 if (document.getElementById("c1").checked) {
//                     var c1 = document.getElementById("c1").value
//                 } else {
//                     var c1 = null
//                 }
//                 if (document.getElementById("c2").checked) {
//                     var c2 = document.getElementById("c2").value
//                 } else {
//                     var c2 = null
//                 }
//                 if (document.getElementById("c3").checked) {
//                     var c3 = document.getElementById("c3").value
//                 } else {
//                     var c3 = null
//                 }
//                 if (document.getElementById("c4").checked) {
//                     var c4 = document.getElementById("c4").value
//                 } else {
//                     var c4 = null
//                 }
//                 if (document.getElementById("c5").checked) {
//                     var c5 = document.getElementById("c5").value
//                 } else {
//                     var c5 = null
//                 }
//                 if (document.getElementById("c6").checked) {
//                     var c6 = document.getElementById("c6").value
//                 } else {
//                     var c6 = null
//                 }
//                 if (document.getElementById("c7").checked) {
//                     var c7 = document.getElementById("c7").value
//                 } else {
//                     var c7 = null
//                 }
//                 var array = [c1, c2, c3, c4, c5, c6, c7]
//                 var array1 = []
//                 for (let i = 0; i < array.length; i++) {
//                     if (array[i] != null) {
//                         array1.push(array[i])
//                     }
//                 }
//                 if (array.length != 0) {
//                     var obj = {
//                         name: document.getElementById("name").value,
//                         email: document.getElementById("email").value,
//                         countryCode: document.getElementById('phoneCountryCode').value,
//                         phoneNumber: document.getElementById("phoneNumber").value,
//                         password: document.getElementById("password").value,
//                         confirmPassword: document.getElementById("confirmPassword").value,
//                         isActive: document.getElementById("isActive").value,
//                         permission: array1,
//                     }
//                     $.ajax({
//                         url: `${host}/api/v1/admin/sub_Admin/add_subAdmin`,
//                         type: 'Post',
//                         data: obj,
//                         beforeSend: function (xhr) {
//                             xhr.setRequestHeader('Authorization', token);
//                         },
//                     }).done(function (data) {
//                         window.location.replace('/admin/sub_admin')
//                     }).fail(function (jqXHR, textStatus, errorThrown) {
//                         // If fail
//                         alert(jqXHR.responseJSON.error)
//                     })
//                 } else {
//                     alert("Please select Permission type")
//                 }
//             } else {
//                 alert("Password must be more than 8 characters with 1 uppercase,1number & 1 symbol.")
//             }
//         } else {
//             alert('Invalid Phone Number Please enter valid Phone Number')
//         }
//     }else{
//         alert("Please Enter Valid Email")
//     }

// }
function classActive() {
    this.setTimeout(() => {
        document.getElementById('sub_admin-nav')?.classList.add("active");
    }, 1500)
}