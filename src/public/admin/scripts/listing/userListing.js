
//*********Listing Table Data**************/

function userDetails(sort) {
    this.setTimeout(() => {
        document.getElementById('user-nav')?.classList.add("active");
    }, 1500)
    if (sort && sort != '' && sort != undefined) {
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
        var sortName = sort
    } else {
        var sortName = ""
        var sort1 = -1
        localStorage.setItem('sort',sort1)
    }
    var obj = {
        'page': 1,
        'pageSize': 10,
        'search': document.getElementById('fog').value,
        'isActive': document.getElementById('sel1').value,
        'sort1': sort1,
        'sort': sortName
    }

    $('#ibox1').children('.ibox-content').toggleClass('sk-loading');
    $.ajax({
        url: `${host}/api/v1/admin/user/list?search=${obj.search}&page=${obj.page}&pageSize=${obj.pageSize}&isActive=${obj.isActive}&sort1=${obj.sort1}&sort=${obj.sort}`,
        type: 'GET',
        timeout:15000,
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
            if (data.data.Total == 0 && data.code == 200) {
                $("#noData").addClass("show");
            }

            if (data.code == 200 && data.data.Total > 0) {
                $("#table2").removeClass("hide")
                $("#noData").removeClass("show")
                $("#page1").removeClass("hide")

                var x = data.data.Total
                $('#example-1').pagination({
                    total: x,
                    current: 1,
                    length: 10,
                    prev: 'Previous',
                    next: 'Next',
                    click: function (options, $target) {
                        let obj = {
                            'page': options.current,
                            'pageSize': options.length,
                            'search': document.getElementById('fog').value,
                            'isActive': document.getElementById('sel1').value,
                            'sort1': sort1,
                            'sort': sortName
                        }

                        $('#ibox1').children('.ibox-content').toggleClass('sk-loading');
                        $.ajax({
                            url: `${host}/api/v1/admin/user/list?search=${obj.search}&page=${obj.page}&pageSize=${obj.pageSize}&isActive=${obj.isActive}&sort1=${obj.sort1}&sort=${obj.sort}`,
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
                                    for (var i = 0; i < data.data.response.length; i++) {

                                        if (data.data.response[i].isActive == true) {
                                            var x = 'Deactive'
                                            var y = 'Active'
                                        } else {
                                            var x = 'Active'
                                            var y = 'Deactive'
                                        }


                                        var index = i + 1 + (obj.pageSize * (obj.page - 1));

                                        if (data.data.response[i].name && data.data.response[i].name != '') {
                                            var name = data.data.response[i].name
                                        } else {
                                            var name = "---"
                                        }
                                        if (data.data.response[i].email && data.data.response[i].email.length > 0) {
                                            var email = data.data.response[i].email[0]
                                        } else {
                                            var email = "---"
                                        }
                                        var Id = data.data.response[i].customerRCId ? data.data.response[i].customerRCId : '---'
                                        document.getElementById('table').innerHTML += '<tr >' +
                                            '<td >' + Id + '<td>' + name + '<td>' + moment(data.data.response[i].createdAt).format('DD/MM/YYYY,HH:mm') + '<td>' + email + '<td>' + data.data.response[i].phoneNumber +
                                            '<td><span class="label label-primary labelStatus">' + y +
                                            '<td> <button type="button" class="btn btn-sm btn-success" id="Action_button" style="margin: 5px;"  data-target="' + data.data.response[i].isActive + '" onclick= "update(' + '\'' + data.data.response[i]._id + '\'' + ')">' + x + '</button>' +
                                            '<button type="button" class="btn btn-sm btn-warning text-white" style="margin: 5px;"  onclick= profile(' + '\'' + data.data.response[i]._id + '\'' + ')>' + 'View' + '</button>' +
                                            '<button type="button" class="btn btn-sm btn-danger text-white" id="Action_button" style="margin: 5px;" onclick= del(' + '\'' + data.data.response[i]._id + '\'' + ')>' + 'Delete   ' + '</button></tr>'
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
                for (var i = 0; i < data.data.response.length; i++) {
                    if (data.data.response[i].isActive == true) {
                        var x = 'Deactive'
                        var y = 'Active'
                    } else {
                        var x = 'Active'
                        var y = 'Deactive'
                    }
                    var index = i + 1
                    if (data.data.response[i].name && data.data.response[i].name != '') {
                        var name = data.data.response[i].name
                    } else {
                        var name = "---"
                    }
                    if (data.data.response[i].email && data.data.response[i].email.length > 0) {
                        var email = data.data.response[i].email[0]
                    } else {
                        var email = "---"
                    }
                    var Id = data.data.response[i].customerRCId ? data.data.response[i].customerRCId : '---'
                    document.getElementById('table').innerHTML += '<tr >' +
                        '<td >' + Id + '<td>' + name + '<td>' + moment(data.data.response[i].createdAt).format('DD/MM/YYYY HH:mm') + '<td>' + email + '<td>' + data.data.response[i].phoneNumber +
                        '<td><span class="label label-primary labelStatus">' + y +
                        '<td> <button type="button" class="btn btn-sm btn-success" id="Action_button" style="margin: 5px;"  data-target="' + data.data.response[i].isActive + '" onclick= "update(' + '\'' + data.data.response[i]._id + '\'' + ')">' + x + '</button>' +
                        '<button type="button" class="btn btn-sm btn-warning" style="margin: 5px;"  onclick= profile(' + '\'' + data.data.response[i]._id + '\'' + ')>' + 'View' + '</button>' +
                        '<button type="button" class="btn btn-sm btn-danger" id="Action_button" style="margin: 5px;" onclick= del(' + '\'' + data.data.response[i]._id + '\'' + ')>' + 'Delete   ' + '</button></tr>'
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

// ****************** Satus Update ******************/

function update(user_id) {
    var userId = (user_id)
    $(document).on('click', "#Action_button", function () {
        var a = ($(this).text());
        if (a === 'Active') {
            var status = true
        } else {
            var status = false
        }
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
                        url: `${host}/api/v1/admin/user/status/${userId}`,
                        type: "PUT",
                        data: { status, userId },
                        dataType: 'json',
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader('Authorization', token);
                        },
                    }).done(function (data) {
                        // If successful
                        swal.close();
                        userDetails();
                    }).fail(function (jqXHR, textStatus, errorThrown) {
                        // If fail
                        alert(jqXHR.responseJSON.error)
                    })
                } else {
                    swal("Cancelled", "Your file is safe :");
                }
            });
    })
}

// ******************User Profile ******************/
function profile(user_id) {
    var id = user_id
    window.location.href = host + "/admin/userView?id=" + id
}

// ****************** Delete Function ******************/

function del(user_id) {
    var userId = (user_id)
    $(document).on('click', '#Action_button', function () {
        var a = $(this).attr('data-target');
        if (a == 'true') {
            var isDelete = false
        } else {
            var isDelete = true
        }
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
                        type: "post",
                        data: { isDelete, userId },
                        dataType: 'json',
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader('Authorization', token);
                        },
                        url: `${host}/api/v1/admin/user/user-delete`,
                    }).done(function (data) {
                        // If successful
                        swal.close();
                        userDetails();
                    }).fail(function (jqXHR, textStatus, errorThrown) {
                        // If fail
                        alert(jqXHR.responseJSON.error)

                    })
                } else {
                    swal("Cancelled", "Your file is safe :");
                }

            });
    });

}

// ****************** Export Excel File of user Data Function ******************/

function convertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';
    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '') line += ','
            line += array[i][index];
        }
        str += line + '\r\n';
    }
    return str;
}

function exportCSVFile(headers, items, fileTitle) {
    if (headers) {
        items.unshift(headers);
    }
    // Convert Object to JSON
    var jsonObject = JSON.stringify(items);
    var csv = this.convertToCSV(jsonObject);
    var exportedFilenmae = fileTitle + '.csv' || 'export.csv';
    var blob = new Blob([csv], {
        type: 'text/csv;charset=utf-8;'
    });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, exportedFilenmae);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", exportedFilenmae);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}

function download() {
    $.get(host + '/api/v1/admin/user/user-excelData', {
    }, function (data, status) {
        if (data) {
            var headers = {
                customerId: "CustomerId",
                name: "Full Name",
                email: "Email",
                countryCode: "Country Code",
                phoneNumber: 'Mobile Number',
            };
            itemsNotFormatted = data.data;
            var fileTitle = 'users';
            exportCSVFile(headers, itemsNotFormatted, fileTitle);
        }
    })
}