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

function order() {
    window.location.replace('/admin/orderManagement')
}
function venderList() {
    window.location.replace('/admin/vendor_list')
}
function dashboard() {
    console.log(localStorage.getItem("currentscreenUrl"), "[][][[[", ";")

    this.setTimeout(() => {
        document.getElementById('dashboard-nav')?.classList.add("active");
    }, 1500)
    if (localStorage.getItem('role') == 'Sub_Admin') {
        if (localStorage.getItem('permission') && localStorage.getItem('permission') != '' && localStorage.getItem('permission') != undefined) {
            var permission = localStorage.getItem('permission')
            var d = permission.split(',')
            document.getElementById('orders').disabled = true
            if (d.includes('Vendor Management') == false) {
                document.getElementById('vendorViews').disabled = true
            }
        }
    }
    $.ajax({
        url: host + '/api/v1/admin/dashboard/details',
        type: 'get',
        timeout: 15000,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        dataType: 'json',
    }).done(function (data) {
        // If successful    
        document.getElementById('total_Customer').innerHTML = data.data.obj.total_Customer
        document.getElementById('active_Customer').innerHTML = data.data.obj.active_Customer
        document.getElementById('inactive_Customer').innerHTML = data.data.obj.inactive_Customer
        document.getElementById('total_Vendor').innerHTML = data.data.obj.total_Vendor
        document.getElementById('total_FoodShop').innerHTML = data.data.obj.total_FoodShop
        document.getElementById('total_GroceryShop').innerHTML = data.data.obj.total_GroceryShop
        document.getElementById('total_Category').innerHTML = data.data.obj.total_StoreType
        document.getElementById('total_MeatShop').innerHTML = data.data.obj.total_MeatShop
        document.getElementById('total_SubCategory').innerHTML = data.data.obj.total_SubCategory
        document.getElementById('total_Orders').innerHTML = data.data.obj.total_Orders
        document.getElementById('total_CancelledOrders').innerHTML = data.data.obj.total_CancelledOrders
        document.getElementById('total_Payment').innerHTML = data.data.total_Payment
        recent_acceptedVendor();
        orderList();
    }).fail(function (jqXHR, textStatus, errorThrown) {
        // If failerror: function (XMLHttpRequest, textStatus, errorThrown) {
        if (textStatus == "timeout") {
            alert("Your internet connection is very poor")
        }else{
            alert(jqXHR.responseJSON.error)
        }
    })
}
function recent_acceptedVendor() {
    $.ajax({
        url: host + '/api/v1/admin/dashboard/list',
        type: 'get',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
            xhr.setRequestHeader('timezone', localStorage.getItem('timeZone'));

        },
        dataType: 'json',
    }).done(function (data) {
        // If successful   
        if (data.code == 200 && data.data.length != 0) {
            for (let i = 0; i < data.data.length; i++) {
                if (data.data[i].image != '') {
                    var image = data.data[i].image
                } else {
                    var image = '../../admin/assets/img/emptyphoto.png'
                }
                // ../../admin/assets/img/emptyphoto.png
                document.getElementById('classId').innerHTML += `<li>
           <div class="rounded_img">
               <img src=${image} />
           </div>
           <div>
               <h2 style="color:#010000">${data.data[i].vendorDetails.businessName}</h2>
               <p style="color:#010000">${data.data[i].vendorDetails.acceptRejectDate_Time}</p>
           </div>
       </li>`
            }
        } else {
            document.getElementById('classId').innerHTML += `<li>
                <h2>${'Waiting for 5 Latest Recent Accepted Vendors'}</h2>
        </li>`
        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        // If fail
        alert(jqXHR.responseJSON.error)
    })
}
//latest order list
function orderList() {
    $('#ibox1').children('.ibox-content').toggleClass('sk-loading');
    $.ajax({
        url: `${host}/api/v1/admin/dashboard/latestOrder_list`,
        type: 'Get',
        contentType: 'application/json',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
            xhr.setRequestHeader('timezone', localStorage.getItem('timeZone'));

        },
        dataType: 'json',
        success: function (data, status) {
            if (data.code == 200) {
                $('#ibox1').children('.ibox-content').toggleClass('sk-loading');
            }
            if (data.data.totalCount == 0 && data.code == 200) {
                document.getElementById('classId1').innerHTML += `<li>
                <h2 class="waiting_latest_order">${'Waiting for 10 Latest Orders'}</h2>
        </li>`
            }
            if (data.code == 200) {
                $("#table2").removeClass("hide")
                $("#noData").removeClass("show")
                $("#page1").removeClass("hide")
                $("#table").html(' ');
                for (var i = 0; i < data.data.items.length; i++) {
                    if (data.data.items[i].paymentStatus == 'Completed') {
                        var status = "Paid"
                    } else {
                        var status = "Unpaid"
                    }
                    document.getElementById('table').innerHTML += '<tr >' +
                        '<td >' + (data.data.items[i].orderId) + '<td>' + (data.data.items[i].order_date) + '<td>' + (data.data.items[i].userId.name ? data.data.items[i].userId.name : '---') + '<td>' + parseFloat(data.data.items[i].totalAmount).toFixed(2) + '<td>' + status + '<td>' + `<a onclick= "invoice_generate('${data.data.items[i]._id}')"><img src='../../admin/assets/img/receipt.png'></a>` +
                        '</tr>'
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

function storeType_Profit() {
    var type = document.getElementById('type').value
    $.ajax({
        url: `${host}/api/v1/admin/dashboard/profit_details?type=${type}`,
        type: 'get',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        dataType: 'json',
    }).done(function (data) {
        // If successful   
        if (data.code == 200 && data.data.items.length != 0) {
            $("#storeTypeId").html(' ')
            var color = ['progress-bar red', 'progress-bar blue', 'progress-bar green']
            for (let i = 0; i < data.data.items.length; i++) {
                if (data.data.items[i].currentAmount == 0) {
                    var percentage = 0 + '%'
                } else if (data.data.items[i].previousAmount == 0) {
                    var percentage = 100 + '%'
                } else {
                    var totalpercentage = (data.data.items[i].currentAmount - data.data.items[i].previousAmount) * 100 / (data.data.items[i].currentAmount)
                    if (totalpercentage > 0) {
                        if (totalpercentage > 100) {
                            var percentage = 100 + '%'
                        } else {
                            var percentage = parseFloat(totalpercentage).toFixed(2) + '%'
                        }
                    } else {
                        var percentage = 0 + '%'
                    }
                }
                document.getElementById('storeTypeId').innerHTML += `<div>
                <h3>${data.data.items[i].storeTypeDetails.storeType}</h3>
            </div>
            <div class="progress">
                <div class="${color[0 + i]}" style="width:${percentage}"></div>
                <h2 class="ml-4"><strong>${percentage}</strong></h2>
            </div>`

            }
        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        // If fail
        alert(jqXHR.responseJSON.error)
    })
}

function press() {
    if (document.getElementById('admin_setting-nav').className && document.getElementById('admin_setting-nav').className == 'active') {
        document.getElementById('admin_setting-nav').className = 'inactive'
        document.getElementById('drop_down').style.display = 'none'
    } else {
        this.setTimeout(() => {
            document.getElementById('admin_setting-nav')?.classList.add("active");
        }, 1500)
        document.getElementById('admin_setting-nav').className = 'active'
        document.getElementById('drop_down').style.display = 'block'
    }
}
//for search button
function submit() {
    if (document.getElementById("fog").value === "") {
        document.getElementById('btnId').disabled = true;
    } else {
        document.getElementById('btnId').disabled = false;
    }
}
// window.addEventListener("online", function () {
//     console.log("eneter online")
//     // alert("Connecting Internet Connection!");
//     window.location.replace(localStorage.getItem("currentscreenUrl"))

// });

const currentLocation = window.location.href
const url = new URL(currentLocation)
// const Id = url.searchParams.get('href')
// window.addEventListener("offline", function () {
//     var t = '/admin/no_internet'
//     localStorage.setItem("currentscreenUrl",url.pathname)
//     alert("Oops!Disconnect Internet Connection!");
//     window.location.replace(t)
// });
// window.addEventListener("load", (event) => {
//     const statusDisplay = document.getElementById("status");
//     statusDisplay.textContent = navigator.onLine ? "Online" : "OFFline";
//   });
function reload() {
    window.localStorage(localStorage.getItem('currentscreenUrl'))
}





