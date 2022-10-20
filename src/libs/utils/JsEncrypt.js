/*
 * @Descripttion:
 * @version:
 * @Author: 金苏
 * @Date: 2021-06-01 15:58:58
 * @LastEditors: 金苏
 * @LastEditTime: 2021-09-02 18:21:41
 */
import JSEncrypt from "jsencrypt";

// 加密公钥
const pubKey =
  '-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDib+4+2jJQiQdZfU5cBUYfk9mrrVLy7yC+gCmcNGVjxSw0ppw+11t0CAp+mp6XFlSQr/9FLobd1ZgCiBkUXeRdykKl4WByfItbCemdfRSw1I/h037EoqcVlP2x1SWE8i4QZTnyx047+DF/Ou6+gNvLT4diJm0fQHFvB2Pg0mfldwIDAQAB-----END PUBLIC KEY-----';
// 加密
export function jseEncrypt(msg) {
  var encryptor = new JSEncrypt(); // 创建加密对象实例
  encryptor.setPublicKey(pubKey); // 设置公钥
  if (['[object Object]', '[object Array]'].includes(Object.prototype.toString.call(msg))) {
    msg = JSON.stringify(msg)
  }
  let i = 0, ciphertext
  do {
    ciphertext ? ciphertext += '$' + encryptor.encrypt(msg.substr(i, 50)) : ciphertext = encryptor.encrypt(msg.substr(i, 50))
    i += 50
  } while (i < msg.length);
  return ciphertext;
}

// 解密私钥
const priKey =
  '-----BEGIN RSA PRIVATE KEY-----MIICeQIBADANBgkqhkiG9w0BAQEFAASCAmMwggJfAgEAAoGBAM+byP8WZuMzfhmcQa3EPEldU9IMAKNJ3r3nqZ9zf768zXnGqiV9qpWXusmFOTrJVncc+ZOu1rjXY2QVbs84xb71nuSP6JJ6L0P7o8XPZVuBY8dsPCYPd+IWzlHIaT32obLSHI93iMt+7Vb1Q32XWZkd3phWhUOM0dHt1Hr6qtrVAgMBAAECgYEAl6vhaPLt0dkBrCYrGY7+2D5ViWP5Z1IFZ8oCcxpHXorCts+76E3pvQYvkSBCUj9bawQBFbKq7jl1RF4gKUX5uJq/zw+3fBbnShEXSm06zWwY7RWKZ2cdE5CR4hDDQa8dBbXFv15Vzjuj6qp15WULVr1B/kVxQJC48X4+pVJDx4ECQQDwyJzsZmBuX8ds608F6fvR23tdrDonDYjIJWQm9QJs5J9Cq5b4fBS4FU8Bnze2nUidc+IyPOnscdrF5CBT4Za1AkEA3Lp3fAkV/UU+sV8QA2BAUmI8zibiOjVY/mLDlHRHPt5mEA5wWvaNwkr9wNrLkITQ0mlglyU3VmYlLM3B2G+noQJBAIQw31Y57n8qPkZh+YR5rTLNmLEYuORv3cRkItPwd2BpM7Zalgvds1JNAI8XZnLvbspisLB8GMEi0MUMNWNX2nECQQCeruM1ZabMVNq0Uz5E3w5+66cBIc0jwbR/9WrbsBiEJwjC5E575qKVGqqA2grck884ZY+OObAlyftR0X5ZZjPhAkEAwXb+d3RJx71druZhPuA1os0ISjF3jfWLk44UnzxJIgxRoor7y+K+IyKnAXv6oKnA4/6aCo70Nag+XSLa2aBRCQ==-----END RSA PRIVATE KEY-----';

// 解密
export function jseDecrypt(msg) {
  if (!msg) return ''
  var jseDecrypt = new JSEncrypt(); // 创建解密对象实例
  jseDecrypt.setPrivateKey(priKey); // 设置秘钥
  let plaintext = ''
  msg.split("$").forEach(element => {
    plaintext += jseDecrypt.decrypt(element);
  }); 
  return plaintext;
}

