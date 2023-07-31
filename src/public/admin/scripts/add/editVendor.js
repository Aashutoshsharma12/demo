function vendorDetails() {
    this.setTimeout(() => {
        document.getElementById('vendor-nav')?.classList.add("active");
    }, 1500)
    const currentLocation = window.location.href
    const url = new URL(currentLocation)
    const Id = url.searchParams.get('id')
    $.ajax({
        url: `${host}/api/v1/admin/vendor/details/${Id}`,
        type: 'get',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        contentType: false,
        processData: false,
    }).done(function (data) {
        // If successful
       
        if (data.data.timing == null) {
            var openTime = ""
            var closeTime = ""
        } else {
            if (data.data.timing.Monday.openingTime && data.data.timing.Monday.openingTime != '') {
                var openTime = data.data.timing.Monday.openingTime
                var closeTime = data.data.timing.Monday.closingTime
            } else
                if (data.data.timing.Tuesday.openingTime && data.data.timing.Tuesday.openingTime != '') {
                    var openTime = data.data.timing.Tuesday.openingTime
                    var closeTime = data.data.timing.Tuesday.closingTime
                }
                else if (data.data.timing.Wednesday.openingTime && data.data.timing.Wednesday.openingTime != '') {
                    var openTime = data.data.timing.Wednesday.openingTime
                    var closeTime = data.data.timing.Wednesday.closingTime
                }
                else if (data.data.timing.Thrusday.openingTime && data.data.timing.Thrusday.openingTime != '') {
                    var openTime = data.data.timing.Thrusday.openingTime
                    var closeTime = data.data.timing.Thrusday.closingTime
                } else if (data.data.timing.Friday.openingTime && data.data.timing.Friday.openingTime != '') {
                    var openTime = data.data.timing.Friday.openingTime
                    var closeTime = data.data.timing.Friday.closingTime
                }
                else if (data.data.timing.Saturday.openingTime && data.data.timing.Saturday.openingTime != '') {
                    var openTime = data.data.timing.Saturday.openingTime
                    var closeTime = data.data.timing.Saturday.closingTime
                } else if (data.data.timing.Sunday.openingTime && data.data.timing.Sunday.openingTime != '') {
                    var openTime = data.data.timing.Sunday.openingTime
                    var closeTime = data.data.timing.Sunday.closingTime
                } else {
                    var openTime = ""
                    var closeTime = ""
                }
        }
        function mobileNoselect() {
            if ($('#form').length) {
                $(".mobile").intlTelInput();
                $(".mobile").intlTelInput("setNumber", document.getElementById('countryCode').value );
            };
        };
        //* Select js
        function nice_Select() {
            if ($('.product_select').length) {
                $('select').niceSelect();
            };
        };
        console.log(data.data.storeDetails.ar_main_branchName && data.data.storeDetails.ar_main_branchName != 'undefined' && data.data.storeDetails.ar_main_branchName !='',";;;",data.data.storeDetails.ar_main_branchName)
        if(data.data.storeDetails.ar_main_branchName && data.data.storeDetails.ar_main_branchName != 'undefined' && data.data.storeDetails.ar_main_branchName !=''){
            var ar_main_branchName = data.data.storeDetails.ar_main_branchName
        }else{
            var ar_main_branchName = ''
        }
        document.getElementById('storeTypeId').value = data.data.storeDetails.storeTypeId._id
        document.getElementById('businessName').value = data.data.storeDetails.main_branchName
        document.getElementById('ar_businessName').value = ar_main_branchName
        document.getElementById('fullAddress').value = data.data.storeDetails.fullAddress
        document.getElementById('zipCode').value = data.data.storeDetails.zipCode
        document.getElementById('state').value = data.data.storeDetails.state
        document.getElementById('city').value = data.data.storeDetails.city
        document.getElementById('country').value = data.data.storeDetails.country ? data.data.storeDetails.country : ''
        document.getElementById('blah').src = data.data.storeDetails.image ? data.data.storeDetails.image :'../../admin/assets/img/emptyphoto.png'
        document.getElementById('ownerName').value = data.data.profileDetails.ownerName
        document.getElementById('vendorId').value = data.data.profileDetails._id
        document.getElementById('phoneNumber').value = data.data.profileDetails.phoneNumber ? data.data.profileDetails.phoneNumber : ""
        document.getElementById('countryCode').value = data.data.profileDetails.countryCode
        document.getElementById('password').value = '........................'
        document.getElementById('openTime').value = openTime
        document.getElementById('closeTime').value = closeTime
        document.getElementById('lng').value = data.data.storeDetails.lng
        document.getElementById('lat').value = data.data.storeDetails.lat
        document.getElementById('googlePlaceId').value = data.data.storeDetails.googlePlaceId
        document.getElementById('countryCodes').value = data.data.storeDetails.countryCodes
        mobileNoselect();
        nice_Select();
    }).fail(function (jqXHR, textStatus, errorThrown) {
        // If fail
        alert(jqXHR.responseJSON.error)
    })
}

