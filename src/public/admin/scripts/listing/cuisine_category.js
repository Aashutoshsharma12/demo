function cuisine_category() {
    this.setTimeout(() => {
        document.getElementById('category-nav')?.classList.add("active");
    }, 1500)
    var obj = {
        'page': 1,
        'perPage': 10,
        'search': document.getElementById('fog').value,
        'status': document.getElementById('status').value,
        'storeTypeId':document.getElementById('storeTypeId').value
    }
    console.log(obj,"pp")
    $('#ibox1').children('.ibox-content').toggleClass('sk-loading');
    $.ajax({
        url: `${host}/api/v1/admin/cuisineCategory/list?page=${obj.page}&perPage=${obj.perPage}&search=${obj.search}&status=${obj.status}&storeTypeId=${obj.storeTypeId}`,
        type: 'Get',
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
                            'status': document.getElementById('status').value,
                            'storeTypeId':document.getElementById('storeTypeId').value
                        }
                        $('#ibox1').children('.ibox-content').toggleClass('sk-loading');
                        $.ajax({
                            url: `${host}/api/v1/admin/cuisineCategory/list?page=${obj.page}&perPage=${obj.perPage}&search=${obj.search}&status=${obj.status}&storeTypeId=${obj.storeTypeId}`,
                            type: 'Get',
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
                                        var image = data.data.items[i].image ? data.data.items[i].image : "../../admin/assets/img/emptyphoto.png"
                                        document.getElementById('table').innerHTML += '<tr >' +
                                            '<td >' + index + '<td>' + (data.data.items[i].title) + '<td>' + (data.data.items[i].ar_title ? data.data.items[i].ar_title : '---') + '<td>' +(data.data.items[i].storeTypeId.storeType ? data.data.items[i].storeTypeId.storeType : '---') +'<td>'+ `<img src =${image} style = "height:32px; width:40px;">` + '<td>' + moment(data.data.items[i].createdAt).format('DD/MM/YYYY') +
                                            '<td> <button  type="button" class="btn btn-sm btn-light" id="Action_button" style="margin: 5px;background-color:#000AFF"   onclick= "updateStatus(' + '\'' + data.data.items[i]._id + '\'' + "," + '\'' + y + '\'' + ')">' + y + '</button>' +
                                            '<td> <button  type="button" class="btn btn-sm btn-green" id="Action_button" style="margin: 5px; background-color:#717DBB;"  data-toggle="modal" data-target="#myModal2"   onclick= "edit(' + '\'' + data.data.items[i]._id + '\'' + ')">' + 'Edit' + '</button>' +
                                            '<button type="button" class="btn btn-sm btn-light" style="margin: 5px; background-color:#19AA8D;"  data-toggle="modal" data-target="#myModal12"    onclick= "view(' + '\'' + data.data.items[i]._id + '\'' + ')">' + "View" + '</button>' +
                                            '<button type="button" class="btn btn-sm btn-danger" style="margin: 5px;"  onclick= Delete(' + '\'' + data.data.items[i]._id + '\'' + ')>' + "Delete" + '</button></tr>'
                                    }
                                }
                            }
                        })
                        $target.next(".show").text('Current: ' + options.current);
                    }
                })
                $("#table").html(' ');
                for (var i = 0; i < data.data.items.length; i++) {
                    var index = i + 1
                    if (data.data.items[i].isActive == true) {
                        var x = 'Deactive'
                        var y = 'Active'
                    } else {
                        var x = 'Active'
                        var y = 'Deactive'
                    }
                    var image = data.data.items[i].image ? data.data.items[i].image : "../../admin/assets/img/emptyphoto.png"
                    document.getElementById('table').innerHTML += '<tr >' +
                        '<td >' + index + '<td>' + (data.data.items[i].title) + '<td>' + (data.data.items[i].ar_title ? data.data.items[i].ar_title : '---') +'<td>' +(data.data.items[i].storeTypeId.storeType ? data.data.items[i].storeTypeId.storeType : '---') + '<td>' + `<img src =${image} style = "height:32px; width:40px;">` + '<td>' + moment(data.data.items[i].createdAt).format('DD/MM/YYYY') +
                        '<td> <button  type="button" class="btn btn-sm btn-light" id="Action_button" style="margin: 5px;background-color:#000AFF"   onclick= "updateStatus(' + '\'' + data.data.items[i]._id + '\'' + "," + '\'' + y + '\'' + ')">' + y + '</button>' +
                        '<td> <button  type="button" class="btn btn-sm btn-green" id="Action_button" style="margin: 5px; background-color:#717DBB;"  data-toggle="modal" data-target="#myModal2"   onclick= "edit1(' + '\'' + data.data.items[i]._id + '\'' + ')">' + 'Edit' + '</button>' +
                        '<button type="button" class="btn btn-sm btn-light" style="margin: 5px; background-color:#19AA8D;"  data-toggle="modal" data-toggle="modal" data-target="#myModal12"    onclick= "view(' + '\'' + data.data.items[i]._id + '\'' + ')">' + "View" + '</button>' +
                        '<button type="button" class="btn btn-sm btn-danger" style="margin: 5px;"  onclick= Delete(' + '\'' + data.data.items[i]._id + '\'' + ')>' + "Delete" + '</button></tr>'
                }
            } else {
                $("#table").html(' ');
                $("#table2").addClass("hide");
                $("#noData").addClass("show");
                $("#page1").hide();

            }
        }

    });
}
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#blah')
                .attr('src', e.target.result)
                .width(200)
                .height(200);
        };

        reader.readAsDataURL(input.files[0]);
    }
}
function readURL1(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#blah1')
                .attr('src', e.target.result)
                .width(200)
                .height(200);
        };

        reader.readAsDataURL(input.files[0]);
    }
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
                    url: `${host}/api/v1/admin/cuisineCategory/updateStatus?cuisineId=${Id}&status=${y}`,
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
                            cuisine_category();
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

