function faqList(sortName) {
    this.setTimeout(() => {
        document.getElementById('faq-nav')?.classList.add("active");
    }, 1500)
    if (sortName && sortName != '' && sortName != undefined) {
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
    }
    else {
        var sort1 = -1
        localStorage.setItem('sort', sort1)
    }
    var obj = {
        'page': 1,
        'perPage': 10,
        'search': document.getElementById('fog').value,
        'role': document.getElementById('role').value,
        'sort': sort1
    }
    $('#ibox1').children('.ibox-content').toggleClass('sk-loading');
    $.ajax({
        url: `${host}/api/v1/common/faq/faq_List?page=${obj.page}&perPage=${obj.perPage}&search=${obj.search}&role=${obj.role}&sort=${obj.sort}`,
        type: 'Get',
        contentType: 'application/json',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        dataType: 'json',
        success: function (data, status) {
            if (data.code == 200) {
                $('#ibox1').children('.ibox-content').toggleClass('sk-loading');
                $("#page1").show();
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
                            'search': document.getElementById('fog').value,
                            'role': document.getElementById('role').value,
                            'sort': sort1
                        }
                        $('#ibox1').children('.ibox-content').toggleClass('sk-loading');
                        $.ajax({
                            url: `${host}/api/v1/common/faq/faq_List?page=${obj.page}&perPage=${obj.perPage}&search=${obj.search}&role=${obj.role}&sort=${obj.sort}`,
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
                                        if (data.data.items[i].isActive == true) {
                                            var x = 'Deactive'
                                            var y = 'Active'
                                        } else {
                                            var x = 'Active'
                                            var y = 'Deactive'
                                        }
                                        document.getElementById('table').innerHTML += '<tr >' +
                                            '<td >' + index + '<td style="white-space:pre-wrap">' + (data.data.items[i].question) + '<td style="white-space:pre-wrap">' + (data.data.items[i].answer ? data.data.items[i].answer : '---')+'<td style="white-space:pre-wrap">' + (data.data.items[i].role ? data.data.items[i].role : '---') + '<td>' + moment(data.data.items[i].createdAt).format('DD/MM/YYYY') +
                                            '<td> <button  type="button" class="btn btn-sm btn-green" id="Action_button" style="margin: 5px; background-color:#717DBB;"  data-toggle="modal" data-target="#myModal1"   onclick= "view_edit(' + '\'' + data.data.items[i]._id + '\'' + ')">' + 'Edit' + '</button>' +
                                            // '<button type="button" class="btn btn-sm btn-light" style="margin: 5px; background-color:#19AA8D;"  data-toggle="modal" data-target="#myModal2"    onclick= "details(' + '\'' + data.data.items[i]._id + '\'' + ')">' + "View" + '</button>' +
                                            '<button type="button" class="btn btn-sm btn-danger" style="margin: 5px;"  onclick= delete_faq(' + '\'' + data.data.items[i]._id + '\'' + ')>' + "Delete" + '</button></tr>'
                                    }
                                }
                            }
                        })
                        $target.next(".show").text('Current: ' + options.current);
                    }
                })
                $("#table").html(' ');
                for (var i = 0; i < data.data.items.length; i++) {
                    var index = i + 1
                    if (data.data.items[i].isActive == true) {
                        var x = 'Deactive'
                        var y = 'Active'
                    } else {
                        var x = 'Active'
                        var y = 'Deactive'
                    }

                    document.getElementById('table').innerHTML += '<tr >' +
                        '<td >' + index + '<td style="white-space:pre-wrap; width:350px;max-width:350px">' + (data.data.items[i].question) + '<td style="white-space:pre-wrap; width:500px; max-width:500px">' + (data.data.items[i].answer ? data.data.items[i].answer : '---')+'<td style="white-space:pre-wrap">' + (data.data.items[i].role ? data.data.items[i].role : '---') + '<td>' + moment(data.data.items[i].createdAt).format('DD/MM/YYYY') +
                        '<td> <button  type="button" class="btn btn-sm btn-green" id="Action_button" style="margin: 5px; background-color:#717DBB;"  data-toggle="modal" data-target="#myModal1"   onclick= "view_edit(' + '\'' + data.data.items[i]._id + '\'' + ')">' + 'Edit' + '</button>' +
                        // '<button type="button" class="btn btn-sm btn-light" style="margin: 5px; background-color:#19AA8D;"  data-toggle="modal" data-target="#myModal2"    onclick= "details(' + '\'' + data.data.items[i]._id + '\'' + ')">' + "View" + '</button>' +
                        '<button type="button" class="btn btn-sm btn-danger" style="margin: 5px;"  onclick= delete_faq(' + '\'' + data.data.items[i]._id + '\'' + ')>' + "Delete" + '</button></tr>'
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

//add faq
function addFaq() {
    if (!document.getElementById('question').value) {
        alert('Please Enter question (In English)')
    } else if (!document.getElementById('ar_question').value) {
        alert('Please Enter question (In Arabic)')
    } else if (!document.getElementById('answer').value) {
        alert('Please Enter answer (English)')
    } else if (!document.getElementById('ar_answer').value) {
        alert('Please Enter answer (In Arabic)')
    } else {
        const obj = {
            question: document.getElementById('question').value,
            ar_question: document.getElementById('ar_question').value,
            answer: document.getElementById('answer').value,
            ar_answer: document.getElementById('ar_answer').value,
            role: document.getElementById('role12').value,
        }
        $.ajax({
            url: `${host}/api/v1/common/faq/add`,
            type: 'Post',
            data: obj,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', token);
            },
        }).done(function (data) {
            // alert("success")
            window.location.reload()
        }).fail(function (jqXHR, textStatus, errorThrown) {
            // If fail 
                 
            alert(jqXHR.responseJSON.error)
        })
    }

}
//edit faq
function editFaq() {
    if (!document.getElementById('question1').value) {
        alert('Please Enter question (In English)')
    } else if (!document.getElementById('ar_question1').value) {
        alert('Please Enter question (In Arabic)')
    } else if (!document.getElementById('answer1').value) {
        alert('Please Enter answer (In English)')
    } else if (!document.getElementById('ar_answer1').value) {
        alert('Please Enter answer (In Arabic)')
    } else {
        const obj = {
            question: document.getElementById('question1').value,
            ar_question: document.getElementById('ar_question1').value,
            answer: document.getElementById('answer1').value,
            ar_answer: document.getElementById('ar_answer1').value,
            role: document.getElementById('role1').value,
        }
        var id = document.getElementById('id').value
        $.ajax({
            url: `${host}/api/v1/common/faq/edit?faqId=${id}`,
            type: 'Put',
            data: obj,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', token);
            },
        }).done(function (data) {
            window.location.reload()
        }).fail(function (jqXHR, textStatus, errorThrown) {
            // If fail
            alert(jqXHR.responseJSON.error)
        })
    }
}

