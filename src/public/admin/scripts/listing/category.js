function category() {
        this.setTimeout(() => {
            document.getElementById('category-nav')?.classList.add("active");
        }, 1500)
        var obj = {
            'page': 1,
            'perPage': 10,
            'search': document.getElementById('fog').value,
            'status': document.getElementById('status').value
        }
        $('#ibox1').children('.ibox-content').toggleClass('sk-loading');
        $.ajax({
            url: `${host}/api/v1/admin/storeType/list?page=${obj.page}&perPage=${obj.perPage}&search=${obj.search}&status=${obj.status}`,
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
                                'status': document.getElementById('status').value
                            }
                            $('#ibox1').children('.ibox-content').toggleClass('sk-loading');
                            $.ajax({
                                url: `${host}/api/v1/admin/storeType/list?page=${obj.page}&perPage=${obj.perPage}&search=${obj.search}&status=${obj.status}`,
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
                                                '<td >' + index + '<td>' + (data.data.items[i].storeType) + '<td>' + (data.data.items[i].ar_storeType ? data.data.items[i].ar_storeType : '---') + '<td>' + `<img src =${data.data.items[i].image ? data.data.items[i].image : "../../admin/assets/img/emptyphoto.png"} style = "height:32px; width:40px;">` + '<td>' + moment(data.data.items[i].createdAt).format('DD/MM/YYYY') +
                                                '<td> <button  type="button" class="btn btn-sm btn-light" id="Action_button" style="margin: 5px;background-color:#000AFF"   onclick= "updateStatus(' + '\'' + data.data.items[i]._id + '\'' + "," + '\'' + y + '\'' + ')">' + y + '</button>' +
                                                '<td> <button  type="button" class="btn btn-sm btn-green" id="Action_button" style="margin: 5px; background-color:#717DBB;"  data-toggle="modal" data-target="#myModal2"   onclick= "edit(' + '\'' + data.data.items[i]._id + '\'' + ')">' + 'Edit' + '</button>' +
                                                '<button type="button" class="btn btn-sm btn-light" style="margin: 5px; background-color:#19AA8D;"  data-toggle="modal" data-target="#myModal12"    onclick= "view(' + '\'' + data.data.items[i]._id + '\'' + ')">' + "View" + '</button></tr>'
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
                        if (data.data.items[i].isActive == true) {
                            var x = 'Deactive'
                            var y = 'Active'
                        } else {
                            var x = 'Active'
                            var y = 'Deactive'
                        }

                        document.getElementById('table').innerHTML += '<tr >' +
                            '<td >' + index + '<td>' + (data.data.items[i].storeType) + '<td>' + (data.data.items[i].ar_storeType ? data.data.items[i].ar_storeType : '---') + '<td>' + `<img src =${data.data.items[i].image ? data.data.items[i].image : '../../admin/assets/img/emptyphoto.png'} style = "height:32px; width:40px;">` + '<td>' + moment(data.data.items[i].createdAt).format('DD/MM/YYYY') +
                            '<td> <button  type="button" class="btn btn-sm btn-light" id="Action_button" style="background-color:#000AFF; color:white;"   onclick= "updateStatus(' + '\'' + data.data.items[i]._id + '\'' + "," + '\'' + y + '\'' + ')">' + y + '</button>' +
                            '<td> <button  type="button" class="btn btn-sm btn-green" id="Action_button" style="margin-right: 5px; background-color:#717DBB; color:white;"  data-toggle="modal" data-target="#myModal2"   onclick= "edit(' + '\'' + data.data.items[i]._id + '\'' + ')">' + 'Edit' + '</button>' +
                            '<button type="button" class="btn btn-sm btn-light" style="background-color:#19AA8D; color:white;"  data-toggle="modal" data-toggle="modal" data-target="#myModal12"    onclick= "view(' + '\'' + data.data.items[i]._id + '\'' + ')">' + "View" + '</button></tr>'
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
                    url: `${host}/api/v1/admin/storeType/updateStatus?storeTypeId=${Id}&status=${y}`,
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
                            category();
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
                    type: "get",
                    dataType: 'json',
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader('Authorization', token);
                    },
                    url: `${host}/api/v1/admin/storeType/deleteStore?storeTypeId=${Id}`,
                }).done(function (data) {
                    // If successful
                    // alert("Success")
                    swal.close();
                    category();
                }).fail(function (jqXHR, textStatus, errorThrown) {
                    // If fail
                    alert(jqXHR.responseJSON.error)
                })
            } else {
                swal("Cancelled", "Your file is safe :");
            }
        });
}
function sub_category() {
    window.location.replace('/admin/sub_category')
}

//get category
function edit(Id) {
    $.ajax({
        url: `${host}/api/v1/admin/storeType/getDetails?storeTypeId=${Id}`,
        type: 'Get',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
    }).done(function (data) {
        if (data.code == 200) {
            // If successful
            // alert("Success")
            document.getElementById('storeType1').value = data.data.storeType
            document.getElementById('storeType11').value = data.data.ar_storeType ? data.data.ar_storeType : ''
            document.getElementById('blah1').src = data.data.image
            document.getElementById('storeTypeId').value = data.data._id
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
        url: `${host}/api/v1/admin/storeType/getDetails?storeTypeId=${Id}`,
        type: 'Get',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
    }).done(function (data) {
        if (data.code == 200) {
            // If successful
            document.getElementById('storeType12').value = data.data.storeType
            document.getElementById('storeType121').value = data.data.ar_storeType ? data.data.ar_storeType : ''
            document.getElementById('blah11').src = data.data.image
            // document.getElementById('status').innerHTML = data.data.isActive

        } else {
            alert("Some Thing Went Wrong")
        }

    }).fail(function (jqXHR, textStatus, errorThrown) {
        // If fail
        alert(jqXHR.responseJSON.error)

    })



}
