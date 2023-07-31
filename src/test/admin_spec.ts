import chai from "chai";
import chaiHttp from "chai-http";
chai.use(chaiHttp);
import { expect } from "chai";
import supertest from "supertest";
import request from "request";
var request1 = supertest('http://3.110.75.42:3009');
import { StatusCodes } from "http-status-codes";
import { success } from "../constants";
import { base } from "@models/customer";
import { func } from "joi";
import storeType from "@controllers/admin/storeType";
import user from "@controllers/admin/user";
import exp from "constants";
import { Console } from "console";
const { OK, CREATED } = StatusCodes
var base_url = "http://3.110.75.42:3009/api/v1/admin/"
var jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzNWExMmYxMzJlNmI0YTFiZWE1NjFjZiIsInJvbGUiOiJBZG1pbiIsImlhdCI6MTY3NjQ0ODIwOSwiZXhwIjoxNjc5MDQwMjA5fQ.bXHcqX0qLuqWQcMd_LAvhEhfzSGVE8pkAuKlcPltB9E"

//Admin Authentication ******************************
describe('Admin Authentication ***********************************', () => {
    //lOGIN
    describe('Login-------------------', () => {
        it('login api', (done) => {
            request.post(base_url + "" + 'auth/login', {
                json: true, headers: { 'timezone': 'Asia/Kolkata' }, body: {
                    "password": "123456",
                    "email": "admin@gmail.com"
                }
            },
                function (err: any, body: any, res: any) {
                    expect(res.code).to.be.eq(OK);
                    expect(res.message).to.be.eq(success.en.success);
                    expect(res.data).to.have.property('token');
                    expect(res.data).to.have.property('role');
                    done();
                })
        })
    });
    //change password
    describe('Change Password -------------------', () => {
        it('Change Password api', (done) => {
            request.post(base_url + "" + 'auth/changePassword', {
                json: true, headers: { 'Authorization': jwt, 'timezone': 'Asia/Kolkata' }, body: {
                    "password": "123456",
                    "newPassword": "123456"
                }
            },
                function (err: any, body: any, res: any) {
                    expect(res.code).to.be.eq(OK);
                    expect(res.message).to.be.eq(success.en.success);
                    done();
                })
        })
    });
    //tax charges
    describe('update tax charges-------------', () => {
        it('update tax charges api', (done) => {
            request.post(base_url + "" + 'tax/add', {
                json: true, headers: { 'Authorization': jwt }, body: {
                    'tax': 3
                }
            },
                function (err: any, body: any, res: any) {
                    expect(res.code).to.be.eq(CREATED);
                    expect(res.message).to.be.eq(success.en.success);
                    done();
                })
        })
    })
    //tax charges details
    describe('tax charges details-------------', () => {
        it(' tax charges details api', (done) => {
            request.get(base_url + "" + 'tax/get', {
                json: true, headers: { 'Authorization': jwt }
            },
                function (err: any, body: any, res: any) {
                    expect(res.code).to.be.eq(OK);
                    expect(res.message).to.be.eq(success.en.success);
                    expect(res.data).to.be.property('tax');
                    done();
                })
        })
    })
    //App version
    describe('update app version--------------------', () => {
        it('update app version', (done) => {
            request.put(base_url + "" + 'setting/edit', {
                json: true, headers: { 'Authorization': jwt }, body: {
                    'andriodUserAppUrl': 'xcewdsaZ1',
                    'andriodUserVersion': '1.1.11',
                    'andriodUserUpdate': 'Normal',
                    'iosUserAppUrl': '2ewqsa1',
                    'iosUserVersion': '1.1.01',
                    'iosUserUpdate': 'Normal',
                    'andriodVendorAppUrl': 'wsda1',
                    'andriodVendorVersion': '1.1.11',
                    'andriodVendorUpdate': 'Normal',
                    'iosVendorAppUrl': 'dscxz1',
                    'iosVendorVersion': ' 1.1.01',
                    'iosVendorUpdate': 'Normal',
                    'andriodDoorKeeperAppUrl': '1ddsdsdsds',
                    'andriodDoorKeeperVersion': '1.1.11',
                    'andriodDoorKeeperUpdate': 'Normal',
                    'iosDoorKeeperAppUrl': 'dddsdscdfdf9',
                    'iosDoorKeeperVersion': '1.1.01',
                    'iosDoorKeeperUpdate': 'Normal'
                }
            }, function (err: any, body: any, res: any) {
                expect(res.code).to.be.eq(OK);
                done();
            })
        })
    })
    //App version details
    describe('app version details--------------------', () => {
        it('app version details', (done) => {
            request.get(base_url + "" + 'setting/detail', {
                json: true, headers: { 'Authorization': jwt }
            }, function (err: any, body: any, res: any) {
                expect(res.code).to.be.eq(OK);
                expect(res.data).to.be.property('andriodUserAppUrl');
                expect(res.data).to.be.property('andriodUserVersion');
                expect(res.data).to.be.property('andriodUserUpdate');
                expect(res.data).to.be.property('iosUserAppUrl');
                expect(res.data).to.be.property('iosUserVersion');
                expect(res.data).to.be.property('iosUserUpdate');
                expect(res.data).to.be.property('andriodVendorAppUrl');
                expect(res.data).to.be.property('andriodVendorVersion');
                expect(res.data).to.be.property('andriodVendorUpdate');
                expect(res.data).to.be.property('iosVendorAppUrl');
                expect(res.data).to.be.property('iosVendorVersion');
                expect(res.data).to.be.property('iosVendorUpdate');
                expect(res.data).to.be.property('andriodDoorKeeperAppUrl');
                expect(res.data).to.be.property('andriodDoorKeeperVersion');
                expect(res.data).to.be.property('andriodDoorKeeperUpdate');
                expect(res.data).to.be.property('iosDoorKeeperAppUrl');
                expect(res.data).to.be.property('iosDoorKeeperVersion');
                expect(res.data).to.be.property('iosDoorKeeperUpdate');
                done();
            })
        })
    })

    // //logout
    // describe('Logout-------------------', () => {
    //     it('Logout api', (done) => {
    //         request.get(base_url + "" + 'auth/logout', {
    //             json: true, headers: { 'Authorization': jwt, 'timezone': 'Asia/Kolkata' }
    //         },
    //             function (err: any, body: any, res: any) {
    //                 expect(res.code).to.be.eq(OK);
    //                 expect(res.message).to.be.eq(success.en.success);
    //                 done();
    //             })
    //     })
    // })
});

