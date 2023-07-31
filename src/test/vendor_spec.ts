import * as chai from 'chai';
// const chaiHttp = require('chai-http')
import chaiHttp from 'chai-http'
import chaiAsPromised from 'chai-as-promised';
import { expect, assert } from 'chai'
chai.use(chaiHttp)
// import 'mocha';
import axios from 'axios';
var request = require("request");
import { success } from "../constants";
import { StatusCodes } from "http-status-codes";
import { func } from 'joi';
var fs = require('fs');
const { CREATED, OK } = StatusCodes
var supertest = require('supertest');

// console.log(process.env['BASE_URL'],"llddl",process.env.CLOUD_NAME,';;l',process.env.MONGO_URI)
var request1 = supertest('http://3.110.75.42:3009');
var base_url = "http://3.110.75.42:3009/api/v1/vendor/"
var jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZTIwMWU0NTYzMDhlMzMyZWE3NTI1MSIsInJvbGUiOiJWZW5kb3IiLCJpYXQiOjE2NzU3NjE2NjAsImV4cCI6MTY3ODM1MzY2MH0.AeM4pj4EQNdS_Bnfrm5w5dNWrY1OkA4g55w5f5UWiE4"

//vendor Authentication
describe('Vendor Authentication **********************************', () => {
    const countryCode = "+91"
    const phoneNumber = "9000190126"
    const role = "Vendor"
    const ownerName = "Punit sharma"
    const ar_businessName = "Punit sharma"
    const businessName = "Food valley(First)"
    const password = "1234"
    const acceptTerms_Condition = true//sign up
    // describe('Signup-------------------', () => {
    //     it("signup APi", (done) => {
    //         request.post(base_url + "" + "auth/sign-up", {
    //             json: true, body: {
    //                 "countryCode": countryCode,
    //                 "phoneNumber": phoneNumber,
    //                 "role": role,
    //                 "ownerName": ownerName,
    //                 "ar_businessName": ar_businessName,
    //                 "businessName": businessName,
    //                 "password": password,
    //                 "acceptTerms_Condition": acceptTerms_Condition
    //             }
    //         }, function (error: any, body: any, res: any) {
    //             expect(res.message).to.be.equal(success.en.signupSuccessful);
    //             expect(res.code).to.be.equal(CREATED);
    //             expect(res.data).to.include.all.keys('token', 'isUser',
    //                 'storeType',
    //                 'isVerified',
    //                 'phoneNumber',
    //                 'countryCode',
    //                 'ownerName',
    //                 'businessName',
    //                 '_id');
    //             done();
    //         });
    //     });
    // });
    //login
    describe('Login---------------------', () => {
        it("login APi", (done) => {
            // request1(io).post('/vendor/auth/login', {
            request.post(base_url + "" + "auth/login", {
                json: true, body: {
                    "countryCode": countryCode,
                    "phoneNumber": phoneNumber,
                    "role": role,
                    "password": password
                }
            }, function (error: any, body: any, res: any) {
                expect(res.message).to.be.equal(success.en.loginSuccessful);
                expect(res.code).to.be.equal(OK);
                expect(res.data).to.include.all.keys('token', 'isUser',
                    'storeType',
                    'isVerified',
                    'storeTypeId',
                    'storeId',
                    '_id'
                );
                done();
            }, 10000);
        });
    });
    //check-account
    describe('Check-Account--------------', () => {
        it("check-account APi", (done) => {
            request.post(base_url + "" + "auth/check-account", {
                json: true, body: {
                    "countryCode": countryCode,
                    "phoneNumber": phoneNumber,
                    "role": role
                }
            }, function (error: any, body: any, res: any) {
                // expect(res.message).to.be.equal(success.en.ac);
                expect(res.code).to.be.equal(OK);
                expect(res.data).to.include.all.keys('isUser');
                done();
            });
        });
    });
    //reset_password
    describe('Reset_Password--------------', () => {
        it("reset password Api", (done) => {
            request.put(base_url + "" + "auth/resetPassword", {
                json: true, body: {
                    "countryCode": countryCode,
                    "phoneNumber": phoneNumber,
                    "newPassword": "1234",
                    "confirmPassword": "1234"
                }
            }, function (error: any, body: any, res: any) {
                expect(res.message).to.be.equal(success.en.success);
                expect(res.code).to.be.equal(OK);
                done();
            });
        });
    });
    //change-password
    describe('Change_Password-------------', () => {
        it("change password Api", (done) => {
            request.put(base_url + "" + "auth/changePassword", {
                json: true, headers: { 'Authorization': jwt }, body: {
                    "oldPassword": password,
                    "newPassword": "1234",
                    "confirmPassword": "1234"
                }
            }, function (error: any, body: any, res: any) {
                expect(res.message).to.be.equal(success.en.updatePassword);
                expect(res.code).to.be.equal(OK);
                done();
            });
        });
    });
    //logout
    // describe('Logout', () => {
    //     it("logout APi", (done) => {
    //         request.get(base_url + "" + "auth/logout", {
    //             json: true, headers: { 'Authorization': jwt }
    //         }, function (error: any, body: any, res: any) {
    //             expect(res.message).to.be.equal(success.en.logOutSuccessful);
    //             expect(res.code).to.be.equal(OK);
    //             expect(res.data).to.include.all.keys('success');
    //             done();
    //         });
    //     });
    // });
});