var Base64 = {
  _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
  encode: function(e) {
    var t = "";
    var n, r, i, s, o, u, a;
    var f = 0;
    e = Base64._utf8_encode(e);
    while (f < e.length) {
      n = e.charCodeAt(f++);
      r = e.charCodeAt(f++);
      i = e.charCodeAt(f++);
      s = n >> 2;
      o = ((n & 3) << 4) | (r >> 4);
      u = ((r & 15) << 2) | (i >> 6);
      a = i & 63;
      if (isNaN(r)) {
        u = a = 64;
      } else if (isNaN(i)) {
        a = 64;
      }
      t =
        t +
        this._keyStr.charAt(s) +
        this._keyStr.charAt(o) +
        this._keyStr.charAt(u) +
        this._keyStr.charAt(a);
    }
    return t;
  },
  decode: function(e) {
    var t = "";
    var n, r, i;
    var s, o, u, a;
    var f = 0;
    e = e.replace(/[^A-Za-z0-9+/=]/g, "");
    while (f < e.length) {
      s = this._keyStr.indexOf(e.charAt(f++));
      o = this._keyStr.indexOf(e.charAt(f++));
      u = this._keyStr.indexOf(e.charAt(f++));
      a = this._keyStr.indexOf(e.charAt(f++));
      n = (s << 2) | (o >> 4);
      r = ((o & 15) << 4) | (u >> 2);
      i = ((u & 3) << 6) | a;
      t = t + String.fromCharCode(n);
      if (u != 64) {
        t = t + String.fromCharCode(r);
      }
      if (a != 64) {
        t = t + String.fromCharCode(i);
      }
    }
    t = Base64._utf8_decode(t);
    return t;
  },
  _utf8_encode: function(e) {
    e = e.replace(/rn/g, "n");
    var t = "";
    for (var n = 0; n < e.length; n++) {
      var r = e.charCodeAt(n);
      if (r < 128) {
        t += String.fromCharCode(r);
      } else if (r > 127 && r < 2048) {
        t += String.fromCharCode((r >> 6) | 192);
        t += String.fromCharCode((r & 63) | 128);
      } else {
        t += String.fromCharCode((r >> 12) | 224);
        t += String.fromCharCode(((r >> 6) & 63) | 128);
        t += String.fromCharCode((r & 63) | 128);
      }
    }
    return t;
  },
  _utf8_decode: function(e) {
    var t = "";
    var n = 0;
    var r = 0;
    var c2 = 0;
    var c3 = 0;
    while (n < e.length) {
      r = e.charCodeAt(n);
      if (r < 128) {
        t += String.fromCharCode(r);
        n++;
      } else if (r > 191 && r < 224) {
        c2 = e.charCodeAt(n + 1);
        t += String.fromCharCode(((r & 31) << 6) | (c2 & 63));
        n += 2;
      } else {
        c2 = e.charCodeAt(n + 1);
        c3 = e.charCodeAt(n + 2);
        t += String.fromCharCode(
          ((r & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63)
        );
        n += 3;
      }
    }
    return t;
  }
};
// export function encryptMixed (msg) {
//   function randomString(n) {  
//     let str = 'abcdefghijklmnopqrstuvwxyz9876543210';
//     let tmp = '',
//         i = 0,
//         l = str.length;
//     for (i = 0; i < n; i++) {
//       tmp += str.charAt(Math.floor(Math.random() * l));
//     }
//     return tmp;
//   }
//   return randomString(9) + Base64.encode(msg)
// }

// export function decryptMixed (msg) {
//   return Base64.decode(msg.slice(9))
// }

export function encryptMixed(msg) {
  function chunkArr(arr, size) {
    if (!arr.length || !size || size < 1) return [];
    let [start, end, result] = [null, null, []];
    for (let i = 0; i < Math.ceil(arr.length / size); i++) {
      start = i * size;
      end = start + size;
      result.push(arr.slice(start, end));
    }
    return result;
  }
  const arr = chunkArr(msg, 20);
  const str = arr.reduce((prev, cur, index, arr) => {
    if (index === 0 || (index === arr.length && cur)) {
      return prev + jseEncrypt(cur);
    } else {
      return prev + "$" + jseEncrypt(cur);
    }
  }, "");
  return str;
}

export function decryptMixed(msg) {
  const arr = msg.split("$");
  const str = arr.reduce((prev, cur) => {
    return prev + jseDecrypt(cur);
  }, "");
  return str;
}