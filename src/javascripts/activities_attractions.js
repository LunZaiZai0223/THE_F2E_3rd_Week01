import { getData } from './api.js';
import { Control } from './main.js';

const onlyActAndAtt = (() => {
  // 不管怎樣都會有 query $format=JSON，所以要有 ?
  let baseUrl = 'https://ptx.transportdata.tw/MOTC/v2/Tourism/';
  // 用來計算目前得到幾筆
  let activitiesCount = 8;
  let activitiesSkip = 0;
  let attractionsCount = 20;
  let attractionsSkip = 0;

  // 暫時儲存得到的資料
  let activitiesArr = [];
  let attractionsArr = [];

  function setActivitiesArr (newData) {
    activitiesArr = newData;
  }

  let activityUlEle = document.querySelector('[data-activity-list]');
  let attractonUlEle = document.querySelector('[data-list=attraction]');
  console.log(attractonUlEle);

  const lowerPartSectionEle = document.querySelector('.lower-part');

  const unneededTitleEle = document.querySelector('.normal-title');
  const foodListUlEle = document.querySelector('.food-list-wrapper');
  
  // const activityTitle = document.querySelector('')
  console.log('切換！');
  // 第一次轉換頁面
  function renderActivities (newData) {
    const hotelDivEle = document.querySelector('.hotels');
    const cityDivEle = document.querySelector('.city');
    activityUlEle = document.querySelector('[data-activity-list]');
    attractonUlEle = document.querySelector('[data-list=attraction]');

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
    // 
    // 刪除不需要的部分
    
    if (cityDivEle) {
      cityDivEle.remove();
    }
    unneededTitleEle.remove();
    foodListUlEle.remove();
    if (hotelDivEle) {
      hotelDivEle.remove();
    }

    if (!newData) {
    const url = Control.setApiUrl(baseUrl, 'Activity?', ['$format=JSON', '$top=8']);
    getData(url).then(data => {
      Control.setActivitiesArr(data);
      console.log(Control.getActivitiesArr());
      console.log(activityUlEle);
      // 暫存
      activitiesArr = data;
     
      /*
      渲染畫面 
        1. addModal 事件
       */
      Control.renderActivies(activitiesArr, activityUlEle);
      Control.addEventToActivitiesBtns();
    });
  } else {
    // 為了要彌補我函式寫不靈活的代價 QQ
    // 要重新去更新 main.js 中暫存的資料
    Control.setActivitiesArr(newData);
    Control.renderActivies(activitiesArr, activityUlEle);
    Control.addEventToActivitiesBtns();
  }

  }
  function renderAttractions (newData) {
    if (!newData) {
      const url = Control.setApiUrl(baseUrl, 'ScenicSpot?', ['$format=JSON', `$top=${attractionsCount}`]);
      getData(url).then(data => {
        console.log(data);
        Control.renderAttractions(data, attractonUlEle);
      });
    } else {
      Control.renderAttractions(newData, attractonUlEle);
    }
  }
  function getActivitiesSkip () {
    return activitiesSkip;
  }
  function addActivitiesSkip (num) {
    activitiesSkip += parseInt(num);
  }
  function minusActivitiesSkip (num) {
    activitiesSkip -= parseInt(num);
  }
  function getAttractionsSkip () {
    return attractionsSkip;
  }
  function addAttractionsSkip (num) {
    attractionsSkip += parseInt(num);
  }
  function minusAttractionsSkip (num) {
    attractionsSkip -= parseInt(num); 
  }
  return { 
    renderActivities,
    renderAttractions,
    getActivitiesSkip,
    addActivitiesSkip,
    minusActivitiesSkip,
    setActivitiesArr,
    getAttractionsSkip,
    addAttractionsSkip,
    minusAttractionsSkip
    };
})();

export { onlyActAndAtt };
