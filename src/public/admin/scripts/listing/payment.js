
//*********Listing Table Data**************/
function paymentDetails(status) {
    this.setTimeout(() => {
        document.getElementById('payment-nav')?.classList.add("active");
    })
    if (status == "amount" || status == "orderId" || status == "date") {
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
        var sortName = status
    } else {
        var sort1 = -1
        localStorage.setItem('sort', sort1)
        var sortName = ''
    }

    var obj = {
        'page': 1,
        'perPage': 10,
        'search': document.getElementById('fog').value,
        'sort': sort1,
        'sortName': sortName
    }
    $('#ibox1').children('.ibox-content').toggleClass('sk-loading');
    $.ajax({
        url: `${host}/api/v1/admin/order/paymentList?search=${obj.search}&page=${obj.page}&perPage=${obj.perPage}&sort=${obj.sort}&sortName=${obj.sortName}`,
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
                console.log(data, "slslsls")
                $('#ibox1').children('.ibox-content').toggleClass('sk-loading');
                $("#page1").show();
            }

            if (data.data.list.totalCount == 0 && data.code == 200) {
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
                            // 'status': document.getElementById('status').value ? document.getElementById('status').value : "Completed",
                            'sort': sort1,
                            'sortName': sortName

                        }
                        $('#ibox1').children('.ibox-content').toggleClass('sk-loading');
                        $.ajax({
                            url: `${host}/api/v1/admin/order/paymentList?search=${obj.search}&page=${obj.page}&perPage=${obj.perPage}&sort=${obj.sort}&sortName=${obj.sortName}`,
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
                                    for (var i = 0; i < data.data.list.length; i++) {

                                        if (data.data.list[i].paymentStatus == "Completed") {
                                            var status = "Received"
                                        } else {
                                            var status = data.data.list[i].paymentStatus
                                        }
                                        document.getElementById('table').innerHTML += '<tr >' +
                                            '<td >' + data.data.list[i].orderId + '<td>' + data.data.list[i].userId.name + '<td>' + moment(data.data.list[i].updatedAt).format('DD MMM YYYY , HH:mm') + '<td>' + data.data.list[i].userId.phoneNumber + '<td>' + parseFloat(data.data.list[i].totalAmount).toFixed(2) +
                                            '<td>' + data.data.list[i].paid + '<td>' + status +
                                            '<td> <div class="col-12 col-sm-6 col-md-6 col-lg-6 oStatus"><button id="download" onclick= "invoice_generate(' + '\'' + data.data.list[i]._id + '\'' + ')"><span class="newtext" id="invoice"> <img src="../../../admin/assets/img/receipt.png"></span></button></div></tr>'
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
                    if (data.data.list[i].paymentStatus == "Completed") {
                        var status = "Received"
                    } else {
                        var status = data.data.list[i].paymentStatus
                    }
                    document.getElementById('table').innerHTML += '<tr >' +
                        '<td >' + data.data.list[i].orderId + '<td>' + data.data.list[i].userId.name + '<td>' + moment(data.data.list[i].updatedAt).format('DD MMM YYYY , HH:mm') + '<td>' + data.data.list[i].userId.phoneNumber + '<td>' + parseFloat(data.data.list[i].totalAmount).toFixed(2) +
                        '<td>' + data.data.list[i].paid + '<td>' + status +
                        '<td> <div class="col-12 col-sm-6 col-md-6 col-lg-6 oStatus"><button id="download" onclick= "invoice_generate(' + '\'' + data.data.list[i]._id + '\'' + ')"><span class="newtext" id="invoice"> <img src="../../../admin/assets/img/receipt.png"></span></button></div></tr>'
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

// const checkAssendingDes = (sort, data) => {
//     if (sort == 1) {
//         return data.sort()
//     } else {
//         return data.reverse()
//     }
// }

// // ******************Coupon Profile ****************** /

// function edit(user_id) {
//     var id = user_id
//     window.location.href = host + "/admin/editCoupon?id=" + id
// }

// // ****************** Delete Function ******************/

// function del(user_id) {
//     var userId = (user_id)
//     $(document).on('click', '#Action_button', function () {
//         var a = $(this).attr('data-target');
//         if (a == 'true') {
//             var isDelete = false
//         } else {
//             var isDelete = true
//         }
//         $.ajax({
//             type: "post",
//             data: { isDelete, userId },
//             dataType: 'json',
//             beforeSend: function (xhr) {
//                 xhr.setRequestHeader('Authorization', token);
//             },
//             url: `${host}/api/v1/admin/coupon/delete-coupon`,
//         }).done(function (data) {
//             // If successful
//             window.location.reload();
//         }).fail(function (jqXHR, textStatus, errorThrown) {
//             // If fail
//             alert(jqXHR.responseJSON.error)

//         })
//     });
// }

// // ****************** Date Format ******************/

// function formatDate(date) {
//     var d = new Date(date),
//         month = '' + (d.getMonth() + 1),
//         day = '' + d.getDate(),
//         year = d.getFullYear();
//     // const monthNames = ["01", "02", "03", "04", "05", "06",
//     //     "07", "08", "09", "10", "11", "12"
//     // ];
//     const monthNames = ["Jan", "Feb", "March", "April", "May", "June",
//         "July", "Aug", "Sept", "Oct", "Nov", "Dec"
//     ];
//     if (month.length < 2)
//         month = '0' + month;
//     if (day.length < 2)
//         day = '0' + day;
//     var y = monthNames[month - 1]
//     return [day, monthNames[month - 1], year].join('-');
// }

