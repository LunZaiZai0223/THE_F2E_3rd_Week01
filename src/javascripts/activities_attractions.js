import { getData } from './api.js';
import { Control } from './main.js';

const onlyActAndAtt = (() => {
  // 不管怎樣都會有 query $format=JSON，所以要有 ?
  let baseUrl = 'https://ptx.transportdata.tw/MOTC/v2/Tourism/';
  // 用來計算目前得到幾筆
  let activitiesCount = 8;
  let attractionsCount = 20;

  // 暫時儲存得到的資料
  let activitiesArr = [];
  let attractionsArr = [];

  const activityUlEle = document.querySelector('[data-activity-list]');

  const lowerPartSectionEle = document.querySelector('.lower-part');
  const cityDivEle = document.querySelector('.city');
  const unneededTitleEle = document.querySelector('.normal-title');
  const foodListUlEle = document.querySelector('.food-list-wrapper');
  // const activityTitle = document.querySelector('')
  console.log('切換！');
  // 第一次轉換頁面
  function renderActivities () {
    // Activity?
    // ScenicSpot?
    // https://ptx.transportdata.tw/MOTC/v2/Tourism/Restaurant?$top=30&$format=JSON
    // const title = `<h4 class="activity-title"><svg style="margin-right: 6px; transform: translateY(2px);" width="20" height="17"><path d="M10 0L0 16.1905H20L10 0Z" fill="#FF1D6C"></path></svg>熱門活動</h4>`;
    // console.log(title);
    // const title = document.createElement('h4');
    // title.classList.add('activity-title');
    // title.innerHTML = `
    // <svg style="margin-right: 6px; transform: translateY(2px);" width="20" height="17"><path d="M10 0L0 16.1905H20L10 0Z" fill="#FF1D6C"></path></svg>熱門活動
    // `;
    const url = Control.setApiUrl(baseUrl, 'Activity?', ['$format=JSON', `$top=${activitiesCount}`]);
    const data = getData(url).then(data => {
      activitiesArr = data;
      // 刪除不需要的部分
      cityDivEle.remove();
      unneededTitleEle.remove();
      foodListUlEle.remove();

      /*
      渲染畫面 
        1. addModal 事件
       */
      Control.renderActivies(activitiesArr, activityUlEle);
      Control.addEventToActivitiesBtns();
      Control.actBtnsClickHandler();

      // console.log(liEles);
      // ulEle.innerHTML = liEles;
      // lowerPartSectionEle.append(title);
      // lowerPartSectionEle.append(ulEle);
    });

    // lowerPartSectionEle.innerHTML = '';
  }
  function _renderAttractions () {

  }
  return { renderActivities };
})();

export { onlyActAndAtt };