//Vendor management ***************************
describe('Vendor Management*********************************', () => {
    var storeTypeId = '634407b7d43a01c935398589'
    var status = 'Approved'
    var vendorId = "63ecaa8b4c3b1dde719ffb04"
    var storeId = '63ecaa8b4c3b1dde719ffb07'
    //vendor list
    describe('vendor list-----------------------------', () => {
        it('vendor list api', (done) => {
            request.get(base_url + "" + 'vendor/list?page=1&perPage=1&storeTypeId=' + "" + storeTypeId + '&status=' + "" + status, { json: true, headers: { 'Authorization': jwt, 'timezone': 'Asia/Kolkata' } },
                function (err: any, body: any, res: any) {
                    expect(res.code).to.be.eq(OK);
                    expect(res.message).to.be.eq(success.en.recordFetched);
                    done();
                })
        })
    })
    // //Add vendor
    // describe('Add vendor -----------------------------', () => {
    //     it('add vendor api', (done) => {
    //         request.post(base_url + "" + 'vendor/addVendor', {
    //             json: true, headers: { 'Authorization': jwt, 'timezone': 'Asia/Kolkata' }, body: {
    //                 "storeTypeId": storeTypeId,
    //                 "ownerName": "Vikash",
    //                 "businessName": "Vikash fast food ",
    //                 "ar_businessName": "Vikash fast food ",
    //                 "countryCode": "+91",
    //                 "phoneNumber": "9068217681",
    //                 "countryCodes": "In",
    //                 "password": "Ashu1212@@",
    //                 "fullAddress": "Raghunathpur,Hapur ,Nizampur 245101",
    //                 "addressLine1": "Raghunathpur,Hapur ,Nizampur 245101",
    //                 "state": "Uttar Pradesh",
    //                 "zipCode": "245101",
    //                 "city": "Hapur",
    //                 "country": "India",
    //                 "googlePlaceId": "23443ee",
    //                 "lat": "20.1222",
    //                 "lng": "21.9000",
    //                 "openTime": "10:00",
    //                 "closeTime": "20:00"
    //             }
    //         },
    //             function (err: any, body: any, res: any) {
    //                 expect(res.code).to.be.eq(CREATED);
    //                 expect(res.message).to.be.eq(success.en.success);
    //                 expect(res.data.item).to.have.property('ownerName')
    //                 expect(res.data.item).to.have.property('phoneNumber')
    //                 expect(res.data.item).to.have.property('countryCode')
    //                 expect(res.data.item).to.have.property('role')
    //                 expect(res.data.item).to.have.property('businessName')
    //                 expect(res.data.item).to.have.property('ar_businessName')
    //                 expect(res.data.data).to.have.property('storeTypeId')
    //                 expect(res.data.data).to.have.property('fullAddress')
    //                 expect(res.data.data).to.have.property('lat')
    //                 expect(res.data.data).to.have.property('lng')
    //                 expect(res.data.data).to.have.property('zipCode')
    //                 expect(res.data.data).to.have.property('city')
    //                 expect(res.data.data).to.have.property('state')
    //                 expect(res.data.data).to.have.property('country')
    //                 done();
    //             })
    //     })
    // })
    //Edit vendor
    describe('Edit vendor -----------------------------', () => {
        it('edit vendor api', (done) => {
            request.put(base_url + "" + 'vendor/editVendor', {
                json: true, headers: { 'Authorization': jwt, 'timezone': 'Asia/Kolkata' }, body: {
                    'vendorId': vendorId,
                    "ownerName": "Vikash",
                    "businessName": "Vikash fast food ",
                    "ar_businessName": "Vikash fast food ",
                    "countryCode": "+91",
                    "phoneNumber": "9068217681",
                    "countryCodes": "In",
                    "password": "Ashu1212@@",
                    "fullAddress": "Raghunathpur,Hapur ,Nizampur 245101",
                    "addressLine1": "Raghunathpur,Hapur ,Nizampur 245101",
                    "state": "Uttar Pradesh",
                    "zipCode": "245101",
                    "city": "Hapur",
                    "country": "India",
                    "googlePlaceId": "23443ee",
                    "lat": "20.1222",
                    "lng": "21.9000",
                    "openTime": "10:00",
                    "closeTime": "20:00"
                }
            },
                function (err: any, body: any, res: any) {
                    expect(res.code).to.be.eq(CREATED);
                    expect(res.message).to.be.eq(success.en.success);
                    done();
                })
        })
    })
    //Vendor Details
    describe('Vendor Details-----------------------', () => {
        it('vendor details api', (done) => {
            request.get(base_url + "" + 'vendor/vendorDetails/' + "" + storeId, { json: true, headers: { 'Authorization': jwt } },
                function (err: any, body: any, res: any) {
                    expect(res.code).to.be.eq(OK);
                    expect(res.message).to.be.eq(success.en.success);
                    expect(res.data.response).to.have.property('storeTypeId')
                    expect(res.data.response).to.have.property('image')
                    expect(res.data.response).to.have.property('main_branchName')
                    expect(res.data.response).to.have.property('phoneNoCountryCode')
                    expect(res.data.response).to.have.property('phoneNumber')
                    expect(res.data.response).to.have.property('branchName')
                    expect(res.data.response).to.have.property('fullAddress')
                    expect(res.data.response).to.have.property('city')
                    expect(res.data.response).to.have.property('state')
                    expect(res.data.response).to.have.property('country')
                    expect(res.data.response).to.have.property('rating')
                    expect(res.data).to.have.property('totalOrder')
                    expect(res.data).to.have.property('completeOrder')
                    expect(res.data).to.have.property('In_progressOrder')
                    expect(res.data).to.have.property('cancelledOrder')
                    done();
                })
        })
    })
    //Active Deactive vendor
    describe('Active Deactive vendor----------------', () => {
        it('Active Deactive vendor Api', (done) => {
            request.put(base_url + "" + 'vendor/updateStatus?status=true&vendorId=' + "" + vendorId, {
                json: true, headers: {
                    "Authorization": jwt
                }
            },
                function (err: any, body: any, res: any) {
                    expect(res.code).to.be.eq(OK);
                    expect(res.message).to.be.eq(success.en.success);
                    done();
                })
        })
    })
    //Approved Reject vendor
    describe('Approved Reject vendor ----------------', () => {
        it('Approved Reject vendor Api', (done) => {
            request.put(base_url + "" + 'vendor/update?status=Approved&vendorId=' + "" + vendorId, {
                json: true, headers: {
                    "Authorization": jwt,
                    "timezone": 'Asia/Kolkata'
                }
            },
                function (err: any, body: any, res: any) {
                    expect(res.code).to.be.eq(OK);
                    expect(res.message).to.be.eq(success.en.success);
                    done();
                })
        })
    })
    //Rating 
    describe('Rating vendor store ----------------', () => {
        it('Rating vendor store Api', (done) => {
            request.get(base_url + "" + 'vendor/rating_list?page=1&perPage=1&storeId=' + "" + storeId, {
                json: true, headers: {
                    "Authorization": jwt,
                    "timezone": 'Asia/Kolkata'
                }
            },
                function (err: any, body: any, res: any) {
                    expect(res.code).to.be.eq(OK);
                    expect(res.message).to.be.eq(success.en.recordFetched);
                    done();
                })
        })
    })
});

