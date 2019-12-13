"use strict";
exports.__esModule = true;
var debug_1 = require("debug");
var admin = require("firebase-admin");
var log = debug_1["default"]('tjl:models:firebaseadmin');
var FirebaseAdmin = /** @class */ (function () {
    function FirebaseAdmin() {
        this.init = false;
    }
    FirebaseAdmin.getInstance = function () {
        if (!FirebaseAdmin.instance) {
            FirebaseAdmin.instance = new FirebaseAdmin();
            FirebaseAdmin.instance.bootstrap();
        }
        return FirebaseAdmin.instance;
    };
    Object.defineProperty(FirebaseAdmin.prototype, "Firestore", {
        /** firestore */
        get: function () {
            if (this.init === false) {
                this.bootstrap();
            }
            return admin.firestore();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FirebaseAdmin.prototype, "Auth", {
        get: function () {
            if (this.init === false) {
                this.bootstrap();
            }
            return admin.auth();
        },
        enumerable: true,
        configurable: true
    });
    FirebaseAdmin.prototype.bootstrap = function () {
        if (!!admin.apps.length === true) {
            this.init = true;
            return;
        }
        log('bootstrap start');
        var config = {
            databaseurl: 'https://sleepy-owl-6a78a.firebaseio.com',
            credential: {
                privateKey: '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCstFgpt2XwKLt+\nmOr6DQ2zK8ZHlQkGvJvoLEmoxdtkxK/CPqsy+pZJJxb30m2ycFwVMsnAJUXk+tdY\n5/bMd0FzVn/3bDlcbwaja/SvhegppqrgMKMt2ln9tdCb+AlmlnTDqtxE/6rDFSVA\ncjzBxK1+nn5nWeF+tELOdI/q6OhMTR99iTvpivXMf7avn3es1N8lbrEXIPzQnif/\nJe6EFWCc6xj4GwC1fqEh9B6wDQbgyP9haUO1SDTwzBfKc021w72XhUxYWE1gUrJS\nYZFDmqymk235N7vACrZK4bL2/QycFZBCncNQuZScvMDGZmmvnHmqyu33DCDyFf+b\naqb98p55AgMBAAECggEAO1YA3mBM7SzJck7umHeop9DX4FsjjUV62VNyAULtRFtR\nOY8Xeb3fqYV9HisVllOFR6E58MK9l1TZbQnRYOFuQsbK04LC2G+q27XpDO8YW0sQ\ndVMwlT3qYkE3yYZ4EF+MAXfwEuK2VC0tLc2x8y70HscsjayzTTl4pH8mvSJFQYVC\nRa4CVn1XkWChBMKJd6XWBFoAJ4YJGY7rvTKJtUTZ6upWhuJaHIj+ExkvfusfwKGg\nhw9fCD4cdkMNZ2STLPta1Hn32jZJy/G9XA73dTsRa2fvVgrgDeFdSLsaNxsyhMPb\nblS/UnOe8NXCcmNB19aeK4y6yUxGpNjA1eNfynD6iwKBgQDtoYOutAyhyr/OdUPJ\nJntYMiFFKYPtNGr9kR/JK1UW3MWxo3l9TiNQ6nxASGRI6MKT50bUlqFWFINkz53B\nipk3wN9KH9qkjwg6FBG3BO3xtWv1O8ntHBFbAemdS7XMqEoy3zDJQNiHlIM/wqzp\niU6qBeqvCYj9lTVSliNunX/i5wKBgQC6Df+gv1K5xyNPs9cIKkD5FJSg2kcSjziu\npjs7GrOkpW5CeVmSvg2dBCY5R5iRLRCcWLQtiKirl2hiRkPUkBkUGy+Na5yoesCC\na92VcjNjX/fUuA9mYrKEdVhlUivcAnq8dpNS/dStLrx/299V4IBwatpo0ug1GnnA\nfq8z/YCnnwKBgDAUWdxjOZsStrRDLa/pRVOW8PxZZgP8cxlS36eISPMTQDys4svj\nn2mjx/gJraDC13utc7tXrtUH2X3wM+8Q5+dL8uHAiDB7cCKwJNVu/eXF204HBtge\nsbREMsxMoUADXN/mIKzXnffwqI2iCfJGgdAM2msH9tu38M4A6rJa06FJAoGBAJXp\njZ2ySy/R2wvvdkXn9e48vP1Wo4m6yQtAed1HyJPTkCITsS7h4AoyO7JPlAj17Lpt\nZtCBmpaYKs10nFb7vJlMxmYG3XWLYu4zh5lRKULbIs/Ndusif4DnJFCPgzOE8+xD\nBrYKPIFGdS/4s914RUVPc6iet+eB67RE31re2fk1AoGAEdvgX26XXkpUOdjmDt+W\nVGJg8fVdguLmB7Bc6qyG5NzU82/XeNfsxvYwm0iHJ66bpErG236ilLBiz6Vc8k+D\nDaCIjNRURgj9ijb5wZXrt99lfhIeWsOhsJ0CzL+albGhWLlaRkI4GETidvdedFqd\nOpFIvOEBOfzfShyIyYtCZrM=\n-----END PRIVATE KEY-----\n'.replace(/\\n/g, '\n'),
                clientEmail: 'firebase-adminsdk-0g3qd@sleepy-owl-6a78a.iam.gserviceaccount.com',
                projectId: 'sleepy-owl-6a78a'
            }
        };
        admin.initializeApp({
            databaseURL: config.databaseurl,
            credential: admin.credential.cert(config.credential)
        });
        log('bootstrap end');
        this.init = true;
    };
    return FirebaseAdmin;
}());
exports["default"] = FirebaseAdmin;
