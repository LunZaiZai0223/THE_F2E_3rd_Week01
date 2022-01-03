import { getData } from './api.js';
import { onlyActAndAtt } from './activities_attractions.js';
import { onlyFoodAndHotels } from './food_hotels.js';
import { Pagination } from './pagination.js';

// Pagination.testing();

// 這邊是回傳一個 promise 
// console.log(getData('https://ptx.transportdata.tw/MOTC/v2/Tourism/Activity?$top=30&$format=JSON').then(data => testingRender(data)));
// getApi('https://ptx.transportdata.tw/MOTC/v2/Tourism/Activity?$top=30&$format=JSON').then(data => console.log(data));

// 這樣子就可以讓串 api 的函式重複利用，而且收到資料後也可以很自由地使用
// https://ptx.transportdata.tw/MOTC/v2/Tourism/Activity?$format=JSON
// https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot?$top=30&$format=JSON
const Control = (() => {
  const activityUlEle = document.querySelector('[data-activity-list]');
  // 這個 Array 目前沒用到，暫時先放著
  const [...closeModalBtns] = document.querySelectorAll('[data-close-modal-buttons]');
  const [...modals] = document.querySelectorAll('[data-modals]');
  const changeModeEle = document.querySelectorAll('[data-change]');
  console.log(changeModeEle);
  const onlyActAndAttEle = changeModeEle[0];
  const onlyFoodAndHotelEle = changeModeEle[1];
  console.log(onlyActAndAttEle, onlyFoodAndHotelEle);

  // 用來控制是不是第一次載入
  let isSecondTimeChangePage = false;

  onlyActAndAttEle.addEventListener('click', () => {
    if (isSecondTimeChangePage) {
      pageInitialize();
    }
    Pagination.initialize();
    document.querySelector('[data-section="activities"]').style.display = 'flex';
    document.querySelector('[data-section="attractions"]').style.display = 'flex';
    onlyActAndAtt.renderActivities();
    onlyActAndAtt.renderAttractions();
    isSecondTimeChangePage = true;
  });

  onlyFoodAndHotelEle.addEventListener('click', () => {
    if (isSecondTimeChangePage) {
      pageInitialize();
    }
    document.querySelector('[data-section="food"]').style.display = 'flex';
    document.querySelector('[data-section="hotels"]').style.display = 'flex';
    onlyFoodAndHotels.initialize();
    onlyFoodAndHotels.foodSecondLoad();
    Pagination.initialize();
    isSecondTimeChangePage = true;
  });

  // 之後要整理一下初始化要做什麼事情
  addCloseModalEvent();

  // false => 搜尋只會出現景點、活動
  // true => 搜尋只會出現美食、住宿
  let mode = false;

  // 不管怎樣都會有 query $format=JSON，所以要有 ?
  let baseUrl = 'https://ptx.transportdata.tw/MOTC/v2/Tourism/';
  // 用來當作暫存
  // 以便使用者之後點擊詳細資料的時候找不到
  // 每次得到新回覆（response）記得要更新暫存的資料
  let activitiesWithPic = [];
  let attractionsArr = [];
  let foodArr = [];
  let hotelsArr = [];

  /*
  getters and setters
  */
  function getActivitiesArr () {
    return activitiesWithPic;
  }
  function setActivitiesArr (newData) {
    activitiesWithPic = newData;
    console.log(activitiesWithPic);
  }
  function getAttractionsArr () {
    return attractionsArr;
  }
  function setAttractionsArr (newData) {
    attractionsArr = newData;
  }
  function getHotelsArr () {
    return hotelsArr;
  }
  function setHotelsArr (newData) {
    hotelsArr = newData;
  }
  function setFoodArr (newData) {
    foodArr = newData;
  }
  function pageInitialize () {
    const lowerPartSectionEle = document.querySelector('.lower-part');
    lowerPartSectionEle.innerHTML = `
    <div class="city"></div>
    <h4 class="activity-title"><svg style="margin-right: 6px; transform: translateY(2px);" width="20" height="17"><path d="M10 0L0 16.1905H20L10 0Z" fill="#FF1D6C"></path></svg>熱門活動</h4>
    <ul class="activity-list-wrapper" data-activity-list></ul>
    <div class="pagination" data-section="activities">
      <button data-pagination="pre" data-length="8" style="display: flex;">PRE</button>
      <span>1</span>
      <button data-pagination="next" data-length="8">NEXT</button>
    </div>
    <h4 class="activity-title normal-title">
      <svg style="margin-right: 6px; transform: translateY(2px);" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="20" height="20" transform="matrix(-1 0 0 1 20 0)" fill="#FFB72C"/>
    </svg>熱門餐飲</h4>
    <ul class="food-list-wrapper" data-list="food"></ul>
    <div class="pagination" data-section="food">
      <button data-pagination="pre" data-length="20" style="display: flex;">PRE</button>
      <span>1</span>
      <button data-pagination="next" data-length="20">NEXT</button>
    </div>
    <div class="attractions">
      <h4 style="display:flex; align-items:center" class="activity-title normal-title">
        <svg style="margin-right: 6px" width="20" height="20" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="6" cy="6" r="5.5" fill="#007350"/>
        </svg>熱門景點
      </h4>
      <ul class="attraction-list" data-list="attraction"></ul>
      <div class="pagination" data-section="attractions">
        <button data-pagination="pre" data-length="20" style="display: flex;">PRE</button>
        <span>1</span>
        <button data-pagination="next" data-length="20">NEXT</button>
      </div>
    </div>
    <div class="hotels">
      <h4 style="display:flex; align-items:center" class="activity-title normal-title">
        <svg style="margin-right: 6px" width="20" height="20" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="6" cy="6" r="5.5" fill="#007350"/></svg>熱門住宿
      </h4>
      <ul class="attraction-list" data-list="hotels"></ul>
      <div class="pagination" data-section="hotels">
        <button data-pagination="pre" data-length="20" style="display: flex;">PRE</button>
        <span>1</span>
        <button data-pagination="next" data-length="20">NEXT</button>
      </div>
    </div>
    `;
  }



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
    // console.log(apiUrl);
    return apiUrl;
  };
  const Search = (() => {
    const searchFormEle = document.querySelector('[data-searchForm]');
    const typeSelectEle = document.querySelector('select[name="searchingType"]');
    const areaSelectEle = document.querySelector('select[name="area"]');

    console.log(typeSelectEle);
    console.log(areaSelectEle);

    addSubmitEventToSearchFormEle();


    function addSubmitEventToSearchFormEle () {
      searchFormEle.addEventListener('submit', submitHandler);
    }
    function submitHandler (event) {
      event.preventDefault();
      console.log(typeSelectEle.value, areaSelectEle.value);
      console.log({ typeSelectValue: typeSelectEle.value, areaSelectValue: areaSelectEle.value });
      searchRender({ typeSelectValue: typeSelectEle.value, areaSelectValue: areaSelectEle.value });
    }
    function searchRender ({ typeSelectValue, areaSelectValue }) {
      if (typeSelectValue === 'default') return console.log('沒選擇類別的篩選');
      // 第二次載入要馬上新增 DOM => 因為是用移除的，所以一次要給全部的東西
      if (isSecondTimeChangePage) { pageInitialize(); }
      if (typeSelectValue === '景點活動') {
        if (document.querySelector('.normal-title')) {
          document.querySelector('.normal-title').remove();
        }
        console.log('開始搜尋景點活動');
        getDataWithArea(typeSelectValue, areaSelectValue);
      } else if (typeSelectValue === '美食住宿') {
        getDataWithArea(typeSelectValue, areaSelectValue);
      }
      isSecondTimeChangePage = true;
    }
    // https://ptx.transportdata.tw/MOTC/v2/Tourism/Activity/Taipei?$top=30&$format=JSON
    // https://ptx.transportdata.tw/MOTC/v2/Tourism/Activity/NewTaipei?$top=30&$format=JSON
    function getDataWithArea (typeSelectValue, areaSelectValue) {
      // setApiUrl(baseUrl, 'Activity?', ['$format=JSON', '$top=30']));
      // https://ptx.transportdata.tw/MOTC/v2/Tourism/
      if (typeSelectValue === '景點活動') {
        const url1 = setApiUrl(baseUrl, `Activity/${areaSelectValue}?`, ['$format=JSON', '$top=8']);
        getData(url1).then(dataWithArea => {
          console.log(dataWithArea);
          onlyActAndAtt.renderActivities(dataWithArea);
        });
        const url2 = setApiUrl(baseUrl, `ScenicSpot/${areaSelectValue}?`, ['format=JSON', '$top=20']);
        getData(url2).then(dataWithArea => {
          console.log(dataWithArea);
          onlyActAndAtt.renderAttractions(dataWithArea);
        });
      } else if (typeSelectValue === '美食住宿') {
        onlyFoodAndHotels.initialize();
        // https://ptx.transportdata.tw/MOTC/v2/Tourism/Restaurant/Taipei?$top=50&$format=JSON
        const url1 = setApiUrl(baseUrl, `Restaurant/${areaSelectValue}?`, ['$format=JSON', '$top=20']);
        getData(url1).then(dataWithArea => {
          console.log(dataWithArea);
          foodArr = dataWithArea;
          // const item = onlyFoodAndHotels.createFoodIdem(dataWithArea);
          // document.querySelector('[data-list="food"]');
          renderFood(dataWithArea, document.querySelector('[data-list="food"]'));
          // onlyFoodAndHotels.render()
        });
        // /Hotel/Taipei?
        const url2 = setApiUrl(baseUrl, `Hotel/${areaSelectValue}?`, ['$format=JSON', '$top=20']);
        getData(url2).then(dataWithArea => {
          console.log(dataWithArea);
          setHotelsArr(dataWithArea);
          addClickEventToUlEle(document.querySelector('.hotels ul'));
          const item = onlyFoodAndHotels.createHotelIdem(dataWithArea);
          onlyFoodAndHotels.render(document.querySelector('.hotels ul'), item);
        });
      }
    }

  })();
  // 一開始只顯示 4 筆活動的資料
  function getRandomActivities (url) {
    const data = getData(url).then(data => {
      console.log(data);
      // 0 => falsy
      let i = 0;
      while (activitiesWithPic.length < 4) {
        if (!!Object.keys(data[i].Picture).length !== false) {
          activitiesWithPic.push(data[i]);
        }
        i++;
      }
      renderActivies(activitiesWithPic, activityUlEle);
      addEventToActivitiesBtns();
    });
  }
  function getFoodData (url) {
    const data = getData(url).then(data => {
      foodArr = data;
      renderFood(foodArr);
    });
  }
  function renderActivies (data, ulEle) {
    let content = '';
    data.forEach((value, currentIndex) => {
      if (Object.values(value.Picture).length) {
        content += `
      <li class="card shadow-large">
        <div class="image-wrapper"><img src="${value.Picture.PictureUrl1}" alt=""></div>
          <div class="content">
            <h1 class="title">${value.ActivityName}</h1>
            <p class="description">${value.Description}</p>
            <div class="info">
              <div class="area" style="display: flex; align-items:center;"><svg width="24" height="24"><path d="M12 21.7778C12 21.7778 20 16.4444 20 10.2222C20 8.10048 19.1571 6.06565 17.6569 4.56536C16.1566 3.06507 14.1217 2.22221 12 2.22221C9.87827 2.22221 7.84344 3.06507 6.34315 4.56536C4.84285 6.06565 4 8.10048 4 10.2222C4 16.4444 12 21.7778 12 21.7778ZM14.6676 10.2224C14.6676 11.6952 13.4736 12.8891 12.0009 12.8891C10.5281 12.8891 9.33421 11.6952 9.33421 10.2224C9.33421 8.74965 10.5281 7.55574 12.0009 7.55574C13.4736 7.55574 14.6676 8.74965 14.6676 10.2224Z" fill="#ff1d6c"></path></svg>${value.Location}</div>
                <button data-actNum="${currentIndex}">活動詳情</button>
            </div>
          </div>
      </li>
      `;
      } else {
        content += `
      <li class="card shadow-large">
        <div class="image-wrapper"><img src="https://jason71708.github.io/F2E2021-taiwan-tourist-attractions/static/media/image-placeholder.23273286.svg" alt=""></div>
          <div class="content">
            <h1 class="title">${value.ActivityName}</h1>
            <p class="description">${value.Description}</p>
            <div class="info">
              <div class="area" style="display: flex; align-items:center;"><svg width="24" height="24"><path d="M12 21.7778C12 21.7778 20 16.4444 20 10.2222C20 8.10048 19.1571 6.06565 17.6569 4.56536C16.1566 3.06507 14.1217 2.22221 12 2.22221C9.87827 2.22221 7.84344 3.06507 6.34315 4.56536C4.84285 6.06565 4 8.10048 4 10.2222C4 16.4444 12 21.7778 12 21.7778ZM14.6676 10.2224C14.6676 11.6952 13.4736 12.8891 12.0009 12.8891C10.5281 12.8891 9.33421 11.6952 9.33421 10.2224C9.33421 8.74965 10.5281 7.55574 12.0009 7.55574C13.4736 7.55574 14.6676 8.74965 14.6676 10.2224Z" fill="#ff1d6c"></path></svg>${value.Location}</div>
                <button data-actNum="${currentIndex}">活動詳情</button>
            </div>
          </div>
      </li>
      `;
      }
    });
    if (ulEle) {
      ulEle.innerHTML = content;
    }
    return content;
  }
  function renderFood (data, ul) {
    let ulEle = '';
    if (ul) {
      ulEle = ul;
    } else {
      ulEle = document.querySelectorAll('[data-list]')[0];
    }
    let content = '';
    data.forEach((obj, currentIndex) => {
      if (obj.Picture.PictureUrl1 !== undefined) {
        content += `
        <li class="item shadow" data-index=${currentIndex}>
          <div class="image-wrapper">
            <img src="${obj.Picture.PictureUrl1}" alt="">
          </div>
          <div class="content">
            <h2 class="title">${obj.RestaurantName}</h2>
            <p><span><svg style="transform: translateY(3px);" width="16" height="16"><path d="M5.5 13.4444C5.5 13.4444 11 9.77778 11 5.5C11 4.04131 10.4205 2.64236 9.38909 1.61091C8.35764 0.579463 6.95869 0 5.5 0C4.04131 0 2.64236 0.579463 1.61091 1.61091C0.579463 2.64236 0 4.04131 0 5.5C0 9.77778 5.5 13.4444 5.5 13.4444ZM7.33388 5.49991C7.33388 6.51243 6.51307 7.33324 5.50055 7.33324C4.48803 7.33324 3.66721 6.51243 3.66721 5.49991C3.66721 4.48739 4.48803 3.66658 5.50055 3.66658C6.51307 3.66658 7.33388 4.48739 7.33388 5.49991Z" fill="#ff1d6c"></path></svg>${obj.Address}</span></p>
          </div>
        </li>
        `;
      } else {
        content += `
        <li class="item shadow" data-index=${currentIndex}>
          <div class="image-wrapper">
            <img src="https://raw.githubusercontent.com/LunZaiZai0223/THE_F2E_3rd_Week01/main/src/images/placeholder.svg" alt="">
          </div>
          <div class="content">
            <h2 class="title">${obj.RestaurantName}</h2>
            <p><span><svg style="transform: translateY(3px);" width="16" height="16"><path d="M5.5 13.4444C5.5 13.4444 11 9.77778 11 5.5C11 4.04131 10.4205 2.64236 9.38909 1.61091C8.35764 0.579463 6.95869 0 5.5 0C4.04131 0 2.64236 0.579463 1.61091 1.61091C0.579463 2.64236 0 4.04131 0 5.5C0 9.77778 5.5 13.4444 5.5 13.4444ZM7.33388 5.49991C7.33388 6.51243 6.51307 7.33324 5.50055 7.33324C4.48803 7.33324 3.66721 6.51243 3.66721 5.49991C3.66721 4.48739 4.48803 3.66658 5.50055 3.66658C6.51307 3.66658 7.33388 4.48739 7.33388 5.49991Z" fill="#ff1d6c"></path></svg>${obj.Address}</span></p>
          </div>
        </li>
        `;
      }
      ulEle.innerHTML = content;
    });
    addClickEventToUlEle(ulEle);
  }
  function getAttractionsData (url) {
    const data = getData(url).then(data => {
      renderAttractions(data);
    });
  }
  function renderAttractions (data, ul) {
    attractionsArr = data;
    let ulEle;
    if (!ul) {
      ulEle = document.querySelectorAll('[data-list]')[1];
    } else {
      ulEle = ul;
    }
    let content = '';
    data.forEach((obj, currentIndex) => {
      const { ScenicSpotName, DescriptionDetail, Picture } = obj;
      const { PictureUrl1 } = obj.Picture;
      if (PictureUrl1) {
        content += `
        <li class="item shadow" data-index=${currentIndex}>
          <div class="background-image" style="background-image: url(${PictureUrl1})">
          </div>
          <div class="content">
            <h2 class="title">${ScenicSpotName}</h2>
            <p>${DescriptionDetail}</p>
          </div>
        </li>
        `;
      } else {
        content += `
        <li class="item shadow" data-index=${currentIndex}>
          <div class="background-image">
          </div>
          <div class="content">
            <h2 class="title">${ScenicSpotName}</h2>
            <p>${DescriptionDetail}</p>
          </div>
        </li>
        `;
      }
    });
    ulEle.innerHTML = content;
    addClickEventToUlEle(ulEle);
  }

  /*
  activities btns events
   */
  function addEventToActivitiesBtns () {
    const [...btns] = document.querySelectorAll('[data-actNum]');
    btns.forEach(btn => { btn.addEventListener('click', actBtnsClickHandler); });
  }
  function actBtnsClickHandler (event) {
    console.log('我其實叫的到喔，因為我在 addEventToActivitiesBtns 的函式裡');
    console.log(activitiesWithPic);
    const index = event.target.dataset.actnum;
    const selectedData = activitiesWithPic[index];
    console.log(selectedData);
    changeActDialogContent(selectedData);
    openModal(modals[0]);
  }
  function changeActDialogContent (selectedData) {
    const imageWrapper = document.querySelector('#dialog [data-image-wrapper]');
    const title = document.querySelector('#dialog h3');
    const description = document.querySelector('#dialog p');
    const time = document.querySelector('#dialog [data-time]');
    const ticket = document.querySelector('#dialog [data-ticket]');
    const location = document.querySelector('#dialog [data-location]');
    const category = document.querySelector('#dialog [data-category]');
    imageWrapper.innerHTML = `<img src="${selectedData.Picture.PictureUrl1}" alt="">`;
    title.innerText = selectedData.Name || selectedData.ActivityName || selectedData.RestaurantName || selectedData.ScenicSpotName;
    description.innerText = selectedData.Description;
    time.innerText = `${selectedData.StartTime.split('T')[0]}`;
    ticket.innerText = selectedData.Charge || '免費';
    location.innerText = selectedData.Location;
    category.innerText = selectedData.Class1;
  }
  function changeAttDialogContent (selectedData) {
    const { Address, DescriptionDetail, Name, OpenTime, TicketInfo, Class1 } = selectedData;
    const { PictureUrl1 } = selectedData.Picture;
    const imageWrapper = document.querySelector('#dialog [data-image-wrapper]');
    const title = document.querySelector('#dialog h3');
    const description = document.querySelector('#dialog p');
    const time = document.querySelector('#dialog [data-time]');
    const ticket = document.querySelector('#dialog [data-ticket]');
    const location = document.querySelector('#dialog [data-location]');
    // 有 class1 的 property 才需要
    const category = document.querySelector('#dialog [data-category]');
    imageWrapper.classList.remove('image-wrapper');
    imageWrapper.classList.add('background-image');
    imageWrapper.innerHTML = '';
    if (PictureUrl1 !== undefined) {
      imageWrapper.style.backgroundImage = `url(${PictureUrl1})`;
    }
    title.innerText = selectedData.Name || selectedData.ActivityName || selectedData.RestaurantName || selectedData.ScenicSpotName;
    description.innerText = DescriptionDetail;
    time.innerText = OpenTime;
    if (TicketInfo !== undefined) {
      ticket.innerText = TicketInfo;
    } else {
      ticket.closest('.item').style.display = 'none';
    }
    if (Address !== undefined) {
      location.innerText = Address;
    } else {
      location.closest('.item').style.display = 'none';
    }
    if (Class1 !== undefined) {
      category.innerText = Class1;
    } else {
      category.closest('.item').style.display = 'none';
    }
  }
  function changeFoodDialogContent (selectedData) {
    const { Address, Class, Description, Name, OpenTime, Phone } = selectedData;
    const { PictureUrl1 } = selectedData.Picture;
    const imageWrapper = document.querySelector('#dialog [data-image-wrapper]');
    const title = document.querySelector('#dialog h3');
    const description = document.querySelector('#dialog p');
    const time = document.querySelector('#dialog [data-time]');
    const ticket = document.querySelector('#dialog [data-ticket]');
    const location = document.querySelector('#dialog [data-location]');
    // 有 class1 的 property 才需要
    const category = document.querySelector('#dialog [data-category]');
    imageWrapper.innerHTML = `<img src="${PictureUrl1}" alt="">`;
    title.innerText = Name || selectedData.RestaurantName || selectedData.ScenicSpotName || selectedData.ActivityName;
    description.innerText = Description;
    time.innerText = OpenTime;
    location.innerText = Address;
    if (Class !== undefined) {
      category.innerText = Class;
    } else {
      category.closest('.item').style.display = 'none';
    }
    if (Phone !== undefined) {
      // 餐廳沒有 ticket 所以要改成電話
      ticket.parentElement.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M2.68649 3.33726C2.68834 3.33726 2.642 3.38546 2.58361 3.44292C2.35933 3.66072 1.895 4.11393 1.89032 5.06207C1.88295 6.38834 2.75507 8.85089 6.95443 13.0494C11.1343 17.2274 13.5931 18.1098 14.9222 18.1098H14.9416C15.8898 18.1051 16.342 17.6399 16.5608 17.4165C16.6275 17.3479 16.6813 17.2979 16.7193 17.2664C17.6423 16.3377 18.115 15.6463 18.1104 15.2033C18.1039 14.751 17.5413 14.2162 16.7637 13.4766C16.5163 13.2412 16.2475 12.9854 15.9639 12.7018C15.2289 11.9687 14.8647 12.0938 14.064 12.3756C12.9564 12.7639 11.4365 13.2922 9.07496 10.9297C6.70975 8.56636 7.23896 7.04823 7.62636 5.94069C7.90626 5.13992 8.03416 4.77475 7.29827 4.03886C7.01004 3.75155 6.75146 3.47907 6.51327 3.22883C5.77831 2.45586 5.24818 1.89699 4.79868 1.8905H4.79126C4.34732 1.8905 3.65778 2.36503 2.68186 3.34097C2.68464 3.33819 2.68649 3.33726 2.68649 3.33726ZM14.9231 19.5C12.6135 19.5 9.60231 17.6612 5.97201 14.0327C2.32782 10.3894 0.486253 7.36891 0.500077 5.05465C0.508497 3.52541 1.31018 2.74225 1.6114 2.44845C1.62715 2.42898 1.68091 2.37615 1.69944 2.35762C3.02848 1.02764 3.9247 0.490085 4.81629 0.500138C5.85153 0.514183 6.58834 1.289 7.52071 2.2705C7.75148 2.51332 8.00172 2.77747 8.28069 3.05551C9.63382 4.40866 9.24827 5.5125 8.93872 6.39853C8.60136 7.3652 8.30942 8.19934 10.0574 9.94731C11.8072 11.6953 12.6413 11.4033 13.6043 11.0632C14.4912 10.7536 15.5923 10.3662 16.9472 11.7194C17.2216 11.9937 17.482 12.2412 17.7221 12.4701C18.7082 13.4071 19.4867 14.1476 19.4998 15.1857C19.5108 16.0708 18.9732 16.9726 17.6461 18.3007L17.0585 17.9022L17.5552 18.3878C17.2614 18.689 16.4792 19.4917 14.9491 19.5H14.9231Z" fill="#FF1D6C"/>
        </svg>
        <span>${Phone}</span>
        `;
    } else {
      ticket.closest('.item').style.display = 'none';
    }
  }
  function changeHotelDialogContent (selectedData) {
    const { Address, Class, Description, HotelName, Phone, ParkingInfo } = selectedData;
    const { PictureUrl1 } = selectedData.Picture;

    const imageWrapper = document.querySelector('#dialog [data-image-wrapper]');
    const title = document.querySelector('#dialog h3');
    const description = document.querySelector('#dialog p');
    const time = document.querySelector('#dialog [data-time]');
    const ticket = document.querySelector('#dialog [data-ticket]');
    const location = document.querySelector('#dialog [data-location]');
    // 有 class1 的 property 才需要
    const category = document.querySelector('#dialog [data-category]');

    if (PictureUrl1 !== undefined) {
      imageWrapper.innerHTML = `<img src="${PictureUrl1}" alt="">`;
    } else {
      imageWrapper.innerHTML = `<img src="../images/placeholder.svg" alt="">`;
    }

    title.innerText = HotelName;
    if (Description !== undefined) {
      description.innerText = Description;
    } else {
      description.style.display = 'none';
    }
    // time 沒有
    time.parentElement.innerHTML = `
      <svg width="20" height="17" viewbox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 0L0 16.1905H20L10 0Z" fill="#FF1D6C"></path></svg>
      <span>${ParkingInfo}</span>
      `;
    location.innerText = Address;
    category.innerText = Class;
    // Hotel 沒有 ticket 所以要改成電話
    ticket.parentElement.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M2.68649 3.33726C2.68834 3.33726 2.642 3.38546 2.58361 3.44292C2.35933 3.66072 1.895 4.11393 1.89032 5.06207C1.88295 6.38834 2.75507 8.85089 6.95443 13.0494C11.1343 17.2274 13.5931 18.1098 14.9222 18.1098H14.9416C15.8898 18.1051 16.342 17.6399 16.5608 17.4165C16.6275 17.3479 16.6813 17.2979 16.7193 17.2664C17.6423 16.3377 18.115 15.6463 18.1104 15.2033C18.1039 14.751 17.5413 14.2162 16.7637 13.4766C16.5163 13.2412 16.2475 12.9854 15.9639 12.7018C15.2289 11.9687 14.8647 12.0938 14.064 12.3756C12.9564 12.7639 11.4365 13.2922 9.07496 10.9297C6.70975 8.56636 7.23896 7.04823 7.62636 5.94069C7.90626 5.13992 8.03416 4.77475 7.29827 4.03886C7.01004 3.75155 6.75146 3.47907 6.51327 3.22883C5.77831 2.45586 5.24818 1.89699 4.79868 1.8905H4.79126C4.34732 1.8905 3.65778 2.36503 2.68186 3.34097C2.68464 3.33819 2.68649 3.33726 2.68649 3.33726ZM14.9231 19.5C12.6135 19.5 9.60231 17.6612 5.97201 14.0327C2.32782 10.3894 0.486253 7.36891 0.500077 5.05465C0.508497 3.52541 1.31018 2.74225 1.6114 2.44845C1.62715 2.42898 1.68091 2.37615 1.69944 2.35762C3.02848 1.02764 3.9247 0.490085 4.81629 0.500138C5.85153 0.514183 6.58834 1.289 7.52071 2.2705C7.75148 2.51332 8.00172 2.77747 8.28069 3.05551C9.63382 4.40866 9.24827 5.5125 8.93872 6.39853C8.60136 7.3652 8.30942 8.19934 10.0574 9.94731C11.8072 11.6953 12.6413 11.4033 13.6043 11.0632C14.4912 10.7536 15.5923 10.3662 16.9472 11.7194C17.2216 11.9937 17.482 12.2412 17.7221 12.4701C18.7082 13.4071 19.4867 14.1476 19.4998 15.1857C19.5108 16.0708 18.9732 16.9726 17.6461 18.3007L17.0585 17.9022L17.5552 18.3878C17.2614 18.689 16.4792 19.4917 14.9491 19.5H14.9231Z" fill="#FF1D6C"/>
      </svg>
      <span>${Phone}</span>
      `;
  }
  function addClickEventToUlEle (ulEle) {
    ulEle.addEventListener('click', ulEleClickHandler);
    console.log('ul 時間已經綁定');
  }
  function ulEleClickHandler (event) {
    // 因為一開始 Modal 的內容格式是按照 Activities 的資料
    // 但是 Food 跟 Attractions 的資料會有所不同
    // 1. 判斷區塊
    // 2. 依照區塊的分類來更新 Modal 裡面的資料
    // 3. 開啟 Modal
    // 4. 關閉 Modal 時把 Modal 回覆成最初的樣子（也就是符合 Activities 資料的形式）

    // 點到 Attraction
    // this === event.currentTarget === 設置 event 的 ele
    if (this.dataset.list === 'attraction') {
      // 確保點到 class content 也可以到祖先層
      // => ele.closest() 會往父層找符合參數的 ele
      const index = event.target.closest('[data-index]').dataset.index;
      const selectedData = attractionsArr[index];
      changeAttDialogContent(selectedData);
      openModal(modals[0]);
    }
    // 點到 Food
    if (this.dataset.list === 'food') {
      const index = event.target.closest('[data-index]').dataset.index;
      console.log(foodArr);
      const selectedData = foodArr[index];
      changeFoodDialogContent(selectedData);
      openModal(modals[0]);
    }
    // 點到 Hotels 
    if (this.dataset.list === 'hotels') {
      console.log('點到 hotels');
      const index = event.target.closest('[data-index]').dataset.index;
      const selectedData = hotelsArr[index];
      changeHotelDialogContent(selectedData);
      openModal(modals[0]);
    }
  }
  function openModal (modal) {
    if (modal === null) {
      return console.log('沒有東西，是 null');
    }
    modal.classList.add('is-active');
    modal.parentElement.style.overflow = 'hidden';
  }
  function closeModal (modal) {
    if (modal === null) {
      return console.log('沒有東西，是 null');
    }
    modal.classList.remove('is-active');
    modal.parentElement.removeAttribute('style');
    modalHTMLInitialize();
  }
  function addCloseModalEvent () {
    modals.forEach(modal => {
      modal.addEventListener('click', (event) => {
        console.log(event.target);
        if (event.target.nodeName === 'BUTTON') {
          closeModal(modals[0]);
        }
      });
    });
  }
  function modalHTMLInitialize () {
    modals[0].innerHTML = `
      <div class="dialog" id="dialog">
        <div class="header">
          <button data-close-modal-buttons>&times;</button>
        </div>
        <div class="image-wrapper" data-image-wrapper>
          <img src="https://www.taiwan.net.tw/att/event/50882fb8-6e13-49dc-8d8a-f7b83de20fe3.jpg" alt="">
        </div>
        <h3>名稱</h3>
        <p>內文</p>
        <div class="info-group">
          <div class="item">
            <svg width="20" height="20" viewbox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M10 0.5C15.2383 0.5 19.5 4.7617 19.5 10C19.5 15.2383 15.2383 19.5 10 19.5C4.7617 19.5 0.5 15.2383 0.5 10C0.5 4.7617 4.7617 0.5 10 0.5ZM10 1.925C5.54735 1.925 1.925 5.54735 1.925 10C1.925 14.4527 5.54735 18.075 10 18.075C14.4527 18.075 18.075 14.4527 18.075 10C18.075 5.54735 14.4527 1.925 10 1.925ZM9.67814 5.34063C10.0724 5.34063 10.3906 5.65983 10.3906 6.05313V10.254L13.6254 12.1825C13.9626 12.3849 14.0738 12.8219 13.8724 13.1601C13.7384 13.3833 13.5019 13.5078 13.2596 13.5078C13.1352 13.5078 13.0098 13.4755 12.8948 13.408L9.31334 11.2715C9.09864 11.1423 8.96564 10.9095 8.96564 10.6587V6.05313C8.96564 5.65983 9.28484 5.34063 9.67814 5.34063Z" fill="#FF1D6C"/>
              </svg><span data-time>時間</span>
            </div>
            <div class="item">
              <svg width="20" height="16" viewbox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M15.9218 0.267456C17.8943 0.267456 19.4991 1.85639 19.4991 3.80853L19.5 6.1009C19.5 6.27587 19.4302 6.44555 19.3056 6.56927C19.1819 6.69387 19.0131 6.76369 18.8372 6.76369C18.1417 6.76369 17.5761 7.31867 17.5761 8.0009C17.5761 8.68313 18.1417 9.23811 18.8372 9.23811C19.2031 9.23811 19.5 9.53504 19.5 9.9009V12.1915C19.5 14.1436 17.8952 15.7326 15.9227 15.7326H4.0773C2.10484 15.7326 0.5 14.1436 0.5 12.1915V9.9009C0.5 9.53504 0.79693 9.23811 1.16279 9.23811C1.85828 9.23811 2.42386 8.68313 2.42386 8.0009C2.42386 7.33811 1.88126 6.83792 1.16279 6.83792C0.98693 6.83792 0.81814 6.76811 0.694419 6.6435C0.569814 6.51978 0.5 6.35011 0.5 6.17513L0.500884 3.80853C0.500884 1.85639 2.10572 0.267456 4.07819 0.267456H15.9218ZM15.9218 1.59304H12.2968L12.2973 3.29084C12.2973 3.6567 12.0004 3.95363 11.6345 3.95363C11.2687 3.95363 10.9717 3.6567 10.9717 3.29084L10.9712 1.59304H4.07819C2.83656 1.59304 1.82647 2.58722 1.82647 3.80853L1.82558 5.59187C2.94526 5.86671 3.74944 6.82643 3.74944 8.0009C3.74944 9.18685 2.93112 10.1872 1.82558 10.478V12.1915C1.82558 13.4128 2.83567 14.407 4.0773 14.407H10.9712L10.9717 13.0916C10.9717 12.7248 11.2687 12.4288 11.6345 12.4288C12.0004 12.4288 12.2973 12.7248 12.2973 13.0916L12.2968 14.407H15.9227C17.1643 14.407 18.1744 13.4128 18.1744 12.1915V10.478C17.0689 10.1872 16.2506 9.18685 16.2506 8.0009C16.2506 6.81406 17.068 5.81457 18.1744 5.52383L18.1735 3.80853C18.1735 2.58722 17.1634 1.59304 15.9218 1.59304ZM11.6345 5.1319C12.0004 5.1319 12.2973 5.42883 12.2973 5.79469V10.0551C12.2973 10.421 12.0004 10.7179 11.6345 10.7179C11.2687 10.7179 10.9717 10.421 10.9717 10.0551V5.79469C10.9717 5.42883 11.2687 5.1319 11.6345 5.1319Z" fill="#FF1D6C"/>
                </svg><span data-ticket>票價</span>
              </div>
              <div class="item">
                <svg width="20" height="16" viewbox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M8 19.7777C8 19.7777 16 14.4444 16 8.22217C16 6.10044 15.1571 4.06561 13.6569 2.56531C12.1566 1.06502 10.1217 0.222168 8 0.222168C5.87827 0.222168 3.84344 1.06502 2.34315 2.56531C0.842855 4.06561 0 6.10044 0 8.22217C0 14.4444 8 19.7777 8 19.7777ZM10.6676 8.22236C10.6676 9.69512 9.47364 10.889 8.00088 10.889C6.52812 10.889 5.33421 9.69512 5.33421 8.22236C5.33421 6.7496 6.52812 5.55569 8.00088 5.55569C9.47364 5.55569 10.6676 6.7496 10.6676 8.22236Z" fill="#FF1D6C"/>
                  </svg><span data-location>地點</span>
                </div>
                <div class="item">
                  <svg width="20" height="17" viewbox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 0L0 16.1905H20L10 0Z" fill="#FF1D6C"></path></svg><span data-category>分類</span></div>
                </div>
              </div>
      `;
  }

  // https://ptx.transportdata.tw/MOTC/v2/Tourism/Restaurant?$top=30&$format=JSON
  getRandomActivities(setApiUrl(baseUrl, 'Activity?', ['$format=JSON', '$top=30']));
  getFoodData(setApiUrl(baseUrl, 'Restaurant?', ['$format=JSON', '$top=10']));
  getAttractionsData(setApiUrl(baseUrl, 'ScenicSpot?', ['$format=JSON', '$top=10']));
  // 

  return {
    setApiUrl,
    renderActivies,
    addEventToActivitiesBtns,
    renderAttractions,
    renderFood,
    addClickEventToUlEle,
    getActivitiesArr,
    setActivitiesArr,
    setAttractionsArr,
    setHotelsArr,
    setFoodArr
  };

})();