//   <section class="lower-part">
// <h4 class="activity-title"><svg style="margin-right: 6px; transform: translateY(2px);" width="20" height="17"><path d="M10 0L0 16.1905H20L10 0Z" fill="#FF1D6C"></path></svg>熱門活動</h4>
// <ul class="activity-list-wrapper" data-activity-list>
//   <li class="card">
//     <div class="image-wrapper"><img src="https://www.taiwan.net.tw/att/event/50882fb8-6e13-49dc-8d8a-f7b83de20fe3.jpg" alt=""></div>
//     <div class="content">
//       <h1 class="title">2021日月潭萬人泳渡</h1>
//       <p class="description">起始於1983年的日月潭國際萬人泳渡活動，每年中秋節前後舉辦，是日月潭最具歷史與規模的活動，2002年正式列入世界游泳名人堂。泳渡全程約3,000公尺，每年均吸引來自海內外四面八方上萬名游泳愛好者參加，幾乎在開放報名即迅速額滿的「日月潭萬人泳渡」嘉年華盛事，場面盛況空前。</p>
//       <div class="info">
//         <div class="area">南投縣 魚池鄉</div>
//         <button>活動詳情</button>
//       </div>
//     </div>
//   </li>
//   <li class="card">
//     <div class="image-wrapper"><img src="https://www.taiwan.net.tw/att/event/50882fb8-6e13-49dc-8d8a-f7b83de20fe3.jpg" alt=""></div>
//     <div class="content">
//       <h1 class="title">2021日月潭萬人泳渡</h1>
//       <p class="description">起始於1983年的日月潭國際萬人泳渡活動，每年中秋節前後舉辦，是日月潭最具歷史與規模的活動，2002年正式列入世界游泳名人堂。泳渡全程約3,000公尺，每年均吸引來自海內外四面八方上萬名游泳愛好者參加，幾乎在開放報名即迅速額滿的「日月潭萬人泳渡」嘉年華盛事，場面盛況空前。</p>
//       <div class="info">
//         <div class="area">南投縣 魚池鄉</div>
//         <button>活動詳情</button>
//       </div>
//     </li>
//     <li class="card">
//       <div class="image-wrapper"><img src="https://www.taiwan.net.tw/att/event/50882fb8-6e13-49dc-8d8a-f7b83de20fe3.jpg" alt=""></div>
//       <div class="content">
//         <h1 class="title">2021日月潭萬人泳渡</h1>
//         <p class="description">起始於1983年的日月潭國際萬人泳渡活動，每年中秋節前後舉辦，是日月潭最具歷史與規模的活動，2002年正式列入世界游泳名人堂。泳渡全程約3,000公尺，每年均吸引來自海內外四面八方上萬名游泳愛好者參加，幾乎在開放報名即迅速額滿的「日月潭萬人泳渡」嘉年華盛事，場面盛況空前。</p>
//         <div class="info">
//           <div class="area">南投縣 魚池鄉</div>
//           <button>活動詳情</button>
//         </div>
//       </li>
//       <li class="card">
//         <div class="image-wrapper"><img src="https://www.taiwan.net.tw/att/event/50882fb8-6e13-49dc-8d8a-f7b83de20fe3.jpg" alt=""></div>
//         <div class="content">
//           <h1 class="title">2021日月潭萬人泳渡</h1>
//           <p class="description">起始於1983年的日月潭國際萬人泳渡活動，每年中秋節前後舉辦，是日月潭最具歷史與規模的活動，2002年正式列入世界游泳名人堂。泳渡全程約3,000公尺，每年均吸引來自海內外四面八方上萬名游泳愛好者參加，幾乎在開放報名即迅速額滿的「日月潭萬人泳渡」嘉年華盛事，場面盛況空前。</p>
//           <div class="info">
//             <div class="area">南投縣 魚池鄉</div>
//             <button>活動詳情</button>
//           </div>
//         </li>
//         <li class="card">
//           <div class="image-wrapper"><img src="https://www.taiwan.net.tw/att/event/50882fb8-6e13-49dc-8d8a-f7b83de20fe3.jpg" alt=""></div>
//           <div class="content">
//             <h1 class="title">2021日月潭萬人泳渡</h1>
//             <p class="description">起始於1983年的日月潭國際萬人泳渡活動，每年中秋節前後舉辦，是日月潭最具歷史與規模的活動，2002年正式列入世界游泳名人堂。泳渡全程約3,000公尺，每年均吸引來自海內外四面八方上萬名游泳愛好者參加，幾乎在開放報名即迅速額滿的「日月潭萬人泳渡」嘉年華盛事，場面盛況空前。</p>
//             <div class="info">
//               <div class="area">南投縣 魚池鄉</div>
//               <button>活動詳情</button>
//             </div>
//           </li>
//           <li class="card">
//             <div class="image-wrapper"><img src="https://www.taiwan.net.tw/att/event/50882fb8-6e13-49dc-8d8a-f7b83de20fe3.jpg" alt=""></div>
//             <div class="content">
//               <h1 class="title">2021日月潭萬人泳渡</h1>
//               <p class="description">起始於1983年的日月潭國際萬人泳渡活動，每年中秋節前後舉辦，是日月潭最具歷史與規模的活動，2002年正式列入世界游泳名人堂。泳渡全程約3,000公尺，每年均吸引來自海內外四面八方上萬名游泳愛好者參加，幾乎在開放報名即迅速額滿的「日月潭萬人泳渡」嘉年華盛事，場面盛況空前。</p>
//               <div class="info">
//                 <div class="area">南投縣 魚池鄉</div>
//                 <button>活動詳情</button>
//               </div>
//             </li>
//             <li class="card">
//               <div class="image-wrapper"><img src="https://www.taiwan.net.tw/att/event/50882fb8-6e13-49dc-8d8a-f7b83de20fe3.jpg" alt=""></div>
//               <div class="content">
//                 <h1 class="title">2021日月潭萬人泳渡</h1>
//                 <p class="description">起始於1983年的日月潭國際萬人泳渡活動，每年中秋節前後舉辦，是日月潭最具歷史與規模的活動，2002年正式列入世界游泳名人堂。泳渡全程約3,000公尺，每年均吸引來自海內外四面八方上萬名游泳愛好者參加，幾乎在開放報名即迅速額滿的「日月潭萬人泳渡」嘉年華盛事，場面盛況空前。</p>
//                 <div class="info">
//                   <div class="area">南投縣 魚池鄉</div>
//                   <button>活動詳情</button>
//                 </div>
//               </li>
//               <li class="card">
//                 <div class="image-wrapper"><img src="https://www.taiwan.net.tw/att/event/50882fb8-6e13-49dc-8d8a-f7b83de20fe3.jpg" alt=""></div>
//                 <div class="content">
//                   <h1 class="title">2021日月潭萬人泳渡</h1>
//                   <p class="description">起始於1983年的日月潭國際萬人泳渡活動，每年中秋節前後舉辦，是日月潭最具歷史與規模的活動，2002年正式列入世界游泳名人堂。泳渡全程約3,000公尺，每年均吸引來自海內外四面八方上萬名游泳愛好者參加，幾乎在開放報名即迅速額滿的「日月潭萬人泳渡」嘉年華盛事，場面盛況空前。</p>
//                   <div class="info">
//                     <div class="area">南投縣 魚池鄉</div>
//                     <button>活動詳情</button>
//                   </div>
//                 </li>
//               </ul>
//               <div class="attractions">
//                 <h4 style="display:flex; align-items:center" class="activity-title normal-title"><svg style="margin-right: 6px" width="20" height="20" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
//                   <circle cx="6" cy="6" r="5.5" fill="#007350"/>
//                 </svg>熱門景點</h4>
//                 <ul class="attraction-list" data-list="attraction">
//                   <li class="item">
//                     <div class="background-image">
//                     </div>
//                     <div class="content">
//                       <h2 class="title">紫坪</h2>
//                       <p>紫坪位在綠島最南方，緊鄰「綠島露營區」。從露營區旁的步道，可通往海岸邊的潟湖「紫坪」。「紫坪」是一處由珊瑚礁構成的潮池，也是綠島著名的潟湖所在地，有全綠島最完整的潟湖地形以及珊瑚礁植群，更有茂盛的植物水芫花和珍貴的陸寄居蟹。外海儘管浪濤洶湧，內湖依然波平如鏡，宛若沉睡的湖水，清淺的躺在外珊瑚礁岩與內珊瑚貝砂灘間；水芫花灌叢身影倒映於平靜無波的水面上，潔白柔細的白砂鋪陳水底。熱帶海岸旖旎風情，盡在不言中。</p>
//                     </div>
//                   </li>
//                   <li class="item">
//                     <div class="image-wrapper">
//                       <img src="https://www.matsu-nsa.gov.tw/FileArtPic.ashx?id=2913&w=1280&h=960" alt="">
//                     </div>
//                     <div class="content">
//                       <h2 class="title">友誼山莊簡餐</h2>
//                       <p><span>連江縣莒光鄉田澳村67號</span></p>
//                     </div>
//                   </li>
//                   <li class="item">
//                     <div class="image-wrapper">
//                       <img src="https://www.matsu-nsa.gov.tw/FileArtPic.ashx?id=2913&w=1280&h=960" alt="">
//                     </div>
//                     <div class="content">
//                       <h2 class="title">友誼山莊簡餐</h2>
//                       <p><span>連江縣莒光鄉田澳村67號</span></p>
//                     </div>
//                   </li>
//                   <li class="item">
//                     <div class="image-wrapper">
//                       <img src="https://www.matsu-nsa.gov.tw/FileArtPic.ashx?id=2913&w=1280&h=960" alt="">
//                     </div>
//                     <div class="content">
//                       <h2 class="title">友誼山莊簡餐</h2>
//                       <p><span>連江縣莒光鄉田澳村67號</span></p>
//                     </div>
//                   </li>
//                   <li class="item">
//                     <div class="image-wrapper">
//                       <img src="https://www.matsu-nsa.gov.tw/FileArtPic.ashx?id=2913&w=1280&h=960" alt="">
//                     </div>
//                     <div class="content">
//                       <h2 class="title">友誼山莊簡餐</h2>
//                       <p><span>連江縣莒光鄉田澳村67號</span></p>
//                     </div>
//                   </li>
//                   <li class="item">
//                     <div class="image-wrapper">
//                       <img src="https://www.matsu-nsa.gov.tw/FileArtPic.ashx?id=2913&w=1280&h=960" alt="">
//                     </div>
//                     <div class="content">
//                       <h2 class="title">友誼山莊簡餐</h2>
//                       <p><span>連江縣莒光鄉田澳村67號</span></p>
//                     </div>
//                   </li>
//                   <li class="item">
//                     <div class="image-wrapper">
//                       <img src="https://www.matsu-nsa.gov.tw/FileArtPic.ashx?id=2913&w=1280&h=960" alt="">
//                     </div>
//                     <div class="content">
//                       <h2 class="title">友誼山莊簡餐</h2>
//                       <p><span>連江縣莒光鄉田澳村67號</span></p>
//                     </div>
//                   </li>
//                   <li class="item">
//                     <div class="image-wrapper">
//                       <img src="https://www.matsu-nsa.gov.tw/FileArtPic.ashx?id=2913&w=1280&h=960" alt="">
//                     </div>
//                     <div class="content">
//                       <h2 class="title">友誼山莊簡餐</h2>
//                       <p><span>連江縣莒光鄉田澳村67號</span></p>
//                     </div>
//                   </li><li class="item">
//                     <div class="image-wrapper">
//                       <img src="https://www.matsu-nsa.gov.tw/FileArtPic.ashx?id=2913&w=1280&h=960" alt="">
//                     </div>
//                     <div class="content">
//                       <h2 class="title">友誼山莊簡餐</h2>
//                       <p><span>連江縣莒光鄉田澳村67號</span></p>
//                     </div>
//                   </li>
//                   <li class="item">
//                     <div class="image-wrapper">
//                       <img src="https://www.matsu-nsa.gov.tw/FileArtPic.ashx?id=2913&w=1280&h=960" alt="">
//                     </div>
//                     <div class="content">
//                       <h2 class="title">友誼山莊簡餐</h2>
//                       <p><span>連江縣莒光鄉田澳村67號</span></p>
//                     </div>
//                   </li>
//                   <li class="item">
//                     <div class="image-wrapper">
//                       <img src="https://www.matsu-nsa.gov.tw/FileArtPic.ashx?id=2913&w=1280&h=960" alt="">
//                     </div>
//                     <div class="content">
//                       <h2 class="title">友誼山莊簡餐</h2>
//                       <p><span>連江縣莒光鄉田澳村67號</span></p>
//                     </div>
//                   </li>
//                   <li class="item">
//                     <div class="image-wrapper">
//                       <img src="https://www.matsu-nsa.gov.tw/FileArtPic.ashx?id=2913&w=1280&h=960" alt="">
//                     </div>
//                     <div class="content">
//                       <h2 class="title">友誼山莊簡餐</h2>
//                       <p><span>連江縣莒光鄉田澳村67號</span></p>
//                     </div>
//                   </li>
//                   <li class="item">
//                     <div class="image-wrapper">
//                       <img src="https://www.matsu-nsa.gov.tw/FileArtPic.ashx?id=2913&w=1280&h=960" alt="">
//                     </div>
//                     <div class="content">
//                       <h2 class="title">友誼山莊簡餐</h2>
//                       <p><span>連江縣莒光鄉田澳村67號</span></p>
//                     </div>
//                   </li>
//                   <li class="item">
//                     <div class="image-wrapper">
//                       <img src="https://www.matsu-nsa.gov.tw/FileArtPic.ashx?id=2913&w=1280&h=960" alt="">
//                     </div>
//                     <div class="content">
//                       <h2 class="title">友誼山莊簡餐</h2>
//                       <p><span>連江縣莒光鄉田澳村67號</span></p>
//                     </div>
//                   </li>
//                   <li class="item">
//                     <div class="image-wrapper">
//                       <img src="https://www.matsu-nsa.gov.tw/FileArtPic.ashx?id=2913&w=1280&h=960" alt="">
//                     </div>
//                     <div class="content">
//                       <h2 class="title">友誼山莊簡餐</h2>
//                       <p><span>連江縣莒光鄉田澳村67號</span></p>
//                     </div>
//                   </li>
//                   <li class="item">
//                     <div class="image-wrapper">
//                       <img src="https://www.matsu-nsa.gov.tw/FileArtPic.ashx?id=2913&w=1280&h=960" alt="">
//                     </div>
//                     <div class="content">
//                       <h2 class="title">友誼山莊簡餐</h2>
//                       <p><span>連江縣莒光鄉田澳村67號</span></p>
//                     </div>
//                   </li>
//                   <li class="item">
//                     <div class="image-wrapper">
//                       <img src="https://www.matsu-nsa.gov.tw/FileArtPic.ashx?id=2913&w=1280&h=960" alt="">
//                     </div>
//                     <div class="content">
//                       <h2 class="title">友誼山莊簡餐</h2>
//                       <p><span>連江縣莒光鄉田澳村67號</span></p>
//                     </div>
//                   </li>
//                   <li class="item">
//                     <div class="image-wrapper">
//                       <img src="https://www.matsu-nsa.gov.tw/FileArtPic.ashx?id=2913&w=1280&h=960" alt="">
//                     </div>
//                     <div class="content">
//                       <h2 class="title">友誼山莊簡餐</h2>
//                       <p><span>連江縣莒光鄉田澳村67號</span></p>
//                     </div>
//                   </li>
//                   <li class="item">
//                     <div class="image-wrapper">
//                       <img src="https://www.matsu-nsa.gov.tw/FileArtPic.ashx?id=2913&w=1280&h=960" alt="">
//                     </div>
//                     <div class="content">
//                       <h2 class="title">友誼山莊簡餐</h2>
//                       <p><span>連江縣莒光鄉田澳村67號</span></p>
//                     </div>
//                   </li>
//                   <li class="item">
//                     <div class="image-wrapper">
//                       <img src="https://www.matsu-nsa.gov.tw/FileArtPic.ashx?id=2913&w=1280&h=960" alt="">
//                     </div>
//                     <div class="content">
//                       <h2 class="title">友誼山莊簡餐</h2>
//                       <p><span>連江縣莒光鄉田澳村67號</span></p>
//                     </div>
//                   </li>
//                 </ul>
//               </div>
//             </section>
//             
//             

