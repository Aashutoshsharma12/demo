
function changePassword() {
    var oldpassword = document.getElementById('oldpass').value;
    var newpassword = document.getElementById('password').value;
    var cpassword = document.getElementById('cpassword').value;
    if (newpassword !== cpassword) {
        swal({
            title: "Error",
            text: "Confirm Password should be same as new password"
        });
    
    } else if (!newpassword && !oldpassword) {
        swal({
            title: "Error",
            text: "Please Fill Password"
        });
    } else {
        let obj = {
            "password": oldpassword,
            "newPassword": newpassword
        }
        $.ajax({
            url: host + '/api/v1/admin/auth/changePassword',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(obj),
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', token);
            },
            dataType: 'json',
            success: function (data, status) {

            }
        }).done(function (data) {
            if (data.code == 200) {
                swal({
                    title: "Success",
                    text: "You have changed Password Successfully ! redirecting you to login page...",
                    type: "success"
                });
                localStorage.removeItem("name");
                localStorage.removeItem("token");
                setTimeout(() => {
                    window.location.replace('/login');
                }, 2000)
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            swal({
                title: "Error!",
                text: `${jqXHR.responseJSON.error}`
            });
        })
    }
}

function classActive() {
    this.setTimeout(() => {
        document.getElementById('admin_setting-nav')?.classList.add("active");
    }, 1500)
    this.setTimeout(() => {
        document.getElementById('setting-nav')?.classList.add("active");
    }, 1500)
}
//**********Button Disable Untill Confirm Password not filled*************** */
function success() {
    if (document.getElementById("cpassword").value === "") {
        document.getElementById('button').disabled = true;
    } else {
        document.getElementById('button').disabled = false;
    }
}

// add admin taxes
function addTax() {
    $.ajax({
        url: host + '/api/v1/admin/tax/add',
        type: 'POST',
        data: { 'tax': document.getElementById('tax').value },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        dataType: 'json'
    }).done(function (data) {
        if (data.code == 201) {
            swal({
                title: "Success",
                text: "Taxes charges Successfully update",
                type: "success"
            });
        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        alert(jqXHR.responseJSON.error)
    })

}
//  taxes details
function getTax() {
    $.ajax({
        url: host + '/api/v1/admin/tax/get',
        type: 'get',
        contentType: 'application/json',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        dataType: 'json'
    }).done(function (data) {
        if (data.code == 200) {
            document.getElementById('tax').value = data.data.tax
        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        jqXHR.responseJSON.error
    })

}

function press1() {
    // console.log('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee2222 change password')
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