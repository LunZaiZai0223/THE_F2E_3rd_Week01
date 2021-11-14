import { getData } from './api.js';

// 這邊是回傳一個 promise 
// console.log(getData('https://ptx.transportdata.tw/MOTC/v2/Tourism/Activity?$top=30&$format=JSON').then(data => testingRender(data)));
// getApi('https://ptx.transportdata.tw/MOTC/v2/Tourism/Activity?$top=30&$format=JSON').then(data => console.log(data));
// 
function testingRender(data) {
  console.log(data);
}

// 這樣子就可以讓串 api 的函式重複利用，而且收到資料後也可以很自由地使用
// 
// 
// https://ptx.transportdata.tw/MOTC/v2/Tourism/Activity?$format=JSON
// https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot?$top=30&$format=JSON
const Control = (() => {
  const activityUlEle = document.querySelector('[data-activity-list]');
  // 不管怎樣都會有 query $format=JSON，所以要有 ?
  let baseUrl = 'https://ptx.transportdata.tw/MOTC/v2/Tourism/';
  /*
  1. 4 個有圖片的活動
  2. 10 個美食
  ===> 找 + render
   */
  function initialize () {
  }
  const setApiUrl = (baseUrl, type, query = ['$format=JSON']) => {
    query = query.join('&');
    let apiUrl = baseUrl + type + query;
    console.log(apiUrl);
    return apiUrl;
  };
  function getRandomActivities (url) {
    const data = getData(url).then(data => {
      console.log(data);
      // 0 => falsy
      // console.log(!!Object.keys(data[0].Picture).length);
      // 只要有圖片的資料（並切 4 筆就好）
      
      // const activitiesWithPic = data.filter(obj => !!Object.keys(obj.Picture).length);
      let activitiesWithPic = [];
      let i = 0;
      while (activitiesWithPic.length < 4) {
        if (!!Object.keys(data[i].Picture).length !== false) {
          activitiesWithPic.push(data[i]);
        }
        i++;
      }
      console.log(activitiesWithPic);
      renderActivies(activitiesWithPic);
      }); 
  }
  function getRandomFood (url) {
    const data = getData(url).then(data => {
      console.log(data);
      renderFood(data);
    });
  }
  function renderActivies (data) {
    let content = '';
    data.forEach(value => {
      content += `
      <li class="card">
        <div class="image-wrapper"><img src="${value.Picture.PictureUrl1}" alt=""></div>
          <div class="content">
            <h1 class="title">${value.Name}</h1>
            <p class="description">${value.Description}</p>
            <div class="info">
              <div class="area" style="display: flex; align-items:center;"><svg width="24" height="24"><path d="M12 21.7778C12 21.7778 20 16.4444 20 10.2222C20 8.10048 19.1571 6.06565 17.6569 4.56536C16.1566 3.06507 14.1217 2.22221 12 2.22221C9.87827 2.22221 7.84344 3.06507 6.34315 4.56536C4.84285 6.06565 4 8.10048 4 10.2222C4 16.4444 12 21.7778 12 21.7778ZM14.6676 10.2224C14.6676 11.6952 13.4736 12.8891 12.0009 12.8891C10.5281 12.8891 9.33421 11.6952 9.33421 10.2224C9.33421 8.74965 10.5281 7.55574 12.0009 7.55574C13.4736 7.55574 14.6676 8.74965 14.6676 10.2224Z" fill="#ff1d6c"></path></svg>${value.Location}</div>
                <button>活動詳情</button>
            </div>
          </div>
      </li>
      `;
    });
    console.log(content);
    activityUlEle.innerHTML = content;
    // const datawithImage = data.filter(obj)
    }
    function renderFood (data) {
      const ulEle = document.querySelector('[data-food-list]');
      let content = '';
      data.forEach(obj => {
        content += `
        <li class="item">
          <div class="image-wrapper">
            <img src="${obj.Picture.PictureUrl1}" alt="">
          </div>
          <div class="content">
            <h2 class="title">${obj.Name}</h2>
            <p><span><svg style="transform: translateY(3px);" width="16" height="16"><path d="M5.5 13.4444C5.5 13.4444 11 9.77778 11 5.5C11 4.04131 10.4205 2.64236 9.38909 1.61091C8.35764 0.579463 6.95869 0 5.5 0C4.04131 0 2.64236 0.579463 1.61091 1.61091C0.579463 2.64236 0 4.04131 0 5.5C0 9.77778 5.5 13.4444 5.5 13.4444ZM7.33388 5.49991C7.33388 6.51243 6.51307 7.33324 5.50055 7.33324C4.48803 7.33324 3.66721 6.51243 3.66721 5.49991C3.66721 4.48739 4.48803 3.66658 5.50055 3.66658C6.51307 3.66658 7.33388 4.48739 7.33388 5.49991Z" fill="#ff1d6c"></path></svg>${obj.Address}</span></p>
          </div>
        </li>
        `;
      ulEle.innerHTML = content;
      });
    }
    // https://ptx.transportdata.tw/MOTC/v2/Tourism/Restaurant?$top=30&$format=JSON
  getRandomActivities(setApiUrl(baseUrl, 'Activity?', ['$format=JSON', '$top=30']));
  getRandomFood(setApiUrl(baseUrl, 'Restaurant?', ['$format=JSON', '$top=10']));
})();