// <li class="card shadow-large">
//   <div class="image-wrapper"><img src="undefined" alt=""></div>
//     <div class="content">
//       <h1 class="title">馬祖年度節慶活動 (Matsu Festival Activities)</h1>
//       <p class="description">馬祖民俗節慶活動，最熱鬧的過年，一路到九月的馬祖昇天祭，還有扛乩、擺暝等特殊文化，元宵節是其中之最，從農曆元月十一日開始，可以一路延續到元月十九、甚至是二十日！</p>
//       <div class="info">
//         <div class="area" style="display: flex; align-items:center;"><svg width="24" height="24"><path d="M12 21.7778C12 21.7778 20 16.4444 20 10.2222C20 8.10048 19.1571 6.06565 17.6569 4.56536C16.1566 3.06507 14.1217 2.22221 12 2.22221C9.87827 2.22221 7.84344 3.06507 6.34315 4.56536C4.84285 6.06565 4 8.10048 4 10.2222C4 16.4444 12 21.7778 12 21.7778ZM14.6676 10.2224C14.6676 11.6952 13.4736 12.8891 12.0009 12.8891C10.5281 12.8891 9.33421 11.6952 9.33421 10.2224C9.33421 8.74965 10.5281 7.55574 12.0009 7.55574C13.4736 7.55574 14.6676 8.74965 14.6676 10.2224Z" fill="#ff1d6c"></path></svg>連江縣南竿鄉仁愛村95-1號</div>
//           <button data-actNum="0">活動詳情</button>
//       </div>
//     </div>
// </li>