//User management  *********************************
describe('User Management****************************************', () => {
    var search = 'as'
    var userId = '63dca6b522f6c2edcd19270c'
    var order_id = '63dcabad22f6c2edcd192a25'
    //user list
    describe('User list --------------------------', () => {
        it('user list api', (done) => {
            request.get(base_url + "" + 'user/list?page=1&pageSize=1&isActive=true&search=' + "" + search, { json: true, headers: { 'Authorization': jwt, "timezone": 'Asia/kolkata' } },
                function (err: any, body: any, res: any) {
                    expect(res.code).to.be.eq(OK);
                    expect(res.message).to.be.eq(success.en.success);
                    done();
                })
        })
    })
    //user profile details
    describe('User profile --------------------------', () => {
        it('user profile api', (done) => {
            request.get(base_url + "" + 'user/detail?userId=' + "" + userId, { json: true, headers: { 'Authorization': jwt, "timezone": 'Asia/kolkata' } },
                function (err: any, body: any, res: any) {
                    expect(res.code).to.be.eq(OK);
                    expect(res.message).to.be.eq(success.en.success);
                    expect(res.data.response).to.have.property('name')
                    expect(res.data.response).to.have.property('email')
                    expect(res.data.response).to.have.property('customerRCId')
                    expect(res.data.response).to.have.property('countryCode')
                    expect(res.data.response).to.have.property('phoneNumber')
                    expect(res.data.response).to.have.property('image')
                    expect(res.data.response).to.have.property('role')
                    expect(res.data).to.have.property('pending_queries')
                    expect(res.data).to.have.property('resolve_queries')
                    expect(res.data).to.have.property('complete_order')
                    expect(res.data).to.have.property('cancelled_order')
                    done();
                })
        })
    })
    //user order list
    describe('User order list --------------------------', () => {
        it('user order list api', (done) => {
            request.get(base_url + "" + 'user/orderList?page=1&perPage=1&sort=1&sortName=orderId&userId=' + "" + userId, { json: true, headers: { 'Authorization': jwt, "timezone": 'Asia/kolkata' } },
                function (err: any, body: any, res: any) {
                    expect(res.code).to.be.eq(OK);
                    expect(res.message).to.be.eq(success.en.recordFetched);
                    done();
                })
        })
    })
    //user order status list
    describe('User order status list --------------------------', () => {
        it('user order status list api', (done) => {
            request.get(base_url + "" + 'user/order_statusList?order_id=' + "" + order_id, { json: true, headers: { 'Authorization': jwt, "timezone": 'Asia/kolkata' } },
                function (err: any, body: any, res: any) {
                    expect(res.code).to.be.eq(OK);
                    expect(res.message).to.be.eq(success.en.recordFetched);
                    expect(res.data).to.have.property('storeId');
                    expect(res.data).to.have.property('status');
                    expect(res.data).to.have.property('pickup_dateTime');
                    expect(res.data).to.have.property('statusList');
                    done();
                })
        })
    })
    //user status
    describe('User status--------------------------', () => {
        it('user status  api', (done) => {
            request.put(base_url + "" + 'user/status/' + "" + userId, {
                json: true, headers: { 'Authorization': jwt, "timezone": 'Asia/kolkata' }, body: {
                    "status": true,
                    "userId": userId
                }
            },
                function (err: any, body: any, res: any) {
                    expect(res.code).to.be.eq(OK);
                    expect(res.message).to.be.eq(success.en.success);
                    done();
                })
        })
    })
    // //Delete user
    // describe('Delete User --------------------------', () => {
    //     it('Delete User  api', (done) => {
    //         request.post(base_url + "" + 'user/user-delete', {
    //             json: true, headers: { 'Authorization': jwt, "timezone": 'Asia/kolkata' }, body: {
    //                 "isDelete": true,
    //                 "userId": userId
    //             }
    //         },
    //             function (err: any, body: any, res: any) {
    //                 expect(res.code).to.be.eq(OK);
    //                 expect(res.message).to.be.eq(success.en.success);
    //                 done();
    //             })
    //     })
    // })

    //excel list
    describe('User excel list--------------------------', () => {
        it('User excel list  api', (done) => {
            request.get(base_url + "" + 'user/user-excelData', {
                json: true, headers: { 'Authorization': jwt, "timezone": 'Asia/kolkata' }
            },
                function (err: any, body: any, res: any) {
                    expect(res.code).to.be.eq(OK);
                    expect(res.message).to.be.eq(success.en.success);
                    done();
                })
        })
    })
});

