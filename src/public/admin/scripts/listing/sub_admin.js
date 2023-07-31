function sub_AdminList() {
    this.setTimeout(() => {
        document.getElementById('sub_admin-nav')?.classList.add("active");
    }, 1500)
        if (localStorage.getItem('sort') && localStorage.getItem('sort') != '' && localStorage.getItem('sort') != undefined) {
            if (localStorage.getItem('sort') == 1) {
                var sort1 = -1
            } else {
                var sort1 = 1
            }
        }else{
            var sort1 = -1
        }
        localStorage.setItem('sort',sort1)
    
    var obj = {
        'page': 1,
        'perPage': 10,
        'search': document.getElementById('fog').value,
        'status': document.getElementById('status').value,
        'sort': sort1
    }
    $('#ibox1').children('.ibox-content').toggleClass('sk-loading');
    $.ajax({
        url: `${host}/api/v1/admin/sub_Admin/list?page=${obj.page}&perPage=${obj.perPage}&search=${obj.search}&status=${obj.status}&sort=${obj.sort}`,
        type: 'Get',
        timeout:15000,
        contentType: 'application/json',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        dataType: 'json',
        success: function (data, status) {
            if (data.code == 200) {
                $('#ibox1').children('.ibox-content').toggleClass('sk-loading');
                $("#page1").show();
            }
            if (data.data.totalCount == 0 && data.code == 200) {
                $("#noData").addClass("show");
            }
            if (data.code == 200 && data.data.totalCount >0 ) {
                $("#table2").removeClass("hide")
                $("#noData").removeClass("show")
                $("#page1").removeClass("hide")

                var x = data.data.totalCount
                $('#example-1').pagination({
                    total: x,
                    current: 1,
                    length: 10,
                    prev: 'Previous',
                    next: 'Next',
                    click: function (options, $target) {
                        let obj = {
                            'page': options.current,
                            'perPage': options.length,
                            'search': document.getElementById('fog').value,
                            'status': document.getElementById('status').value,
                            'sort': sort1

                        }
                        $('#ibox1').children('.ibox-content').toggleClass('sk-loading');
                        $.ajax({
                            url: `${host}/api/v1/admin/sub_Admin/list?page=${obj.page}&perPage=${obj.perPage}&search=${obj.search}&status=${obj.status}&sort=${obj.sort}`,
                            type: 'Get',
                            timeout:15000,
                            contentType: 'application/json',
                            data: JSON.stringify(obj),
                            beforeSend: function (xhr) {
                                xhr.setRequestHeader('Authorization', token);
                            },
                            dataType: 'json',
                            success: function (data, status) {
                                // auth(data.code)
                                if (data.code == 200) {
                                    $('#ibox1').children('.ibox-content').toggleClass('sk-loading');
                                    $("#table").html(' ');
                                    for (var i = 0; i < data.data.items.length; i++) {
                                        if (data.data.items[i].isActive == true) {
                                            var x = 'Deactive'
                                            var y = 'Active'
                                        } else {
                                            var x = 'Active'
                                            var y = 'Deactive'
                                        }
                                        if (data.data.items[i].login_date && data.data.items[i].login_date != '') {
                                            var loginTime = data.data.items[i].login_date + " , " + data.data.items[i].login_time
                                        } else {
                                            var loginTime = "-----"
                                        }
                                        document.getElementById('table').innerHTML += '<tr >' +
                                            '<td >' + "#" + data.data.items[i].ID + '<td>' + (data.data.items[i].name) + '<td>' + loginTime + '<td>' + (data.data.items[i].email) + '<td>' + (data.data.items[i].phoneNumber) +
                                            '<td> <button  type="button" class="btn btn-sm btn-light" id="Action_button" style="margin: 5px; width: 78px; background-color:#000AFF "    onclick= "updateStatus(' + '\'' + data.data.items[i]._id + '\'' + "," + '\'' + y + '\'' + ')">' + y + '</button>' +
                                            '<td> <button  type="button" class="btn btn-sm btn-green" id="Action_button" style="margin: 5px; background-color:#02CD2F;"    onclick= "edit(' + '\'' + data.data.items[i]._id + '\'' + ')">' + 'Edit' + '</button>' +
                                            '<button type="button" class="btn btn-sm btn-light" style="margin: 5px; background-color:#05A7CB;"     onclick= "view(' + '\'' + data.data.items[i]._id + '\'' + ')">' + "View" + '</button>'
                                    }
                                }
                            },
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                                if (textStatus == "timeout") {
                                    alert("Your internet connection is very poor")
                                }
                            }
                        })
                        $target.next(".show").text('Current: ' + options.current);
                    }
                })
                $("#table").html(' ');
                for (var i = 0; i < data.data.items.length; i++) {
                    if (data.data.items[i].isActive == true) {
                        var x = 'Deactive'
                        var y = 'Active'
                    } else {
                        var x = 'Active'
                        var y = 'Deactive'
                    }
                    if (data.data.items[i].login_date && data.data.items[i].login_date != '') {
                        var loginTime = data.data.items[i].login_date + " , " + data.data.items[i].login_time
                    } else {
                        var loginTime = "-----"
                    }
                    document.getElementById('table').innerHTML += '<tr >' +
                        '<td >' + "#" + data.data.items[i].ID + '<td>' + (data.data.items[i].name) + '<td>' + loginTime + '<td>' + (data.data.items[i].email) + '<td>' + (data.data.items[i].phoneNumber) +
                        '<td> <button  type="button" class="btn btn-sm btn-light text-white" id="Action_button" style="margin: 5px; width: 78px; background-color:#000AFF "   onclick= "updateStatus(' + '\'' + data.data.items[i]._id + '\'' + "," + '\'' + y + '\'' + ')">' + y + '</button>' +
                        '<td> <button  type="button" class="btn btn-sm btn-green text-white" id="Action_button" style="margin: 5px; background-color:#02CD2F;"    onclick= "edit(' + '\'' + data.data.items[i]._id + '\'' + ')">' + 'Edit' + '</button>' +
                        '<button type="button" class="btn btn-sm btn-light text-white" style="margin: 5px; background-color:#05A7CB;"     onclick= "view(' + '\'' + data.data.items[i]._id + '\'' + ')">' + "View" + '</button>'
                }
            } else {
                $("#table").html(' ');
                $("#table2").addClass("hide");
                $("#noData").addClass("show");
                $("#page1").hide();

            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            if (textStatus == "timeout") {
                alert("Your internet connection is very poor")
            }
        }

    });
}

