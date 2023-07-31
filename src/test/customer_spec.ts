import chai from "chai";
import { expect } from "chai";
import request from "request";
import { StatusCodes } from "http-status-codes";
import { success } from "../constants"
import exp from "constants";
import { base } from "@models/customer";
const { OK, CREATED } = StatusCodes
var supertest = require('supertest');
var request1 = supertest('http://3.110.75.42:3009');
var base_url = "http://3.110.75.42:3009/api/v1/customer/"
var jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzYzkxY2E2NmE4MWY5Y2E0NzVlNzAyNyIsInJvbGUiOiJDdXN0b21lciIsImlhdCI6MTY3NTY4NDc0MSwiZXhwIjoxNjc4Mjc2NzQxfQ.pTdeH-eJ3DbhWY0kNk-aFQWtxEgdtU054bWEaNbu8gw'

//Customer Authentication
describe('Customer Authentication******************************', () => {
    // describe('customer signup----------------------------', () => {
    //     it('signup api', (done) => {
    //         request.post(base_url + "" + 'auth/sign-up', {
    //             json: true, body: {
    //                 "countryCode": "+91",
    //                 "phoneNumber": "8979012645",
    //                 "role": "Customer",
    //                 "otp": "123456"
    //             }
    //         }, function (err: any, body: any, res: any) {
    //             console.log(res, "res")
    //             expect(res.code).to.be.eq(CREATED);
    //             expect(res.message).to.be.eq(success.en.signupSuccessful);
    //             done();
    //         });
    //     });
    // });
    //Login api
    // describe('customer login----------------------------', () => {
    //     it('login api', (done) => {
    //         request.post(base_url + "" + 'auth/login', {
    //             json: true, body: {
    //                 "countryCode": "+91",
    //                 "phoneNumber": "8979012645",
    //                 "role": "Customer",
    //                 "otp": "123456"
    //             }
    //         }, function (err: any, body: any, res: any) {
    //             expect(res.code).to.be.eq(OK);
    //             expect(res.message).to.be.eq(success.en.loginSuccessful);
    //             done();
    //         });
    //     });
    // });
    //check_account api
    describe('check_account ----------------------------', () => {
        it('check_account api', (done) => {
            request.post(base_url + "" + 'auth/check-account', {
                json: true, body: {
                    "countryCode": "+91",
                    "phoneNumber": "8979012645",
                    "role": "Customer",
                }
            }, function (err: any, body: any, res: any) {
                expect(res.code).to.be.eq(OK);
                expect(res.message).to.be.eq(success.en.accountExists);
                done();
            });
        });
    });
});

//address
describe('Address**********', () => {
    //add address
    describe('address Api----------', () => {
        it('address api', (done) => {
            request.post(base_url + "" + 'address/add', {
                json: true, headers: { 'Authorization': jwt }, body: {
                    "addressLine1": "Homes 121 side raw, Nariman Point12",
                    "addressLine2": "221 Road 211",
                    "city": "Mumbai",
                    "state": "Maharashtra",
                    "zipCode": "400211",
                    "countryCode": "IN",
                    "fullAddress": "Homes 121 side raw, Nariman Point Hapur Pilkhuwa",
                    "googlePlaceId": "ChIJ2dOW9-vR5zsRHvnJHGffkY",
                    "lat": 20.1221,
                    "lng": 21.1221
                }
            },
                function (err: any, body: any, res: any) {
                    expect(res.code).to.be.eq(OK);
                    expect(res.message).to.be.eq(success.en.addressAdded);
                    done();
                });
        });
    });
    //get address
    describe('address details----------', () => {
        it('address details api', (done) => {
            request.get(base_url + "" + 'address/get', {
                json: true, headers: { 'Authorization': jwt }
            },
                function (err: any, body: any, res: any) {
                    expect(res.code).to.be.eq(OK);
                    expect(res.message).to.be.eq(success.en.gotLatestAddress);
                    done();
                });
        });
    });
});

