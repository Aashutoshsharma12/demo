const currentLocation = window.location.href
const url = new URL(currentLocation)
const Id = url.searchParams.get('id')

function details() {
    this.setTimeout(() => {
        document.getElementById('vendor-nav')?.classList.add("active");
    }, 1500)
    $.ajax({
        url: `${host}/api/v1/admin/vendor/vendorDetails/${Id}`,
        type: 'get',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        contentType: false,
        processData: false,
    }).done(function (data) {
        // If successful
        
        document.getElementById("stars").innerHTML = getStars(data.data.response.rating);
        function getStars(rating) {
            // Round to nearest half
            rating = Math.round(rating * 2) / 2;
            let output = [];
            // Append all the filled whole stars
            for (var i = rating; i >= 1; i--)
                output.push('<img style="width: 25px;" src="../../../admin/assets/img/full.svg" />&nbsp;');

            // If there is a half a star, append it
            if (i == .5) output.push('<img style="width:25px;" src="../../../admin/assets/img/halfstar.svg" />&nbsp;');

            // Fill the empty stars
            for (let i = (5 - rating); i >= 1; i--)
                output.push('<img style="width:25px;" src="../../../admin/assets/img/graystar.svg" />&nbsp;');
            return output.join('');
        }
        document.getElementById('rating').innerHTML = parseFloat(data.data.response.rating).toFixed(1) + " Ratings"
        document.getElementById('buttn').innerHTML = data.data.response.userId._id
        document.getElementById('storeType').innerHTML = data.data.response.storeTypeId.storeType
        document.getElementById('shopName').innerHTML = data.data.response.main_branchName
        document.getElementById('blah').src = data.data.response.image ? data.data.response.image : '../../admin/assets/img/emptyphoto.png'
        document.getElementById('fullAddress').innerHTML = data.data.response.fullAddress
        document.getElementById('state').innerHTML = data.data.response.state
        document.getElementById('city').innerHTML = data.data.response.city
        document.getElementById('country').innerHTML = data.data.response.country ? data.data.response.country : ''
        document.getElementById('ownerName').innerHTML = data.data.response.userId.ownerName
        document.getElementById('phoneNumber').innerHTML = data.data.response.phoneNumber ? data.data.response.phoneNumber : ""
        document.getElementById('totalOrder').innerHTML = data.data.totalOrder
        document.getElementById('completeOrder').innerHTML = data.data.completeOrder
        document.getElementById('InProgress').innerHTML = data.data.In_progressOrder
        document.getElementById('cancelled').innerHTML = data.data.cancelledOrder
        ratingList();
    }).fail(function (jqXHR, textStatus, errorThrown) {
        // If fail
        alert(jqXHR.responseJSON.error)
    })
}

function vendor_category(id) {
    var Id = document.getElementById('buttn').innerHTML
    window.location.href = host + '/admin/vendorCategoey?id=' + Id
}

//vendor store rating and review list
function ratingList() {
    var obj = {
        'storeId': Id,
        'page': 1,
        'perPage': 10
    }
    $('#ibox1').children('.ibox-content').toggleClass('sk-loading');
    $.ajax({
        url: `${host}/api/v1/admin/vendor/rating_list?storeId=${obj.storeId}&page=${obj.page}&perPage=${obj.perPage}`,
        type: 'Get',
        contentType: 'application/json',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        dataType: 'json',
        success: function (data, status) {
            if (data.code == 200) {
                $('#ibox1').children('.ibox-content').toggleClass('sk-loading');
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
                            'storeId': Id
                        }
                        $('#ibox1').children('.ibox-content').toggleClass('sk-loading');
                        $.ajax({
                            url: `${host}/api/v1/admin/vendor/rating_list?storeId=${obj.storeId}&page=${obj.page}&perPage=${obj.perPage}`,
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
                                        var rating = Math.round(data.data.items[i].rating * 2) / 2;
                                        let output = [];
                                        // Append all the filled whole stars
                                        for (var i1 = rating; i1 >= 1; i1--)
                                            output.push('<img style="width: 25px;" src="../../../admin/assets/img/full.svg" />&nbsp;');
                                        // If there is a half a star, append it
                                        if (i1 == .5) output.push('<img style="width:25px;" src="../../../admin/assets/img/halfstar.svg" />&nbsp;');
                                        // Fill the empty stars
                                        for (let i1 = (5 - rating); i1 >= 1; i1--)
                                            output.push('<img style="width:25px;" src="../../../admin/assets/img/graystar.svg" />&nbsp;');
                                        var index = i + 1
                                        document.getElementById('table').innerHTML += '<tr >' +
                                            '<td >' + index + '<td>' + (data.data.items[i].userId.name) + '<td>' + (data.data.items[i].review ? data.data.items[i].review : '---') + '<td>' + output.join(''); +'</tr>'
                                    }
                                }
                            }
                        })
                        $target.next(".show").text('Current: ' + options.current);
                    }
                })
                $("#table").html(' ');
                for (var i = 0; i < data.data.items.length; i++) {
                    var rating = Math.round(data.data.items[i].rating * 2) / 2;
                    let output = [];
                    // Append all the filled whole stars
                    for (var i1 = rating; i1 >= 1; i1--)
                        output.push('<img style="width: 25px;" src="../../../admin/assets/img/full.svg" />&nbsp;');
                    // If there is a half a star, append it
                    if (i1 == .5) output.push('<img style="width:25px;" src="../../../admin/assets/img/halfstar.svg" />&nbsp;');
                    // Fill the empty stars
                    for (let i1 = (5 - rating); i1 >= 1; i1--)
                        output.push('<img style="width:25px;" src="../../../admin/assets/img/graystar.svg" />&nbsp;');
                    var index = i + 1
                    document.getElementById('table').innerHTML += '<tr >' +
                        '<td >' + index + '<td>' + (data.data.items[i].userId.name) + '<td>' + (data.data.items[i].review ? data.data.items[i].review : '---') + '<td>' + output.join(''); +'</tr>'
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
