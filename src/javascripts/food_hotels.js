import { getData } from './api.js';
import { Control } from './main.js';
import { Pagination } from './pagination.js';

const onlyFoodAndHotels = (() =>{
  let baseUrl = 'https://ptx.transportdata.tw/MOTC/v2/Tourism/';
  let foodSkip = 0;
  let hotelSkip = 0;

  function getFoodSkip () {
    return foodSkip;
  }
  function addFoodSkip (num) {
    foodSkip += parseInt(num);
  }
  function minusFoodSkip (num) {
    foodSkip -= parseInt(num);
  }
  function getHotelSkip () {
    return hotelSkip;
  }
  function addHotelSkip (num) {
    hotelSkip += parseInt(num);
  }
  function munisHotelSkip (num) {
    hotelSkip -= parseInt(num);
  }

  const hotelDivEle = document.querySelector('.hotels');
  const hotelUlEle = document.querySelector('.hotels ul');
/*
1. 移除不要的元素
2. 顯示 pagination
3. 刪掉 pagination 的 event
4. 重新綁定 event
5. hotel 新抓
 */
  function initialize() {
    const cityDivEle = document.querySelector('.city');
    const activitiesWrapper = document.querySelector('.activity-list-wrapper');
    const activitiesPagination = document.querySelector('[data-section="activities"]');
    const unneededTitleEle = document.querySelectorAll('.activity-title');
    const attractionsDivEle = document.querySelector('.attractions');
    cityDivEle.remove();
    activitiesWrapper.remove();
    activitiesPagination.remove();
    unneededTitleEle[0].remove();
    attractionsDivEle.remove();

    hotelDivEle.style.display = 'block';
    Pagination.initialize();

    // 因為是偷吃步先隱藏 hotel 再顯示
    // 所以裡面的資料也要更新
    // 之後函式要想到「靈活度」！！要不然我現在是改到死==
    const url = Control.setApiUrl(baseUrl, 'Hotel?$', ['$format=JSON', '$top=10']);
    getData(url).then(data => {
      Control.setHotelsArr(data);
      Control.addClickEventToUlEle(hotelUlEle);
      render(hotelUlEle, createHotelIdem(data));
    });
  }


  function createHotelIdem (data) {
    let item = '';
    data.forEach((obj, currentIndex) => {
      const { Address, HotelName } = obj;
      const { PictureUrl1 } = obj.Picture;
      if (PictureUrl1 === undefined) {
        item += `
        <li class="item shadow" data-index="${currentIndex}">
          <div class="image-wrapper">
            <img src="https://raw.githubusercontent.com/LunZaiZai0223/THE_F2E_3rd_Week01/main/src/images/placeholder.svg" alt="">
          </div>
          <div class="content">
            <h2 class="title">${HotelName}</h2>
            <p>${Address}</p>
          </div>
        </li>`;
      } else {
        item += `
        <li class="item shadow" data-index="${currentIndex}">
          <div class="image-wrapper">
            <img src="${PictureUrl1}" alt="">
          </div>
          <div class="content">
            <h2 class="title">${HotelName}</h2>
            <p>${Address}</p>
          </div>
        </li>`;
      }
    });
    return item;
  } 
  function createFoodIdem (data) {
    let item = '';
    data.forEach((obj, currentIndex) => {
      const { Name, Address } = obj;
      const { PictureUrl1 } = obj.Picture;
      if (PictureUrl1 !== undefined ) {
        item += `
      <li class="item shadow" data-index=${currentIndex}>
        <div class="image-wrapper">
          <img src="${PictureUrl1}" alt="">
        </div>
        <div class="content">
          <h2 class="title">${Name}</h2>
          <p><span><svg style="transform: translateY(3px);" width="16" height="16"><path d="M5.5 13.4444C5.5 13.4444 11 9.77778 11 5.5C11 4.04131 10.4205 2.64236 9.38909 1.61091C8.35764 0.579463 6.95869 0 5.5 0C4.04131 0 2.64236 0.579463 1.61091 1.61091C0.579463 2.64236 0 4.04131 0 5.5C0 9.77778 5.5 13.4444 5.5 13.4444ZM7.33388 5.49991C7.33388 6.51243 6.51307 7.33324 5.50055 7.33324C4.48803 7.33324 3.66721 6.51243 3.66721 5.49991C3.66721 4.48739 4.48803 3.66658 5.50055 3.66658C6.51307 3.66658 7.33388 4.48739 7.33388 5.49991Z" fill="#ff1d6c"></path></svg>${Address}</span></p>
        </div>
        </li>`;
      } else {
          item += `
        <li class="item shadow" data-index=${currentIndex}>
          <div class="image-wrapper">
            <img src="https://raw.githubusercontent.com/LunZaiZai0223/THE_F2E_3rd_Week01/main/src/images/placeholder.svg" alt="">
          </div>
          <div class="content">
            <h2 class="title">${Name}</h2>
            <p><span><svg style="transform: translateY(3px);" width="16" height="16"><path d="M5.5 13.4444C5.5 13.4444 11 9.77778 11 5.5C11 4.04131 10.4205 2.64236 9.38909 1.61091C8.35764 0.579463 6.95869 0 5.5 0C4.04131 0 2.64236 0.579463 1.61091 1.61091C0.579463 2.64236 0 4.04131 0 5.5C0 9.77778 5.5 13.4444 5.5 13.4444ZM7.33388 5.49991C7.33388 6.51243 6.51307 7.33324 5.50055 7.33324C4.48803 7.33324 3.66721 6.51243 3.66721 5.49991C3.66721 4.48739 4.48803 3.66658 5.50055 3.66658C6.51307 3.66658 7.33388 4.48739 7.33388 5.49991Z" fill="#ff1d6c"></path></svg>${Address}</span></p>
          </div>
          </li>`;
      }
    });
    return item;
  }
  function render(domEle, item) {
    domEle.innerHTML = item;
  }

  return {
    initialize,
    createHotelIdem,
    createFoodIdem,
    render,
    getFoodSkip,
    addFoodSkip,
    minusFoodSkip,
    getHotelSkip,
    addHotelSkip,
    munisHotelSkip
  };

})();

export { onlyFoodAndHotels };