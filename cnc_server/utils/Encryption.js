const crypto = require("crypto");
const path = require("path");
const fs = require("fs");
const pswKey = Buffer.from("1111111111111111").slice(0,16);
const rasKeyPath = require("../config/systemConfig.js").rasKeyPath;
const requestPromise = require("request-promise");
const urlConfig = require("../config/url.js");
const encryptionUtll = {
    encryptStringWithRsaPublicKey: encryptStringWithRsaPublicKey,
    aesEncrypt:aesEncrypt,
    aesDecrypt:aesDecrypt,
    md5Encrypt:md5Encrypt,
    sha1Encrypt:sha1Encrypt,
    getKey:function(){
        return pswKey;
    }
};

/**
 * 使用指定文件路径的公钥加密字符串
 * @param {string} data 
 * @param {string} keyPath 
 */
function encryptStringWithRsaPublicKey(data) {
    let absolutePath = path.resolve(rasKeyPath);
    let publicKey = fs.readFileSync(absolutePath,"utf8");
    let buffer = new Buffer(data);
    //console.log(publicKey);
    let encrypted = crypto.publicEncrypt({
        key:publicKey.toString("base64"),
        padding:crypto.constants.RSA_PKCS1_PADDING
    }, buffer);
    //console.log(encrypted);
    return encrypted.toString("hex").toLocaleUpperCase();
};

/**
 * 加密字符串
 * @param {*} text 
 */
function aesEncrypt(text){
    const CipherivAES = crypto.createCipheriv("aes-128-cbc",pswKey,Buffer.from([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]));
    CipherivAES.setAutoPadding(true);
    let clearEncoding = 'utf8';
    let code1 = CipherivAES.update(Buffer.from(text),clearEncoding);
    let code2 = CipherivAES.final();
    let code = Buffer.concat([code1,code2]);
    return code;
}   

/**
 * 
 * @param {string} text 
 */
function aesDecrypt(text){
    try {
        const DecipherivAES = crypto.createDecipheriv("aes-128-cbc",pswKey,Buffer.from([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]));
        DecipherivAES.setAutoPadding(true);
        let clearEncoding = 'base64';
        let code1 = DecipherivAES.update(text,clearEncoding);
        let code2 = DecipherivAES.final();
        let code = Buffer.concat([code1,code2]).toString();
        return code;
    } catch (error) {
        console.error(error);
    }
}
/**
 * md5 hash
 * @param {*} text 
 */
function md5Encrypt(text){
    let md5 = crypto.createHash('md5');
    let hashCode = md5.update(text,"utf8").digest('hex');
    return hashCode;
}

/**
 * sha1 hash
 * @param {*} text 
 */
function sha1Encrypt(text){
    let sha1 = crypto.createHash('sha1');
    let hashCode = sha1.update(text,"utf8").digest('hex');
    return hashCode;
}
module.exports = encryptionUtll;

