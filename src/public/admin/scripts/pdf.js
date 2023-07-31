 function invoice_generate(id) {
    console.log(id,":;lllll")
    if(id && id !=null && id != undefined && id !=''){
        var Id = id
    }else{
    var Id = document.getElementById('order_id').innerHTML
    }
    window.location.href = host + "/admin/invoice_pdf?id=" + Id
}
function downloadPdf() {               
          var invoice  = this.document.getElementById('invoice')
            var opt = {
                margin: 1,
                filename: 'myfile.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
            };
            html2pdf().from(invoice).set(opt).save();
}

//pdfDetails
function pdfDetails() {
    console.log('enter')
    // this.setTimeout(() => {
    //     document.getElementById('order-nav')?.classList.add("active");
    // }, 1500)
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
       const d = (data.data.response.orderId).split('Id')
        document.getElementById('orderId').innerHTML = "##"+d[1]
        document.getElementById('currentDate').innerHTML =moment().format('MMMM DD,YYYY')
        document.getElementById('currentDate').innerHTML =moment().format('MMMM DD,YYYY')
        document.getElementById('dueDate').innerHTML =moment().format('MMMM DD,YYYY')
        document.getElementById('vendor_ownerName').innerHTML = data.data.response.vendorId.ownerName ? data.data.response.vendorId.ownerName : '----'
        document.getElementById('vendor_ownerName').innerHTML = data.data.response.vendorId.ownerName ? data.data.response.vendorId.ownerName : '----'
        document.getElementById('vendor_businessName').innerHTML = data.data.response.vendorId.businessName ? data.data.response.vendorId.businessName : '-----'
        document.getElementById('vendor_phoneNumber').innerHTML = data.data.response.vendorId.phoneNumber
        document.getElementById('state').innerHTML = data.data.response.address.state ? data.data.response.address.state : '----'
        document.getElementById('city').innerHTML = data.data.response.address.city ? data.data.response.address.city : '----'
        document.getElementById('name').innerHTML = data.data.response.userId.name ? data.data.response.userId.name : '----'
        document.getElementById('cus_email').innerHTML = data.data.response.userId.email[0] ? data.data.response.userId.email[0] : '-----'
        document.getElementById('cus_phoneNumber').innerHTML = data.data.response.userId.phoneNumber
        document.getElementById('address').innerHTML = data.data.response.address.fullAddress ? data.data.response.address.fullAddress : ""
        document.getElementById('subTotal').innerHTML = data.data.response.subTotal
        document.getElementById('taxes_Charges').innerHTML = data.data.response.taxes_Charges +"%"
        document.getElementById('taxes_Charges_amount').innerHTML = parseFloat(data.data.response.taxes_Charges_amount).toFixed(2) ? parseFloat(data.data.response.taxes_Charges_amount).toFixed(2) :"--"
        document.getElementById('totalAmount').innerHTML = parseFloat(data.data.response.totalAmount).toFixed(2)
        downloadPdf();
    }).fail(function (jqXHR, textStatus, errorThrown) {
        // If fail
        alert(jqXHR.responseJSON.error)
    })
}



//  <div class="card-header bg-transparent header-elements-inline">
// <h6 class="card-title text-primary">Sale invoice</h6>
// </div>
// <div class="card-body">
//     <div class="row">
//         <div class="col-sm-6">
//             <div class="mb-4 ">
//                 <div class="text-sm-right">
//                     <h4 class="invoice-color mb-2 mt-md-2">Invoice #BBB1243</h4>
//                     <ul class="list list-unstyled mb-0">
//                         <li>Date: <span class="font-weight-semibold">${moment().format('D,YYYY')}</span></li>
//                         <li>Due date: <span class="font-weight-semibold">${moment().format('D,yyyy')}</span></li>
//                     </ul>
//                 </div>
//             </div>
//         </div>
//         <div class="col-sm-6">
//             <div class="mb-4 ">
//                 <div class="text-sm-right">
//                     <h4 class="invoice-color mb-2 mt-md-2">Invoice #BBB1243</h4>
//                     <ul class="list list-unstyled mb-0">
//                         <li>Customer Name: <span class="font-weight-semibold">${name}</span></li>
//                       <li>Customer Email: <span class="font-weight-semibold">${cus_email}</span></li>
//                       <li>Customer Phone Number: <span class="font-weight-semibold">${cus_phoneNumber}</span></li>
//                       <li>Customer City: <span class="font-weight-semibold">${cus_city}</span></li>
//                       <li>Customer State: <span class="font-weight-semibold">${cus_state}</span></li>
//                       <li>Customer Country: <span class="font-weight-semibold">${cus_fullAddress}</span></li>

//                       </ul>
//                 </div>
//             </div>
//         </div>
//     </div>
//     <div class="d-md-flex flex-md-wrap">
//         <div class="mb-4 mb-md-2 text-left"> <span class="text-muted">Invoice To:</span>
//             <ul class="list list-unstyled mb-0">
//                 <li>
//                     <h5 class="my-2">${document.getElementById('vendor_ownerName').innerHTML}</h5>
//                 </li>
//                 <li><span class="font-weight-semibold">Samantha Mutual funds Ltd</span></li>
//                 <li>${document.getElementById('vendor_businessName').innerHTML}</li>
//                 <li>Noida</li>
//                 <li>India</li>
//                 <li>${document.getElementById('vendor_phoneNumber').innerHTML}</li>
//                 <li><a href="#" data-abc="true">as12@gmail.com</a></li>
//             </ul>
//         </div>
//         <div class="mb-2 ml-auto"> <span class="text-muted">Payment Details:</span>
//             <div class="d-flex flex-wrap wmin-md-400">
//                 <ul class="list list-unstyled mb-0 text-left">
//                     <li>
//                         <h5 class="my-2">Total Due:</h5>
//                     </li>
//                     <li>Bank name:</li>
//                     <li>Country:</li>
//                     <li>City:</li>
//                     <li>Address:</li>
                   
//                 </ul>
//                 <ul class="list list-unstyled text-right mb-0 ml-auto">
//                     <li>
//                         <h5 class="font-weight-semibold my-2">${document.getElementById('totalAmount').value}</h5>
//                     </li>
//                     <li><span class="font-weight-semibold">Indian Bank</span></li>
//                     <li>Indai</li>
//                     <li>Noida</li>
//                     <li>India Noida</li>
//                 </ul>
//             </div>
//         </div>
//     </div>
// </div>
// <div class="card-body">
//     <div class="d-md-flex flex-md-wrap">
//         <div class="pt-2 mb-3 wmin-md-400 ml-auto">
//             <h6 class="mb-3 text-left">Total due</h6>
//             <div class="table-responsive">
//                 <table class="table">
//                     <tbody>
//                         <tr>
//                             <th class="text-left">Subtotal:</th>
//                             <td class="text-right">${document.getElementById('subTotal').innerHTML}</td>
//                         </tr>
//                         <tr>
//                             <th class="text-left">Tax: <span class="font-weight-normal">(25%)</span></th>
//                             <td class="text-right">${document.getElementById('taxes_Charges_amount').innerHTML}</td>
//                         </tr>
//                         <tr>
//                             <th class="text-left">Total:</th>
//                             <td class="text-right text-primary">
//                                 <h4 class="font-weight-semibold">${document.getElementById('totalAmount').innerHTML}</h4>
//                             </td>
//                         </tr>
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     </div>
// </div>