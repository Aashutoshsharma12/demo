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

//list of categories
function category() {
  this.setTimeout(() => {
    document.getElementById('category-nav')?.classList.add("active");
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
        console.log(select, "lll")

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

//Details
function sub_categoryDetails() {
  this.setTimeout(() => {
    document.getElementById('category-nav')?.classList.add("active");
  }, 1500)
  var Id = localStorage.getItem('Id')
  $.ajax({
    url: `${host}/api/v1/admin/itemCategory/getDetails?sub_CategoryId=${Id}`,
    type: 'get',
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Authorization', token);
    },
  }).done(function (data) {
    // If successful
    console.log(data, "ll")
    document.getElementById("storeTypeId1").value = data.data.storeTypeId._id
    document.getElementById("storeTypeId").value = data.data.storeTypeId._id
    document.getElementById("sub_CategoryId").value = data.data._id
    document.getElementById("title").value = data.data.title
    document.getElementById("ar_title").value = data.data.ar_title ? data.data.ar_title : ''

    document.getElementById("blah1").src = data.data.image ? data.data.image : "../../admin/assets/img/emptyphoto.png"
  }).fail(function (jqXHR, textStatus, errorThrown) {
    // If fail
    alert(jqXHR.responseJSON.error)

  })
}