//vendor store
describe('Vendor Store *********************************************', () => {
    var fullAddress = "Pilkhuwa Hapur Ghaziabad near nizampur India"
    var streetAddress = "Hapur"
    var countryCode = "In"
    var state = "Uttar Pradesh"
    var addressLine1 = " nizampur"
    var addressLine2 = "nizampur hapur"
    var city = "hapur"
    var zipCode = "245101"
    var lat = "12.223"
    var lng = "20.433"
    var googlePlaceId = "345tef6yh"
    var notes = "hii brkjdc"
    var storeTypeId = "63440972d43a01c93539858e"
    var branchName = "Vinay shop"
    var phoneNoCountryCode = "+91"
    var phoneNumber = "9087655678"
    var email = "as12@gmail.com"
    var ar_branchName = "Vinay shop"
    var branchId = "63e22a1310700359a60c0303"
    //add Store Main branch
    // describe('Add Store (Main Branch)', () => {
    //     it("add store APi", (done) => {
    //         request.post(base_url + "" + "vendor_store/add", {
    //             json: true, headers: { 'Authorization': jwt }, body: {
    //                 "fullAddress": fullAddress,
    //                 "streetAddress": streetAddress,
    //                 "countryCode": countryCode,
    //                 "state": state,
    //                 "addressLine1": addressLine1,
    //                 "addressLine2": addressLine2,
    //                 "city": city,
    //                 "zipCode": zipCode,
    //                 "lat": lat,
    //                 "lng": lng,
    //                 "googlePlaceId": googlePlaceId,
    //                 "notes": notes,
    //                 "storeTypeId": storeTypeId
    //             }
    //         }, function (error: any, body: any, res: any) {
    //             expect(res.message).to.be.equal(success.en.storeAdd);
    //             expect(res.code).to.be.equal(CREATED);
    //             done();
    //         });
    //     });
    // });
    //add  branch
    // describe('Add Branch--------------', () => {
    //     it("add branch Api", (done) => {
    //         request.post(base_url + "" + "vendor_store/add_branch", {
    //             json: true, headers: { 'Authorization': jwt }, body: {
    //                 "fullAddress": fullAddress,
    //                 "countryCode": countryCode,
    //                 "state": state,
    //                 "addressLine1": addressLine1,
    //                 "addressLine2": addressLine2,
    //                 "city": city,
    //                 "zipCode": zipCode,
    //                 "lat": lat,
    //                 "lng": lng,
    //                 "googlePlaceId": googlePlaceId,
    //                 "phoneNoCountryCode": phoneNoCountryCode,
    //                 "email": email,
    //                 "phoneNumber": phoneNumber,
    //                 "branchName": branchName,
    //                 "ar_branchName": ar_branchName,
    //                 "isActive": true
    //             }
    //         }, function (error: any, body: any, res: any) {
    //             expect(res.message).to.be.equal(success.en.branchAdd);
    //             expect(res.code).to.be.equal(CREATED);
    //             done();
    //         });
    //     });
    // });
    //Edit branch
    describe('Edit Branch----------------', () => {
        it("edit branch Api", (done) => {
            request.put(base_url + "" + "vendor_store/editBranch?branch_Id=" + "" + branchId, {
                json: true, headers: { 'Authorization': jwt }, body: {
                    "fullAddress": fullAddress,
                    "countryCode": countryCode,
                    "state": state,
                    "addressLine1": addressLine1,
                    "addressLine2": addressLine2,
                    "city": city,
                    "zipCode": zipCode,
                    "lat": lat,
                    "lng": lng,
                    "googlePlaceId": googlePlaceId,
                    "phoneNoCountryCode": phoneNoCountryCode,
                    "email": email,
                    "phoneNumber": phoneNumber,
                    "branchName": branchName,
                    "ar_branchName": ar_branchName,
                    "isActive": true
                }
            }, function (error: any, body: any, res: any) {
                expect(res.message).to.be.equal(success.en.branchEdit);
                expect(res.code).to.be.equal(CREATED);
                done();
            });
        });
    });
    //Branch details
    describe('Branch Details-------------', () => {
        it("branch details Api", (done) => {
            request.get(base_url + "" + "vendor_store/branchDetails/" + "" + branchId, {
                json: true, headers: { 'Authorization': jwt }
            }, function (error: any, body: any, res: any) {
                expect(res.message).to.be.equal(success.en.recordFetched);
                expect(res.code).to.be.equal(OK);
                expect(res.data).to.have.property('storeTypeId');
                expect(res.data).to.have.property('store_openClosing_time');
                expect(res.data).to.have.property('branchId');
                expect(res.data).to.have.property('image');
                expect(res.data).to.have.property('phoneNoCountryCode');
                expect(res.data).to.have.property('phoneNumber');
                expect(res.data).to.have.property('branchName');
                expect(res.data).to.have.property('ar_branchName');
                expect(res.data).to.have.property('fullAddress');
                expect(res.data).to.have.property('lat');
                expect(res.data).to.have.property('lng');
                done();
            });
        });
    });
    //Branch list
    describe('Branch List-----------', () => {
        it("branch list Api", (done) => {
            request.get(base_url + "" + "vendor_store/listOf_branch", {
                json: true, headers: { 'Authorization': jwt }
            }, function (error: any, body: any, res: any) {
                expect(res.message).to.be.equal(success.en.recordFetched);
                expect(res.code).to.be.equal(OK);
                done();
            });
        });
    });
    //Branch status update
    describe('Update Status Branch-------------', () => {
        it("Update Status Api", (done) => {
            request.get(base_url + "" + "vendor_store/update_status?branch_id=" + "" + branchId + "&isActive=" + "" + true, {
                json: true, headers: { 'Authorization': jwt }
            }, function (error: any, body: any, res: any) {
                expect(res.message).to.be.equal(success.en.branchstatus);
                expect(res.code).to.be.equal(OK);
                done();
            });
        });
    });
});