// <li class="card shadow-large">
//   <div class="image-wrapper"><img src="undefined" alt=""></div>
//     <div class="content">
//       <h1 class="title">2021綠島海陸聯合跨年活動</h1>
//       <p class="description">跨年，代表著向舊一年的道別，代表著向新一年的期待，是人們聚集相歡的一夜，是大家滿懷期待的一刻，而本次【2021攜手潛進-綠島海陸聯合跨年活動，舉辦全台唯一海陸聯合跨年晚會，並以【陸地(演唱會型態)，及【海底-水肺海底夜潛】之方式，做為本活動的最大亮點，期望綠島在新的一年能一起【攜手潛進】。活動日期：2020/12/31-2121/1/1活動時間：19:30-00:30      活動地點：綠島鄉石朗潛水區活動對象：跨年活動參與人員不限制，海底跨年活動需潛導陪同並著完整裝備(50人)海底跨年活動報名網址: https://bit.ly/3qD3s59活動洽詢專線: 02-7730-9993*126活動行程表：   (1)海陸跨年活動流程表19：30-20：00■ 長官/貴賓進場20：00-20：05■ 主持人開場-黑面/妞妞20：05-21：00■ 表演藝人-黃錦雯/東布青樂團21：00-21：25■ 第一階段摸彩/幸運一把抓21：25-22：15■ 表演藝人-熊海靈/楊肅浩22：15-22：40■ 第二階段摸彩/幸運一把抓22：40-23：05■ 表演藝人-高蕾雅23：05-23：15■ 幸運一把抓23：15-23：45■ 表演藝人-妮可醬23：45-23：50■ 長官貴賓出場秀23：50-23：58■ 介紹長官貴賓/致詞23：58-00：05■ 海陸聯合倒數迎新年00：05-00：25■ 表演藝人-張艾莉（鳳娘）00：25-00：30■ 第三階段摸彩*實際活動流程以官方公告為準。活動詳情請參閱:綠島鄉公所網站：https://www.lyudao.gov.tw/潛進綠島FB粉絲專頁:https://www.facebook.com/DiveGreenIsland.Taiwan/&lt;資訊提供:綠島鄉公所&gt;</p>
//       <div class="info">
//         <div class="area" style="display: flex; align-items:center;"><svg width="24" height="24"><path d="M12 21.7778C12 21.7778 20 16.4444 20 10.2222C20 8.10048 19.1571 6.06565 17.6569 4.56536C16.1566 3.06507 14.1217 2.22221 12 2.22221C9.87827 2.22221 7.84344 3.06507 6.34315 4.56536C4.84285 6.06565 4 8.10048 4 10.2222C4 16.4444 12 21.7778 12 21.7778ZM14.6676 10.2224C14.6676 11.6952 13.4736 12.8891 12.0009 12.8891C10.5281 12.8891 9.33421 11.6952 9.33421 10.2224C9.33421 8.74965 10.5281 7.55574 12.0009 7.55574C13.4736 7.55574 14.6676 8.74965 14.6676 10.2224Z" fill="#ff1d6c"></path></svg>詳見官網</div>
//           <button data-actNum="1">活動詳情</button>
//       </div>
//     </div>
// </li>