//Order Management**********************************
describe('Order Management***********************************************', () => {
    var status = "Completed"
    var order_id = '63dcabad22f6c2edcd192a25'
    //order list
    describe('Order List----------------', () => {
        it('order list api', (done) => {
            request.get(base_url + "" + 'order/list?page=1&perPage=1&sort=1&sortName=OrderId&status=' + "" + status, { json: true, headers: { 'Authorization': jwt, 'timezone': "Asia/Kolkata" } },
                function (err: any, body: any, res: any) {
                    expect(res.code).to.be.eq(OK);
                    expect(res.message).to.be.eq(success.en.recordFetched);
                    done();
                })
        })
    });
    //order details
    describe('Order details----------------', () => {
        it('order details api', (done) => {
            request.get(base_url + "" + 'order/details/' + "" + order_id, { json: true, headers: { 'Authorization': jwt, 'timezone': "Asia/Kolkata" } },
                function (err: any, body: any, res: any) {
                    expect(res.code).to.be.eq(OK);
                    expect(res.message).to.be.eq(success.en.recordFetched);
                    expect(res.data.response).to.have.property('vendorId');
                    expect(res.data.response).to.have.property('storeId');
                    expect(res.data.response).to.have.property('userId');
                    expect(res.data.response).to.have.property('items');
                    expect(res.data.response).to.have.property('storeTypeId');
                    expect(res.data.response).to.have.property('status');
                    expect(res.data.response).to.have.property('address');
                    expect(res.data.response).to.have.property('order_dateTime');
                    expect(res.data.response).to.have.property('order_date');
                    expect(res.data.response).to.have.property('order_time');
                    expect(res.data.response).to.have.property('totalItems');
                    expect(res.data.response).to.have.property('discount');
                    expect(res.data.response).to.have.property('subTotal');
                    expect(res.data.response).to.have.property('totalAmount');
                    expect(res.data.response).to.have.property('taxes_Charges');
                    expect(res.data.response).to.have.property('taxes_Charges_amount');
                    expect(res.data.response).to.have.property('paymentStatus');
                    expect(res.data.response).to.have.property('paid');
                    done();
                })
        })
    })
});

//Parking Management****************************
describe('Parking management*********************************', () => {
    describe('parking list-------------------------', () => {
        it('parking list api', (done) => {
            request.get(base_url + "" + 'parking/list?page=1&perPage=1', { json: true, headers: { 'Authorization': jwt } },
                function (err: any, body: any, res: any) {
                    expect(res.code).to.be.eq(OK);
                    expect(res.message).to.be.eq(success.en.recordFetched);
                    done();
                });
        });
    });
});

//faq module*************************
describe('Faq Module************************', () => {
    var faqId = '63edfb294c3b1dde71a009e5'
    //faq list
    describe("faq list -------------------", () => {
        it('faq list api', (done) => {
            request.get('http://3.110.75.42:3009/api/v1/common/faq/faq_List?page=1&perPage=1&role=Both', { json: true, headers: { 'Authorization': jwt } },
                function (err: any, body: any, res: any) {
                    expect(res.code).to.be.eq(OK);
                    expect(res.message).to.be.eq(success.en.recordFetched);
                    done();
                });
        });
    });
    // //add faq
    // describe("add faq  -------------------", () => {
    //     it('add faq api', (done) => {
    //         request.post('http://3.110.75.42:3009/api/v1/common/faq/add', {
    //             json: true, headers: { 'Authorization': jwt }, body: {
    //                 "question": "what's your name",
    //                 "answer": "finity",
    //                 "ar_question": "what's your name",
    //                 "ar_answer": "finity",
    //                 "role": "Both"
    //             }
    //         },
    //             function (err: any, body: any, res: any) {
    //                 console.log(res)
    //                 expect(res.code).to.be.eq(CREATED);
    //                 expect(res.message).to.be.eq(success.en.addFaq);
    //                 expect(res.data).to.be.property('question');
    //                 expect(res.data).to.be.property('answer');
    //                 expect(res.data).to.be.property('ar_question');
    //                 expect(res.data).to.be.property('ar_answer');
    //                 expect(res.data).to.be.property('role');
    //                 done();
    //             });
    //     });
    // });
    //edit faq
    describe("edit faq  -------------------", () => {
        it('edit faq api', (done) => {
            request.put('http://3.110.75.42:3009/api/v1/common/faq/edit?faqId=' + "" + faqId, {
                json: true, headers: { 'Authorization': jwt }, body: {
                    "question": "what's your name",
                    "answer": "finity",
                    "ar_question": "what's your name",
                    "ar_answer": "finity",
                    "role": "Both"
                }
            },
                function (err: any, body: any, res: any) {
                    expect(res.code).to.be.eq(CREATED);
                    expect(res.message).to.be.eq(success.en.editFaq);
                    done();
                });
        });
    });
    //get faq
    describe("get faq  -------------------", () => {
        it('get faq api', (done) => {
            request.get('http://3.110.75.42:3009/api/v1/common/faq/details?faqId=' + "" + faqId, { json: true, headers: { 'Authorization': jwt } },
                function (err: any, body: any, res: any) {
                    expect(res.code).to.be.eq(OK);
                    expect(res.message).to.be.eq(success.en.recordFetched);
                    expect(res.data.response).to.be.property('question');
                    expect(res.data.response).to.be.property('answer');
                    expect(res.data.response).to.be.property('ar_question');
                    expect(res.data.response).to.be.property('ar_answer');
                    expect(res.data.response).to.be.property('role');
                    done();
                });
        });
    });
    //  //delete Faq
    //  describe("delete faq  -------------------", () => {
    //     it('delete faq api', (done) => {
    //         request.delete('http://3.110.75.42:3009/api/v1/common/faq/delete?faqId='+""+faqId, { json: true, headers: { 'Authorization': jwt } },
    //             function (err: any, body: any, res: any) {
    //                 expect(res.code).to.be.eq(OK);
    //                 expect(res.message).to.be.eq(success.en.success);
    //                 done();
    //             });
    //     });
    // });
});

//report module**********************
describe('Report Module ************************************', () => {
    //report list
    describe('List Report---------------------------------', () => {
        it('list report api', (done) => {
            request1.get('/api/v1/common/report/report_List?page=1&perPage=1&search=89').set('Authorization', jwt)
                .end(function (err: any, res: any) {
                    var body = res.body
                    expect(body.code).to.be.eq(OK);
                    expect(body.message).to.be.eq(success.en.recordFetched);
                    done();
                });;
        });
    });
    //report details
    describe('Report details---------------------------------', () => {
        it('report details api', (done) => {
            request1.get('/api/v1/common/report/get?reportId=63d767ac8a4e63c5121cb1c5').set('Authorization', jwt)
                .end(function (err: any, res: any) {
                    var body = res.body
                    expect(body.code).to.be.eq(OK);
                    expect(body.message).to.be.eq(success.en.recordFetched);
                    expect(body.data[0]).to.be.property('description');
                    expect(body.data[0]).to.be.property('role');
                    expect(body.data[0]).to.be.property('image');
                    expect(body.data[0]).to.be.property('status');
                    expect(body.data[0]).to.be.property('vendorDetails');
                    expect(body.data[0]).to.be.property('userDetails');
                    done();
                });;
        });
    });
});

