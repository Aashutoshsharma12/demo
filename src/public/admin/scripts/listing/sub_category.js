//sub category list
function sub_category(sort) {
    this.setTimeout(() => {
        document.getElementById('category-nav')?.classList.add("active");
    }, 1500)
    if (sort && sort != '' && sort != undefined && sort != "SNo") {
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
        var sorted = sort
    } else if (sort == "SNo") {
        var sort1 = -1
        var sorted = ''
    }
    else {
        var sorted = ''
        var sort1 = -1
        localStorage.setItem('sort', sort1)
    } 
    var obj = {
        'page': 1,
        'perPage': 10,
        'search': document.getElementById('fog').value,
        'storeTypeId': document.getElementById('storeTypeId').value,
        'status': document.getElementById('status').value,
        'sorting': sort1,
        'sort': sorted
    }
    $('#ibox1').children('.ibox-content').toggleClass('sk-loading');
    $.ajax({
        url: `${host}/api/v1/admin/itemCategory/list?page=${obj.page}&perPage=${obj.perPage}&storeTypeId=${obj.storeTypeId}&search=${obj.search}&status=${obj.status}&sort=${obj.sort}&sorting=${obj.sorting}`,
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
            if (data.code == 200 && data.data.totalCount >0) {
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
                            'storeTypeId': document.getElementById('storeTypeId').value,
                            'status': document.getElementById('status').value,
                            'sorting': sort1,
                            'sort': sorted
                        }
                        $('#ibox1').children('.ibox-content').toggleClass('sk-loading');
                        $.ajax({
                            url: `${host}/api/v1/admin/itemCategory/list?page=${obj.page}&perPage=${obj.perPage}&storeTypeId=${obj.storeTypeId}&search=${obj.search}&status=${obj.status}&sort=${obj.sort}&sorting=${obj.sorting}`,
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
                                        var index = i + 1 + (obj.perPage * (obj.page - 1));
                                        if (data.data.items[i].isActive == true) {
                                            var x = 'Deactive'
                                            var y = 'Active'
                                        } else {
                                            var x = 'Active'
                                            var y = 'Deactive'
                                        }
                                        document.getElementById('table').innerHTML += '<tr >' +
                                            '<td >' + index + '<td>' + (data.data.items[i].title) + '<td>' + (data.data.items[i].ar_title ? data.data.items[i].ar_title : '---') + '<td>' + `<img  src=${data.data.items[i].image ? data.data.items[i].image : '../../admin/assets/img/emptyphoto.png'} style = "height:32px; width:40px;">` + '<td>' + moment(data.data.items[i].createdAt).format('DD/MM/YYYY') +
                                            '<td> <button  type="button" class="btn btn-sm btn-light" id="Action_button" style="margin: 5px; background-color:#000AFF;"   onclick= "updateStatus(' + '\'' + data.data.items[i]._id + '\'' + "," + '\'' + y + '\'' + ')">' + y + '</button>' +
                                            '<td> <button  type="button" class="btn btn-sm btn-light" id="Action_button" style="margin: 5px; background-color:#717DBB"   onclick= "edit(' + '\'' + data.data.items[i]._id + '\'' + ')">' + 'Edit' + '</button>' +
                                            '<button type="button" class="btn btn-sm btn-danger" style="margin: 5px;"  data-toggle="modal" data-target="#myModal2"    onclick= deleteSub_category(' + '\'' + data.data.items[i]._id + '\'' + ')>' + "Delete" + '</button></tr>'
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
                if (sort == 'SNo' && localStorage.getItem('Sno.') == 'false') {
                    localStorage.setItem('Sno.', true)
                    for (let i1 = data.data.items.length - 1; i1 >= 0; i1--) {
                        var index = i1 + 1
                        if (data.data.items[i1].isActive == true) {
                            var x = 'Deactive'
                            var y = 'Active'
                        } else {
                            var x = 'Active'
                            var y = 'Deactive'
                        }
                        document.getElementById('table').innerHTML += '<tr >' +
                            '<td >' + index + '<td>' + (data.data.items[i1].title) + '<td>' + (data.data.items[i1].ar_title ? data.data.items[i1].ar_title : '----') + '<td>' + `<img  src=${data.data.items[i1].image ? data.data.items[i1].image : '../../admin/assets/img/emptyphoto.png'} style = "height:32px; width:40px;">` + '<td>' + moment(data.data.items[i1].createdAt).format('DD/MM/YYYY') +
                            '<td> <button  type="button" class="btn btn-sm btn-light" id="Action_button" style="margin: 5px; background-color:#000AFF;"   onclick= "updateStatus(' + '\'' + data.data.items[i1]._id + '\'' + "," + '\'' + y + '\'' + ')">' + y + '</button>' +
                            '<td> <button  type="button" class="btn btn-sm btn-light" id="Action_button" style="margin: 5px; background-color:#717DBB"   onclick= "edit(' + '\'' + data.data.items[i1]._id + '\'' + ')">' + 'Edit' + '</button>' +
                            '<button type="button" class="btn btn-sm btn-danger" style="margin: 5px;"  data-toggle="modal" data-target="#myModal2"    onclick= deleteSub_category(' + '\'' + data.data.items[i1]._id + '\'' + ')>' + "Delete" + '</button></tr>'
                    }
                } else {
                    localStorage.setItem('Sno.', false)
                    for (var i = 0; i < data.data.items.length; i++) {
                        var index = i + 1
                        if (data.data.items[i].isActive == true) {
                            var x = 'Deactive'
                            var y = 'Active'
                        } else {
                            var x = 'Active'
                            var y = 'Deactive'
                        }
                        document.getElementById('table').innerHTML += '<tr >' +
                            '<td >' + index + '<td>' + (data.data.items[i].title) + '<td>' + (data.data.items[i].ar_title ? data.data.items[i].ar_title : '----') + '<td>' + `<img  src=${data.data.items[i].image ? data.data.items[i].image : '../../admin/assets/img/emptyphoto.png'} style = "height:32px; width:40px;">` + '<td>' + moment(data.data.items[i].createdAt).format('DD/MM/YYYY') +
                            '<td> <button  type="button" class="btn btn-sm btn-light" id="Action_button" style="background-color:#000AFF;  color:#FFFFFF;"   onclick= "updateStatus(' + '\'' + data.data.items[i]._id + '\'' + "," + '\'' + y + '\'' + ')">' + y + '</button>' +
                            '<td> <button  type="button" class="btn btn-sm btn-light" id="Action_button" style="margin-right: 10px; background-color:#717DBB; color:#FFFFFF;"   onclick= "edit(' + '\'' + data.data.items[i]._id + '\'' + ')">' + 'Edit' + '</button>' +
                            '<button type="button" class="btn btn-sm btn-danger" data-toggle="modal" data-target="#myModal2"    onclick= deleteSub_category(' + '\'' + data.data.items[i]._id + '\'' + ')>' + "Delete" + '</button></tr>'
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

//category list
function category() {
    $.ajax({
        url: host + '/api/v1/admin/storeType/list',
        type: 'Get',
        contentType: 'application/json',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', localStorage.token);
        },
        dataType: 'json',
        success: function (data, status) {
            if (data.code == 200) {
                var select = document.getElementById("storeTypeId");
                let catId = document.getElementById("storeTypeId1").value
                for (var i = 0; i < data.data.items.length; i++) {
                    var option = document.createElement("option"),
                        txt = document.createTextNode(data.data.items[i].storeType);
                    option.appendChild(txt);
                    option.setAttribute("value", data.data.items[i]._id);
                    option.selected = data.data.items[i]._id === catId ? true : false
                    select.insertBefore(option, select.lastChild);
                }
            } else {
                document.getElementById('table').innerHTML = ''
            }
        }
    });
}

// //Active Deative
function updateStatus(Id, status) {
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
                if (status == "Active") {
                    var y = false
                } else {
                    var y = true
                }
                $.ajax({
                    url: `${host}/api/v1/admin/itemCategory/updateStatus?sub_CategoryId=${Id}&status=${y}`,
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
                            sub_category();
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

// Delete sub_category
function deleteSub_category(Id) {
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
                    url: `${host}/api/v1/admin/itemCategory/delete_subCategory?sub_CategoryId=${Id}`,
                    type: 'get',
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader('Authorization', token);
                    },
                    dataType: 'json',
                    success: function (data, status) {
                        // auth(data.code)
                        if (data.code == 200) {
                            swal.close();
                            sub_category();
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
function edit(Id) {
    localStorage.setItem('Id', Id)
    window.location.replace('/admin/editSub_category')
}
function addSub_category() {
    window.location.replace('/admin/addSub_category')
}