// <li class="card shadow-large">
//   <div class="image-wrapper"><img src="undefined" alt=""></div>
//     <div class="content">
//       <h1 class="title">【取消辦理】2021年綠島海上長泳活動</h1>
//       <p class="description">綠島鄉公所為配合政府防疫政策，宣佈2021年綠島海上長泳活動停辦，退費相關說明如下：一、 海上長泳選手一律退半價報名費460元。二、 代訂便當之選手退回80元便當費用。三、 退費申請日期自110年5月17日起至5月21止，退費作業則於110年5月31日前完成。四、 退費請上伊貝特報名網https://bao-ming.com/eb/content/4740#regquery申請退費，如有任何疑義，請洽馬蘭文藝企業社 許雅惠0932-817073。五、 111年度綠島海上長泳日期暫定為111年5月22日，凡今年參與賽事之選手明年報名費可享九折優惠。六、 依據報名簡章內第八條明列：停辦事宜：如遇天災或不可抗拒之原因停辦時，以主辦單位：綠島鄉公所發佈為準，並將所有紀念品及贈品寄到聯絡人之地址。若同意以上辦法再行報名，一經報名如遇停辦情事，主辦單位依本條款辦理停辦事宜。因此承辦廠商(馬蘭文藝企業社)將於110年5月31日前完成選手物資的寄送。七、 台鐵已公告於110年5月11日(含當日)前申購之團體票，可申請取消或退票免收退票手續費。綠島鄉公所亦將發文函綠島鄉內業者柔性勸導全額退費事宜，疫情期間請選手互相體諒，也期待明年綠島再見。</p>
//       <div class="info">
//         <div class="area" style="display: flex; align-items:center;"><svg width="24" height="24"><path d="M12 21.7778C12 21.7778 20 16.4444 20 10.2222C20 8.10048 19.1571 6.06565 17.6569 4.56536C16.1566 3.06507 14.1217 2.22221 12 2.22221C9.87827 2.22221 7.84344 3.06507 6.34315 4.56536C4.84285 6.06565 4 8.10048 4 10.2222C4 16.4444 12 21.7778 12 21.7778ZM14.6676 10.2224C14.6676 11.6952 13.4736 12.8891 12.0009 12.8891C10.5281 12.8891 9.33421 11.6952 9.33421 10.2224C9.33421 8.74965 10.5281 7.55574 12.0009 7.55574C13.4736 7.55574 14.6676 8.74965 14.6676 10.2224Z" fill="#ff1d6c"></path></svg>詳見官網</div>
//           <button data-actNum="2">活動詳情</button>
//       </div>
//     </div>
// </li>