//Menu Items
describe('Menu Items Module ***************************************', () => {
    const storeTypeId = "63440972d43a01c93539858e"
    const foodCategoryId = "6345113c33a16976037f049c"
    const itemCategoryId = "639ac64c160b110f85b7d73a"
    const cuisineCategoryId = "639ac410160b110f85b7d5c3"
    const itemName = "a11q1www1cc"
    const amount = "100"
    // const image = "https://res.cloudinary.com/tecorbssvan/image/upload/v1671087120/tlbptvekgq8buuk7pmel.jpg"
    const description = "Itemqqqww1"
    const preparationTime = '30'
    const storeId = "63e22a1310700359a60c0303"
    const recommended = 'false'
    const ar_description = "Item"
    const ar_itemName = "Item"
    const itemId = "63e34ea07a9cd2ea6aead1c3"
    // //add menu item
    // describe('Add Menu Item -------------------------------', function () {
    //     // it('add menu_item', (done) => {
    //     var body = {
    //         'storeTypeId': storeTypeId,
    //         'foodCategoryId': foodCategoryId,
    //         'itemCategoryId': itemCategoryId,
    //         'cuisineCategoryId': cuisineCategoryId,
    //         'itemName': itemName,
    //         'amount': amount,
    //         'description': description,
    //         'preparationTime': preparationTime,
    //         'storeId': storeId,
    //         'recommended': recommended,
    //         'ar_description': ar_description,
    //         'ar_itemName': ar_itemName
    //     }
    //     it('add menu items', async (done) => {
    //         request1.post('/api/v1/vendor/vendor_menuItems/add').set('Authorization', jwt).field(body)
    //             // .field('extra_info', '{"in":"case you want to send json along with your file"}')
    //             .attach('image', '/home/tecorb/Pictures/Screenshot from 2023-02-07 10-52-44.png')
    //             .end(function (err: any, res: any) {
    //                 console.log(err, ";;lll", res.body, "[[]")
    //                 var body = res.body
    //                 expect(body.code).to.be.eq(CREATED);
    //                 expect(body.message).to.be.eq(success.en.ItemsAdd);
    //                 done();
    //             });
    //     });
    // });
    //edit menu item
    describe('Edit Menu Item -------------------------------', function () {
        // it('add menu_item', (done) => {
        var body = {
            'storeTypeId': storeTypeId,
            'foodCategoryId': foodCategoryId,
            'itemCategoryId': itemCategoryId,
            'cuisineCategoryId': cuisineCategoryId,
            'itemName': itemName,
            'amount': amount,
            'description': description,
            'preparationTime': preparationTime,
            'storeId': storeId,
            'recommended': recommended,
            'ar_description': ar_description,
            'ar_itemName': ar_itemName
        }
        it('edit menu items', (done) => {
            request1.put('/api/v1/vendor/vendor_menuItems/edit?itemId=' + "" + itemId).set('Authorization', jwt).field(body)
                // .field('extra_info', '{"in":"case you want to send json along with your file"}')
                .attach('image', '/home/tecorb/Pictures/Screenshot from 2023-02-07 10-52-44.png')
                .end(function (err: any, res: any) {
                    var body = res.body
                    expect(body.code).to.be.eq(CREATED);
                    expect(body.message).to.be.eq(success.en.ItemsUpda);
                    done();
                });
        });
    });

    //item wdetails
    describe('Item Detaills ---------', () => {
        it('item details api', (done) => {
            request.get(base_url + "" + "vendor_menuItems/get?itemId=" + "" + itemId, { json: true, headers: { 'Authorization': jwt } },
                function (err: any, body: any, res: any) {
                    expect(res.code).to.be.eq(OK)
                    expect(res.message).to.be.eq(success.en.recordFetched)
                    expect(res.data).to.have.property('storeTypeId');
                    expect(res.data).to.have.property('itemCategoryId');
                    expect(res.data).to.have.property('foodCategoryId');
                    expect(res.data).to.have.property('cuisineCategoryId');
                    expect(res.data).to.have.property('itemName');
                    expect(res.data).to.have.property('ar_itemName');
                    expect(res.data).to.have.property('amount');
                    expect(res.data).to.have.property('recommended');
                    expect(res.data).to.have.property('description');
                    expect(res.data).to.have.property('ar_description');
                    expect(res.data).to.have.property('image');
                    expect(res.data).to.have.property('preparationTime');
                    done();
                });
        });
    });
    //item list
    describe('Item List ---------', () => {
        it('item list api', (done) => {
            request.get(base_url + "" + "vendor_menuItems/list?storeId=" + "" + storeId, { json: true, headers: { 'Authorization': jwt } },
                function (err: any, body: any, res: any) {
                    expect(res.code).to.be.eq(OK)
                    expect(res.message).to.be.eq(success.en.recordFetched)
                    done();
                });
        });
    });
    //update status
    describe('Update Status ---------', () => {
        it('update status api', (done) => {
            request.get(base_url + "" + "vendor_menuItems/update?isActive=true&itemId=" + "" + itemId, { json: true, headers: { 'Authorization': jwt } },
                function (err: any, body: any, res: any) {
                    expect(res.code).to.be.eq(OK)
                    expect(res.message).to.be.eq(success.en.ItemsUpda)
                    done();
                });
        });
    });
    // describe('Delete Item ---------', () => {
    //     it('delete item api', (done) => {
    //         request.delete(base_url + "" + "vendor_menuItems/delete_items/"+""+itemId, { json: true, headers: { 'Authorization': jwt } },
    //             function (err: any, body: any, res: any) {
    //                 console.log(res,"dkdkd")
    //                 expect(res.code).to.be.eq(OK)
    //                 expect(res.message).to.be.eq(success.en.menuItemDelete)
    //                 done();
    //             });
    //     });
    // });
    //cusine category APi
    describe('Cuisine list ---------', () => {
        it('cuisine list api', (done) => {
            request.get(base_url + "" + "vendor_menuItems/cusinecategoriesList?storeTypeId=" + "" + storeTypeId, { json: true, headers: { 'Authorization': jwt } },
                function (err: any, body: any, res: any) {
                    expect(res.code).to.be.eq(OK)
                    expect(res.message).to.be.eq(success.en.recordFetched)
                    done();
                });
        });
    });
    // item category Api
    describe('Item_category list ---------', () => {
        it('item_category list api', (done) => {
            request.get(base_url + "" + "vendor_menuItems/itemcategoriesList?page=1&perPage=1&storeTypeId=" + "" + storeTypeId, { json: true, headers: { 'Authorization': jwt } },
                function (err: any, body: any, res: any) {
                    expect(res.code).to.be.eq(OK)
                    expect(res.message).to.be.eq(success.en.recordFetched)
                    done();
                });
        });
    });
    //Food category APi
    describe('Food_category list ---------', () => {
        it('food_category list api', (done) => {
            request.get(base_url + "" + "vendor_menuItems/foodCategoryList", { json: true, headers: { 'Authorization': jwt } },
                function (err: any, body: any, res: any) {
                    expect(res.code).to.be.eq(OK)
                    expect(res.message).to.be.eq(success.en.recordFetched)
                    done();
                });
        });
    });
});

