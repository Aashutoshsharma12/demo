function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#blah4')
                .attr('src', e.target.result)
                .width(100)
                .height(100);
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// storeType list
function storeType_list() {
    this.setTimeout(() => {
        document.getElementById('coupon-nav')?.classList.add("active");
    }, 1500)
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

// cancel
function cancel() {
    window.location.replace('/admin/offers')
}