// //Active Deative
function updateStatus(Id) {
    swal({
        title: "Are you sure?",
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
                $.ajax({
                    url: `${host}/api/v1/admin/sub_Admin/updateStatus/${Id}`,
                    type: 'get',
                    // contentType: 'application/json',
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader('Authorization', token);
                    },
                    dataType: 'json',
                    success: function (data, status) {
                        // auth(data.code)
                        if (data.code == 200) {
                            swal.close();
                            sub_AdminList();
                        } else {
                            console.log("error")
                            alert("Something Wrong, Try again")
                        }
                    }
                })
            }
            else {
                swal("Cancelled", "Your file is safe :");
            }
        });
}

function view(Id) {
    window.location.href = host + '/admin/viewSub_admin?id=' + Id
}
function edit(Id) {
    window.location.href = host + '/admin/editSub_admin?id=' + Id
}
function Add() {
    window.location.replace('/admin/addSub_admin')
}


//view Sub_Admin
function details() {
    this.setTimeout(() => {
        document.getElementById('sub_admin-nav')?.classList.add("active");
    }, 1500)
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
                    $(".mobile").intlTelInput("setNumber", data.data.countryCode );
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
            document.getElementById('status').value = data.data.isActive
            document.getElementById('password').value = "........."
            document.getElementById('confirmPassword').value = "........."
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


