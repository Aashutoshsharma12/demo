const request = require("request")
import { success } from "../constants"
import chai from "chai"
import { expect } from "chai"
// const request1 = require('supertest')
import { StatusCodes } from "http-status-codes"
import exp from "constants"
import parking from "@controllers/door_Keeper/parking"
var base_url = "http://3.110.75.42:3009/api/v1/doorKeeper/"
var jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZTYyYzM5ZjRiYzFlYmNkMDlhNWIxNCIsInJvbGUiOiJEb29yS2VlcGVyIiwiaWF0IjoxNjc2MDI5MTE5LCJleHAiOjE2Nzg2MjExMTl9.HkKGJ5YVpmTAAmEqvl3Cn9scnDcfe9-6rRpd-m5dxcY'
const { CREATED, OK } = StatusCodes

//Doorkeeper Authentication
describe('Dorrkeeper Authentication--------------------', () => {
    //login
    describe('Dorrkeeper Login Api--------------------', () => {
        it('login api', (done) => {
            request.post(base_url + "" + 'auth/login', {
                json: true, body: {
                    "countryCode": "+91",
                    "password": "12345",
                    "phoneNumber": "8979012644",
                    "role": "DoorKeeper"
                }
            }, function (err: any, body: any, res: any) {
                expect(res.code).to.be.eq(OK);
                expect(res.message).to.be.eq(success.en.loginSuccessful);
                expect(res.data).to.have.property('token');
                expect(res.data).to.have.property('isUser');
                done();
            });
        });
    });

    //change password
    describe('Dorrkeeper change password Api--------------------', () => {
        it('change password api', (done) => {
            request.put(base_url + "" + 'auth/changePassword', {
                json: true, headers: { 'Authorization': jwt }, body: {
                    "oldPassword": "12345",
                    "newPassword": "12345",
                    "confirmPassword": "12345"
                }
            }, function (err: any, body: any, res: any) {
                expect(res.code).to.be.eq(OK);
                expect(res.message).to.be.eq(success.en.updatePassword);
                done();
            });
        });
    });
    //check account
    describe('check account Api--------------------', () => {
        it('check account api', (done) => {
            request.post(base_url + "" + 'auth/check-account', {
                json: true, headers: { 'Authorization': jwt }, body: {
                    "countryCode": "+91",
                    "phoneNumber": "8979012644",
                    "role": "DoorKeeper"
                }
            }, function (err: any, body: any, res: any) {
                expect(res.code).to.be.eq(OK);
                expect(res.message).to.be.eq(success.en.accountExists);
                done();
            });
        });
    });
});

//profile
describe('Profile module--------------------', () => {
    describe('profile details--------------------', () => {

        it('get profile api', (done) => {
            request.get(base_url + "" + 'profile/get', {
                json: true, headers: { 'Authorization': jwt }
            }, function (err: any, body: any, res: any) {
                expect(res.code).to.be.eq(OK);
                expect(res.message).to.be.eq(success.en.gotUserProfile);
                expect(res.data.userData).to.have.property('name');
                expect(res.data.userData).to.have.property('phoneNumber');
                expect(res.data.userData).to.have.property('countryCode');
                expect(res.data.userData).to.have.property('image');
                done();
            });
        });
    });

    //update profile
    var supertest = require('supertest');
    var request1 = supertest('http://3.110.75.42:3009');
    describe('update profile --------------------', () => {
        it('update profile api', (done) => {
            request1.put('/api/v1/doorKeeper/profile/edit').set('Authorization', jwt)
                // .field('extra_info', '{"in":"case you want to send json along with your file"}')
                .attach('image', '/home/tecorb/Pictures/Screenshot from 2023-02-07 10-52-44.png')
                .end(function (err: any, res: any) {
                    var body = res.body
                    expect(body.code).to.be.eq(OK);
                    expect(body.message).to.be.eq(success.en.profileUpdate);
                    // expect(body.code).to.have.property('image');
                    done();
                });
        });
    });
});

//parking
describe('Parking module--------------------', () => {
    const orderId = ""
    it('provide parking api', (done) => {
        request.post(base_url + "" + 'parking/parking', {
            json: true, headers: { 'Authorization': jwt }, body: {
                'orderId': orderId
            }
        }, function (err: any, body: any, res: any) {
            expect(res.code).to.be.eq(OK);
            expect(res.message).to.be.eq(success.en.success);
            expect(res.data).to.have.property('parkingNumber');
            expect(res.data).to.have.property('storeId');
            expect(res.data).to.have.property('userId');
            expect(res.data).to.have.property('items');
            expect(res.data).to.have.property('order_dateTime');
            expect(res.data).to.have.property('orderId');
            done();
        });
    });
});