//Offer module
describe('Offer Module **********************************************', () => {
    const storeId = "63e22a1310700359a60c0303"
    const offerId = "63e48365d79addb4beed1df9"
    //offer list
    describe('Offer list ----------------', () => {
        it('offer list api', (done) => {
            request.get(base_url + "" + 'offer/list?page=1&perPage=1&storeId=' + "" + storeId, { json: true, headers: { 'Authorization': jwt, 'timezone': 'Asia/Calcutta' } },
                function (err: any, body: any, res: any) {
                    expect(res.code).to.be.eq(OK);
                    expect(res.message).to.be.eq(success.en.recordFetched);
                    done();
                });
        });
    });
    //offer details
    describe('Offer Details ----------------', () => {
        it('offer details api', (done) => {
            request.get(base_url + "" + 'offer/get/' + "" + offerId, { json: true, headers: { 'Authorization': jwt } },
                function (err: any, body: any, res: any) {
                    expect(res.code).to.be.eq(OK);
                    // assert.equal(res.code,'3030',"LOOOOO------")
                    expect(res.message).to.be.eq(success.en.recordFetched);
                    expect(res.data).to.have.property('storeTypeId');
                    expect(res.data).to.have.property('storeId');
                    expect(res.data).to.have.property('addBy');
                    expect(res.data).to.have.property('couponCode');
                    expect(res.data).to.have.property('title');
                    expect(res.data).to.have.property('description');
                    expect(res.data).to.have.property('offer_type');
                    expect(res.data).to.have.property('offer_amount');
                    expect(res.data).to.have.property('startDate');
                    expect(res.data).to.have.property('ar_title');
                    expect(res.data).to.have.property('image');
                    expect(res.data).to.have.property('ar_description');
                    expect(res.data).to.have.property('expiryDate');
                    done();
                });
        });
    });
    //update offer status 
    describe('Update Offer Status----------------', () => {
        it('update offer status api', (done) => {
            request.put(base_url + "" + 'offer/update_status?isActive=true&offerId=' + "" + offerId, { json: true, headers: { 'Authorization': jwt, 'timezone': 'Asia/Kolkata' } },
                function (err: any, body: any, res: any) {
                    expect(res.code).to.be.eq(CREATED);
                    // assert.equal(res.code,'3030',"LOOOOO------")
                    expect(res.message).to.be.eq(success.en.OffersEdit);
                    done();
                });
        });
    });
    // //delete offer 
    //   describe('Delete Offer  ----------------', () => {
    //     it('delete offer api', (done) => {
    //         request.delete(base_url + "" + 'offer/delete/' + "" + storeId, { json: true, headers: { 'Authorization': jwt } },
    //             function (err: any, body: any, res: any) {
    //                 expect(res.code).to.be.eq(OK);
    //                 // assert.equal(res.code,'3030',"LOOOOO------")
    //                 expect(res.message).to.be.eq(success.en.offerDelete);
    //                 done();
    //             });
    //     });
    // });
});