//Home Screen
describe('Home Screen *******************************', () => {
    //offer list
    describe('Offer list ----------------------------', () => {
        it('offer list api', (done) => {
            request.get(base_url + "" + 'offer/offer-list?lat=28.7121526&lng=77.6728374', { json: true, headers: { 'Authorization': jwt, 'timezone': 'Asia/Kolkata' } },
                function (err: any, body: any, res: any) {
                    expect(res.code).to.be.eq(OK);
                    expect(res.message).to.be.eq(success.en.success);
                    done();
                });
        });
    });
    //check offer
    describe('Check offer ----------------------------', () => {
        it('check offer api', (done) => {
            request.get(base_url + "" + 'offer/checkOffer', { json: true, headers: { 'Authorization': jwt, 'timezone': 'Asia/Kolkata' } },
                function (err: any, body: any, res: any) {
                    expect(res.code).to.be.eq(OK);
                    expect(res.message).to.be.eq(success.en.success);
                    done();
                }
            )
        });
    });
    //check order  list
    describe('Check order list ----------------------------', () => {
        it('check oeder list api', (done) => {
            request.get(base_url + "" + 'order/checkOrder', { json: true, headers: { 'Authorization': jwt, 'timezone': 'Asia/Kolkata' } },
                function (err: any, body: any, res: any) {
                    expect(res.code).to.be.eq(OK);
                    expect(res.message).to.be.eq(success.en.recordFetched);
                    done();
                }
            )
        });
    });
    //store type list
    describe('Store type list ----------------------------', () => {
        it('Store type list api', (done) => {
            request.get(base_url + "" + 'home/storeType-list', { json: true, headers: { 'Authorization': jwt, 'timezone': 'Asia/Kolkata' } },
                function (err: any, body: any, res: any) {
                    expect(res.code).to.be.eq(OK);
                    expect(res.message).to.be.eq(success.en.success);
                    done();
                }
            )
        });
    });
});

//Main home screen
describe('Main home screen ****************************************', () => {
    //offer list
    describe('Offer list------------------------------', () => {
        it('offer list api', (done) => {
            request.get(base_url + "" + 'offer/offer-list?storeTypeId=634407b7d43a01c935398589&lat=28.7121526&lng=77.6728374&type=Home', { json: true, headers: { "Authorization": jwt, 'timezone': 'Asia/Kolkata' } },
                function (err: any, body: any, res: any) {
                    expect(res.code).to.be.eq(OK);
                    expect(res.message).to.be.eq(success.en.success);
                    done();
                });
        });
    });
    //category list 
    describe('Category list------------------------------', () => {
        it('category list api', (done) => {
            request.get(base_url + "" + 'home/category-list?storeTypeId=634407b7d43a01c935398589&lat=28.7121526&lng=77.6728374&page=1&perPage=1', { json: true, headers: { "Authorization": jwt, 'timezone': 'Asia/Kolkata' } },
                function (err: any, body: any, res: any) {
                    expect(res.code).to.be.eq(OK);
                    expect(res.message).to.be.eq(success.en.success);
                    done();
                });
        });
    });
    //For searching bar shop list 
    describe('For searching bar shop list------------------------------', () => {
        it('For searching bar shop list api', (done) => {
            request.get(base_url + "" + 'search/vendorShop-list?storeTypeId=634407b7d43a01c935398589&lat=28.7121526&lng=77.6728374&page=1&perPage=1&search=pizz', { json: true, headers: { "Authorization": jwt, 'timezone': 'Asia/Kolkata' } },
                function (err: any, body: any, res: any) {
                    console.log(res, "ldldldd", err, "err")
                    expect(res.code).to.be.eq(OK);
                    expect(res.message).to.be.eq(success.en.success);
                    done();
                });
        });
    });
    //Restaurant list 
    describe('Restaurant list------------------------------', () => {
        it('restaurant list api', (done) => {
            request.get(base_url + "" + 'home/get-restaurant?storeTypeId=634407b7d43a01c935398589&lat=28.7121526&lng=77.6728374&page=1&perPage=1', { json: true, headers: { "Authorization": jwt, 'timezone': 'Asia/Kolkata' } },
                function (err: any, body: any, res: any) {
                    expect(res.code).to.be.eq(OK);
                    expect(res.message).to.be.eq(success.en.recordFetched);
                    done();
                });
        });
    });
    //Search list 
    describe('Search list------------------------------', () => {
        it('search list api', (done) => {
            request.get(base_url + "" + 'home/getSearchData?storeTypeId=634407b7d43a01c935398589&page=1&perPage=1', { json: true, headers: { "Authorization": jwt, 'timezone': 'Asia/Kolkata' } },
                function (err: any, body: any, res: any) {
                    expect(res.code).to.be.eq(OK);
                    expect(res.message).to.be.eq(success.en.success);
                    done();
                });
        });
    });
    // //Search save 
    // describe('Search list------------------------------', () => {
    //     it('search list api', (done) => {
    //         request.get(base_url+""+'home/searchSave?storeTypeId=634407b7d43a01c935398589&title=The Breakfast Clubswe3',{json:true,headers:{"Authorization":jwt,'timezone':'Asia/Kolkata'}},
    //         function(err:any,body:any,res:any){
    //             expect(res.code).to.be.eq(OK);
    //             expect(res.message).to.be.eq(success.en.success);
    //             done();
    //         });
    //     });
    // });
});

