function login() {
    var tz1 = Intl.DateTimeFormat().resolvedOptions().timeZone;
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    $.ajax({
        type: "POST",
        data: { email, password },
        dataType: 'json',
        url: host + '/api/v1/admin/auth/login',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('timezone', tz1)
        }
    }).done(function (data) {
        // If successful  
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("timeZone", tz1);
        localStorage.setItem("role", data.data.role);
        if (data.data.role == "Sub_Admin") {
                var permission = data.data.permission
                if (permission && permission.length != 0) {
                    if (permission[0] == "Dashboard") {
                        window.location.replace('/admin/dashboard')
                    }
                    if (permission[0] == "User Management") {
                        window.location.replace('/admin/user')
                    }
                    if (permission[0] == "Vendor Management") {
                        window.location.replace('/admin/vendor_list')
                    }
                    if (permission[0] == "Category Management") {
                        window.location.replace('/admin/category')
                    }
                    if (permission[0] == "Notification") {
                        window.location.replace('/admin/notification')
                    }
                    if (permission[0] == "Admin Setting") {
                        window.location.replace('/admin/changePassword')
                    }
                    if (permission[0] == "Payment Management") {
                        window.location.replace('/admin/payment')
                    }
                    localStorage.setItem("permission", data.data.permission);
                } else {
                    window.location.replace('/admin/dashboard')
                }
        } else {
            window.location.replace('/admin/dashboard')
        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        // If fail
        alert(jqXHR.responseJSON.error)
    })
}
window.addEventListener("online", function () {
    alert("Connecting Internet Connection!");
});

window.addEventListener("offline", function () {
    alert("Oops!Disconnect Internet Connection!");
});