// <li class="card shadow-large">
//   <div class="image-wrapper"><img src="undefined" alt=""></div>
//     <div class="content">
//       <h1 class="title">2021臺灣國際衝浪公開賽</h1>
//       <p class="description">臺東濱海地區的海浪得天獨厚，加上秋冬之際吹東北季風，助長東河、金樽一帶浪勢，臺東被世界衝浪聯盟指定為國際衝浪比賽的場地，成為臺灣唯一具國際級衝浪巡迴賽事場地，藉由賽事舉辦，讓國際衝浪選手挑戰臺東浪點，也讓全世界有機會認識臺灣東海岸的美麗。✨2021臺灣國際衝浪公開賽 雙主場預備備✨ #臺灣國際衝浪公開賽 即將來襲！史上首次加碼雙主場形式 #東浪嘉年華 搶先在11月20日登場～今年將要打造臺灣最大海上運動盛會，早上看衝浪比賽、下午放風箏、晚上一起在沙灘下賞星空看電影，還有一系列超多精彩活動等你來體驗！臺灣國際衝浪公開賽&mdash;東浪嘉年華活動日期：110年11月20日-11月28日​活動地點：卑南鄉．杉原海水浴場SUP競速挑戰賽沙灘排球挑戰賽大型風箏展演 海洋環保藝術特展沙灘星空電影院杉原灣潮間帶導覽活動風動地景藝術衝浪模擬機體驗黑潮海洋音樂會(閉幕活動) 臺灣國際衝浪公開賽&mdash;臺東挑戰賽活動日期：110年11月24日-11月28日​活動地點：東河鄉．金樽漁港活動內容：台東挑戰賽-職業/業餘各項衝浪賽事衝浪好好玩體驗活動</p>
//       <div class="info">
//         <div class="area" style="display: flex; align-items:center;"><svg width="24" height="24"><path d="M12 21.7778C12 21.7778 20 16.4444 20 10.2222C20 8.10048 19.1571 6.06565 17.6569 4.56536C16.1566 3.06507 14.1217 2.22221 12 2.22221C9.87827 2.22221 7.84344 3.06507 6.34315 4.56536C4.84285 6.06565 4 8.10048 4 10.2222C4 16.4444 12 21.7778 12 21.7778ZM14.6676 10.2224C14.6676 11.6952 13.4736 12.8891 12.0009 12.8891C10.5281 12.8891 9.33421 11.6952 9.33421 10.2224C9.33421 8.74965 10.5281 7.55574 12.0009 7.55574C13.4736 7.55574 14.6676 8.74965 14.6676 10.2224Z" fill="#ff1d6c"></path></svg>詳見官網</div>
//           <button data-actNum="3">活動詳情</button>
//       </div>
//     </div>
// </li>