//item_size
describe('Item_Size Module **********************************************', () => {
    const itemId = "63e34ea07a9cd2ea6aead1c3"
    const item_size = "Quarter1"
    const amount = "20"
    var ar_item_size = 'Quarter'
    const itemSizeId = "63e38184967a0f2f19a24252"
    const storeId = "63e22a1310700359a60c0303"

    // //add item size
    // describe('item_size Add ----------------', () => {
    //     it('add item_size api', (done) => {
    //         request.post(base_url + "" + 'vendor_itemSize/add', {
    //             json: true, headers: { 'Authorization': jwt }, body: {
    //                 "itemId": itemId,
    //                 "item_size": item_size,
    //                 "ar_item_size": ar_item_size,
    //                 "amount": amount
    //             }
    //         },
    //             function (err: any, body: any, res: any) {
    //                 console.log(res, "ress")
    //                 expect(res.code).to.be.eq(CREATED);
    //                 expect(res.message).to.be.eq(success.en.AddItem_size);
    //                 done();
    //             });
    //     });
    // });
    //edit item size
    describe('Edit item_size ----------------', () => {
        it('edit item size api', (done) => {
            request.put(base_url + "" + 'vendor_itemSize/edit?itemSizeId=' + "" + itemSizeId, {
                json: true, headers: { 'Authorization': jwt }, body: {
                    "itemId": itemId,
                    "item_size": item_size,
                    "ar_item_size": ar_item_size,
                    "amount": amount
                }
            },
                function (err: any, body: any, res: any) {
                    expect(res.code).to.be.eq(CREATED);
                    expect(res.message).to.be.eq(success.en.updItemSize);
                    done();
                });
        });
    });
    //item size details
    describe('Item size details----------------', () => {
        it('item size details api', (done) => {
            request.get(base_url + "" + 'vendor_itemSize/get?itemSizeId=' + "" + itemSizeId, { json: true, headers: { 'Authorization': jwt } },
                function (err: any, body: any, res: any) {
                    expect(res.data).to.have.property('userId');
                    expect(res.data).to.have.property('itemId');
                    expect(res.data).to.have.property('item_size');
                    expect(res.data).to.have.property('ar_item_size');
                    expect(res.data).to.have.property('amount');
                    expect(res.code).to.be.eq(OK);
                    expect(res.message).to.be.eq(success.en.recordFetched);
                    done();
                });
        });
    });
    //item size LIST
    describe('Item size List ---------------', () => {
        it('item size list api', (done) => {
            request.get(base_url + "" + 'vendor_itemSize/list?page=1&perPage=1&itemId=' + "" + itemId, { json: true, headers: { 'Authorization': jwt } },
                function (err: any, body: any, res: any) {
                    expect(res.code).to.be.eq(OK);
                    expect(res.message).to.be.eq(success.en.recordFetched);
                    done();
                });
        });
    });
    //update item size  status
    describe('Update Item size Status ---------------', () => {
        it('update item size status api', (done) => {
            request.get(base_url + "" + 'vendor_itemSize/update?isActive=true&itemSizeId=' + "" + itemSizeId, { json: true, headers: { 'Authorization': jwt } },
                function (err: any, body: any, res: any) {
                    expect(res.code).to.be.eq(OK);
                    expect(res.message).to.be.eq(success.en.updItemSize);
                    done();
                });
        });
    });
    // //delete item size 
    //   describe('Delete Item Size  ----------------', () => {
    //     it('delete Item Size api', (done) => {
    //         request.delete(base_url + "" + 'vendor_itemSize/delete_itemSize/' + "" + storeId, { json: true, headers: { 'Authorization': jwt } },
    //             function (err: any, body: any, res: any) {
    //                 expect(res.code).to.be.eq(OK);
    //                 // assert.equal(res.code,'3030',"LOOOOO------")
    //                 expect(res.message).to.be.eq(success.en.offerDelete);
    //                 done();
    //             });
    //     });
    // });
});

//order Module
describe('Order module ******************', () => {
    var storeId = "63e22a1310700359a60c0303"
    var orderId = '6399aa1d42784439752fc561'
    //order list
    describe('Order list ------------------------', () => {
        it('order list api', (done) => {
            request.get(base_url + "" + "order/list?page=1&perPage=1&type=Pending&storeId=" + "" + storeId, { json: true, headers: { 'Authorization': jwt } },
                function (err: any, body: any, res: any) {
                    expect(res.code).to.be.eq(OK);
                    expect(res.message).to.be.eq(success.en.recordFetched)
                    done()
                }
            )
        });
    });

    //order details
    describe('Order details ------------------------', () => {
        it('order details api', (done) => {
            request.get(base_url + "" + "order/details?orderId=" + "" + orderId, { json: true, headers: { 'Authorization': jwt, 'timezone': 'Asia/kolkata' } },
                function (err: any, body: any, res: any) {
                    expect(res.data).to.have.property('address');
                    expect(res.data).to.have.property('storeId');
                    expect(res.data).to.have.property('orderId');
                    expect(res.data).to.have.property('userId');
                    expect(res.data).to.have.property('vendorId');
                    expect(res.data).to.have.property('items');
                    expect(res.data).to.have.property('totalItems');
                    expect(res.data).to.have.property('description');
                    expect(res.code).to.be.eq(OK);
                    expect(res.message).to.be.eq(success.en.recordFetched)
                    done();
                }
            )
        });
    });
    //update order status
    describe('Update Order status ------------------------', () => {
        it('order details api', (done) => {
            request.put(base_url + "" + "order/update?status=Pending&orderId=" + "" + orderId, { json: true, headers: { 'Authorization': jwt, 'timezone': "Asia/Kolkata" } },
                function (err: any, body: any, res: any) {
                    expect(res.code).to.be.eq(OK);
                    expect(res.message).to.be.eq(success.en.success)
                    done()
                }
            )
        });
    });
    //sacn order 
    // describe('Scan Order  ------------------------', () => {
    //    it('scan order  api', (done) => {
    //       request.get(base_url + "" + "order/scan_QRcode?orderId=" + "" + orderId, { json: true, headers: { 'Authorization': jwt } },
    //          function (err: any, body: any, res: any) {
    //             console.log(res,"ll;;")
    //             expect(res.code).to.be.eq(OK);
    //             expect(res.message).to.be.eq(success.en.success)
    //             done()
    //          }
    //       )
    //    });
    // });
});