//Dashboard
describe('Dashboard*******************************************', () => {
    //Dashboard count
    describe('Dashboard count-------------------------------', () => {
        it('dashboard count api', (done) => {
            request.get(base_url + "" + 'dashboard/details', { json: true, headers: { 'Authorization': jwt, 'timezone': "Asia/Kolkata" } },
                function (err: any, body: any, res: any) {
                    expect(res.code).to.be.eq(OK);
                    expect(res.message).to.be.eq(success.en.recordFetched);
                    expect(res.data.obj).to.have.property('total_Customer');
                    expect(res.data.obj).to.have.property('active_Customer');
                    expect(res.data.obj).to.have.property('inactive_Customer');
                    expect(res.data.obj).to.have.property('total_Vendor');
                    expect(res.data.obj).to.have.property('total_FoodShop');
                    expect(res.data.obj).to.have.property('total_GroceryShop');
                    expect(res.data.obj).to.have.property('total_MeatShop');
                    expect(res.data.obj).to.have.property('total_GroceryShop');
                    expect(res.data.obj).to.have.property('total_StoreType');
                    expect(res.data.obj).to.have.property('total_SubCategory');
                    expect(res.data.obj).to.have.property('total_Orders');
                    expect(res.data.obj).to.have.property('total_CancelledOrders');
                    expect(res.data).to.have.property('total_Payment');
                    done();
                });
        });
    });
    //latest accepted rejected vendor
    describe('latest accepted rejected vendor-------------------------------', () => {
        it('latest accepted rejected vendor api', (done) => {
            request.get(base_url + "" + 'dashboard/list', { json: true, headers: { 'Authorization': jwt, 'timezone': "Asia/Kolkata" } },
                function (err: any, body: any, res: any) {
                    expect(res.code).to.be.eq(OK);
                    expect(res.message).to.be.eq(success.en.recordFetched);
                    done();
                });
        });
    });
    //latest order list
    describe('latest order list-------------------------------', () => {
        it('latest order list api', (done) => {
            request.get(base_url + "" + 'dashboard/latestOrder_list', { json: true, headers: { 'Authorization': jwt, 'timezone': "Asia/Kolkata" } },
                function (err: any, body: any, res: any) {
                    expect(res.code).to.be.eq(OK);
                    expect(res.message).to.be.eq(success.en.recordFetched);
                    done();
                });
        });
    });
    //Graph details
    describe('Graph details-------------------------------', () => {
        it('Graph details api', (done) => {
            request.get(base_url + "" + 'dashboard/graph_Api?type_data=month', { json: true, headers: { 'Authorization': jwt, 'timezone': "Asia/Kolkata" } },
                function (err: any, body: any, res: any) {
                    expect(res.code).to.be.eq(OK);
                    expect(res.message).to.be.eq(success.en.recordFetched);
                    done();
                });
        });
    });
    //profit_details
    describe('profit_details?type=week-------------------------------', () => {
        it('profit_details?type=week api', (done) => {
            request.get(base_url + "" + 'dashboard/profit_details?type=week', { json: true, headers: { 'Authorization': jwt, 'timezone': "Asia/Kolkata" } },
                function (err: any, body: any, res: any) {
                    expect(res.code).to.be.eq(OK);
                    expect(res.message).to.be.eq(success.en.recordFetched);
                    done();
                });
        });
    });
});

//storeType management
describe('Store Type Management ****************************', () => {
    var storeTypeId = "63440972d43a01c93539858e"
    //store type list
    describe('storeType list -----------------------', () => {
        it('store type list api', (done) => {
            request.get(base_url + "" + 'storeType/list?page=1&perPage=10&search=Meat&status=true', { json: true, headers: { 'Authorization': jwt } },
                function (err: any, body: any, res: any) {
                    expect(res.code).to.be.eq(OK);
                    expect(res.message).to.be.eq(success.en.success);
                    done();
                });
        });
    });
    // //add store type 
    // describe('add storeType -----------------------', () => {
    //     it('add store type api', (done) => {
    //         request1.post('/api/v1/admin/storeType/add').set('Authorization', jwt).field('storeType', 'meart1').field('ar_storeType', 'meart1').
    //             attach('image', '/home/tecorb/Pictures/Screenshot from 2023-02-07 10-52-44.png').
    //             end((err: any, res: any) => {
    //                 expect(res.body.code).to.be.eq(CREATED);
    //                 expect(res.body.message).to.be.eq(success.en.success);
    // expect(res.body.data).to.have.property('storeType');
    // expect(res.body.data).to.have.property('ar_storeType');
    // expect(res.body.data).to.have.property('image');
    //                 done();
    //             });
    //     });
    // });

    //edit store type 
    describe('edit storeType -----------------------', () => {
        it('edit store type api', (done) => {
            request1.put('/api/v1/admin/storeType/edit').set('Authorization', jwt).field('storeType', 'Meat').field('ar_storeType', 'Meat').field('storeTypeId', storeTypeId).
                attach('image', '/home/tecorb/Pictures/Screenshot from 2023-02-07 10-52-44.png').
                end((err: any, res: any) => {
                    expect(res.body.code).to.be.eq(OK);
                    expect(res.body.message).to.be.eq(success.en.success);
                    done();
                });
        });
    });
    //get store type 
    describe('get storeType -----------------------', () => {
        it('get store type api', (done) => {
            request1.get('/api/v1/admin/storeType/getDetails?storeTypeId=' + "" + storeTypeId).set('Authorization', jwt).
                end((err: any, res: any) => {
                    expect(res.body.code).to.be.eq(OK);
                    expect(res.body.message).to.be.eq(success.en.success);
                    expect(res.body.data).to.have.property('storeType');
                    expect(res.body.data).to.have.property('ar_storeType');
                    expect(res.body.data).to.have.property('image');
                    done();
                });
        });
    });
    //update status store type 
    describe('update status storeType -----------------------', () => {
        it('update status store type api', (done) => {
            request1.get('/api/v1/admin/storeType/updateStatus?status=true&storeTypeId=' + "" + storeTypeId).set('Authorization', jwt).
                end((err: any, res: any) => {
                    expect(res.body.code).to.be.eq(OK);
                    expect(res.body.message).to.be.eq(success.en.success);
                    done();
                });
        });
    });
    // //delete store type 
    //  describe('delete storeType -----------------------', () => {
    //     it('delete store type api', (done) => {
    //         request1.get('/api/v1/admin/storeType/deleteStore?storeTypeId='+""+storeTypeId).set('Authorization', jwt).
    //             end((err: any, res: any) => {
    //                 expect(res.body.code).to.be.eq(OK);
    //                 expect(res.body.message).to.be.eq(success.en.success);
    //                 done();
    //             });
    //     });
    // });
});

