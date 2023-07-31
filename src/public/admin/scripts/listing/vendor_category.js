var currentLocation = window.location.href;
var url = new URL(currentLocation);
var Id = url.searchParams.get("id");
function vendor_category() {
    this.setTimeout(() => {
        document.getElementById('vendor-nav')?.classList.add("active");
    }, 1500)

    var obj = {
        'vendorId':Id,
        'page': 1,
        'perPage': 10,
        'search': document.getElementById('fog').value,
        'status': document.getElementById('status').value
    }
    console.log(Id,";ll",obj,"ll")

    $('#ibox1').children('.ibox-content').toggleClass('sk-loading');
    $.ajax({
        url: `${host}/api/v1/admin/itemCategory/vendor_categoryList?page=${obj.page}&perPage=${obj.perPage}&search=${obj.search}&status=${obj.status}&vendorId=${obj.vendorId}`,
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
            // if (data.data.totalCount == 0 && data.code == 200) {
            //     console.log("dsakhdlj")
            //     $("#noData").addClass("show");
            // }
            if (data.code == 200 && data.data.totalCount > 0 ) {
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
                            'vendorId':Id,
                            'page': options.current,
                            'perPage': options.length,
                            'search': document.getElementById('fog').value,
                            'status': document.getElementById('status').value
                        }
                        $('#ibox1').children('.ibox-content').toggleClass('sk-loading');
                        $.ajax({
                            url: `${host}/api/v1/admin/itemCategory/vendor_categoryList?page=${obj.page}&perPage=${obj.perPage}&search=${obj.search}&status=${obj.status}&vendorId=${obj.vendorId}`,
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
                                            '<td >' + index + '<td>' + (data.data.items[i].title) + '<td>' + (data.data.items[i].ar_title ? data.data.items[i].ar_title : '---') + '<td>' + `<img src =${data.data.items[i].image ? data.data.items[i].image : "../../admin/assets/img/emptyphoto.png"} style = "height:32px; width:40px; border-radius: 6px;">` + '<td>' + moment(data.data.items[i].createdAt).format('DD/MM/YYYY') +
                                            '<td> <button  type="button" class="btn btn-sm btn-light" id="Action_button" style="margin: 5px;background-color:#000AFF">'  + y + '</button></tr>'
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
                    '<td >' + index + '<td>' + (data.data.items[i].title) + '<td>' + (data.data.items[i].ar_title ? data.data.items[i].ar_title : '---') + '<td>' + `<img src =${data.data.items[i].image ? data.data.items[i].image : "../../admin/assets/img/emptyphoto.png"} style = "height:32px; width:40px; border-radius: 6px;">` + '<td>' + moment(data.data.items[i].createdAt).format('DD/MM/YYYY') +
                    '<td> <button  type="button" class="btn btn-sm btn-light" id="Action_button" style="margin: 5px;background-color:#000AFF">'  + y + '</button></tr>'
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