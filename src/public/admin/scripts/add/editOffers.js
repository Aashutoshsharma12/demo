//***********User view Details*********/
var currentLocation = window.location.href;
var url = new URL(currentLocation);
var userId = url.searchParams.get("id");

function offerDetail() {
    this.setTimeout(() => {
        document.getElementById('coupon-nav')?.classList.add("active");
    }, 1500)
    var obj = {
        "userId": userId
    }
    $.ajax({
        url: `${host}/api/v1/admin/offer/get/${userId}`,
        type: 'Get',
        contentType: 'application/json',
        data: JSON.stringify(obj),
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        dataType: 'json',
        success: function (data, status) {
            if (data.code == 200) {
                var array1 = []
                var storeId = data.data.storeId
                if (data.data.addBy == "Vendor") {
                    document.getElementById('storeId').disabled = true;
                    document.getElementById('storeTypeId').disabled = true
                    document.getElementById('storeTypeId1').disabled = true

                }
                if (storeId.length > 0) {
                    for (let i = 0; i < storeId.length; i++) {
                        array1.push(storeId[i]._id)
                    }
                }
                $.ajax({
                    url: `${host}/api/v1/admin/offer/storeList?storeTypeId=${data.data.storeTypeId._id}`,
                    type: 'Get',
                    contentType: 'application/json',
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader('Authorization', localStorage.token);
                    },
                    dataType: 'json',
                    success: function (data, status) {
                        if (data.code == 200) {
                            if (data.data.totalCount > 0) {
                                var array = []
                                var obj = {}
                                if (array1.length > 0) {
                                    for (let i = 0; i < data.data.items.length; i++) {
                                        if (array1.includes(data.data.items[i]._id) == true) {
                                            obj = {
                                                "value": data.data.items[i]._id,
                                                "label": data.data.items[i].branchName,
                                                "selected": true
                                            }
                                        } else {
                                            obj = {
                                                "value": data.data.items[i]._id,
                                                "label": data.data.items[i].branchName,
                                                "selected": false
                                            }
                                        }
                                        array.push(obj)
                                    }
                                } else {
                                    for (let i = 0; i < data.data.items.length; i++) {
                                        obj = {
                                            "value": data.data.items[i]._id,
                                            "label": data.data.items[i].branchName,
                                            "selected": false
                                        }
                                        array.push(obj)
                                    }
                                }

                            }
                            var multipleCancelButton = new Choices('#storeId', {
                                removeItemButton: true,
                                choices: array,
                                maxItemCount: 100,
                                searchResultLimit: 100,
                                renderChoiceLimit: 100
                            });
                        }
                    }
                });
                if ("Percentage" == data.data.offer_type) {
                    document.getElementById('UptoId').style.display = "block"
                    document.getElementById('upto_Amount1').value = data.data.upto_Amount ? data.data.upto_Amount : ''
                } else {
                    document.getElementById('UptoId').style.display = "none"
                }
                document.getElementById('minimum_amount').value = data.data.minimum_amount;
                document.getElementById('offer_type').value = data.data.offer_type;
                document.getElementById('offer_amount').value = data.data.offer_amount;
                document.getElementById('startDate').value = moment(data.data.startDate).format('yyyy-MM-DD'),
                    document.getElementById('expiryDate').value = moment(data.data.expiryDate).format('yyyy-MM-DD'),
                    document.getElementById('description').value = data.data.description ? data.data.description : "";
                document.getElementById('ar_description').value = data.data.ar_description ? data.data.ar_description : "";
                document.getElementById('couponCode').value = data.data.couponCode ? data.data.couponCode : "";
                document.getElementById('blah2').src = data.data.image ? data.data.image : "../../admin/assets/img/emptyphoto.png";
                document.getElementById('title').value = data.data.title
                document.getElementById('ar_title').value = data.data.ar_title ? data.data.ar_title : ''
                document.getElementById('storeTypeId').value = data.data.storeTypeId._id;
                document.getElementById('storeTypeId1').value = data.data.storeTypeId._id
            } else {
                alert("Something Wrong, Try again")
            }
        }
    });
}

function readURL1(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#blah2')
                .attr('src', e.target.result)
                .width(100)
                .height(100);
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// storeType list
function storeType_list() {
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

//storeList
function store_list() {
    document.getElementById('dynamic').innerHTML = `<div class="form-group" id="data_1">
    <label>Select Stores*</label>
    <select class="form-control" id="storeId" name="storeId"
        style="height: 55px;" multiple autocomplete="off">
    </select>
</div>`
    var storeTypeId = document.getElementById('storeTypeId').value
    $.ajax({
        url: `${host}/api/v1/admin/offer/storeList?storeTypeId=${storeTypeId}`,
        type: 'Get',
        contentType: 'application/json',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', localStorage.token);
        },
        dataType: 'json',
        success: function (data, status) {
            if (data.code == 200) {
                if (data.data.totalCount > 0) {
                    var array = []
                    for (let i = 0; i < data.data.items.length; i++) {
                        var obj = {
                            "value": data.data.items[i]._id,
                            "label": data.data.items[i].branchName,
                            "selected": false
                        }
                        array.push(obj)
                    }
                }
                var multipleCancelButton = new Choices('#storeId', {
                    removeItemButton: true,
                    choices: array,
                    maxItemCount: 100,
                    searchResultLimit: 100,
                    renderChoiceLimit: 100
                });
            } else {
                document.getElementById('table').innerHTML = ''
            }
        }
    });
}

// cancel\
function cancel() {
    window.location.replace('/admin/offers')
}
