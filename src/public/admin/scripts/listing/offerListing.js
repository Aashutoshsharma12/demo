
//*********Listing Table Data**************/
function offerList(role) {
    this.setTimeout(() => {
        document.getElementById('coupon-nav')?.classList.add("active");
    }, 1500)
    if (role && role != '' && role != undefined && role != 'offerName' && role != "offer_amount" && role != 'startDate' && role != 'expiryDate') {
        var addBy = role
        localStorage.setItem('addBy', role)
        if (role == "Admin") {
            document.getElementById('admin').className = "btn active"
            document.getElementById('vendor').className = "btn"

        } else {
            document.getElementById('vendor').className = "btn active"
            document.getElementById('admin').className = "btn"
        }
    } else if (localStorage.getItem('addBy') && localStorage.getItem('addBy') != '' && localStorage.getItem('addBy') != undefined) {
        var addBy = localStorage.getItem('addBy')
        if (addBy == "Admin") {
            document.getElementById('admin').className = "btn active"
            document.getElementById('vendor').className = "btn"
        } else {
            document.getElementById('vendor').className = "btn active"
            document.getElementById('admin').className = "btn"
        }
    }
    else {
        var addBy = "Admin"
        localStorage.setItem('addBy', "Admin")
        document.getElementById('admin').className = "btn active"
        document.getElementById('vendor').className = "btn"
    }
    if (role && role != '' && role != undefined && role != "Admin" && role != "Vendor") {
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
        var sortName = role
    } else {
        var sortName = ""
        var sort1 = -1
        localStorage.setItem('sort', sort1)
    }

    var obj = {
        'page': 1,
        'perPage': 10,
        'search': document.getElementById('fog').value,
        'sort': sort1,
        'sortName': sortName,
        'addBy': addBy
    }
    $('#ibox1').children('.ibox-content').toggleClass('sk-loading');
    $.ajax({
        url: `${host}/api/v1/admin/offer/list?search=${obj.search}&page=${obj.page}&perPage=${obj.perPage}&sort=${obj.sort}&sortName=${obj.sortName}&addBy=${obj.addBy}`,
        type: 'GET',
        timeout:15000,
        contentType: 'application/json',
        data: JSON.stringify(obj),
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
            xhr.setRequestHeader('timezone', localStorage.getItem('timeZone'));

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
                            'sortName': sortName,
                            'addBy': addBy

                        }
                        $('#ibox1').children('.ibox-content').toggleClass('sk-loading');
                        $.ajax({
                            url: `${host}/api/v1/admin/offer/list?search=${obj.search}&page=${obj.page}&perPage=${obj.perPage}&sort=${obj.sort}&sortName=${obj.sortName}&addBy=${obj.addBy}`,
                            type: 'GET',
                            timeout:15000,
                            contentType: 'application/json',
                            data: JSON.stringify(obj),
                            beforeSend: function (xhr) {
                                xhr.setRequestHeader('Authorization', token);
                                xhr.setRequestHeader('timezone', localStorage.getItem('timeZone'));
                            },
                            dataType: 'json',
                            success: function (data, status) {
                                if (data.code == 200) {
                                    $('#ibox1').children('.ibox-content').toggleClass('sk-loading');
                                    $("#table").html(' ');
                                    for (let i = 0; i < data.data.items.length; i++) {
                                        if (data.data.items[i].offer_type == "Percentage") {
                                            var percentage = data.data.items[i].offer_amount + "%"
                                        } else {
                                            var percentage = '----'
                                        }
                                        if (data.data.items[i].offer_type == "Flat") {
                                            var amount = data.data.items[i].offer_amount
                                        } else {
                                            var amount = '----'
                                        }
                                        if (data.data.items[i].offer_status == "Expired") {
                                            var offer_status = '<td> <div   style="margin: 5px; color: red;">' + 'Expired' + '</div>'
                                        } else if (data.data.items[i].offer_status == "Running") {
                                            var offer_status = '<td> <div  style="margin: 5px; color: blue;">' + 'Running' + '</div>'
                                        } else {
                                            var offer_status = '<td> <div style="margin: 5px; color: green;">' + 'Upcoming' + '</div>'
                                        }
                                        document.getElementById('table').innerHTML += '<tr >' +
                                            '<td >' + index + '<td style="white-space:pre-wrap">' + data.data.items[i].title + '<td>' + data.data.items[i].offer_type + '<td>' + amount + '<td>' + percentage + '<td>' + formatDate(data.data.items[i].startDate) +
                                            '<td>' + formatDate(data.data.items[i].expiryDate) +offer_status+
                                            '<td> <button  type="button" class="btn btn-sm btn-warning" id="Action_button" style="margin: 5px; color: white;"   onclick= "edit(' + '\'' + data.data.items[i]._id + '\'' + ')">' + 'Edit' + '</button>' +
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
                for (var i = 0; i < data.data.items.length; i++) {
                    var index = i + 1
                    if (data.data.items[i].offer_type == "Percentage") {
                        var percentage = data.data.items[i].offer_amount + "%"
                    } else {
                        var percentage = '----'
                    }
                    if (data.data.items[i].offer_type == "Flat") {
                        var amount = data.data.items[i].offer_amount
                    } else {
                        var amount = '----'
                    }
                    if (data.data.items[i].offer_status == "Expired") {
                        var offer_status = '<td> <div   style="margin: 5px; color: red;">' + 'Expired' + '</div>'
                    } else if (data.data.items[i].offer_status == "Running") {
                        var offer_status = '<td> <div  style="margin: 5px; color: blue;">' + 'Running' + '</div>'
                    } else {
                        var offer_status = '<td> <div style="margin: 5px; color: green;">' + 'Upcoming' + '</div>'
                    }
                    document.getElementById('table').innerHTML += '<tr >' +
                        '<td >' + index + '<td style="white-space:pre-wrap">' + data.data.items[i].title + '<td>' + data.data.items[i].offer_type + '<td>' + amount + '<td>' + percentage + '<td>' + formatDate(data.data.items[i].startDate) +
                        '<td>' + formatDate(data.data.items[i].expiryDate) + offer_status +
                        '<td> <button  type="button" class="btn btn-sm btn-green" id="Action_button" style="margin: 5px; background-color:#717DBB;"   onclick= "edit(' + '\'' + data.data.items[i]._id + '\'' + ')">' + 'Edit' + '</button>' +
                        '<button type="button" class="btn btn-sm btn-danger" id="Action_button" style="margin: 5px;" onclick= del(' + '\'' + data.data.items[i]._id + '\'' + ')>' + 'Delete   ' + '</button></tr>'
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



// ******************Coupon Profile ****************** /

function edit(user_id) {
    var id = user_id
    window.location.href = host + "/admin/editOffers?id=" + id
}

// ****************** Delete Function ******************/

function del(offerId) {
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
                    url: `${host}/api/v1/admin/offer/delete/${offerId}`,
                    type: "delete",
                    dataType: 'json',
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader('Authorization', token);
                    },
                }).done(function (data) {
                    // If successful
                    swal.close();
                    offerList();
                }).fail(function (jqXHR, textStatus, errorThrown) {
                    // If fail
                    alert(jqXHR.itemsJSON.error)

                })
            } else {
                swal("Cancelled", "Your file is safe :");
            }
        });
}

// ****************** Date Format ******************/

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
    // const monthNames = ["01", "02", "03", "04", "05", "06",
    //     "07", "08", "09", "10", "11", "12"
    // ];
    const monthNames = ["Jan", "Feb", "March", "April", "May", "June",
        "July", "Aug", "Sept", "Oct", "Nov", "Dec"
    ];
    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;
    var y = monthNames[month - 1]
    return [day, monthNames[month - 1], year].join('-');
}

