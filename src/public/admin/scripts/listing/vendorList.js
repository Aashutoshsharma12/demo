function vendorList(status) {
    this.setTimeout(() => {
        document.getElementById('vendor-nav')?.classList.add("active");
    }, 1500)
    document.getElementById('isActive').style.display = "block"

    if (status && status != '' && status != undefined) {
        if (status == 'Approved') {
            document.getElementById('all').className = 'btn header_btn mr-5'
            document.getElementById('pending').className = 'btn header_btn mr-5'
            document.getElementById('approved').className = 'btn header_btn active mr-5'
            var status2 = status
        } else if (status == 'Pending') {
            document.getElementById('isActive').style.display = "none"
            document.getElementById('all').className = 'btn header_btn mr-5'
            document.getElementById('approved').className = 'btn header_btn mr-5'
            document.getElementById('pending').className = 'btn header_btn active mr-5'
            var status2 = status
        } else {
            document.getElementById('all').className = 'btn header_btn active mr-5'
            document.getElementById('approved').className = 'btn header_btn mr-5'
            document.getElementById('pending').className = 'btn header_btn mr-5'
            var status2 = ''
        }
        localStorage.setItem("status2", status2)
    } else if (localStorage.getItem('status2') && localStorage.getItem('status2') != '' && localStorage.getItem('status2') != undefined) {
        var status2 = localStorage.getItem('status2')
        if (status2 == 'Approved') {
            document.getElementById('all').className = 'btn header_btn mr-5'
            document.getElementById('pending').className = 'btn header_btn mr-5'
            document.getElementById('approved').className = 'btn header_btn active mr-5'
        } else {
            document.getElementById('isActive').style.display = "none"
            document.getElementById('all').className = 'btn header_btn mr-5'
            document.getElementById('approved').className = 'btn header_btn mr-5'
            document.getElementById('pending').className = 'btn header_btn active mr-5'
        }
    } else {
        localStorage.removeItem('status2')
        document.getElementById('pending').className = 'btn header_btn mr-5'
        document.getElementById('approved').className = 'btn header_btn mr-5'
        document.getElementById('all').className = 'btn header_btn active mr-5'
        var status2 = ''
    }
    if (localStorage.getItem('sort') && localStorage.getItem('sort') != '' && localStorage.getItem('sort') != undefined) {
        if (localStorage.getItem('sort') == 1) {
            var sort1 = -1
        } else {
            var sort1 = 1
        }
        localStorage.setItem('sort', sort1)
    } else {
        var sort1 = -1
        localStorage.setItem('sort', sort1)
    }

    let obj = {
        'page': 1,
        'perPage': 10,
        'search': document.getElementById('fog').value,
        'status': status2,
        'isActive': document.getElementById('isActive').value,
        'sort': sort1
    }
    if (document.getElementById('storeTypeId').value && document.getElementById('storeTypeId').value != '' && document.getElementById('storeTypeId').value != null && document.getElementById('storeTypeId').value != undefined) {
        obj = {
            ...obj,
            'storeTypeId': document.getElementById('storeTypeId').value
        }
    } else {
        obj = {
            ...obj,
            'storeTypeId': ''
        }
    }

    $('#ibox1').children('.ibox-content').toggleClass('sk-loading');
    $.ajax({
        url: `${host}/api/v1/admin/vendor/list?page=${obj.page}&perPage=${obj.perPage}&search=${obj.search}&status=${obj.status}&isActive=${obj.isActive}&sort=${obj.sort}&storeTypeId=${obj.storeTypeId}`,
        type: 'GET',
        timeout: 15000,
        contentType: 'application/json',
        data: JSON.stringify(obj),
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        dataType: 'json',
        success: function (data, status) {
            //  auth(data.code)
            if (data.code == 200) {
                $('#ibox1').children('.ibox-content').toggleClass('sk-loading');
                $("#page1").show();
            }
            if (data.data.totalCount == 0 && data.code == 200) {
                $("#noData").addClass("show");
            }
            if (data.code == 200 && data.data.totalCount > 0) {
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
                            'status': status2,
                            'isActive': document.getElementById('isActive').value,
                            'sort': sort1
                        }
                        if (document.getElementById('storeTypeId').value && document.getElementById('storeTypeId').value != '' && document.getElementById('storeTypeId').value != null && document.getElementById('storeTypeId').value != undefined) {
                            obj = {
                                ...obj,
                                'storeTypeId': document.getElementById('storeTypeId').value
                            }
                        } else {
                            obj = {
                                ...obj,
                                'storeTypeId': ''
                            }
                        }
                        $('#ibox1').children('.ibox-content').toggleClass('sk-loading');
                        $.ajax({
                            url: `${host}/api/v1/admin/vendor/list?page=${obj.page}&perPage=${obj.perPage}&search=${obj.search}&status=${obj.status}&isActive=${obj.isActive}&sort=${obj.sort}&storeTypeId=${obj.storeTypeId}`,
                            type: 'GET',
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
                                    for (var i = 0; i < data.data.list.length; i++) {
                                        if (data.data.list[i].userId.status == "Pending" || data.data.list[i].userId.status == "Rejected") {
                                            var status = "Accept"
                                            var status1 = "Reject"
                                        } else {
                                            var status = "Active"
                                            var status1 = "Inactive"
                                        }
                                        if (data.data.list[i].userId.status == 'Approved') {
                                            if (data.data.list[i].userId.isActive == true) {
                                                var x11 = '<td><span class="label label-primary labelStatus" style="background-color:orange">'
                                                var x1 = 'Active'
                                            } else {
                                                var x1 = 'Deactive'
                                                var x11 = '<td><span class="label label-primary labelStatus" style="background-color:green">'
                                            }
                                        } else {
                                            if (data.data.list[i].userId.status == 'Pending') {
                                                var x1 = data.data.list[i].userId.status
                                                var x11 = '<td><span class="label label-primary labelStatus" style="background-color:gray">'
                                            } else {
                                                var x1 = data.data.list[i].userId.status
                                                var x11 = '<td><span class="label label-primary labelStatus" style="background-color:violet">'
                                            }
                                        }
                                        document.getElementById('table').innerHTML += '<tr >' +
                                            '<td >' + data.data.list[i].branchId + '<td>' + (data.data.list[i].main_branchName) + '<td>' + data.data.list[i].storeTypeId.storeType +
                                            '<td>' + (data.data.list[i].userId.ownerName) + '<td>' + (data.data.list[i].userId.phoneNumber) +
                                            '<td> <button type="button" class="btn btn-sm btn-info" id="Action_button" style="margin: 5px;"   onclick= "view(' + '\'' + data.data.list[i]._id + '\'' + ')">' + 'View' + '</button>' +
                                            '<td> <button  type="button" class="btn btn-sm btn-warning" id="Action_button" style="margin: 5px;"   onclick= "edit(' + '\'' + data.data.list[i].userId._id + '\'' + ')">' + 'Edit' + '</button>' +
                                            // '<td><span class="label label-primary labelStatus">' + x1 +
                                            x11 + x1 +
                                            '<td> <button type="button" class="btn btn-sm  btn-light text-white" style="margin: 5px; background-color:#000AFF;"  data-toggle="modal" data-target="#myModal2"    onclick= updateStatus(' + '\'' + data.data.list[i].userId._id + '\'' + "," + '\'' + status11 + '\'' + ')>' + status + '</button>' +
                                            '<button type="button" class="btn btn-sm btn-danger" style="margin: 5px;"  data-toggle="modal" data-target="#myModal2"    onclick= updateStatus(' + '\'' + data.data.list[i].userId._id + '\'' + "," + '\'' + status12 + '\'' + ')>' + status1 + '</button></tr>'
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
                for (var i = 0; i < data.data.list.length; i++) {
                    if (data.data.list[i].userId.status == "Pending" || data.data.list[i].userId.status == "Rejected") {
                        var status = "Accept"
                        var status1 = "Reject"
                        var status11 = "Approved"
                        var status12 = "Rejected"
                    } else {
                        var status = "Active"
                        var status1 = "Inactive"
                        var status11 = true
                        var status12 = false

                    }
                    if (data.data.list[i].userId.status == 'Approved') {
                        if (data.data.list[i].userId.isActive == true) {
                            var x11 = '<td><span class="label label-primary labelStatus" style="background-color:orange">'
                            var x1 = 'Active'
                        } else {
                            var x1 = 'Deactive'
                            var x11 = '<td><span class="label label-primary labelStatus" style="background-color:green">'
                        }
                    } else {
                        if (data.data.list[i].userId.status == 'Pending') {
                            var x1 = data.data.list[i].userId.status
                            var x11 = '<td><span class="label label-primary labelStatus" style="background-color:gray">'
                        } else {
                            var x1 = data.data.list[i].userId.status
                            var x11 = '<td><span class="label label-primary labelStatus" style="background-color:violet">'
                        }
                    }
                    document.getElementById('table').innerHTML += '<tr >' +
                        '<td >' + data.data.list[i].branchId + '<td>' + (data.data.list[i].main_branchName) + '<td>' + data.data.list[i].storeTypeId.storeType +
                        '<td>' + (data.data.list[i].userId.ownerName) + '<td>' + (data.data.list[i].userId.phoneNumber) +
                        '<td> <button type="button" class="btn btn-sm btn-info" id="Action_button" onclick= "view(' + '\'' + data.data.list[i]._id + '\'' + ')">' + 'View' + '</button>' +
                        '<td> <button  type="button" class="btn btn-sm btn-warning text-white" id="Action_button" onclick= "edit(' + '\'' + data.data.list[i].userId._id + '\'' + ')">' + 'Edit' + '</button>' +
                        // '<td><span class="label label-primary labelStatus">' + x1 +
                        x11 + x1 +
                        // '<td> <button  type="button" class="btn btn-sm btn-warning" id="Action_button" style="margin: 5px;">' + x1 + '</button>' +
                        '<td> <button type="button" class="btn btn-sm btn-light text-white" style="margin: 5px; background-color:#000AFF;"  data-toggle="modal" data-target="#myModal2"    onclick= updateStatus(' + '\'' + data.data.list[i].userId._id + '\'' + "," + '\'' + status11 + '\'' + ')>' + status + '</button>' +
                        '<button type="button" class="btn btn-sm btn-danger" style="margin: 5px;"  data-toggle="modal" data-target="#myModal2"    onclick= updateStatus(' + '\'' + data.data.list[i].userId._id + '\'' + "," + '\'' + status12 + '\'' + ')>' + status1 + '</button></tr>'
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

//Active Deative
function updateStatus(vendorId, status) {
    if (status == "true" || status == "false") {
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
                        url: `${host}/api/v1/admin/vendor/updateStatus?vendorId=${vendorId}&status=${status}`,
                        type: 'Put',
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader('Authorization', token);
                            xhr.setRequestHeader('timezone', localStorage.getItem('timeZone'));

                        },
                        dataType: 'json',
                        success: function (data, status) {
                            // auth(data.code)
                            if (data.code == 200) {
                                swal.close();
                                vendorList();
                                // window.location.reload()
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
    } else {
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
                        url: `${host}/api/v1/admin/vendor/update?vendorId=${vendorId}&status=${status}`,
                        type: 'Put',
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader('Authorization', token);
                            xhr.setRequestHeader('timezone', localStorage.getItem('timeZone'));

                        },
                        dataType: 'json',
                        success: function (data, status) {
                            if (data.code == 200) {
                                //if success
                                swal.close();
                                vendorList();
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
}
function addVendor() {
    window.location.replace('/admin/addVendor')
}
function edit(vendorId) {
    window.location.href = host + '/admin/editVendor?id=' + vendorId
}
function view(vendorId) {
    window.location.href = host + '/admin/vendorView?id=' + vendorId
}