// <li class="card shadow-large">
//   <div class="image-wrapper"><img src="https://www.taiwan.net.tw/att/event/50882fb8-6e13-49dc-8d8a-f7b83de20fe3.jpg" alt=""></div>
//     <div class="content">
//       <h1 class="title">2021日月潭萬人泳渡</h1>
//       <p class="description">起始於1983年的日月潭國際萬人泳渡活動，每年中秋節前後舉辦，是日月潭最具歷史與規模的活動，2002年正式列入世界游泳名人堂。泳渡全程約3,000公尺，每年均吸引來自海內外四面八方上萬名游泳愛好者參加，幾乎在開放報名即迅速額滿的「日月潭萬人泳渡」嘉年華盛事，場面盛況空前。</p>
//       <div class="info">
//         <div class="area" style="display: flex; align-items:center;"><svg width="24" height="24"><path d="M12 21.7778C12 21.7778 20 16.4444 20 10.2222C20 8.10048 19.1571 6.06565 17.6569 4.56536C16.1566 3.06507 14.1217 2.22221 12 2.22221C9.87827 2.22221 7.84344 3.06507 6.34315 4.56536C4.84285 6.06565 4 8.10048 4 10.2222C4 16.4444 12 21.7778 12 21.7778ZM14.6676 10.2224C14.6676 11.6952 13.4736 12.8891 12.0009 12.8891C10.5281 12.8891 9.33421 11.6952 9.33421 10.2224C9.33421 8.74965 10.5281 7.55574 12.0009 7.55574C13.4736 7.55574 14.6676 8.74965 14.6676 10.2224Z" fill="#ff1d6c"></path></svg>南投縣 魚池鄉</div>
//           <button data-actNum="4">活動詳情</button>
//       </div>
//     </div>
// </li>

// <li class="card shadow-large">
//   <div class="image-wrapper"><img src="https://www.taiwan.net.tw/att/event/d9db59b2-9d6d-4d7e-8231-fed0d97bcc52.jpg" alt=""></div>
//     <div class="content">
//       <h1 class="title">2021日月潭花火音樂嘉年華</h1>
//       <p class="description">日月潭花火音樂嘉年華系列活動自民國97年（西元2008年）起舉辦迄今，將觀光結合文化，以「藝文為主，花火為輔」作為活動主軸，邀請國內知名樂團，將大型藝術表演活動，搭配施放炫爛煙火，高品質的音樂花火聲光饗宴，在日月潭浪漫唯美之自然山光水景特色中演出，創造日月潭獨特之藝文氣息。近年來更逐漸導入自行車、馬拉松、紅茶產業文化、婚紗旅遊等多元主題，發展一系列高品質戶外展演及觀光活動，塑造多元嘉年華盛事意象，為日月潭嘉年華活動奠定深刻之「藝文表演」與「運動休閒」高優質旅遊印象，每年10-11月的日月潭花火音樂嘉年華活動已成為秋遊日月潭年度重大盛會。    10/30 NTSO臺灣青年交響樂團花火音樂會    暫定19:00開演，演出結束後施放煙火    10/30-10/31 紅茶文化季    10:00-16:00    11/13 日月潭Come!BikeDay自行車嘉年華    報到時間及地點視活動路線及內容而定，報名資訊後續公告</p>
//       <div class="info">
//         <div class="area" style="display: flex; align-items:center;"><svg width="24" height="24"><path d="M12 21.7778C12 21.7778 20 16.4444 20 10.2222C20 8.10048 19.1571 6.06565 17.6569 4.56536C16.1566 3.06507 14.1217 2.22221 12 2.22221C9.87827 2.22221 7.84344 3.06507 6.34315 4.56536C4.84285 6.06565 4 8.10048 4 10.2222C4 16.4444 12 21.7778 12 21.7778ZM14.6676 10.2224C14.6676 11.6952 13.4736 12.8891 12.0009 12.8891C10.5281 12.8891 9.33421 11.6952 9.33421 10.2224C9.33421 8.74965 10.5281 7.55574 12.0009 7.55574C13.4736 7.55574 14.6676 8.74965 14.6676 10.2224Z" fill="#ff1d6c"></path></svg>南投縣 魚池鄉</div>
//           <button data-actNum="5">活動詳情</button>
//       </div>
//     </div>
// </li>