//Cuisine category Management
describe('Cuisine category Management ****************************', () => {
    var storeTypeId = "63440972d43a01c93539858e"
    var cuisineId = '63ef244d4c3b1dde71a014ad'
    //store type list
    describe('Cuisine list -----------------------', () => {
        it('Cuisine list api', (done) => {
            request.get(base_url + "" + 'cuisineCategory/list?page=1&perPage=10&search=&status=true&storeTypeId=' + "" + storeTypeId, { json: true, headers: { 'Authorization': jwt } },
                function (err: any, body: any, res: any) {
                    expect(res.code).to.be.eq(OK);
                    expect(res.message).to.be.eq(success.en.success);
                    done();
                });
        });
    });
    // //add Cuisine
    // describe('add Cuisine -----------------------', () => {
    //     it('add Cuisine api', (done) => {
    //         request1.post('/api/v1/admin/cuisineCategory/add').set('Authorization', jwt).field('title', 'meart11').field('ar_title', 'meart11').field('storeTypeId', storeTypeId).
    //             attach('image', '/home/tecorb/Pictures/Screenshot from 2023-02-07 10-52-44.png').
    //             end((err: any, res: any) => {
    //                 console.log(res)
    //                 expect(res.body.code).to.be.eq(OK);
    //                 expect(res.body.message).to.be.eq(success.en.success);
    //                 expect(res.body.data).to.have.property('title');
    //                 expect(res.body.data).to.have.property('ar_title');
    //                 expect(res.body.data).to.have.property('image');
    //                 done();
    //             });
    //     });
    // });

    //edit Cuisine
    describe('edit Cuisine -----------------------', () => {
        it('edit Cuisine api', (done) => {
            request1.post('/api/v1/admin/cuisineCategory/edit').set('Authorization', jwt).field('title', 'Meat').field('ar_title', 'Meat').field('storeTypeId', storeTypeId).field('cuisineId', cuisineId).
                attach('image', '/home/tecorb/Pictures/Screenshot from 2023-02-07 10-52-44.png').
                end((err: any, res: any) => {
                    expect(res.body.code).to.be.eq(OK);
                    expect(res.body.message).to.be.eq(success.en.success);
                    done();
                });
        });
    });
    //get store type 
    describe('get Cuisine -----------------------', () => {
        it('get Cuisine api', (done) => {
            request1.get('/api/v1/admin/cuisineCategory/get?cuisineId=' + "" + cuisineId).set('Authorization', jwt).
                end((err: any, res: any) => {
                    expect(res.body.code).to.be.eq(OK);
                    expect(res.body.message).to.be.eq(success.en.success);
                    expect(res.body.data).to.have.property('title');
                    expect(res.body.data).to.have.property('storeTypeId');
                    expect(res.body.data).to.have.property('ar_title');
                    expect(res.body.data).to.have.property('image');
                    done();
                });
        });
    });
    //update status Cuisine 
    describe('update status Cuisine -----------------------', () => {
        it('update status Cuisine api', (done) => {
            request1.get('/api/v1/admin/cuisineCategory/updateStatus?status=true&cuisineId=' + "" + cuisineId).set('Authorization', jwt).
                end((err: any, res: any) => {
                    expect(res.body.code).to.be.eq(OK);
                    expect(res.body.message).to.be.eq(success.en.success);
                    done();
                });
        });
    });
    // //delete Cuisine 
    //  describe('delete Cuisine -----------------------', () => {
    //     it('delete store type api', (done) => {
    //         request1.delete('/api/v1/admin/cuisineCategory/delete?cuisineId='+""+cuisineId).set('Authorization', jwt).
    //             end((err: any, res: any) => {
    //                 expect(res.body.code).to.be.eq(OK);
    //                 expect(res.body.message).to.be.eq(success.en.success);
    //                 done();
    //             });
    //     });
    // });
});

//Item category Management
describe('Item category Management ****************************', () => {
    var storeTypeId = "63440972d43a01c93539858e"
    var sub_CategoryId = '63c794b7f06bfc9b2cde640c'

    //store type list
    describe('Item list -----------------------', () => {
        it('Item list api', (done) => {
            request.get(base_url + "" + 'itemCategory/list?page=1&perPage=10&search=&status=true&storeTypeId=' + "" + storeTypeId, { json: true, headers: { 'Authorization': jwt } },
                function (err: any, body: any, res: any) {
                    expect(res.code).to.be.eq(OK);
                    expect(res.message).to.be.eq(success.en.success);
                    done();
                });
        });
    });
    // //add Item
    // describe('add Item -----------------------', () => {
    //     it('add Item api', (done) => {
    //         request1.post('/api/v1/admin/itemCategory/add').set('Authorization', jwt).field('title', 'meart11').field('ar_title', 'meart11').field('storeTypeId', storeTypeId).
    //             attach('image', '/home/tecorb/Pictures/Screenshot from 2023-02-07 10-52-44.png').
    //             end((err: any, res: any) => {
    //                 console.log(res)
    //                 expect(res.body.code).to.be.eq(OK);
    //                 expect(res.body.message).to.be.eq(success.en.success);
    //                 expect(res.body.data).to.have.property('title');
    //                 expect(res.body.data).to.have.property('ar_title');
    //                 expect(res.body.data).to.have.property('image');
    //                 done();
    //             });
    //     });
    // });

    //edit Item
    describe('edit Item -----------------------', () => {
        it('edit Item api', (done) => {
            request1.put('/api/v1/admin/itemCategory/edit').set('Authorization', jwt).field('title', 'meart1').field('ar_title', 'meart1').field('storeTypeId', storeTypeId).field('sub_CategoryId', sub_CategoryId).
                attach('image', '/home/tecorb/Pictures/Screenshot from 2023-02-07 10-52-44.png').
                end((err: any, res: any) => {
                    expect(res.body.code).to.be.eq(OK);
                    expect(res.body.message).to.be.eq(success.en.success);
                    done();
                });
        });
    });
    //get store type 
    describe('get Item -----------------------', () => {
        it('get Item api', (done) => {
            request1.get('/api/v1/admin/itemCategory/getDetails?sub_CategoryId=' + "" + sub_CategoryId).set('Authorization', jwt).
                end((err: any, res: any) => {
                    expect(res.body.code).to.be.eq(OK);
                    expect(res.body.message).to.be.eq(success.en.success);
                    expect(res.body.data).to.have.property('title');
                    expect(res.body.data).to.have.property('storeTypeId');
                    expect(res.body.data).to.have.property('ar_title');
                    expect(res.body.data).to.have.property('image');
                    done();
                });
        });
    });
    //update status Item 
    describe('update status Item -----------------------', () => {
        it('update status Item api', (done) => {
            request1.get('/api/v1/admin/itemCategory/updateStatus?status=true&sub_CategoryId=' + "" + sub_CategoryId).set('Authorization', jwt).
                end((err: any, res: any) => {
                    expect(res.body.code).to.be.eq(OK);
                    expect(res.body.message).to.be.eq(success.en.success);
                    done();
                });
        });
    });
    // //delete Item 
    //  describe('delete Item -----------------------', () => {
    //     it('delete store type api', (done) => {
    //         request1.get('/api/v1/admin/itemCategory/delete_subCategory?sub_CategoryId='+""+sub_CategoryId).set('Authorization', jwt).
    //             end((err: any, res: any) => {
    //                 expect(res.body.code).to.be.eq(OK);
    //                 expect(res.body.message).to.be.eq(success.en.success);
    //                 done();
    //             });
    //     });
    // });
});

