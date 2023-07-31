
//*********Listing Table Data**************/
function quriesDetails(sortName) {
    this.setTimeout(() => {
        document.getElementById('queries-nav')?.classList.add("active");
    }, 1500)

    if (sortName && sortName != undefined && sortName != NaN && sortName != "SNo") {
        if (localStorage.getItem('sort') && localStorage.getItem('sort') != '' && localStorage.getItem('sort') != undefined) {
            if (localStorage.getItem('sort') == 1) {
                var sort1 = -1
            } else {
                var sort1 = 1
            }
        } else {
            var sort1 = -1
        }
        localStorage.setItem('sort', sort1)
        var sortName1 = sortName
    } else if (sortName == "SNo") {
        var sort1 = -1
        var sortName1 = ""
    }
    else {
        var sort1 = -1
        var sortName1 = "createdAt"
        localStorage.setItem('sort', sort1)
    }
    var obj = {
        'page': 1,
        'perPage': 10,
        'search': document.getElementById('fog').value,
        'sort': sort1,
        'sortName': sortName1
    }
    $('#ibox1').children('.ibox-content').toggleClass('sk-loading');
    $.ajax({
        // url: `${host}/api/v1/common/report/report_List?search=${obj.search}&page=${obj.page}&perPage=${obj.perPage}&sort1=${obj.sort1}&sort=${obj.sort}`,

        url: `${host}/api/v1/common/report/report_List?page=${obj.page}&perPage=${obj.perPage}&sort=${obj.sort}&sortName=${obj.sortName}&search=${obj.search}`,
        type: 'GET',
        timeout: 15000,
        contentType: 'application/json',
        data: JSON.stringify(obj),
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        dataType: 'json',
        success: function (data, status) {
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
                            'perPage': options.length,
                            'search': document.getElementById('fog').value,
                            'sort': sort1,
                            'sortName': sortName1
                        }
                        $('#ibox1').children('.ibox-content').toggleClass('sk-loading');
                        $.ajax({
                            // url: `${host}/api/v1/admin/coupon/coupon-list?search=${obj.search}&page=${obj.page}&perPage=${obj.perPage}&sort1=${obj.sort1}&sort=${obj.sort}`,
                            url: `${host}/api/v1/common/report/report_List?page=${obj.page}&perPage=${obj.perPage}&sort=${obj.sort}&sortName=${obj.sortName}&search=${obj.search}`,
                            type: 'GET',
                            timeout: 15000,
                            contentType: 'application/json',
                            data: JSON.stringify(obj),
                            beforeSend: function (xhr) {
                                xhr.setRequestHeader('Authorization', token);
                            },
                            dataType: 'json',
                            success: function (data, status) {
                                if (data.code == 200) {
                                    $('#ibox1').children('.ibox-content').toggleClass('sk-loading');
                                    $("#table").html(' ');
                                    for (var i = 0; i < data.data.items.length; i++) {
                                        var index = i + 1 + (obj.perPage * (obj.page - 1));
                                        if (data.data.items[i].role == "Vendor") {
                                            var name = data.data.items[i].vendorDetails[0].ownerName ? data.data.items[i].vendorDetails[0].ownerName : "-----"
                                            if (data.data.items[i].vendor_storeDetails.length == 0) {
                                                var email = "-----"
                                                var phoneNumber = "-----"
                                            } else {
                                                var email = data.data.items[i].vendor_storeDetails[0].email ? data.data.items[i].vendor_storeDetails[0].email : "-----"
                                                var phoneNumber = data.data.items[i].vendor_storeDetails[0].phoneNumber ? data.data.items[i].vendor_storeDetails[0].phoneNumber : "-----"
                                            }
                                            var date = moment(data.data.items[i].vendorDetails[0].createdAt).format('DD/MM/YYYY') ? moment(data.data.items[i].vendorDetails[0].createdAt).format('DD/MM/YYYY') : "-----"
                                        }
                                        if (data.data.items[i].role == "Customer") {
                                            var name = data.data.items[i].userDetails[0].name ? data.data.items[i].userDetails[0].name : "-----"
                                            var email = data.data.items[i].userDetails[0].email[0] ? data.data.items[i].userDetails[0].email[0] : "-----"
                                            var phoneNumber = data.data.items[i].userDetails[0].phoneNumber ? data.data.items[i].userDetails[0].phoneNumber : "-----"
                                            var date = moment(data.data.items[i].userDetails[0].createdAt).format('DD/MM/YYYY') ? moment(data.data.items[i].userDetails[0].createdAt).format('DD/MM/YYYY') : "-----"
                                        }

                                        document.getElementById('table').innerHTML += '<tr >' +
                                            '<td >' + index + '<td>' + name + '<td>' + email + '<td>' + phoneNumber + '<td>' + date +
                                            '<td> <button  type="button" class="btn btn-sm btn-warning-color" id="Action_button" style="margin: 5px; color: white;"  data-toggle="modal" data-target="#myModal5" onclick= "view(' + '\'' + data.data.items[i]._id + '\'' + ')">' + 'view' + '</button>' + '<td>' +
                                            '<button type="button" class="btn btn-sm btn-danger" id="Action_button" style="margin: 5px;" onclick= del(' + '\'' + data.data.items[i]._id + '\'' + ')>' + 'Delete   ' + '</button></tr>'
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
                if (sortName == "SNo" && localStorage.getItem('sno') == "false") {
                    localStorage.setItem('sno', true)
                    for (var i = data.data.items.length - 1; i >= 0; i--) {
                        var index = i + 1
                        if (data.data.items[i].role == "Vendor") {
                            var name = data.data.items[i].vendorDetails[0].ownerName ? data.data.items[i].vendorDetails[0].ownerName : "-----"
                            if (data.data.items[i].vendor_storeDetails.length == 0) {
                                var email = "-----"
                                var phoneNumber = "-----"
                            } else {
                                var email = data.data.items[i].vendor_storeDetails[0].email ? data.data.items[i].vendor_storeDetails[0].email : "-----"
                                var phoneNumber = data.data.items[i].vendor_storeDetails[0].phoneNumber ? data.data.items[i].vendor_storeDetails[0].phoneNumber : "-----"
                            }
                            var date = moment(data.data.items[i].createdAt).format('DD/MM/YYYY') ? moment(data.data.items[i].createdAt).format('DD/MM/YYYY') : "-----"
                        }
                        if (data.data.items[i].role == "Customer") {
                            var name = data.data.items[i].userDetails[0].name ? data.data.items[i].userDetails[0].name : "-----"
                            var email = data.data.items[i].userDetails[0].email[0] ? data.data.items[i].userDetails[0].email[0] : "-----"
                            var phoneNumber = data.data.items[i].userDetails[0].phoneNumber ? data.data.items[i].userDetails[0].phoneNumber : "-----"
                            var date = moment(data.data.items[i].createdAt).format('DD/MM/YYYY') ? moment(data.data.items[i].createdAt).format('DD/MM/YYYY') : "-----"
                        }
                        document.getElementById('table').innerHTML += '<tr >' +
                            '<td >' + index + '<td>' + name + '<td>' + email + '<td>' + phoneNumber + '<td>' + date +
                            '<td> <button  type="button" class="btn btn-sm btn-warning-color" id="Action_button" style="margin: 5px; color: white;"  data-toggle="modal" data-target="#myModal5" onclick= "view(' + '\'' + data.data.items[i]._id + '\'' + ')">' + 'view' + '</button>' + '<td>' +
                            '<button type="button" class="btn btn-sm btn-danger" id="Action_button" style="margin: 5px;" onclick= del(' + '\'' + data.data.items[i]._id + '\'' + ')>' + 'Delete   ' + '</button></tr>'
                    }
                } else {
                    localStorage.setItem('sno', false)
                    for (var i = 0; i < data.data.items.length; i++) {
                        var index = i + 1
                        if (data.data.items[i].role == "Vendor") {
                            var name = data.data.items[i].vendorDetails[0].ownerName ? data.data.items[i].vendorDetails[0].ownerName : "-----"
                            if (data.data.items[i].vendor_storeDetails.length == 0) {
                                var email = "-----"
                                var phoneNumber = "-----"
                            } else {
                                var email = data.data.items[i].vendor_storeDetails[0].email ? data.data.items[i].vendor_storeDetails[0].email : "-----"
                                var phoneNumber = data.data.items[i].vendor_storeDetails[0].phoneNumber ? data.data.items[i].vendor_storeDetails[0].phoneNumber : "-----"
                            }
                            var date = moment(data.data.items[i].createdAt).format('DD/MM/YYYY') ? moment(data.data.items[i].createdAt).format('DD/MM/YYYY') : "-----"
                        }
                        if (data.data.items[i].role == "Customer") {
                            var name = data.data.items[i].userDetails[0].name ? data.data.items[i].userDetails[0].name : "-----"
                            var email = data.data.items[i].userDetails[0].email[0] ? data.data.items[i].userDetails[0].email[0] : "-----"
                            var phoneNumber = data.data.items[i].userDetails[0].phoneNumber ? data.data.items[i].userDetails[0].phoneNumber : "-----"
                            var date = moment(data.data.items[i].createdAt).format('DD/MM/YYYY') ? moment(data.data.items[i].createdAt).format('DD/MM/YYYY') : "-----"
                        }
                        document.getElementById('table').innerHTML += '<tr >' +
                            '<td >' + index + '<td>' + name + '<td>' + email + '<td>' + phoneNumber + '<td>' + date +
                            '<td class="text-center"> <button  type="button" class="btn btn-sm btn-warning-color" id="Action_button" style="margin: 5px; color: white;"  data-toggle="modal" data-target="#myModal5" onclick= "view(' + '\'' + data.data.items[i]._id + '\'' + ')">' + 'view' + '</button>' + '<td class="text-center">' +
                            '<button type="button" class="btn btn-sm btn-danger" id="Action_button" style="margin: 5px;" onclick= del(' + '\'' + data.data.items[i]._id + '\'' + ')>' + 'Delete   ' + '</button></tr>'
                    }
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


function view(Id) {
    var obj = {
        "Id": Id
    }
    $.ajax({
        url: `${host}/api/v1/common/report/get?reportId=${Id}`,
        type: 'Get',
        contentType: 'application/json',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        dataType: 'json',
        success: function (data, status) {
            if (data.code == 200) {
                if (data.data[0].role == "Customer") {
                    document.getElementById('userName').innerHTML = data.data[0].userDetails[0].name ? data.data[0].userDetails[0].name : '----'
                    document.getElementById('email').innerHTML = data.data[0].userDetails[0].email ? data.data[0].userDetails[0].email : '----'
                    document.getElementById('description').innerHTML = data.data[0].description ? data.data[0].description : '----'
                    document.getElementById('Id').innerHTML = data.data[0]._id ? data.data[0]._id : '----'
                }
                if (data.data[0].role == "Vendor") {
                    document.getElementById('userName').innerHTML = data.data[0].vendorDetails[0].ownerName ? data.data[0].vendorDetails[0].ownerName : '----'
                    document.getElementById('email').innerHTML = data.data[0].vendor_storeDetails[0].email ? data.data[0].vendor_storeDetails[0].email : '----'
                    document.getElementById('description').innerHTML = data.data[0].description ? data.data[0].description : '----'
                    document.getElementById('Id').innerHTML = data.data[0]._id ? data.data[0]._id : '----'
                }
                if (data.data[0].image != '') {
                    document.getElementById('blah2').src = data.data[0].image

                }

            } else {
                alert("Something Wrong, Try again")
            }
        }
    });
}

function update_status(Id) {
    var Id = document.getElementById('Id').innerHTML
    $.ajax({
        url: `${host}/api/v1/common/report/update?reportId=${Id}`,
        type: 'Get',
        contentType: 'application/json',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        dataType: 'json',
        success: function (data, status) {
            if (data.code == 200) {
                alert(data.message)
                window.location.reload()
            } else {
                alert("Something Wrong, Try again")
            }
        }
    });
}

// function readURL(input) {
//     if (input.files && input.files[0]) {
//         var reader = new FileReader();
//         reader.onload = function (e) {
//             $('#blah2')
//                 .attr('src', e.target.result)
//                 .width(100)
//                 .height(100);
//         };
//         reader.readAsDataURL(input.files[0]);
//     }
// }
// function readURL1(input) {
//     if (input.files && input.files[0]) {
//         var reader = new FileReader();
//         reader.onload = function (e) {
//             $('#blah3')
//                 .attr('src', e.target.result)
//                 .width(100)
//                 .height(100);
//         };
//         reader.readAsDataURL(input.files[0]);
//     }
// }


// ****************** Delete Report ******************/

function del(Id) {
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
                    type: "get",
                    dataType: 'json',
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader('Authorization', token);
                    },
                    url: `${host}/api/v1/common/report/delete?reportId=${Id}`,
                }).done(function (data) {
                    // If successful
                    if (data.code == 200) {
                        swal.close();
                        quriesDetails();
                    } else {
                        alert('Some thing went Wrong')
                    }
                }).fail(function (jqXHR, textStatus, errorThrown) {
                    // If fail
                    alert(jqXHR.responseJSON.error)

                })
            }
            else {
                swal("Cancelled", "Your file is safe :");
            }
        });
}


