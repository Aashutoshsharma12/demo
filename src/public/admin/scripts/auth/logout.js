function logout() {
    swal({
        title: "Are you want to logout?",
        text: "Ready to Action!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, Take Action!",
        cancelButtonText: "No, leave pls!",
        closeOnConfirm: false,
        closeOnCancel: true
    },
        function (isConfirm) {
            if (isConfirm) {
                localStorage.removeItem("name");
                localStorage.removeItem("token");
                // unSubscribeFromTopic("admin_web_app_development")
                setTimeout(() => {
                    window.location.replace('/admin/login');
                }, 1000)
                $.ajax({
                    type: "Get",
                    dataType: 'json',
                    url: host + '/api/v1/admin/auth/logout',
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader('Authorization', token);
                    },
                }).done(function (data) {
                    if (data.code == 200) {
                        // If successful      
                        localStorage.removeItem("token");
                        localStorage.removeItem("role");
                        localStorage.removeItem("addBy");
                        localStorage.removeItem("permission");
                        localStorage.removeItem("Id");
                        localStorage.removeItem("timeZone");
                        localStorage.removeItem('status2')
                        window.location.replace('/admin')
                    } else {
                        alert('Some thing went wrong')
                    }
                }).fail(function (jqXHR, textStatus, errorThrown) {
                    // If fail
                    alert(jqXHR.responseJSON.error)
                });
            }
            else {
                swal("Cancelled", "Your file is safe :");
            }
        });
}