//Google Api for Address
async function autocomplete() {
    address1Field = document.querySelector("#fullAddress");
    autocomplete = await new google.maps.places.Autocomplete(address1Field, {
        fields: ["place_id", "address_components", "geometry", "icon", "name"],
        strictBounds: false,
        // types: ["establishment"],
    });
    address1Field.focus();
    autocomplete.addListener("place_changed", fillInAddress);
}
function fillInAddress() {
    const place = autocomplete.getPlace();
    document.getElementById('lat').value = place.geometry.location.lat();
    document.getElementById('lng').value = place.geometry.location.lng();
    document.getElementById('googlePlaceId').value = place.place_id;

    let address1 = "";
    let postcode = "";
    for (const component of place.address_components) {
        const componentType = component.types[0];
        switch (componentType) {
            case "postal_code":
                {
                    postcode = `${component.long_name}${postcode}`;
                    break;
                }
            case "locality":
                for (let i = 0; i < place.address_components.length; i++) {
                    for (let i1 = 0; i1 < place.address_components[i].types.length; i1++) {
                        if (place.address_components[i].types[i1] == "country") {
                            var countryCodes = place.address_components[i].short_name
                            var country = place.address_components[i].long_name

                        }
                        if (place.address_components[i].types[i1] == "administrative_area_level_1") {
                            var state = place.address_components[i].long_name
                        }
                        if (place.address_components[i].types[i1] == "sublocality_level_1") {
                            var addressLine1 = place.address_components[i].long_name
                        }
                       
                        if (place.address_components[i].types[i1] == "postal_code") {
                            var zipCode = place.address_components[i].long_name
                        }
                        if (place.address_components[i].types[i1] == "locality") {
                            var city = place.address_components[i].long_name
                        }
                    }
                }
                console.log(city, zipCode, "[[[")
                if (countryCodes == null) {
                    document.getElementById('countryCodes').value = "";
                    document.getElementById('country').value = ""
                } else {
                    document.getElementById('countryCodes').value = countryCodes
                    document.getElementById('country').value = country
                    console.log(document.getElementById('country').value,";;",country)
                }
                if (state == null) {
                    document.getElementById('state').value = "";

                } else {
                    document.getElementById('state').value = state;
                    console.log()
                }
                if (city == null) {
                    document.getElementById('city').value = "";

                } else {
                    document.getElementById('city').value = city;
                }
                // if (addressLine1 == null) {
                //     document.getElementById('addressLine1').value = "";

                // } else {
                //     document.getElementById('addressLine1').value = addressLine1;

                // }
               
                if (zipCode == null) {
                    document.getElementById('zipCode').value = "";

                } else {
                    document.getElementById('zipCode').value = zipCode;

                }

                break;
        }
    }
}


//24 hours time dropdown open time
function timeDropdown(){   
    var hours = ['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23']
    var minutes = ['00','05','10','15','20','25','30','35','40','45','50','55']
    for(let i = 0;i<hours.length;i++){
        for(let j = 0;j<minutes.length;j++){
        var select = document.getElementById("openTime");
        let catId = document.getElementById("openTime1").value
            var option = document.createElement("option"),
                txt = document.createTextNode(hours[i] +":"+minutes[j]);
            option.appendChild(txt);
            option.setAttribute("value",hours[i]+":"+minutes[j]);
            option.selected = hours[i]+':'+minutes[j] === catId ? true : false
            select.insertBefore(option, select.lastChild);
        }  
    }
}
//24 hours time dropdown close time
function timeDropdown1(){   
    var hours = ['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23']
    var minutes = ['00','05','10','15','20','25','30','35','40','45','50','55']
    for(let i = 0;i<hours.length;i++){
        for(let j = 0;j<minutes.length;j++){
        var select = document.getElementById("closeTime");
        let catId = document.getElementById("closeTime1").value
            var option = document.createElement("option"),
                txt = document.createTextNode(hours[i] +":"+minutes[j]);
            option.appendChild(txt);
            option.setAttribute("value",hours[i]+":"+minutes[j]);
            option.selected = hours[i]+':'+minutes[j] === catId ? true : false
            select.insertBefore(option, select.lastChild);
        }  
    }
}
