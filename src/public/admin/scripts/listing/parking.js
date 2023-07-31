function parking_list() {
    this.setTimeout(() => {
        document.getElementById('parking-nav')?.classList.add("active");
    }, 1500)
    var obj = {
        'page': 1,
        'perPage': 500,
        'search': document.getElementById('fog').value,
        // 'status': document.getElementById('status').value
    }
    $('#ibox1').children('.ibox-content').toggleClass('sk-loading');
    $.ajax({
        url: `${host}/api/v1/admin/parking/list?page=${obj.page}&perPage=${obj.perPage}&search=${obj.search}`,
        type: 'Get',
        timeout: 15000,
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
                $("#parking").html(' ');
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
                    length: 500,
                    prev: 'Previous',
                    next: 'Next',
                    click: function (options, $target) {
                        let obj = {
                            'page': options.current,
                            'perPage': options.length,
                            'search': document.getElementById('fog').value,
                            // 'status': document.getElementById('status').value
                        }
                        $('#ibox1').children('.ibox-content').toggleClass('sk-loading');
                        $.ajax({
                            url: `${host}/api/v1/admin/parking/list?page=${obj.page}&perPage=${obj.perPage}&search=${obj.search}`,
                            type: 'Get',
                            timeout: 15000,
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
                                    $("#parking").html(' ');
                                    for (var i = 0; i < data.data.list.length; i++) {
                                        if (data.data.list[i].parkingSlot_booked == true) {
                                            var color = "red"
                                        } else {
                                            var color = "green"
                                        }
                                        document.getElementById('parking').innerHTML += `
                <div class="main_container d-flex align-items-center justify-contents-center flex-wrap">
                    <div>
                        <div style="width:73px;height:75px; margin-right:10px; background-color:${color};border-radius:10px 10px 0px 0px;"></div>
                        <small>${data.data.list[i].title}</small>
                    </div>
                </div>`
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
                $("#parking").html(' ');
                console.log(data.data.totalParking, "krfdskjvdc", data.data)

                document.getElementById('totalParking').innerHTML = data.data.totalParking
                document.getElementById('leftParking').innerHTML = data.data.leftParking
                document.getElementById('bookedParking').innerHTML = data.data.bookedParking
                for (var i = 0; i < data.data.list.length; i++) {
                    if (data.data.list[i].parkingSlot_booked == true) {
                        var color = "red"
                    } else {
                        var color = "green"
                    }
                    //     document.getElementById('parking').innerHTML += `<div class="col-12 col-sm-6 col-md-4 col-lg-2 mt-5">
                    //     <div class="card">
                    //     <div class="card-body" style="background-color: ${color};"></div>
                    //     <div class="card-footer">${data.data.list[i].title}</div>
                    //     </div>
                    // </div>`


                    document.getElementById('parking').innerHTML += `
                <div class="main_container d-flex align-items-center justify-contents-center flex-wrap">
                    <div>
                        <div style="width:73px;height:75px; margin-right:10px; background-color:${color};border-radius:10px 10px 0px 0px;"></div>
                        <small>${data.data.list[i].title}</small>
                    </div>
                </div>`
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