//Offer Management
describe('Offer Management*************************************', () => {
    var addBy = 'Admin'
    var offerId = '63ef2e5e4c3b1dde71a017f8'
    var storeTypeId = "63440972d43a01c93539858e"

    //offer list
    describe('Offer list------------------', () => {
        it('offer list', (done) => {
            request.get(base_url + "" + 'offer/list?page=1&perPage=1&search=&addBy=' + "" + addBy, { json: true, headers: { 'Authorization': jwt, "timezone": "Asia/Kolkata" } },
                function (err: any, body: any, res: any) {
                    expect(res.code).to.be.eq(OK);
                    expect(res.message).to.be.eq(success.en.recordFetched);
                    done();
                });
        });
    });
    // //add offer
    // describe('Add Offer------------------', () => {
    //     it('add offer', (done) => {
    //         request.post(base_url + "" + 'offer/add', {
    //             json: true, headers: { 'Authorization': jwt }, body: {
    //                 'storeId':["639c6d1535d6b493d9b2528d"],
    //                 'storeTypeId':"63440972d43a01c93539858e",
    //                 'addBy': "Admin",
    //                 'image': "",
    //                 'couponCode': "qasqdwxsz11",
    //                 'title': "OFFER",
    //                 'description': "OFFER",
    //                 'offer_type': "Percentage",
    //                 'offer_amount': 11,
    //                 'startDate': "2023-02-17T00:00:00.000Z",
    //                 'ar_title': "OFFER",
    //                 'ar_description': "OFFER",
    //                 'minimum_amount': 300,
    //                 'upto_Amount': 234,
    //                 'expiryDate': "2023-02-28"
    //             }
    //         },
    //             function (err: any, body: any, res: any) {
    //                 console.log(res)
    //                 expect(res.code).to.be.eq(CREATED);
    //                 expect(res.message).to.be.eq(success.en.OffersAdd);
    //                 expect(res.data).to.have.property('storeId');
    //                 expect(res.data).to.have.property('storeTypeId');
    //                 expect(res.data).to.have.property('addBy');
    //                 expect(res.data).to.have.property('image');
    //                 expect(res.data).to.have.property('couponCode');
    //                 expect(res.data).to.have.property('title');
    //                 expect(res.data).to.have.property('description');
    //                 expect(res.data).to.have.property('offer_type');
    //                 expect(res.data).to.have.property('offer_amount');
    //                 expect(res.data).to.have.property('startDate');
    //                 expect(res.data).to.have.property('ar_title');
    //                 expect(res.data).to.have.property('ar_description');
    //                 expect(res.data).to.have.property('minimum_amount');
    //                 expect(res.data).to.have.property('upto_Amount');
    //                 expect(res.data).to.have.property('expiryDate');
    //                 done();
    //             });
    //     });
    // });

    //edit offer
    describe('Edit Offer------------------', () => {
        it('edit offer', (done) => {
            request.put(base_url + "" + 'offer/edit/' + "" + offerId, {
                json: true, headers: { 'Authorization': jwt }, body: {
                    'storeId': ["639c6d1535d6b493d9b2528d"],
                    'storeTypeId': "63440972d43a01c93539858e",
                    'addBy': "Admin",
                    'image': "",
                    'couponCode': "qasqdwxsz11",
                    'title': "OFFER",
                    'description': "OFFER",
                    'offer_type': "Percentage",
                    'offer_amount': 11,
                    'startDate': "2023-02-17T00:00:00.000Z",
                    'ar_title': "OFFER",
                    'ar_description': "OFFER",
                    'minimum_amount': 300,
                    'upto_Amount': 234,
                    'expiryDate': "2023-02-28"
                }
            },
                function (err: any, body: any, res: any) {
                    expect(res.code).to.be.eq(CREATED);
                    expect(res.message).to.be.eq(success.en.OffersEdit);
                    done();
                });
        });
    });
    // offer details
    describe('Offer details------------------', () => {
        it('Offer details', (done) => {
            request.get(base_url + "" + 'offer/get/' + "" + offerId, {
                json: true, headers: { 'Authorization': jwt }
            },
                function (err: any, body: any, res: any) {
                    expect(res.code).to.be.eq(OK);
                    expect(res.message).to.be.eq(success.en.recordFetched);
                    expect(res.data).to.have.property('storeId');
                    expect(res.data).to.have.property('storeTypeId');
                    expect(res.data).to.have.property('addBy');
                    expect(res.data).to.have.property('image');
                    expect(res.data).to.have.property('couponCode');
                    expect(res.data).to.have.property('title');
                    expect(res.data).to.have.property('description');
                    expect(res.data).to.have.property('offer_type');
                    expect(res.data).to.have.property('offer_amount');
                    expect(res.data).to.have.property('startDate');
                    expect(res.data).to.have.property('ar_title');
                    expect(res.data).to.have.property('ar_description');
                    expect(res.data).to.have.property('minimum_amount');
                    expect(res.data).to.have.property('upto_Amount');
                    expect(res.data).to.have.property('expiryDate');
                    done();
                });
        });
    });

    // // offer delete
    // describe('Offer delete------------------', () => {
    //     it('Offer delete', (done) => {
    //         request.delete(base_url + "" + 'offer/delete/' + "" + offerId, {
    //             json: true, headers: { 'Authorization': jwt }
    //         },
    //             function (err: any, body: any, res: any) {
    //                 expect(res.code).to.be.eq(OK);
    //                 expect(res.message).to.be.eq(success.en.offerDelete);
    //                 done();
    //             });
    //     });
    // });
    // store list
    describe('store list------------------', () => {
        it('store list', (done) => {
            request.get(base_url + "" + 'offer/storeList?storeTypeId=' + "" + storeTypeId, {
                json: true, headers: { 'Authorization': jwt }
            },
                function (err: any, body: any, res: any) {
                    expect(res.code).to.be.eq(OK);
                    expect(res.message).to.be.eq(success.en.recordFetched);
                    done();
                });
        });
    });
});