async function test(){
    // let token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjp7ImxvY2F0aW9uIjoxLCJ1c2VySWQiOjYyMDMxMiwidXNlck5hbWUiOiLpmYjkvJ8ifSwicGVybWlzc2lvbiI6eyJtZXNfcHJvZHVjdGlvbiI6Ik9GRiIsInB1cmNoYXNpbmdfYXBwbGljYXRpb24iOiJPRkYiLCJwcm9jZXNzX2FwcHJvdmFsIjoiT0ZGIiwicHVyY2hhc2luZ19pbmZvIjoiT0ZGIiwicHJvamVjdF9tYW5hZ2VyIjoiT0ZGIiwidGFza3Rvb2xzX3VzZXIiOiJPRkYiLCJtYW5hZ2VfdmlldyI6Ik9GRiIsImNvbXBhbnlfYW5ub3VuY2VtZW50IjoiT0ZGIiwicHVyY2hhc2luZ19xdWVyeSI6Ik9GRiIsImNvbnRhY3RzIjoiT0ZGIn0sImlzcyI6InJlc3RhcGl1c2VyICAiLCJhdWQiOiIwOThmNmJjZDQ2MjFkMzczY2FkZTRlODMyNjI3YjRmNiAgIn0.V0DGmvAYUaWgcCIQ8c00hQkeJodWmJTs8E9_lIWT5yg";
    // //let token = "12345";
    // console.log(Date.now());
    // let encData = encryptionUtll.aesEncrypt(token).toString("base64");
    // console.log(Date.now());
    // //console.log("encData",encData);
    // let encKey = encryptStringWithRsaPublicKey(pswKey);
    // console.log(Date.now());
    // //console.log("encKey",encKey);
    // let newToken = encryptionUtll.aesDecrypt(encData);
    // console.log(Date.now());
    // //console.log(newToken);
    let token = ["eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjp7ImxvY2F0aW9uIjoxLCJ1c2VySWQiOjYxOTk3MCwidXNlck5hbWUiOiLmnY7lrZDmspsifSwicGVybWlzc2lvbiI6eyJhcHBfZmFjdG9yeSI6Ik9GRiIsIm1lc19wcm9kdWN0aW9uIjoiT0ZGIiwicHVyY2hhc2luZ19hcHBsaWNhdGlvbiI6Ik9GRiIsInByb2Nlc3NfYXBwcm92YWwiOiJPRkYiLCJwdXJjaGFzaW5nX2luZm8iOiJPRkYiLCJwcm9qZWN0X21hbmFnZXIiOiJPRkYiLCJ0YXNrdG9vbHNfdXNlciI6Ik9GRiIsIm1hbmFnZV92aWV3IjoiT0ZGIiwiY29tcGFueV9hbm5vdW5jZW1lbnQiOiJPRkYiLCJwdXJjaGFzaW5nX3F1ZXJ5IjoiT0ZGIiwiY29udGFjdHMiOiJPRkYifSwiaXNzIjoicmVzdGFwaXVzZXIgICIsImF1ZCI6IkhyUUJrTEloTExXbGlmcUZnNUpHOXRNZHlYTWxwS0cxQkh1WVIzUm43TWdnTHZXdHlDSHF6em5oQUdvQ2hYVGUifQ.t2YQG5DMqqnY6SpxFyxV-dkgrEUh43idp8ES9WKLY2k"];
    let encrypAESKEY = encryptStringWithRsaPublicKey( pswKey );
    token = aesEncrypt( JSON.stringify(token) ).toString("base64");
    try {
        //console.log("token",token);
        //console.log("encrypAESKEY",encrypAESKEY);
        let result = await requestPromise.post( urlConfig.tokenListCheck,{
            form:{
                encData:token,
                encKey:encrypAESKEY
            },
            json:true
        });
        console.log(result);
        let encryptResult = aesDecrypt(result.data);
        console.log(encryptResult);
    } catch (error) {
        console.log(error);
    }
}

//test();

async function newTest(){
    //获取token
    let username = "cw5128";
    let password = "123";
    let seed = Date.now();
    let hash = md5Encrypt(password) + seed;
    hash = sha1Encrypt(hash);
    let params = {
        "user":username,
        "hash":hash,
        "seed":seed
    };
    let loginResult = await requestPromise.get(urlConfig.getToken,{
        qs:{
            r:"LOGIN_"+JSON.stringify(params)
        }
    });
    loginResult = loginResult.replace("LOGON_","");
    loginResult = JSON.parse(loginResult);
    if( loginResult.code !== 0 ){
        throw "账号或密码错误";
    }
    console.log("获取到的token",loginResult.token);
    let token = loginResult.token;
    //单独检查token
    let encrypToken = aesEncrypt(token).toString("base64");
    let encrypAESKEY = encryptStringWithRsaPublicKey(pswKey);
    console.log("单独检查token,encrypToken",encrypToken);
    console.log("单独检查token,encrypAESKEY",encrypAESKEY);
    let checkResult = await requestPromise.post(urlConfig.tokenCheck,{
        form:{
            encData:encrypToken,
            encKey:encrypAESKEY
        },
        json:true
    })
    if( checkResult.code !== 200 ){
        throw "账号或密码错误";
    }
    let data = aesDecrypt(checkResult.data);
    data = JSON.parse(data);
    console.log("单独检查token成功");
    //批量检查token
    let tokens = [token];
    encrypAESKEY = encryptStringWithRsaPublicKey( pswKey );
    token = aesEncrypt( JSON.stringify(token) ).toString("base64");
    try {
        //console.log("token",token);
        //console.log("encrypAESKEY",encrypAESKEY);
        let result = await requestPromise.post( urlConfig.tokenListCheck,{
            form:{
                encData:token,
                encKey:encrypAESKEY
            },
            json:true
        });
        console.log(result);
        let encryptResult = aesDecrypt(result.data);
        console.log(encryptResult);
    } catch (error) {
        console.log(error);
    }

}

//newTest();

