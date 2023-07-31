
$(document).ready(function () {
    var selector = '.nav li';
    $(selector).on('click', function () {
        $(selector).removeClass('active');
        $(this).addClass('active');
    });
});

//*********Listing Table Data**************/

//***********User view Details*********/
var currentLocation = window.location.href;
var url = new URL(currentLocation);
var userId = url.searchParams.get("id");
function userDetails() {
    this.setTimeout(() => {
        document.getElementById('user-nav')?.classList.add("active");
    }, 1500)
    var obj = {
        "userId": userId
    }
    $.ajax({
        url: `${host}/api/v1/admin/user/detail?userId=${userId}`,
        type: 'Get',
        contentType: 'application/json',
        data: JSON.stringify(obj),
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        dataType: 'json',
        success: function (data, status) {
            if (data.code == 200) {
                document.getElementById('name').innerHTML = data.data.response.name ? data.data.response.name : 'N/A';
                document.getElementById('email').innerHTML = data.data.response.email[0] ? data.data.response.email[0] : "N/A";
                document.getElementById('mobile').innerHTML = data.data.response.phoneNumber ? data.data.response.phoneNumber : "N/A";
                document.getElementById('blah').src = data.data.response.image ? data.data.response.image : 'https://www.w3schools.com/howto/img_avatar.png'
                document.getElementById('pendingIssue').innerHTML = data.data.pending_queries
                document.getElementById('resolvedIssue').innerHTML = data.data.resolve_queries
                document.getElementById('order_complete').innerHTML = data.data.complete_order
                document.getElementById('order_pending').innerHTML = data.data.cancelled_order
            } else {
                alert("Something Wrong, Try again")
            }
        }
    });
}