//Delete category
function Delete(Id) {
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
                    type: "delete",
                    dataType: 'json',
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader('Authorization', token);
                    },
                    url: `${host}/api/v1/admin/cuisineCategory/delete?cuisineId=${Id}`,
                }).done(function (data) {
                    // If successful
                    // alert("Success")
                    swal.close();
                    cuisine_category();
                }).fail(function (jqXHR, textStatus, errorThrown) {
                    // If fail
                    alert(jqXHR.responseJSON.error)
                })
            } else {
                swal("Cancelled", "Your file is safe :");
            }
        });
}

// //get category
function edit1(Id) {
    $.ajax({
        url: `${host}/api/v1/admin/cuisineCategory/get?cuisineId=${Id}`,
        type: 'Get',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
    }).done(function (data) {
        if (data.code == 200) {
            // If successful
            document.getElementById('storeTypeId11').value = data.data.storeTypeId._id
            document.getElementById('storeTypeId22').value = data.data.storeTypeId._id
            document.getElementById('title10').value = data.data.title
            document.getElementById('title12').value = data.data.ar_title ? data.data.ar_title : ''
            document.getElementById('blah1').src = data.data.image ? data.data.image : './../admin/assets/img/emptyphoto.png'
            document.getElementById('cuisineId').value = data.data._id
        } else {
            alert("Some Thing Went Wrong")
        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        // If fail
        alert(jqXHR.responseJSON.error)
    })
}
//view category
function view(Id) {
    $.ajax({
        url: `${host}/api/v1/admin/cuisineCategory/get?cuisineId=${Id}`,
        type: 'Get',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
    }).done(function (data) {
        if (data.code == 200) {
            // If successful
            document.getElementById('storeTypeId10').value = data.data.storeTypeId._id
            document.getElementById('storeTypeId20').value = data.data.storeTypeId._id
            document.getElementById('title11').value = data.data.title
            document.getElementById('title111').value = data.data.ar_title ? data.data.ar_title : ''
            document.getElementById('blah11').src = data.data.image ? data.data.image : './../admin/assets/img/emptyphoto.png'
            // document.getElementById('status').innerHTML = data.data.isActive
        } else {
            alert("Some Thing Went Wrong")
        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        // If fail
        alert(jqXHR.responseJSON.error)
    })
}

//storeType list
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
                var list = data.data
                localStorage.setItem('storeType_list', JSON.stringify(list))
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
                category1();
                category12();
                category13();
            } else {
                document.getElementById('table').innerHTML = ''
            }
        }
    });
}
//category list
function category1() {
    var select = document.getElementById("storeTypeId01");
    var catId = document.getElementById("storeTypeId12").value
    var t = JSON.parse(localStorage.getItem('storeType_list'))
    for (var i = 0; i < t.items.length; i++) {
        var option = document.createElement("option"),
            txt = document.createTextNode(t.items[i].storeType);
        option.appendChild(txt);
        option.setAttribute("value", t.items[i]._id);
        option.selected = t.items[i]._id === catId ? true : false
        select.insertBefore(option, select.lastChild);
    }
}
function category12() {
    var select = document.getElementById("storeTypeId11");
    var catId = document.getElementById("storeTypeId22").value
    var t = JSON.parse(localStorage.getItem('storeType_list'))
    for (var i = 0; i < t.items.length; i++) {
        var option = document.createElement("option"),
            txt = document.createTextNode(t.items[i].storeType);
        option.appendChild(txt);
        option.setAttribute("value", t.items[i]._id);
        option.selected = t.items[i]._id === catId ? true : false
        select.insertBefore(option, select.lastChild);
    }
}
function category13() {
    var select = document.getElementById("storeTypeId10");
    var catId = document.getElementById("storeTypeId20").value
    var t = JSON.parse(localStorage.getItem('storeType_list'))
    for (var i = 0; i < t.items.length; i++) {
        var option = document.createElement("option"),
            txt = document.createTextNode(t.items[i].storeType);
        option.appendChild(txt);
        option.setAttribute("value", t.items[i]._id);
        option.selected = t.items[i]._id === catId ? true : false
        select.insertBefore(option, select.lastChild);
    }
}