// <li class="card shadow-large">
//   <div class="image-wrapper"><img src="https://www.taiwan.net.tw/att/event/10de645f-acbb-4447-a71e-45adbef38a7f.jpg" alt=""></div>
//     <div class="content">
//       <h1 class="title">2021南投世界茶業博覽會</h1>
//       <p class="description"><!--2019年南投世界茶業博覽會<!-邁入第10年，-->每年創下優異的營業額，近年與台灣工藝研究發展中心合作並將縣內之茶、竹產業、茶竹文化與創意商品等作行銷宣傳與推廣，藉由活動，不只在創造商機、增加農民的收入，並帶動周邊及整體觀光產業；讓傳統農業轉型，加強品牌行銷，增加市場的競爭力，讓茶與竹之文化創意商品化；茶道與竹藝融合，同時以世界博覽會的形式，展售各國的特色茶樣，展示南投的竹工藝術，呈現多元茶與竹文化，進而塑造出世界台灣島的精神，提高台灣茶葉的曝光率與知名度。眾所期待的千人茶會、千人揉茶、茶與音樂，還有茶薰六覺，亦在大操場或樹蔭下自然呈現。在黃金品茗館裡，可以品飲到來自台灣各地比賽茶的特等茶。中興會堂及青少年活動中心同時邀請中、日、韓等世界各地的茶道展演，使與會的民眾能對國際茶文化、茶產業能有更廣大的認識視野。<!--主題展館涵蓋有世界茶葉之旅、見證台灣茶的茶葉藝文館、黃金品茗館外，今年加入了農村再生館、客家產業館等再地的產業融入不同的文化、特色增加活動精彩度。--></p>
//       <div class="info">
//         <div class="area" style="display: flex; align-items:center;"><svg width="24" height="24"><path d="M12 21.7778C12 21.7778 20 16.4444 20 10.2222C20 8.10048 19.1571 6.06565 17.6569 4.56536C16.1566 3.06507 14.1217 2.22221 12 2.22221C9.87827 2.22221 7.84344 3.06507 6.34315 4.56536C4.84285 6.06565 4 8.10048 4 10.2222C4 16.4444 12 21.7778 12 21.7778ZM14.6676 10.2224C14.6676 11.6952 13.4736 12.8891 12.0009 12.8891C10.5281 12.8891 9.33421 11.6952 9.33421 10.2224C9.33421 8.74965 10.5281 7.55574 12.0009 7.55574C13.4736 7.55574 14.6676 8.74965 14.6676 10.2224Z" fill="#ff1d6c"></path></svg>南投縣 南投市</div>
//           <button data-actNum="6">活動詳情</button>
//       </div>
//     </div>
// </li>

// <li class="card shadow-large">
//   <div class="image-wrapper"><img src="https://www.taiwan.net.tw/att/event/f401957f-72ff-4c95-9a51-b59a6194bed5.jpg" alt=""></div>
//     <div class="content">
//       <h1 class="title">2022合歡山國際暗空公園-星空清境跨年活動</h1>
//       <p class="description">南投縣與各單位多年於合歡山舉辦清境高山跨年晚會活動，今年將活動主軸由傳統跨年晚會轉化成為台灣高山星空遊程之體驗活動，以剛通過美國IDA認證的華語區第一座國際暗空公園作為宣傳主題，在擁有東南亞區最佳的星空觀測環境的合歡山上作為本次活動主舞台，透過現場天文導覽及專業器材進行互動體驗，使民眾有機會在臺灣高山漫天星斗下倒數跨年，用臺灣最美的山景迎接2022年的到來。</p>
//       <div class="info">
//         <div class="area" style="display: flex; align-items:center;"><svg width="24" height="24"><path d="M12 21.7778C12 21.7778 20 16.4444 20 10.2222C20 8.10048 19.1571 6.06565 17.6569 4.56536C16.1566 3.06507 14.1217 2.22221 12 2.22221C9.87827 2.22221 7.84344 3.06507 6.34315 4.56536C4.84285 6.06565 4 8.10048 4 10.2222C4 16.4444 12 21.7778 12 21.7778ZM14.6676 10.2224C14.6676 11.6952 13.4736 12.8891 12.0009 12.8891C10.5281 12.8891 9.33421 11.6952 9.33421 10.2224C9.33421 8.74965 10.5281 7.55574 12.0009 7.55574C13.4736 7.55574 14.6676 8.74965 14.6676 10.2224Z" fill="#ff1d6c"></path></svg>南投縣 仁愛鄉</div>
//           <button data-actNum="7">活動詳情</button>
//       </div>
//     </div>
// </li>