//Addons Type
describe('Addons Type module *********', () => {
    const title = 'Pepperoni white'
    const ar_title = "Pepperoni White"
    const storeId = "63e22a1310700359a60c0303"
    const addons_typeId = "63e4ef83da6f15c8a93d1ee1"
    // describe('Add addons type  ------------------', () => {
    //    it('add addons type Api', (done) => {
    //       request.post(base_url + "" + 'addons_type/add', {
    //          json: true, headers: { 'Authorization': jwt }, body: {
    //             "title": title,
    //             "ar_title": ar_title,
    //             "storeId": storeId,
    //             "isActive": true
    //          }
    //       }, function (err: any, body: any, res: any) {
    //          console.log(res,"res")
    //          expect(res.code).to.be.eq(CREATED);
    //          expect(res.message).to.be.eq(success.en.addons_type)
    //          done();
    //       }
    //       )
    //    });
    // });
    //edit addons type
    describe('Edit addons type  ------------------', () => {
        it('edit addons type Api', (done) => {
            request.put(base_url + "" + 'addons_type/edit/' + "" + addons_typeId + "?title=" + "" + title + "&storeId=" + "" + storeId, {
                json: true, headers: { 'Authorization': jwt }
            }, function (err: any, body: any, res: any) {
                expect(res.code).to.be.eq(CREATED);
                expect(res.message).to.be.eq(success.en.addons_typeEdit)
                done();
            }
            )
        });
    });
    //details addons type
    describe('Details addons type  ------------------', () => {
        it('details addons type Api', (done) => {
            request.get(base_url + "" + 'addons_type/get/' + "" + addons_typeId, {
                json: true, headers: { 'Authorization': jwt }
            }, function (err: any, body: any, res: any) {
                expect(res.code).to.be.eq(OK);
                expect(res.message).to.be.eq(success.en.recordFetched)
                done();
            }
            )
        });
    });
    // addons type list
    describe('Addons type  list ------------------', () => {
        it('addons type list Api', (done) => {
            request.get(base_url + "" + 'addons_type/list?isActive=true&storeId=' + "" + storeId, {
                json: true, headers: { 'Authorization': jwt }
            }, function (err: any, body: any, res: any) {
                expect(res.code).to.be.eq(OK);
                expect(res.message).to.be.eq(success.en.recordFetched)
                done();
            }
            )
        });
    });
});

