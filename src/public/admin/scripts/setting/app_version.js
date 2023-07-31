
// function changePassword() {
//     var oldpassword = document.getElementById('oldpass').value;
//     var newpassword = document.getElementById('password').value;
//     var cpassword = document.getElementById('cpassword').value;
//     if (newpassword !== cpassword) {
//         swal({
//             title: "Error",
//             text: "Confirm Password should be same as new password"
//         });

//     } else if (!newpassword && !oldpassword) {
//         swal({
//             title: "Error",
//             text: "Please Fill Password"
//         });
//     } else {
//         let obj = {
//             "password": oldpassword,
//             "newPassword": newpassword
//         }
//         $.ajax({
//             url: host + '/api/v1/admin/auth/changePassword',
//             type: 'POST',
//             contentType: 'application/json',
//             data: JSON.stringify(obj),
//             beforeSend: function (xhr) {
//                 xhr.setRequestHeader('Authorization', token);
//             },
//             dataType: 'json',
//             success: function (data, status) {

//             }
//         }).done(function (data) {
//             if (data.code == 200) {
//                 swal({
//                     title: "Success",
//                     text: "You have changed Password Successfully ! redirecting you to login page...",
//                     type: "success"
//                 });
//                 localStorage.removeItem("name");
//                 localStorage.removeItem("token");
//                 setTimeout(() => {
//                     window.location.replace('/login');
//                 }, 2000)
//             }
//         }).fail(function (jqXHR, textStatus, errorThrown) {
//             swal({
//                 title: "Error!",
//                 text: `${jqXHR.responseJSON.error}`
//             });
//         })
//     }
// }

function classActive() {
    this.setTimeout(() => {
        document.getElementById('admin_setting-nav')?.classList.add("active");
    }, 1500)
    this.setTimeout(() => {
        document.getElementById('app-nav')?.classList.add("active");
    }, 1500)
}

//  update Version
function update() {
    console.log("enter")
    var obj = {
        'andriodUserAppUrl': document.getElementById('andriodUserAppUrl').value,
        'andriodUserVersion': document.getElementById('andriodUserVersion').value,
        'andriodUserUpdate': document.getElementById('andriodUserUpdate').value,
        'iosUserAppUrl': document.getElementById('iosUserAppUrl').value,
        'iosUserVersion': document.getElementById('iosUserVersion').value,
        'iosUserUpdate': document.getElementById('iosUserUpdate').value,
        'andriodVendorAppUrl': document.getElementById('andriodVendorAppUrl').value,
        'andriodVendorVersion': document.getElementById('andriodVendorVersion').value,
        'andriodVendorUpdate': document.getElementById('andriodVendorUpdate').value,
        'iosVendorAppUrl': document.getElementById('iosVendorAppUrl').value,
        'iosVendorVersion': document.getElementById('iosVendorVersion').value,
        'iosVendorUpdate': document.getElementById('iosVendorUpdate').value,
        'andriodDoorKeeperAppUrl': document.getElementById('andriodDoorKeeperAppUrl').value,
        'andriodDoorKeeperVersion': document.getElementById('andriodDoorKeeperVersion').value,
        'andriodDoorKeeperUpdate': document.getElementById('andriodDoorKeeperUpdate').value,
        'iosDoorKeeperAppUrl': document.getElementById('iosDoorKeeperAppUrl').value,
        'iosDoorKeeperVersion': document.getElementById('iosDoorKeeperVersion').value,
        'iosDoorKeeperUpdate': document.getElementById('iosDoorKeeperUpdate').value
    }
    console.log("enter",obj)

    $.ajax({
        url: host + '/api/v1/admin/setting/edit',
        type: 'Put',
        data: obj,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        // dataType: 'json'
    }).done(function (data) {
        if (data.code == 200) {
            swal({
                title: "Success",
                text: " Successfully update",
                type: "success"
            });
        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        alert(jqXHR.responseJSON.error)
    })

}
//   details
function getDetails() {
    $.ajax({
        url: host + '/api/v1/admin/setting/detail',
        type: 'get',
        contentType: 'application/json',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        dataType: 'json'
    }).done(function (data) {
        if (data.code == 200) {
            document.getElementById('andriodUserVersion').value  = data.data.andriodUserVersion,
                document.getElementById('andriodVendorVersion').value =data.data.andriodVendorVersion
                document.getElementById('andriodDoorKeeperVersion').value = data.data.andriodDoorKeeperVersion
                document.getElementById('iosUserVersion').value = data.data.iosUserVersion
                document.getElementById('iosVendorVersion').value = data.data.iosVendorVersion
                document.getElementById('iosDoorKeeperVersion').value = data.data.iosDoorKeeperVersion
                document.getElementById('andriodUserUpdate').value = data.data.andriodUserUpdate
                document.getElementById('andriodVendorUpdate').value = data.data.andriodVendorUpdate
                document.getElementById('andriodDoorKeeperUpdate').value = data.data.andriodDoorKeeperUpdate
                document.getElementById('iosUserUpdate').value = data.data.iosUserUpdate
                document.getElementById('iosVendorUpdate').value = data.data.iosVendorUpdate
                document.getElementById('iosDoorKeeperUpdate').value = data.data.iosDoorKeeperUpdate
                document.getElementById('andriodUserAppUrl').value = data.data.andriodUserAppUrl,
                document.getElementById('andriodVendorAppUrl').value = data.data.andriodVendorAppUrl,
                document.getElementById('andriodDoorKeeperAppUrl').value = data.data.andriodDoorKeeperAppUrl,
                document.getElementById('iosUserAppUrl').value = data.data.iosUserAppUrl,
                document.getElementById('iosVendorAppUrl').value = data.data.iosVendorAppUrl,
                document.getElementById('iosDoorKeeperAppUrl').value = data.data.iosDoorKeeperAppUrl
        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        jqXHR.responseJSON.error
    })

}
function press1() {
    console.log('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee appversion')
    // if (document.getElementById('admin_setting-nav').className && document.getElementById('admin_setting-nav').className == 'active') {
    //     document.getElementById('admin_setting-nav').className = 'inactive'
    //     document.getElementById('drop_down').style.display = 'none'
    // } else {
    //     this.setTimeout(() => {
    //         document.getElementById('admin_setting-nav')?.classList.add("active");
    //     }, 1500)
    //     document.getElementById('admin_setting-nav').className = 'active'
    //     document.getElementById('drop_down').style.display = 'block'
    // }
}