// faq Details
function view_edit(id) {
    $.ajax({
        url: `${host}/api/v1/common/faq/details?faqId=${id}`,
        type: 'get',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
    }).done(function (data) {
        document.getElementById('question1').value = data.data.response.question;
        document.getElementById('ar_question1').value = data.data.response.ar_question
        document.getElementById('answer1').value = data.data.response.answer
        document.getElementById('ar_answer1').value = data.data.response.ar_answer
        document.getElementById('role1').value = data.data.response.role
        document.getElementById('id').value = data.data.response._id

    }).fail(function (jqXHR, textStatus, errorThrown) {
        // If fail
        alert(jqXHR.responseJSON.error)
    })
}
// faq Details
function details(id) {
    $.ajax({
        url: `${host}/api/v1/common/faq/details?faqId=${id}`,
        type: 'get',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
    }).done(function (data) {
        document.getElementById('question2').value = data.data.response.question;
        document.getElementById('ar_question2').value = data.data.response.ar_question
        document.getElementById('answer2').value = data.data.response.answer
        document.getElementById('ar_answer2').value = data.data.response.ar_answer
        document.getElementById('role2').value = data.data.response.role
    }).fail(function (jqXHR, textStatus, errorThrown) {
        // If fail
        alert(jqXHR.responseJSON.error)
    })
}

// faq Details
function delete_faq(id) {
    swal({
        title: "Are you sure?",
        text: "Ready to Action!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, Take Action!",
        cancelButtonText: "No, leave pls!",
        closeOnConfirm: false,
        closeOnCancel: true
    },
        function (isConfirm) {
            if (isConfirm) {
                $.ajax({
                    url: `${host}/api/v1/common/faq/delete?faqId=${id}`,
                    type: 'delete',
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader('Authorization', token);
                    },
                }).done(function (data) {
                    swal.close();
                    faqList();
                }).fail(function (jqXHR, textStatus, errorThrown) {
                    // If fail
                    alert(jqXHR.responseJSON.error)
                })
            }
            else {
                swal("Cancelled", "Your file is safe :");
            }
        });
}