//Addons
describe('Addons Module ***********************************', () => {
    const itemId = "63e34ea07a9cd2ea6aead1c3"
    const storeId = "63e22a1310700359a60c0303"
    const addons_typeId = "63e4ef83da6f15c8a93d1ee1"
    const addonsId = "63e4f73cda6f15c8a93d225b"
    // //add addons
    // describe('Add addons --------------------------', () => {
    //    it('add addons api', (done) => {
    //       request.post(base_url + "" + "addons/add", {
    //          json: true, headers: { 'Authorization': jwt }, body: {
    //             "itemId": itemId,
    //             "addons_typeId": addons_typeId,
    //             "title": "Onion Slice1",
    //             "ar_title": "Onion Slice1",
    //             "amount": "30"
    //          }
    //       }, function (err: any, body: any, res: any) {
    //          console.log(res, "addons")
    //          expect(res.code).to.be.eq(CREATED);
    //          expect(res.message).to.be.eq(success.en.addonsAdd)
    //          done();
    //       });
    //    });
    // });
    //edit addons
    describe('Edit addons --------------------------', () => {
        it('edit addons api', (done) => {
            request.put(base_url + "" + "addons/edit/" + "" + addonsId, {
                json: true, headers: { 'Authorization': jwt }, body: {
                    "itemId": itemId,
                    "addons_typeId": addons_typeId,
                    "title": "Onion Slice1",
                    "ar_title": "Onion Slice1",
                    "amount": "30"
                }
            }, function (err: any, body: any, res: any) {
                assert.equal(res.code, CREATED)
                assert.equal(res.message, success.en.addonsEdit)
                done();
            });
        });
    });
    //addons details
    describe('Addons Details --------------------------', () => {
        it('addons details api', (done) => {
            request.get(base_url + "" + "addons/get/" + "" + addonsId, { json: true, headers: { 'Authorization': jwt } },
                function (err: any, body: any, res: any) {
                    expect(res.data).to.have.property('addons_typeId');
                    expect(res.data).to.have.property('ar_title');
                    expect(res.data).to.have.property('title');
                    expect(res.data).to.have.property('userId');
                    expect(res.data).to.have.property('itemId');
                    expect(res.data).to.have.property('amount');
                    assert.equal(res.code, OK)
                    assert.equal(res.message, success.en.recordFetched);
                    done();
                });
        });
    });
    //Addons List
    describe('Addons list --------------------------', () => {
        it('Addons list api', (done) => {
            request.get(base_url + "" + "addons/list?itemId=" + "" + itemId, { json: true, headers: { 'Authorization': jwt } },
                function (err: any, body: any, res: any) {
                    assert.equal(res.code, OK)
                    assert.equal(res.message, success.en.recordFetched);
                    done();
                });
        });
    });
    //update addons status
    describe('Addons status --------------------------', () => {
        it('addons  status api', (done) => {
            request.get(base_url + "" + "addons/update/" + "" + addonsId + "?isActive=true", {
                json: true, headers: { 'Authorization': jwt }
            },
                function (err: any, body: any, res: any) {
                    assert.equal(res.code, OK)
                    assert.equal(res.message, success.en.addonsEdit);
                    done();
                });
        });
    });
    // //delete addons
    // describe('Addons delete --------------------------', () => {
    //    it('addons  delete api', (done) => {
    //       request.delete(base_url + "" + "addons/delete_addons/" + "" + itemId, {
    //          json: true, headers: { 'Authorization': jwt }
    //       },
    //          function (err: any, body: any, res: any) {
    //             console.log(res,"delete")
    //             assert.equal(res.code,OK)
    //             assert.equal(res.message,success.en.addondelete);
    //             done();
    //          });
    //    });
    // });
});

//timing module
describe('Timing module*****************************', () => {
    const storeId = "63e22a1310700359a60c0303"
    //Add Timing
    describe('Add timing', () => {
        it('add timing api', (done) => {
            request.post(base_url + "" + 'timing/add', {
                json: true, headers: { 'Authorization': jwt }, body: {
                    "Monday": {
                        "openingTime": "12:21",
                        "closingTime": "23:21"
                    },
                    "Tuesday": {
                        "openingTime": "08:20",
                        "closingTime": "21:10"
                    },
                    "Wednesday": {
                        "openingTime": "01:20",
                        "closingTime": "22:10"
                    },
                    "Thursday": {
                        "openingTime": "01:20",
                        "closingTime": "11:10"
                    },
                    "Friday": {
                        "openingTime": "01:20",
                        "closingTime": "11:10"
                    },
                    "Saturday": {
                        "openingTime": "01:20",
                        "closingTime": "11:10"
                    },
                    "Sunday": {
                        "openingTime": "11:21",
                        "closingTime": "12:11"
                    },
                    "storeId": storeId
                }
            }, function (err: any, body: any, res: any) {
                expect(res.code).to.be.eq(CREATED);
                expect(res.message).to.be.eq(success.en.success);
                done();
            });
        });
    });
    //details
    describe('Timing Details', () => {
        it('timing details api', (done) => {
            request.get(base_url + "" + 'timing/get?storeId=' + "" + storeId, { json: true, headers: { 'Authorization': jwt } }, function (err: any, body: any, res: any) {
                expect(res.code).to.be.eq(OK);
                expect(res.message).to.be.eq(success.en.recordFetched)
                expect(res.data).to.include.all.keys('Monday', 'Tuesday',
                    'Wednesday',
                    'Thursday',
                    'Friday',
                    'Saturday',
                    'Sunday', '_id', 'userId', 'storeId', 'createdAt', 'updatedAt'
                );
                done();
            });
        });
    });
});

//Gallery module
describe('Gallery module*****************************', () => {
    //add image
    const storeId = "63e22a1310700359a60c0303"

    describe('Add image  -------------------------------', function () {
        var body = {
            'storeId': storeId
        }
        it('add image', (done) => {
            request1.post('/api/v1/vendor/gallery/add').set('Authorization', jwt).field(body)
                // .field('extra_info', '{"in":"case you want to send json along with your file"}')
                .attach('image', '/home/tecorb/Pictures/Screenshot from 2023-02-07 10-52-44.png')
                .end(function (err: any, res: any) {
                    var body = res.body
                    expect(body.code).to.be.eq(CREATED);
                    expect(body.message).to.be.eq(success.en.ImageAdd);
                    done();
                });
        });
    });
    describe('List of image---------------------', () => {
        it('image list api', (done) => {
            request.get(base_url + "" + 'gallery/imageList?page=1&perPage=1&storeId=' + "" + storeId, {
                json: true, headers: { 'Authorization': jwt }
            }, function (err: any, body: any, res: any) {
                expect(res.code).to.be.eq(OK);
                expect(res.message).to.be.eq(success.en.recordFetched);
                done();
            });
        });
    });
    // //details
    // describe('delete image-----------------', () => {
    //     it('image delete api', (done) => {
    //         request.delete(base_url + "" + 'gallery/delete_image?storeId=' + "" + storeId, {
    //             json: true, headers: { 'Authorization': jwt }, body: {
    //                 "type": "All",
    //                 "storeId": storeId
    //             }
    //         }, function (err: any, body: any, res: any) {
    //             console.log(res, "list")
    //             expect(res.code).to.be.eq(OK);
    //             expect(res.message).to.be.eq(success.en.imageDelete)

    //             done();
    //         });
    //     });
    // });
});