//customer details
describe('Customer details ***************************', () => {
    //get profile
    describe('customer details--------------', () => {
        it('customer details Api', (done) => {
            request.get(base_url + "" + 'profile/get', { json: true, headers: { 'Authorization': jwt } },
                function (err: any, body: any, res: any) {
                    expect(res.code).to.be.eq(OK);
                    expect(res.message).to.be.eq(success.en.gotUserProfile);
                    expect(res.data.userData).to.have.property('name');
                    expect(res.data.userData).to.have.property('email');
                    expect(res.data.userData).to.have.property('customerRCId');
                    expect(res.data.userData).to.have.property('countryCode');
                    expect(res.data.userData).to.have.property('phoneNumber');
                    expect(res.data.userData).to.have.property('image');
                    expect(res.data.userData).to.have.property('role');
                    expect(res.data.userData).to.have.property('isAllow_Notification');
                    done();
                });
        });
    });
    //update profile

    describe('update profile--------------', () => {
        it('update profile Api', (done) => {
            request1.put('/api/v1/customer/profile/edit').set('Authorization', jwt).field('name', 'ashu').field('countryCode', '+91').field('phoneNumber', '8979012645').field('email', 'as2@gmail.com')
                .attach('image', '/home/tecorb/Pictures/Screenshot from 2023-02-07 10-52-44.png')
                .end(function (err: any, res: any) {
                    var body = res.body
                    expect(body.code).to.be.eq(OK);
                    expect(body.message).to.be.eq(success.en.updateSuccessful);
                    done();
                });;
        });
    });
});

//menu_list
describe('Menu list*******************************', () => {
    var storeId = "63e22a1310700359a60c0303"
    describe("menu list---------------", () => {
        it('menu_list api', (done) => {
            request.get(base_url + "" + 'menu/store-menu?foodCategoryId=634510ed33a16976037f048c&search=p&storeId=' + "" + storeId, { json: true, headers: { 'Authorization': jwt } },
                function (err: any, body: any, res: any) {
                    console.log(res, "resss")
                    expect(res.code).to.be.eq(OK);
                    expect(res.message).to.be.eq(success.en.success);
                    done();
                });
        });
    });
});