/*
城市列表拖移
 */
const Slider = (() => {
  const slider = document.querySelector('[data-slider]');
  const sliderInner = document.querySelector('[data-slider-inner]');
  let isPressed = false;
  // 目前滑鼠離 slider 的距離
  let startX;
  let x;

  console.log(slider, sliderInner);

  slider.addEventListener('mousedown', (event) => {
    // slider.style.cursor = ''
    isPressed = true;
    slider.style.cursor = 'grabbing';
    startX = event.offsetX - sliderInner.offsetLeft;
    console.log('現在startX', startX);
    console.log(`sliderInner 距離祖先 city 的 x 軸 px 為${sliderInner.offsetLeft}`);
    console.log(`目前滑鼠至 slider 的 x px 為${event.offsetX}`);
    console.log(`isPressed`, isPressed);
  });

  slider.addEventListener('mouseenter', (event) => {
    console.log("I'm in!");
    slider.style.cursor = 'pointer';
  });

  slider.addEventListener('mouseup', (event) => {
    console.log('起身');
    slider.style.cursor = 'pointer';
  });

  slider.addEventListener('mousemove', (event) => {
    if (!isPressed) return;
    event.preventDefault();
    x = event.offsetX;
    console.log('現在x', x);
    console.log('startX', startX);
    console.log('hello');
    console.log(`${x - startX}`);
    sliderInner.style.left = `${x - startX}px`;
    checkBoundary();
  });

  // window 的時間最後會分配給全部 DOM elements
  // 當然也會給 slider 
  // => 用來控制現在可不可以滑動的開關 （isPressed）
  window.addEventListener('mouseup', (event) => {
    isPressed = false;
    console.log(`isPressed`, isPressed);
    console.log('window mouseup');
  });

  function checkBoundary () {
    const outer = slider.getBoundingClientRect();
    const inner = sliderInner.getBoundingClientRect();

    console.log(outer);
    console.log(inner);

    if (parseInt(sliderInner.style.left) > 0) {
      console.log('觸發');
      sliderInner.style.left = '0px';
    } else if (inner.right < outer.right) {
      console.log('到底了');
      console.log(`-${inner.width - outer.width}px`);
      sliderInner.style.left = `-${inner.width - outer.width}px`;
    }
  }
})();


export { Control };