//Sub_Admin Management
describe('Sub_Admin Management****************************', () => {
    var sub_AdminId = '63ef47504c3b1dde71a01a97'
    //sub_Admin list
    describe('sub_admin list', () => {
        it('sub_admin list api', (done) => {
            request.get(base_url + "" + 'sub_Admin/list?page=1&perPage=1&search=8&status=true', { json: true, headers: { 'Authorization': jwt } },
                function (err: any, body: any, res: any) {
                    expect(res.code).to.be.eq(OK);
                    expect(res.message).to.be.eq(success.en.recordFetched);
                    done();
                });
        });
    });
    // //add Sub_Admin
    // describe('Add sub_admin ', () => {
    //     it('Add sub_admin api', (done) => {
    //         request.post(base_url + "" + 'sub_Admin/add_subAdmin', {
    //             json: true, headers: { 'Authorization': jwt }, body: {
    //                 "name": "Deepanshu",
    //                 "email": "deep12022@gmail.com",
    //                 "password": "12345",
    //                 "confirmPassword": "12345",
    //                 "phoneNumber": "8765420201",
    //                 "countryCode": "+91",
    //                 "isActive": true,
    //                 "permission": ["Dashboard"]
    //             }
    //         },
    //             function (err: any, body: any, res: any) {
    //                 expect(res.code).to.be.eq(CREATED);
    //                 expect(res.message).to.be.eq(success.en.success);
    //                 expect(res.data).to.be.property('name');
    //                 expect(res.data).to.be.property('email');
    //                 expect(res.data).to.be.property('password');
    //                 expect(res.data).to.be.property('confirmPassword');
    //                 expect(res.data).to.be.property('countryCode');
    //                 expect(res.data).to.be.property('permission');
    //                 expect(res.data).to.be.property('isActive');
    //                 done();
    //             });
    //     });
    // });
    //edit Sub_Admin
    describe('Edit sub_admin ', () => {
        it('Edit sub_admin api', (done) => {
            request.put(base_url + "" + 'sub_Admin/edit_subAdmin', {
                json: true, headers: { 'Authorization': jwt }, body: {
                    "name": "Deepanshu",
                    "email": "deep22@gmail.com",
                    "phoneNumber": "8765420201",
                    "countryCode": "+91",
                    "isActive": true,
                    "permission": ["Dashboard"],
                    "subAdminId": sub_AdminId
                }
            },
                function (err: any, body: any, res: any) {
                    expect(res.code).to.be.eq(OK);
                    expect(res.message).to.be.eq(success.en.success);
                    done();
                });
        });
    });
    //details Sub_Admin
    describe('Details sub_admin ', () => {
        it('Details sub_admin api', (done) => {
            request.get(base_url + "" + 'sub_Admin/details/' + "" + sub_AdminId, {
                json: true, headers: { 'Authorization': jwt }
            },
                function (err: any, body: any, res: any) {

                    expect(res.code).to.be.eq(OK);
                    expect(res.message).to.be.eq(success.en.recordFetched);
                    expect(res.data).to.be.property('name');
                    expect(res.data).to.be.property('email');
                    expect(res.data).to.be.property('countryCode');
                    expect(res.data).to.be.property('permission');
                    expect(res.data).to.be.property('isActive');
                    done();
                });
        });
    });
    //update Sub_Admin status
    describe('Update sub_admin status ', () => {
        it('Update sub_admin status api', (done) => {
            request.get(base_url + "" + 'sub_Admin/updateStatus/' + "" + sub_AdminId, {
                json: true, headers: { 'Authorization': jwt }
            },
                function (err: any, body: any, res: any) {
                    expect(res.code).to.be.eq(OK);
                    expect(res.message).to.be.eq(success.en.updateStatus);
                    done();
                });
        });
    });
});

//Notification Management
describe('Notification Management*************************', () => {
    var role = 'Both'
    //notification list
    describe('Notification List------------------------------', () => {
        it('Notification list api', (done) => {
            request.get(base_url + "" + '/notification/adminSend-notificationList?page=1&pageSize=10&date=22/02/2223&role=' + "" + role, { json: true, headers: { 'Authorization': jwt, 'timezone': 'Asia/Kolkata' } },
                function (err: any, body: any, res: any) {
                    expect(res.code).to.be.eq(OK);
                    expect(res.message).to.be.eq(success.en.recordFetched);
                    done();
                });
        });
    });
    //Send Notification Bulk and single
    describe('Send Notification ------------------------------', () => {
        it('Send Notification api', (done) => {
            request1.post('/api/v1/admin/notification/sendNotification').set('Authorization', jwt).set('timezone', 'Asia/Kolkata').field({'phoneNumber':'8979012645','title':"notification",'ar_title':'Notification','description':"Notification",'ar_description':'Notification','sendBy':"Single"}).
                end((err: any, res: any) => {
                    expect(res.body.code).to.be.eq(OK);
                    expect(res.body.message).to.be.eq(success.en.success);
                    expect(res.body.data.response).to.be.property('title');
                    expect(res.body.data.response).to.be.property('ar_title');
                    expect(res.body.data.response).to.be.property('phoneNumber');
                    expect(res.body.data.response).to.be.property('description');
                    expect(res.body.data.response).to.be.property('image');
                    expect(res.body.data.response).to.be.property('sendBy');
                    expect(res.body.data.response).to.be.property('notificationTime');
                    expect(res.body.data.response).to.be.property('notification_dateTime');
                    expect(res.body.data.response).to.be.property('notificationDate');
                    expect(res.body.data.response).to.be.property('sendFrom');
                    expect(res.body.data.response).to.be.property('sendTo');
                    done();
                });
        });
    });
});