//order module
describe('Order module**********************', () => {
    var storeId = "63e22a1310700359a60c0303"
    var order_id = "63eb315a4dc6875076154f1b"
    //add order
    // describe('order add api--------------------------', () => {
    //     it('order add api', (done) => {
    //         request.post(base_url + "" + "order/add", {
    //             json: true, headers: {
    //                 'Authorization': jwt
    //             }, body: {
    //                 "vendorId": "63e201e456308e332ea75251",
    //                 "storeId": storeId,
    //                 "items": [{
    //                     "itemId": "63e252eb1b22c5442ec21333",
    //                     "perItemPrice": "120",
    //                     "quantity": "1",
    //                 }
    //                 ],
    //                 "totalItems": "1",
    //                 "status": "Pending",
    //                 "statusList": [
    //                     {
    //                         "status": "Pending",
    //                         "dateAndTime": "2022-12-02 11:20",
    //                         "time": "11:20"
    //                     }
    //                 ],
    //                 "description": "hii i am",
    //                 "order_dateTime": "2022-01-12 21:00",
    //                 "order_time": "21:00",
    //                 "order_date": "2022-01-12",
    //                 "couponCode": "23e34",
    //                 "couponCodeAmount": "20",
    //                 "subTotal": "120",
    //                 "taxes_Charges": "2",
    //                 "totalAmount": "102",
    //                 "address": {
    //                     "addressId": "63721e5b9600fae246de9e6f",
    //                     "lat": "20.1221",
    //                     "lng": "21.1221",
    //                     "fullAddress": "Homes 121 side raw, Nariman Point Hapur Pilkhuwa",
    //                     "city": "Mumbai",
    //                     "state": "Maharashtra",
    //                     "zipCode": "40021",
    //                     "addressLine1": "Homes 121 side raw, Nariman Point12"
    //                 }


    //             }
    //         }, function (err: any, body: any, res: any) {
    //             console.log(res, "err")
    //             expect(res.code).to.be.eq(CREATED);
    //             expect(res.message).to.be.eq(success.en.orderAdd);
    //             done();
    //         });
    //     });
    // });

    //edit order
    describe('order edit api--------------------------', () => {
        it('order edit api', (done) => {
            request.post(base_url + "" + "order/edit", {
                json: true, headers: {
                    'Authorization': jwt
                }, body: {
                    "order_id": order_id,
                    "vendorId": "63e201e456308e332ea75251",
                    "storeId": storeId,
                    "items": [{
                        "itemId": "63e252eb1b22c5442ec21333",
                        "perItemPrice": "120",
                        "quantity": "1",
                    }
                    ],
                    "totalItems": "1",
                    "status": "Pending",
                    "statusList": [
                        {
                            "status": "Pending",
                            "dateAndTime": "2022-12-02 11:20",
                            "time": "11:20"
                        }
                    ],
                    "description": "hii i am",
                    "order_dateTime": "2022-01-12 21:00",
                    "order_time": "21:00",
                    "order_date": "2022-01-12",
                    "couponCode": "23e34",
                    "couponCodeAmount": "20",
                    "subTotal": "120",
                    "taxes_Charges": "2",
                    "totalAmount": "102",
                    'pickup_dateTime':"2022-01-12 21:00",
                    "pickup_time":"21:00",
                    "pickup_date":"2022-01-12",
                    "address": {
                        "addressId": "63721e5b9600fae246de9e6f",
                        "lat": "20.1221",
                        "lng": "21.1221",
                        "fullAddress": "Homes 121 side raw, Nariman Point Hapur Pilkhuwa",
                        "city": "Mumbai",
                        "state": "Maharashtra",
                        "zipCode": "40021",
                        "addressLine1": "Homes 121 side raw, Nariman Point12"
                    }
                }
            }, function (err: any, body: any, res: any) {
                expect(res.code).to.be.eq(CREATED);
                expect(res.message).to.be.eq(success.en.orderEdit);
                done();
            });
        });
    });

    //order details
    describe('Order details--------------------------', () => {
        it("order details api", (done) => {
            request.get(base_url + "" + "order/orderDetails/" + "" + order_id, { json: true, headers: { 'Authorization': jwt } },
                function (err: any, body: any, res: any) {
                    expect(res.code).to.be.eq(OK);
                    expect(res.message).to.be.eq(success.en.recordFetched);
                    done();
                });
        });
    });
    //order list
    describe('Order list--------------------------', () => {
        it("order list api", (done) => {
            request.get(base_url + "" + "order/orderList?page=1&perPage=1", { json: true, headers: { 'Authorization': jwt } },
                function (err: any, body: any, res: any) {
                    expect(res.code).to.be.eq(OK);
                    expect(res.message).to.be.eq(success.en.recordFetched);
                    done();
                });
        });
    });
    //re_order details
    describe('reorder details--------------------------', () => {
        it("re_order  api", (done) => {
            request.get(base_url + "" + "order/reorder_details?lat=28.6162976&lng=77.377256&storeId=" + "" + storeId, { json: true, headers: { 'Authorization': jwt, 'timezone': 'Asia/Kolkata' } },
                function (err: any, body: any, res: any) {
                    expect(res.code).to.be.eq(OK);
                    expect(res.message).to.be.eq(success.en.recordFetched);
                    done();
                });
        });
    });
    //time slot
    describe('time slot--------------------------', () => {
        it("time slot api", (done) => {
            request.get(base_url + "" + "order/GetTimeSlot?bookingDate=2023-02-14&storeId=" + "" + storeId, { json: true, headers: { 'Authorization': jwt, 'timezone': 'Asia/Kolkata' } },
                function (err: any, body: any, res: any) {
                    expect(res.code).to.be.eq(OK);
                    expect(res.message).to.be.eq(success.en.recordFetched);
                    done();
                });
        });
    });
    // //update status
    // describe('update order status--------------------------', () => {
    //     it("update order status api", (done) => {
    //         request.put(base_url + "" + "order/updateStatus/" + "" + order_id, {
    //             json: true, headers: { 'Authorization': jwt, 'timezone': 'Asia/Kolkata' }, body: {
    //                 "status": "Pending",
    //                 "dateAndTime": "    -12-02 11:30",
    //                 "time": "11:30"
    //             }
    //         },
    //             function (err: any, body: any, res: any) {
    //                 expect(res.code).to.be.eq(OK);
    //                 expect(res.message).to.be.eq(success.en.success);
    //                 done();
    //             });
    //     });
    // });
});

