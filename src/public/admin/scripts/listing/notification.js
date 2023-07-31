
//*********Listing Table Data**************/

function notificationDetails(sortName) {
    this.setTimeout(() => {
        document.getElementById('notification-nav')?.classList.add("active");
    }, 1500)
    var obj = {
        'page': 1,
        'pageSize': 10,
        'search': document.getElementById('fog').value,
        'role': document.getElementById('role').value
    }
    if (document.getElementById('date').value && document.getElementById('date').value != '' && document.getElementById('date').value != 'Invalid date' && document.getElementById('date').value != undefined) {
        obj.date = moment(document.getElementById('date').value).format('DD/MM/YYYY')
    } else {
        obj.date = ''
    }
    $('#ibox1').children('.ibox-content').toggleClass('sk-loading');
    $.ajax({
        url: `${host}/api/v1/admin/notification/adminSend-notificationList?search=${obj.search}&date=${obj.date}&role=${obj.role}&page=${obj.page}&pageSize=${obj.pageSize}`,
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
                            'pageSize': options.length,
                            'search': document.getElementById('fog').value,
                            'role': document.getElementById('role').value
                        }
                        if (document.getElementById('date').value && document.getElementById('date').value != '' && document.getElementById('date').value != 'Invalid date' && document.getElementById('date').value != undefined) {
                            obj.date = moment(document.getElementById('date').value).format('DD/MM/YYYY')
                        } else {
                            obj.date = ''
                        }

                        $('#ibox1').children('.ibox-content').toggleClass('sk-loading');
                        $.ajax({
                            url: `${host}/api/v1/admin/notification/adminSend-notificationList?search=${obj.search}&date=${obj.date}&role=${obj.role}&page=${obj.page}&pageSize=${obj.pageSize}`,
                            type: 'GET',
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
                                    $("#table").html(' ');
                                    for (var i = 0; i < data.data.response.length; i++) {

                                        var index = i + 1 + (obj.pageSize * (obj.page - 1));

                                        if (data.data.response[i].image == '') {
                                            var image = 'No Image'
                                        } else {
                                            var image =
                                                `<img src =${data.data.response[i].image} style = "height:32px; width:40px; border-radius: 6px;">`
                                        }

                                        document.getElementById('table').innerHTML += '<tr style="border-bottom: 3px solid #c7b4d5; border-top: 3px solid #c7b4d5;">' +

                                            '<td style="line-height: 3.42857;">' + index + '<td style="line-height: 3.42857;">' + image +
                                            '<td class="disable-text-selection" style="line-height: 3.42857;">' + data.data.response[i].notification_dateTime +
                                            '<td style="line-height: 3.42857;">' + data.data.response[i].description + '<td style="line-height: 3.42857;">' + data.data.response[i].sendTo + '</tr>'

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
                if (sortName == "SNo" && localStorage.getItem('sno.') == "false") {
                    localStorage.setItem('sno.', true)
                    for (var i = data.data.response.length - 1; i >= 0; i--) {
                        var index = i + 1
                        if (data.data.response[i].image == '') {
                            var image = 'No Image'
                        } else {
                            var image =
                                `<img src =${data.data.response[i].image} style = "height:32px; width:40px; border-radius: 6px;">`
                        }
                        document.getElementById('table').innerHTML += '<tr style="border-bottom: 3px solid #c7b4d5; border-top: 3px solid #c7b4d5;">' +
                            '<td style="line-height: 3;">' + index + '<td style="line-height: 3;">' + image +
                            '<td class="disable-text-selection" style="line-height: 3;">' + data.data.response[i].notification_dateTime +
                            '<td style="line-height: 3;">' + data.data.response[i].description + '<td style="line-height: 3;">' + data.data.response[i].sendTo + '</tr>'
                    }
                } else {
                    localStorage.setItem('sno.', false)
                    for (var i = 0; i < data.data.response.length; i++) {
                        var index = i + 1
                        if (data.data.response[i].image == '') {
                            var image = 'No Image'
                        } else {
                            var image =
                                `<img src =${data.data.response[i].image} style = "height:32px; width:40px; border-radius: 6px;">`
                        }
                        document.getElementById('table').innerHTML += '<tr style="border-top: 3px solid #cc;">' +
                            '<td style="line-height: 3;">' + index + '<td style="line-height: 3;">' + image +
                            '<td class="disable-text-selection" style="line-height: 3;">' + data.data.response[i].notification_dateTime +
                            '<td style="line-height:2;width:200px;white-space:normal;">' + data.data.response[i].description + '<td style="line-height: 3;">' + data.data.response[i].sendTo + '</tr>'
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
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#blah')
                .attr('src', e.target.result)
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
        };

        reader.readAsDataURL(input.files[0]);
    }
}