//faq module
describe('Faq list************************', () => {
    describe("faq list -------------------", () => {
        it('faq list api', (done) => {
            request.get('http://3.110.75.42:3009/api/v1/common/faq/list?page=1&perPage=1&role=Vendor', { json: true, headers: { 'Authorization': jwt } },
                function (err: any, body: any, res: any) {
                    expect(res.code).to.be.eq(OK);
                    expect(res.message).to.be.eq(success.en.recordFetched);
                    done();
                });
        });
    });
});

//Notification module
describe('Notification Module************************', () => {
    describe("notification list -------------------", () => {
        it('notification list api', (done) => {
            request.get(base_url + "" + 'notification/list?phoneNumber=9000190126', { json: true, headers: { 'Authorization': jwt } },
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

//Dashboard
describe('Dashboard ****************************', () => {
    const storeId = "63e22a1310700359a60c0303"
    describe('Dashboard Api-------------------', () => {
        it('dashboard api', (done) => {
            request.get(base_url + "" + 'dashBoard/get?storeId=' + "" + storeId, { json: true, headers: { 'Authorization': jwt } },
                function (err: any, body: any, res: any) {
                    expect(res.code).to.be.eq(OK);
                    expect(res.message).to.be.eq(success.en.recordFetched);
                    expect(res.data).to.have.property('branchId')
                    expect(res.data).to.have.property('image')
                    expect(res.data).to.have.property('ar_branchName')
                    expect(res.data).to.have.property('main_branchName')
                    expect(res.data).to.have.property('online_status')
                    expect(res.data).to.have.property('totalEarning')
                    expect(res.data).to.have.property('totalOrder')
                    expect(res.data).to.have.property('completedOrder')
                    expect(res.data).to.have.property('cancelledOrder')
                    expect(res.data).to.have.property('liveOrderCOunt')
                    expect(res.data).to.have.property('menuItem_count')
                    expect(res.data).to.have.property('offerCount')
                    done();
                });
        });
    });
    //online status api
    describe('Online status Api-------------------', () => {
        it('Online status api', (done) => {
            request.get(base_url + "" + 'dashBoard/update_status?online_status=true&storeId=' + "" + storeId, { json: true, headers: { 'Authorization': jwt } },
                function (err: any, body: any, res: any) {
                    expect(res.code).to.be.eq(OK);
                    expect(res.message).to.be.eq(success.en.success);
                    done();
                });
        });
    });
    //Earning api
    describe('Earning Api-------------------', () => {
        it('Earning api', (done) => {
            request.get(base_url + "" + 'earning/list?page=1&perPage=1&startDate=2023-01-01&endDate=2023-11-11&storeId=' + "" + storeId, { json: true, headers: { 'Authorization': jwt } },
                function (err: any, body: any, res: any) {
                    expect(res.code).to.be.eq(OK);
                    expect(res.message).to.be.eq(success.en.recordFetched);
                    done();
                });
        });
    });
});

// //Add doorkeeper
// describe('Add doorkeeper *************************', () => {
//     describe('add api---', () => {
//         it('add doorkeeper api', (done) => {
//             request.post(base_url + "" + 'addDoor_Keeper/add', {
//                 json: true, headers: { 'Authorization': jwt }, body: {
//                     "name": "Aashu",
//                     "countryCode": "+91",
//                     "password": "12345",
//                     "phoneNumber": "8979012641",
//                     "role": "DoorKeeper"
//                 }
//             }, function (err: any, body: any, res: any) {
//                 expect(res.code).to.be.eq(CREATED);
//                 expect(res.message).to.be.eq(success.en.doorKeeperSuccessful);
//                 done();
//             });
//         });
//     });
// });


//report module
describe('Report Module ************************************', () => {
    var storeId = "63e22a1310700359a60c0303"
    //add report
    describe('Add Report---------------------------------', () => {
        it('add report api', (done) => {
            request1.post('/api/v1/common/report/addReport').set('Authorization', jwt).field('description', 'ashu').field('role', 'Vendor').field('ar_description', '9000190126').field('storeId', storeId)
                .attach('image', '/home/tecorb/Pictures/Screenshot from 2023-02-07 10-52-44.png')
                .end(function (err: any, res: any) {
                    var body = res.body
                    expect(body.code).to.be.eq(CREATED);
                    expect(body.message).to.be.eq(success.en.issueReported);
                    expect(body.data).to.have.property('description');
                    expect(body.data).to.have.property('storeId');
                    expect(body.data).to.have.property('status');
                    expect(body.data).to.have.property('issueId');
                    done();
                });
        });
    });
    //report list
    describe('List Report---------------------------------', () => {
        it('list report api', (done) => {
            request1.get('/api/v1/common/report/list?page=1&perPage=1&role=Vendor&storeId=' + "" + storeId).set('Authorization', jwt)
                .end(function (err: any, res: any) {
                    var body = res.body
                    expect(body.code).to.be.eq(OK);
                    expect(body.message).to.be.eq(success.en.recordFetched);
                    done();
                });
        });
    });
});

