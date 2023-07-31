
//*********Listing Table Data**************/

function orderDetails(status) {
    this.setTimeout(() => {
        document.getElementById('order-nav')?.classList.add("active");
    }, 1500)
    if (status && status != '' && status != undefined && status != 'orderId' && status != "amount") {
        if (status == 'Completed') {
            document.getElementById('rescheduled').className = 'btn header_btn mr-5'
            document.getElementById('all').className = 'btn header_btn mr-5'
            document.getElementById('pending').className = 'btn header_btn mr-5'
            document.getElementById('completed').className = 'btn header_btn active mr-5',
            document.getElementById('rejected').className = 'btn header_btn mr-5'
            var status3 = status
        } else if (status == 'Pending') {
            document.getElementById('rescheduled').className = 'btn header_btn mr-5'
            document.getElementById('all').className = 'btn header_btn mr-5'
            document.getElementById('completed').className = 'btn header_btn mr-5'
            document.getElementById('pending').className = 'btn header_btn active mr-5',
            document.getElementById('rejected').className = 'btn header_btn mr-5'
            var status3 = status
        } else if (status == 'Rescheduled') {
            document.getElementById('rescheduled').className = 'btn header_btn active mr-5'
            document.getElementById('completed').className = 'btn header_btn mr-5'
            document.getElementById('pending').className = 'btn header_btn  mr-5'
            document.getElementById('all').className = 'btn header_btn  mr-5',
            document.getElementById('rejected').className = 'btn header_btn mr-5'
            var status3 = status
        }
        else if (status == 'Rejected') {
            document.getElementById('rejected').className = 'btn header_btn active mr-5'
            document.getElementById('rescheduled').className = 'btn header_btn mr-5'
            document.getElementById('completed').className = 'btn header_btn mr-5'
            document.getElementById('pending').className = 'btn header_btn  mr-5'
            document.getElementById('all').className = 'btn header_btn  mr-5'
            var status3 = status
        }
        else {
            document.getElementById('all').className = 'btn header_btn active mr-5'
            document.getElementById('completed').className = 'btn header_btn mr-5'
            document.getElementById('pending').className = 'btn header_btn mr-5'
            document.getElementById('rescheduled').className = 'btn header_btn mr-5'
            document.getElementById('rejected').className = 'btn header_btn mr-5'
            var status3 = ''
        }
        localStorage.setItem("status3", status3)
    } else if (localStorage.getItem('status3') && localStorage.getItem('status3') != '' && localStorage.getItem('status3') != undefined) {
        var status3 = localStorage.getItem('status3')
        if (status3 == 'Completed') {
            document.getElementById('rescheduled').className = 'btn header_btn mr-5'
            document.getElementById('all').className = 'btn header_btn mr-5'
            document.getElementById('pending').className = 'btn header_btn mr-5'
            document.getElementById('completed').className = 'btn header_btn active mr-5'
            document.getElementById('rejected').className = 'btn header_btn mr-5'

        } else if (status3 == 'Pending') {
            document.getElementById('rescheduled').className = 'btn header_btn mr-5'
            document.getElementById('all').className = 'btn header_btn mr-5'
            document.getElementById('completed').className = 'btn header_btn mr-5'
            document.getElementById('pending').className = 'btn header_btn active mr-5'
            document.getElementById('rejected').className = 'btn header_btn mr-5'

        } else if (status3 == 'Rejected') {
            document.getElementById('rescheduled').className = 'btn header_btn mr-5'
            document.getElementById('all').className = 'btn header_btn mr-5'
            document.getElementById('completed').className = 'btn header_btn mr-5'
            document.getElementById('pending').className = 'btn header_btn mr-5'
            document.getElementById('rejected').className = 'btn header_btn active mr-5'
        }else {
            document.getElementById('rescheduled').className = 'btn header_btn active mr-5'
            document.getElementById('all').className = 'btn header_btn mr-5'
            document.getElementById('completed').className = 'btn header_btn mr-5'
            document.getElementById('pending').className = 'btn header_btn mr-5'
            document.getElementById('rejected').className = 'btn header_btn mr-5'

        }
    } else {
        localStorage.removeItem('status3')
        document.getElementById('rejected').className = 'btn header_btn mr-5'
        document.getElementById('rescheduled').className = 'btn header_btn mr-5'
        document.getElementById('pending').className = 'btn header_btn mr-5'
        document.getElementById('completed').className = 'btn header_btn mr-5'
        document.getElementById('all').className = 'btn header_btn active mr-5'
        var status3 = ''
    }
    if (status && status != '' && status != undefined) {
        if (status == "amount" || status == "orderId") {
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
        }else{
            var sort1 = -1
            localStorage.setItem('sort', sort1)
            var sortName = '' 
        }
    }else{
        var sort1 = -1
        localStorage.setItem('sort', sort1)
        var sortName = '' 
    }
    var obj = {
        'page': 1,
        'perPage': 10,
        'search': document.getElementById('fog').value,
        'status': status3,
        'sort': sort1,
        'sortName': sortName
    }
    $('#ibox1').children('.ibox-content').toggleClass('sk-loading');
    $.ajax({
        url: `${host}/api/v1/admin/order/list?search=${obj.search}&page=${obj.page}&perPage=${obj.perPage}&status=${obj.status}&sort=${obj.sort}&sortName=${obj.sortName}`,
        type: 'GET',
        timeout:15000,
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
                            'status': status3,
                            'sort': sort1,
                            'sortName': sortName

                        }
                        $('#ibox1').children('.ibox-content').toggleClass('sk-loading');
                        $.ajax({
                            url: `${host}/api/v1/admin/order/list?search=${obj.search}&page=${obj.page}&perPage=${obj.perPage}&status=${obj.status}&sort=${obj.sort}&sortName=${obj.sortName}`,
                            type: 'GET',
                            timeout:15000,
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

                                    if(data.data.list[i].status == "Pending"){
                                        var status = "In Progress"
                                    }else{
                                        var status = data.data.list[i].status
                                    }
                                    document.getElementById('table').innerHTML += '<tr >' +
                                        '<td >' + data.data.list[i].orderId + '<td>' + data.data.list[i].storeId.branchName + '<td>' + data.data.list[i].userId.name + '<td>' + data.data.list[i].userId.phoneNumber + '<td>' + data.data.list[i].order_dateTime + '<td>' + parseFloat(data.data.list[i].totalAmount).toFixed(2) +
                                        '<td>' + (data.data.list[i].device_modelName ? data.data.list[i].device_modelName :'----') + '<td>' + status +
                                        '<td> <button  type="button" class="btn btn-sm btn-warning" id="Action_button" style="margin: 5px; color: white; background-color: blue; border: blue;"   onclick= "view(' + '\'' + data.data.list[i]._id + '\'' + ')">' + 'View' + '</button>'
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
                    if(data.data.list[i].status == "Pending"){
                        var status = "In Progress"
                    }else{
                        var status = data.data.list[i].status
                    }
                    document.getElementById('table').innerHTML += '<tr >' +
                        '<td >' + data.data.list[i].orderId + '<td>' + (data.data.list[i].storeId.branchName ? data.data.list[i].storeId.branchName : '----') + '<td>' + data.data.list[i].userId.name + '<td>' + data.data.list[i].userId.phoneNumber + '<td>' + moment(data.data.list[i].order_dateTime).format('DD/MM/YYYY, HH:mm') + '<td>' + parseFloat(data.data.list[i].totalAmount).toFixed(2)+
                        '<td>' +(data.data.list[i].device_modelName ? data.data.list[i].device_modelName :'----')+'<td>' + status +
                        '<td> <button  type="button" class="btn btn-sm btn-warning" id="Action_button" style="margin: 5px; color: white; background-color: blue; border: blue;"   onclick= "view(' + '\'' + data.data.list[i]._id + '\'' + ')">' + 'View' + '</button>'
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

function view(Id) {
    window.location.href = host + "/admin/viewOrderManagement?id=" + Id
}



