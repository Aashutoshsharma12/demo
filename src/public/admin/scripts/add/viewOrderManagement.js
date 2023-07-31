function orderDetails() {
    this.setTimeout(() => {
        document.getElementById('order-nav')?.classList.add("active");
    }, 1500)
    const currentLocation = window.location.href
    const url = new URL(currentLocation)
    const Id = url.searchParams.get('id')
    $.ajax({
        url: `${host}/api/v1/admin/order/details/${Id}`,
        type: 'get',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        contentType: false,
        processData: false,
    }).done(function (data) {
        // If successful
        console.log(data)
        document.getElementById('order_id').innerHTML = data.data.response._id
        document.getElementById('name').innerHTML = data.data.response.userId.name ? data.data.response.userId.name : '----'
        document.getElementById('email').innerHTML = data.data.response.userId.email[0] ? data.data.response.userId.email[0] : '-----'
        document.getElementById('mobile').innerHTML = data.data.response.userId.phoneNumber
        document.getElementById('address').innerHTML = data.data.response.address.fullAddress ? data.data.response.address.fullAddress : ""
        document.getElementById('orderDate').innerHTML = moment(data.data.response.order_date).format('DD/MM/YYYY')
        document.getElementById('orderTime').innerHTML = moment(data.data.response.order_time, ['HH:mm']).format('hh:mm a')
        document.getElementById('subTotal').innerHTML = data.data.response.subTotal
        document.getElementById('Discount_price').innerHTML = data.data.response.discount?data.data.response.discount :00
        document.getElementById('taxes_Charges_amount').innerHTML = parseFloat(data.data.response.taxes_Charges_amount).toFixed(2) ? parseFloat(data.data.response.taxes_Charges_amount).toFixed(2) : "--"
        document.getElementById('total').innerHTML = parseFloat(data.data.response.totalAmount).toFixed(2)
        document.getElementById('orderStatus').innerHTML = data.data.response.status
        if (data.data.response.paymentStatus == 'Completed') {
            document.getElementById('paymentStatus').innerHTML = "Paid" + " By " + data.data.response.paid
        } else {
            document.getElementById('paymentStatus').innerHTML = "Unpaid"
        }
        var details = data.data.response.items
        var index = 0;
        var totalAmount = 0
        if (!data.data.response.couponCodeAmount) {
            var couponCodeAmount = 00
        } else {
            var couponCodeAmount = data.data.response.couponCodeAmount
        }
        for (let i = 0; i < details.length; i++) {
            if (data.data.response.items[i].itemId.item_size == true) {
                var item_size = data.data.response.items[i].item_size.item_size
            } else {
                var item_size = '---'
            }
            index += 1
            totalAmount += (data.data.response.items[i].itemPrice)
            document.getElementById('table').innerHTML += '<tr >' + '<td >' + index +
                '<td >' + data.data.response.items[i].itemId.itemName + '<td>' + `<img style="height:40px; width:40px; border-radius:8px;" src = ${data.data.response.items[i].itemId.image}>` + '<td>' + item_size + '<td>' + data.data.response.items[i].quantity + '<td>' + data.data.response.vendorId.ownerName + '<td>' + (data.data.response.items[i].itemPrice) +
                '<td>' + couponCodeAmount
        }
        document.getElementById('totalAmount').innerHTML = totalAmount
        document.getElementById('totalDiscount').innerHTML = couponCodeAmount
    }).fail(function (jqXHR, textStatus, errorThrown) {
        // If fail
        alert(jqXHR.responseJSON.error)
    })
}