//favourite Module
describe('Favourite Module***********', () => {
    var storeId = "63e22a1310700359a60c0303"
    var vendorId = "63e201e456308e332ea75251"

    // //add favourite
    // describe('favourite add api-----------------', () => {
    //     it('favourite add Api', (done) => {
    //         request.get(base_url + "" + 'fav/addFavorite?vendorId=' + "" + vendorId + "" + "&storeId=" + "" + storeId, { json: true, headers: { 'Authorization': jwt } },
    //             function (err: any, body: any, res: any) {
    //                 expect(res.code).to.be.eq(OK);
    //                 expect(res.message).to.be.eq(success.en.success);
    //                 done();
    //             });
    //     });
    // });

    //get favourite list
    describe('Favourite list -----------------------', () => {
        it('favourite list api', (done) => {
            request.get(base_url + "" + 'fav/GetFavoriteByUser?page=1&perPage=1&lat=&lng=', { json: true, headers: { 'Authorization': jwt } },
                function (err: any, body: any, res: any) {
                    expect(res.code).to.be.eq(OK);
                    expect(res.message).to.be.eq(success.en.success);
                    done();
                });
        });
    });
});

//Notification module
describe('Notification Module************************', () => {
    describe("notification list -------------------", () => {
        it('notification list api', (done) => {
            request.get(base_url + "" + 'notification/list?phoneNumber=8979012645', { json: true, headers: { 'Authorization': jwt } },
                function (err: any, body: any, res: any) {
                    expect(res.code).to.be.eq(OK);
                    expect(res.message).to.be.eq(success.en.recordFetched);
                    done();
                });
        });
    });
    //get notification
    describe("notification get -------------------", () => {
        it('notification get api', (done) => {
            request.get(base_url + "" + 'notification/get', { json: true, headers: { 'Authorization': jwt } },
                function (err: any, body: any, res: any) {
                    expect(res.code).to.be.eq(OK);
                    expect(res.message).to.be.eq(success.en.success);
                    done();

                });
        });
    });
    //update notification
    describe("notification update -------------------", () => {
        it('notification update api', (done) => {
            request.post(base_url + "" + 'notification/update_status?isAllowNotification=true', { json: true, headers: { 'Authorization': jwt } },
                function (err: any, body: any, res: any) {
                    expect(res.code).to.be.eq(OK);
                    expect(res.message).to.be.eq(success.en.updateStatus);
                    done();

                });
        });
    });
});

//faq module
describe('Faq list************************', () => {
    describe("faq list -------------------", () => {
        it('faq list api', (done) => {
            request.get('http://3.110.75.42:3009/api/v1/common/faq/list?page=1&perPage=1&role=Customer', { json: true, headers: { 'Authorization': jwt } },
                function (err: any, body: any, res: any) {
                    expect(res.code).to.be.eq(OK);
                    expect(res.message).to.be.eq(success.en.recordFetched);
                    done();
                });
        });
    });
});

//report module
describe('Report Module ************************************', () => {
    var storeId = "63e22a1310700359a60c0303"
    //add report
    describe('Add Report---------------------------------', () => {
        it('add report api', (done) => {
            request1.post('/api/v1/common/report/addReport').set('Authorization', jwt).field('description', 'ashu').field('role', 'Customer').field('ar_description', '8979012645').field('storeId', storeId)
                .attach('image', '/home/tecorb/Pictures/Screenshot from 2023-02-07 10-52-44.png')
                .end(function (err: any, res: any) {
                    var body = res.body
                    expect(body.code).to.be.eq(CREATED);
                    expect(body.message).to.be.eq(success.en.issueReported);
                    expect(body.data).to.have.property('description');
                    expect(body.data).to.have.property('status');
                    expect(body.data).to.have.property('issueId');
                    done();
                });;
        });
    });
    //report list
    describe('List Report---------------------------------', () => {
        it('list report api', (done) => {
            request1.get('/api/v1/common/report/list?page=1&perPage=1&role=Customer').set('Authorization', jwt)
                .end(function (err: any, res: any) {
                    var body = res.body
                    expect(body.code).to.be.eq(OK);
                    expect(body.message).to.be.eq(success.en.recordFetched);
                    done();
                });;
        });
    });
});