//user order list
function user_orderList(sortName) {
    if (sortName && sortName != undefined && sortName != NaN && sortName != "orderId") {
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
        var sortName1 = sortName
    } else if (sortName == "orderId") {
        var sort1 = -1
        var sortName1 = ""
    }
    else {
        var sort1 = -1
        var sortName1 = "createdAt"
        localStorage.setItem('sort', sort1)
    }
    var obj = {
        'page': 1,
        'perPage': 10,
        'userId': userId,
        'sort': sort1,
        'sortName': sortName1
    }
    $('#ibox1').children('.ibox-content').toggleClass('sk-loading');
    $.ajax({
        url: `${host}/api/v1/admin/user/orderList?page=${obj.page}&perPage=${obj.perPage}&userId=${obj.userId}&sort=${obj.sort}&sortName=${obj.sortName}`,
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
                            'userId': userId,
                            'sort': sort1,
                            'sortName': sortName1
                        }
                        $('#ibox1').children('.ibox-content').toggleClass('sk-loading');
                        $.ajax({
                            url: `${host}/api/v1/admin/user/orderList?page=${obj.page}&perPage=${obj.perPage}&userId=${obj.userId}&sort=${obj.sort}&sortName=${obj.sortName}`,
                            type: 'Get',
                            contentType: 'application/json',
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
                                        if (data.data.items[i].status == "Cancelled" || data.data.items[i].status == "Rejected") {
                                            var pickup_dateTime = '------'
                                        } else {
                                            var pickup_dateTime = moment(data.data.items[i].pickup_dateTime).format('DD/MM/YYYY hh:mm a')
                                        }

                                        document.getElementById('table').innerHTML += '<tr>' +
                                            '<td >' + (data.data.items[i].orderId) + '<td>' + (data.data.items[i].userId.name ? data.data.items[i].userId.name : '---') + '<td>' + (data.data.items[i].storeId.branchName ? data.data.items[i].storeId.branchName : '---') + '<td>' + parseFloat(data.data.items[i].totalAmount).toFixed(2) + '<td>' + (data.data.items[i].status) + '<td>' + moment(data.data.items[i].order_dateTime).format('DD/MM/YYYY  hh:mm a') + '<td>' + pickup_dateTime + '<td>' + (data.data.items[i].paid) +
                                            '<td> <button type="button" class="btn btn-sm btn-success" id="Action_button" style="margin: 5px;"   onclick= "track(' + '\'' + data.data.items[i]._id + '\'' + ')">' + "Track" + '</button>' +
                                            '</tr>'
                                    }
                                }
                            }
                        })
                        $target.next(".show").text('Current: ' + options.current);
                    }
                })
                $("#table").html(' ');

                var completed = ` <div class="order-track-step">
                                            <div class="order-track-status">
                                                <span class="order-track-status-dot1"></span>
                                                <span class="order-track-status-line1"></span>
                                            </div>
                                            <div class="order-track-text">
                                                <p class="order-track-text-stat">Order Picked Up date and time</p>
                                                <span class="order-track-text-sub"></span>
                                            </div>
                                        </div>`
                if (data.data.items[0].status == "Rejected") {
                    var dateTime = data.data.items[0].statusList[1].dateAndTime
                    var track_order = `<div class="order-track-step">
                                                                    <div class="order-track-status">
                                                                    <span class="order-track-status-dot"></span>
                                                                    <span class="order-track-status-line"></span>
                                                                         </div>
                                                                     <div class="order-track-text">
                                                                    <p class="order-track-text-stat">Order Placed</p>
                                                                    <span class="order-track-text-sub">${moment(data.data.items[0].statusList[0].dateAndTime).format('DD/MM/YYYY  hh:mm a')}</span>
                                                                   </div>
                                                                    </div>
                                                                    <div class="order-track-step">
                                                                                        <div class="order-track-status">
                                                                                            <span class="order-track-status-dot"></span>
                                                                                            <span class="order-track-status-line1"></span>
                                                                                        </div>
                                                                                        <div class="order-track-text">
                                                                                            <p class="order-track-text-stat">${data.data.items[0].storeId.branchName + "Rejected the Order"}</p>
                                                                                            <span class="order-track-text-sub">${moment(dateTime).format('DD/MM/YYYY  hh:mm a')}</span>
                                                                                        </div>
                                                                                    </div> <div class="order-track-step">
                                                                                    <div class="order-track-status">
                                                                                        <span class="order-track-status-dot1"></span>
                                                                                        <span class="order-track-status-line1"></span>
                                                                                    </div>
                                                                                    <div class="order-track-text">
                                                                                        <p class="order-track-text-stat">Pickup schedule Date and time</p>
                                                                                        <span class="order-track-text-sub"></span>
                                                                                    </div>
                                                                                </div>`+ "" + completed
                }
                if (data.data.items[0].status == "Cancelled") {
                    var dateTime = data.data.items[0].statusList[2].dateAndTime
                    var track_order = `<div class="order-track-step">
                                                <div class="order-track-status">
                                                <span class="order-track-status-dot"></span>
                                                <span class="order-track-status-line"></span>
                                                     </div>
                                                 <div class="order-track-text">
                                                <p class="order-track-text-stat">Order Placed</p>
                                                <span class="order-track-text-sub">${moment(data.data.items[0].statusList[0].dateAndTime).format('DD/MM/YYYY  hh:mm a')}</span>
                                               </div>
                                                </div>
                                                <div class="order-track-step">
                                                                    <div class="order-track-status">
                                                                        <span class="order-track-status-dot"></span>
                                                                        <span class="order-track-status-line1"></span>
                                                                    </div>
                                                                    <div class="order-track-text">
                                                                        <p class="order-track-text-stat">${data.data.items[0].storeId.branchName + " Cancelled the Order"}</p>
                                                                        <span class="order-track-text-sub">${moment(dateTime).format('DD/MM/YYYY  hh:mm a')}</span>
                                                                    </div>
                                                                </div> <div class="order-track-step">
                                                                <div class="order-track-status">
                                                                    <span class="order-track-status-dot1"></span>
                                                                    <span class="order-track-status-line1"></span>
                                                                </div>
                                                                <div class="order-track-text">
                                                                    <p class="order-track-text-stat">Pickup schedule Date and time</p>
                                                                    <span class="order-track-text-sub"></span>
                                                                </div>
                                                            </div>`+ "" + completed
                }
                if (data.data.items[0].status == "Pending") {
                    var track_order = `<div class="order-track-step">
                        <div class="order-track-status">
                        <span class="order-track-status-dot"></span>
                        <span class="order-track-status-line1"></span>
                             </div>
                         <div class="order-track-text">
                        <p class="order-track-text-stat">Order Placed</p>
                        <span class="order-track-text-sub">${moment(data.data.items[0].statusList[0].dateAndTime).format('DD/MM/YYYY  hh:mm a')}</span>
                       </div>
                        </div>
                        <div class="order-track-step">
                                            <div class="order-track-status">
                                                <span class="order-track-status-dot1"></span>
                                                <span class="order-track-status-line1"></span>
                                            </div>
                                            <div class="order-track-text">
                                                <p class="order-track-text-stat">${data.data.items[0].storeId.branchName + " Accepted the Order"}</p>
                                                <span class="order-track-text-sub"></span>
                                            </div>
                                        </div> <div class="order-track-step">
                                        <div class="order-track-status">
                                            <span class="order-track-status-dot1"></span>
                                            <span class="order-track-status-line1"></span>
                                        </div>
                                        <div class="order-track-text">
                                            <p class="order-track-text-stat">Pickup schedule Date and time</p>
                                            <span class="order-track-text-sub">${moment(data.data.items[0].pickup_dateTime).format('DD/MM/YYYY  hh:mm a')}</span>
                                        </div>
                                    </div>`+ "" + completed
                } if (data.data.items[0].status == "Accepted") {
                    var track_order = `<div class="order-track-step">
                        <div class="order-track-status">
                        <span class="order-track-status-dot"></span>
                        <span class="order-track-status-line"></span>
                             </div>
                         <div class="order-track-text">
                        <p class="order-track-text-stat">Order Placed</p>
                        <span class="order-track-text-sub">${moment(data.data.items[0].statusList[0].dateAndTime).format('DD/MM/YYYY  hh:mm a')}</span>
                       </div>
                        </div>
                        <div class="order-track-step">
                                            <div class="order-track-status">
                                                <span class="order-track-status-dot"></span>
                                                <span class="order-track-status-line"></span>
                                            </div>
                                            <div class="order-track-text">
                                                <p class="order-track-text-stat">${data.data.items[0].storeId.branchName + " Accepted the Order"}</p>
                                                <span class="order-track-text-sub">${moment(data.data.items[0].statusList[1].dateAndTime).format('DD/MM/YYYY  hh:mm a')}</span>
                                            </div>
                                        </div> <div class="order-track-step">
                                        <div class="order-track-status">
                                            <span class="order-track-status-dot"></span>
                                            <span class="order-track-status-line1"></span>
                                        </div>
                                        <div class="order-track-text">
                                            <p class="order-track-text-stat">Pickup schedule Date and time</p>
                                            <span class="order-track-text-sub">${moment(data.data.items[0].pickup_dateTime).format('DD/MM/YYYY  hh:mm a')}</span>
                                        </div>
                                    </div>`+ "" + completed
                } if (data.data.items[0].status == "Completed") {
                    var track_order = `<div class="order-track-step">
                        <div class="order-track-status">
                        <span class="order-track-status-dot"></span>
                        <span class="order-track-status-line"></span>
                             </div>
                         <div class="order-track-text">
                        <p class="order-track-text-stat">Order Placed</p>
                        <span class="order-track-text-sub">${moment(data.data.items[0].statusList[0].dateAndTime).format('DD/MM/YYYY  hh:mm a')}</span>
                       </div>
                        </div>
                        <div class="order-track-step">
                                            <div class="order-track-status">
                                                <span class="order-track-status-dot"></span>
                                                <span class="order-track-status-line"></span>
                                            </div>
                                            <div class="order-track-text">
                                                <p class="order-track-text-stat">${data.data.items[0].storeId.branchName + " Accepted the Order"}</p>
                                                <span class="order-track-text-sub">${moment(data.data.items[0].statusList[1].dateAndTime).format('DD/MM/YYYY  hh:mm a')}</span>
                                            </div>
                                        </div> <div class="order-track-step">
                                        <div class="order-track-status">
                                            <span class="order-track-status-dot"></span>
                                            <span class="order-track-status-line"></span>
                                        </div>
                                        <div class="order-track-text">
                                            <p class="order-track-text-stat">Pickup schedule Date and time</p>
                                            <span class="order-track-text-sub">${moment(data.data.items[0].pickup_dateTime).format('DD/MM/YYYY hh:mm a')}</span>
                                        </div>
                                    </div><div class="order-track-step">
                                    <div class="order-track-status">
                                        <span class="order-track-status-dot"></span>
                                        <span class="order-track-status-line"></span>
                                    </div>
                                    <div class="order-track-text">
                                        <p class="order-track-text-stat">Order Picked Up date and time</p>
                                        <span class="order-track-text-sub">${moment(data.data.items[0].statusList[2].dateAndTime).format('DD/MM/YYYY  hh:mm a')}</span>
                                    </div>
                                </div>`
                }
                // }
                var track = 'Track'
                document.getElementById('track').innerHTML += track_order
                for (var i = 0; i < data.data.items.length; i++) {
                    if (i == 0) {
                        var class1 = `<td> <button type="button" class="btn btn-sm btn-success active" id="Action_button" style="margin: 5px;"   onclick= "track('${data.data.items[i]._id}')"> ${track} </button>`
                    } else {
                        var class1 = `<td> <button type="button" class="btn btn-sm btn-success" id="Action_button" style="margin: 5px;"   onclick= "track('${data.data.items[i]._id}')"> ${track} </button>`
                    }
                    if (data.data.items[i].status == "Cancelled" || data.data.items[i].status == "Rejected") {
                        var pickup_dateTime = "------"
                    } else {
                        var pickup_dateTime = moment((data.data.items[i].pickup_dateTime)).format('DD/MM/YYYY  hh:mm a')
                    }
                    document.getElementById('table').innerHTML += '<tr>' +
                        '<td >' + (data.data.items[i].orderId) + '<td>' + (data.data.items[i].userId.name ? data.data.items[i].userId.name : '---') + '<td>' + (data.data.items[i].storeId.branchName ? data.data.items[i].storeId.branchName : '---') + '<td>' + parseFloat(data.data.items[i].totalAmount).toFixed(2) + '<td>' + (data.data.items[i].status) + '<td>' + (moment(data.data.items[i].order_dateTime).format('DD/MM/YYYY  hh:mm a')) + '<td>' + pickup_dateTime + '<td>' + (data.data.items[i].paid) +
                        // '<td> <button type="button" class="btn btn-sm btn-success" id="Action_button" style="margin: 5px;"   onclick= "track(' + '\'' + data.data.items[i]._id + '\'' + ')">' + "Track" + '</button>' +
                        class1 +
                        '</tr>'
                }
                var header = document.getElementById("classId");
                var btns = header.getElementsByClassName("btn btn-sm btn-success");
                for (var i = 0; i < btns.length; i++) {
                    btns[i].addEventListener("click", function () {
                        var current = document.getElementsByClassName("btn btn-sm btn-success active");
                        current[0].className = current[0].className.replace("btn btn-sm btn-success active", "btn btn-sm btn-success");
                        this.className += " active";
                    });
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
                .width(100)
                .height(100);
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function track(order_id) {
    var header = document.getElementById("classId");
    var btns = header.getElementsByClassName("btn btn-sm btn-success");
    for (var i = 0; i < btns.length; i++) {
        btns[i].addEventListener("click", function () {
            var current = document.getElementsByClassName("btn btn-sm btn-success active");
            current[0].className = current[0].className.replace("btn btn-sm btn-success active", "btn btn-sm btn-success");
            this.className += " active";
        });
    }
    $.ajax({
        url: `${host}/api/v1/admin/user/order_statusList?order_id=${order_id}`,
        type: 'Get',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
    }).done(function (data) {
        // alert('sucess')
        $('#track').html('')
        var completed = ` <div class="order-track-step">
    <div class="order-track-status">
        <span class="order-track-status-dot1"></span>
        <span class="order-track-status-line1"></span>
    </div>
    <div class="order-track-text">
        <p class="order-track-text-stat">Order Picked Up date and time</p>
        <span class="order-track-text-sub"></span>
    </div>
      </div>`
      if (data.data.status == "Rejected") {
        var dateTime = data.data.statusList[1].dateAndTime
    var track_order = `<div class="order-track-step">
                            <div class="order-track-status">
                            <span class="order-track-status-dot"></span>
                            <span class="order-track-status-line"></span>
                                 </div>
                             <div class="order-track-text">
                            <p class="order-track-text-stat">Order Placed</p>
                            <span class="order-track-text-sub">${moment(data.data.statusList[0].dateAndTime).format('DD/MM/YYYY  hh:mm a')}</span>
                           </div>
                            </div>
                            <div class="order-track-step">
                                                <div class="order-track-status">
                                                    <span class="order-track-status-dot"></span>
                                                    <span class="order-track-status-line1"></span>
                                                </div>
                                                <div class="order-track-text">
                                                    <p class="order-track-text-stat">${data.data.storeId.branchName + " Rejected the Order"}</p>
                                                    <span class="order-track-text-sub">${moment(dateTime).format('DD/MM/YYYY  hh:mm a')}</span>
                                                </div>
                                            </div> <div class="order-track-step">
                                            <div class="order-track-status">
                                                <span class="order-track-status-dot1"></span>
                                                <span class="order-track-status-line1"></span>
                                            </div>
                                            <div class="order-track-text">
                                                <p class="order-track-text-stat">Pickup schedule Date and time</p>
                                                <span class="order-track-text-sub"></span>
                                            </div>
                                        </div>`+ "" + completed
}
        if (data.data.status == "Cancelled") {
                var dateTime = data.data.statusList[2].dateAndTime
            var track_order = `<div class="order-track-step">
                                    <div class="order-track-status">
                                    <span class="order-track-status-dot"></span>
                                    <span class="order-track-status-line"></span>
                                         </div>
                                     <div class="order-track-text">
                                    <p class="order-track-text-stat">Order Placed</p>
                                    <span class="order-track-text-sub">${moment(data.data.statusList[0].dateAndTime).format('DD/MM/YYYY  hh:mm a')}</span>
                                   </div>
                                    </div>
                                    <div class="order-track-step">
                                                        <div class="order-track-status">
                                                            <span class="order-track-status-dot"></span>
                                                            <span class="order-track-status-line1"></span>
                                                        </div>
                                                        <div class="order-track-text">
                                                            <p class="order-track-text-stat">${data.data.storeId.branchName + " Cancelled the Order"}</p>
                                                            <span class="order-track-text-sub">${moment(dateTime).format('DD/MM/YYYY  hh:mm a')}</span>
                                                        </div>
                                                    </div> <div class="order-track-step">
                                                    <div class="order-track-status">
                                                        <span class="order-track-status-dot1"></span>
                                                        <span class="order-track-status-line1"></span>
                                                    </div>
                                                    <div class="order-track-text">
                                                        <p class="order-track-text-stat">Pickup schedule Date and time</p>
                                                        <span class="order-track-text-sub"></span>
                                                    </div>
                                                </div>`+ "" + completed
        }
        if (data.data.status == "Pending") {
            var track_order = `<div class="order-track-step">
      <div class="order-track-status">
<span class="order-track-status-dot"></span>
<span class="order-track-status-line1"></span>
</div>
<div class="order-track-text">
<p class="order-track-text-stat">Order Placed</p>
<span class="order-track-text-sub">${moment(data.data.statusList[0].dateAndTime).format('DD/MM/YYYY  hh:mm a')}</span>
</div>
</div>
<div class="order-track-step">
    <div class="order-track-status">
        <span class="order-track-status-dot1"></span>
        <span class="order-track-status-line1"></span>
    </div>
    <div class="order-track-text">
        <p class="order-track-text-stat">${data.data.storeId.branchName + " Accepted the Order"}</p>
        <span class="order-track-text-sub"></span>
    </div>
</div> <div class="order-track-step">
<div class="order-track-status">
    <span class="order-track-status-dot1"></span>
    <span class="order-track-status-line1"></span>
</div>
<div class="order-track-text">
    <p class="order-track-text-stat">Pickup schedule Date and time</p>
    <span class="order-track-text-sub">${moment(data.data.pickup_dateTime).format('DD/MM/YYYY  hh:mm a')}</span>
</div>
</div>`+ "" + completed
        } if (data.data.status == "Accepted") {
            var track_order = `<div class="order-track-step">
<div class="order-track-status">
<span class="order-track-status-dot"></span>
<span class="order-track-status-line"></span>
</div>
<div class="order-track-text">
<p class="order-track-text-stat">Order Placed</p>
<span class="order-track-text-sub">${moment(data.data.statusList[0].dateAndTime).format('DD/MM/YYYY  hh:mm a')}</span>
</div>
</div>
<div class="order-track-step">
    <div class="order-track-status">
        <span class="order-track-status-dot"></span>
        <span class="order-track-status-line"></span>
    </div>
    <div class="order-track-text">
        <p class="order-track-text-stat">${data.data.storeId.branchName + " Accepted the Order"}</p>
        <span class="order-track-text-sub">${moment(data.data.statusList[1].dateAndTime).format('DD/MM/YYYY  hh:mm a')}</span>
    </div>
</div> <div class="order-track-step">
<div class="order-track-status">
    <span class="order-track-status-dot"></span>
    <span class="order-track-status-line1"></span>
</div>
<div class="order-track-text">
    <p class="order-track-text-stat">Pickup schedule Date and time</p>
    <span class="order-track-text-sub">${moment(data.data.pickup_dateTime).format('DD/MM/YYYY  hh:mm a')}</span>
</div>
</div>`+ "" + completed
        } if (data.data.status == "Completed") {
            var track_order = `<div class="order-track-step">
<div class="order-track-status">
<span class="order-track-status-dot"></span>
<span class="order-track-status-line"></span>
</div>
<div class="order-track-text">
<p class="order-track-text-stat">Order Placed</p>
<span class="order-track-text-sub">${moment(data.data.statusList[0].dateAndTime).format('DD/MM/YYYY  hh:mm a')}</span>
</div>
</div>
<div class="order-track-step">
    <div class="order-track-status">
        <span class="order-track-status-dot"></span>
        <span class="order-track-status-line"></span>
    </div>
    <div class="order-track-text">
        <p class="order-track-text-stat">${data.data.storeId.branchName + " Accepted the Order"}</p>
        <span class="order-track-text-sub">${moment(data.data.statusList[1].dateAndTime).format('DD/MM/YYYY  hh:mm a')}</span>
    </div>
</div> <div class="order-track-step">
<div class="order-track-status">
    <span class="order-track-status-dot"></span>
    <span class="order-track-status-line"></span>
</div>
<div class="order-track-text">
    <p class="order-track-text-stat">Pickup schedule Date and time</p>
    <span class="order-track-text-sub">${moment(data.data.pickup_dateTime).format('DD/MM/YYYY hh:mm a')}</span>
</div>
</div><div class="order-track-step">
<div class="order-track-status">
<span class="order-track-status-dot"></span>
<span class="order-track-status-line"></span>
</div>
<div class="order-track-text">
<p class="order-track-text-stat">Order Picked Up date and time</p>
<span class="order-track-text-sub">${moment(data.data.statusList[2].dateAndTime).format('DD/MM/YYYY  hh:mm a')}</span>
</div>
</div>`

        }
        document.getElementById('track').innerHTML += track_order
    }).fail(function (jqXHR, textStatus, errorThrown) {
        // If fail
        alert(jqXHR.responseJSON.error)
    })
}

//only for user view
function checkPermission() {
    if (navigator.onLine) {
        localStorage.removeItem('sort')
        localStorage.removeItem('sno')
        localStorage.removeItem('Sno.')
        localStorage.removeItem('sno.')
        localStorage.removeItem('storeType_list')
        localStorage.removeItem('status3')
        $.ajax({
            url: host + '/api/v1/admin/auth/details',
            type: 'get',
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', token);
            },
            dataType: 'json',
        }).done(function (data) {
            // If successful      
            if (data.data.response.role == "Sub_Admin") {
                var permission = data.data.response.permission
                if (permission && permission.length != 0) {
                    document.getElementById('sub_admin-nav').style.display = "none"
                    document.getElementById('dashboard-nav').style.display = "none"
                    document.getElementById('user-nav').style.display = "none"
                    document.getElementById('vendor-nav').style.display = "none"
                    document.getElementById('category-nav').style.display = "none"
                    document.getElementById('order-nav').style.display = "none"
                    document.getElementById('notification-nav').style.display = "none"
                    document.getElementById('coupon-nav').style.display = "none"
                    document.getElementById('payment-nav').style.display = "none"
                    document.getElementById('admin_setting-nav').style.display = "none"
                    document.getElementById('queries-nav').style.display = "none"
                    for (let i = 0; i < permission.length; i++) {
                        if (permission[i] == "Dashboard") {
                            document.getElementById('dashboard-nav').style.display = "block"
                        }
                        if (permission[i] == "User Management") {
                            document.getElementById('user-nav').style.display = "block"
                        }
                        if (permission[i] == "Vendor Management") {
                            document.getElementById('vendor-nav').style.display = "block"
                        }
                        if (permission[i] == "Category Management") {
                            document.getElementById('category-nav').style.display = "block"
                        }
                        if (permission[i] == "Notification") {
                            document.getElementById('notification-nav').style.display = "block"
                        }
                        if (permission[i] == "Admin Setting") {
                            document.getElementById('admin_setting-nav').style.display = "block"
                        }
                        if (permission[i] == "Payment Management") {
                            document.getElementById('payment-nav').style.display = "block"
                        }
                    }
                } else {
                    document.getElementById('dashboard-nav').style.display = "none"
                    document.getElementById('user-nav').style.display = "none"
                    document.getElementById('vendor-nav').style.display = "none"
                    document.getElementById('category-nav').style.display = "none"
                    document.getElementById('order-nav').style.display = "none"
                    document.getElementById('notification-nav').style.display = "none"
                    document.getElementById('coupon-nav').style.display = "none"
                    document.getElementById('payment-nav').style.display = "none"
                    document.getElementById('sub_admin-nav').style.display = "none"
                    document.getElementById('admin_setting-nav').style.display = "none"
                    document.getElementById('queries-nav').style.display = "none"
                }
            } else {
                document.getElementById('dashboard-nav').style.display = "block"
                document.getElementById('user-nav').style.display = "block"
                document.getElementById('vendor-nav').style.display = "block"
                document.getElementById('category-nav').style.display = "block"
                document.getElementById('order-nav').style.display = "block"
                document.getElementById('notification-nav').style.display = "block"
                document.getElementById('coupon-nav').style.display = "block"
                document.getElementById('payment-nav').style.display = "block"
                document.getElementById('sub_admin-nav').style.display = "block"
                document.getElementById('admin_setting-nav').style.display = "block"
                document.getElementById('queries-nav').style.display = "block"
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            // If fail
            alert(jqXHR.responseJSON.error)
        })
    } else {
        const currentLocation = window.location.href
        const url = new URL(currentLocation)
        localStorage.setItem('currentscreenUrl', url.pathname)
        window.location.replace('/admin/no_internet')
    }

}