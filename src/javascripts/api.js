export function getData (url) {
  return fetch(url, {
   headers: getAuthorizationHeader()
    }).then(response => {
        // 丟 promise 回去，之後就可以有比較自由的方式處理
        console.log(response);
        if (response.status !== 200) { throw new Error(response.status); }
        // return Promise
        return response.json();
    })
}

function getAuthorizationHeader() {
  // 填入自己 ID、KEY 開始
  const AppID = 'cdc97aa99391461b9021627534b0614a';
  const AppKey = 'EaDUbTrvFGkBNJ0J2akXBsvDxU0';
  // 填入自己 ID、KEY 結束
  const GMTString = new Date().toGMTString();
  const ShaObj = new jsSHA('SHA-1', 'TEXT');
  ShaObj.setHMACKey(AppKey, 'TEXT');
  ShaObj.update('x-date: ' + GMTString);
  const HMAC = ShaObj.getHMAC('B64');
  const Authorization = 'hmac username=\"' + AppID + '\", algorithm=\"hmac-sha1\", headers=\"x-date\", signature=\"' + HMAC + '\"';
  return { 'Authorization': Authorization, 'X-Date': GMTString }; 
}
