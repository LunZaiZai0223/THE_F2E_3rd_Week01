import { getData } from './api.js';
import { Control } from './main.js';
import { onlyActAndAtt } from './activities_attractions.js';
import { onlyFoodAndHotels } from './food_hotels.js';

const Pagination = (() => {
  let actCurrentPage = 1;
  let attcurrentPage = 1;
  let foodCurrentPage = 1;
  let hotelsCurrentPage = 1;

  let baseUrl = 'https://ptx.transportdata.tw/MOTC/v2/Tourism/';

  function initialize () {
    const [...paginationWrappers] = document.querySelectorAll('[data-section]');
    console.log(paginationWrappers);
    actCurrentPage = 1;
    attcurrentPage = 1;
    foodCurrentPage = 1;
    hotelsCurrentPage = 1;
    removeEventListenerToPaginationWrapper(paginationWrappers);
    addEventListenerToPaginationWrapper(paginationWrappers);
    // 都第一頁，隱藏上一頁的按鈕
    paginationWrappers.forEach(wrapper => {
      wrapper.children[0].style.display = 'none';
    });
    // 之後還要再新增對應區塊的 span
    if (document.querySelector('[data-section="activities"] span')) {
      document.querySelector('[data-section="activities"] span').innerText = actCurrentPage;
    }
    if (document.querySelector('[data-section="attractions"] span')) {
      document.querySelector('[data-section="attractions"] span').innerText = attcurrentPage;
    }
    if (document.querySelector('[data-section="food"] span')) {
      document.querySelector('[data-section="food"] span').innerText = foodCurrentPage;
    }
    if (document.querySelector('[data-section="hotels"] span')) {
      document.querySelector('[data-section="hotels"] span').innerText = hotelsCurrentPage;
    }
  }
  function addEventListenerToPaginationWrapper (paginationWrappers) {
    paginationWrappers.forEach(wrapper => {
      wrapper.addEventListener('click', clickHandler);
    });
  }
  function removeEventListenerToPaginationWrapper (paginationWrappers) {
    paginationWrappers.forEach(wrapper => {
      wrapper.removeEventListener('click', clickHandler);
    });
  }
  function clickHandler (event) {
    const section = event.currentTarget.dataset.section;
    const pagination = event.target.dataset.pagination;
    const length = event.target.dataset.length;
    const domTarget = event.target.nodeName;
    const paginationWrapper = event.currentTarget;
    console.log(section, pagination, length);
    changeData(domTarget, {section, pagination, length}, paginationWrapper);
  }
  function changeData (domTarget ,{ section,  pagination, length }, paginationWrapper) {
    if (domTarget !== 'BUTTON') return console.log('沒點到按鈕');
    if (section === 'activities') {
      if (pagination === 'pre') {
        if (actCurrentPage - 1 <= 1) {
          hidePreButton(paginationWrapper);
        }
        actCurrentPage--;
        changePageNum(paginationWrapper, actCurrentPage);
        onlyActAndAtt.minusActivitiesSkip(length);
        const skip = onlyActAndAtt.getActivitiesSkip();
        const newUrl = Control.setApiUrl(baseUrl, 'Activity?', ['$format=JSON', `$skip=${skip}`, '$top=8']);
        getMoreData(newUrl, section);
      } else {
        actCurrentPage++;
        changePageNum(paginationWrapper, actCurrentPage);
        if (actCurrentPage > 1) {
          showPreButton(paginationWrapper);
        }
        onlyActAndAtt.addActivitiesSkip(length);
        const skip = onlyActAndAtt.getActivitiesSkip();
        const newUrl = Control.setApiUrl(baseUrl, 'Activity?', ['$format=JSON', `$skip=${skip}`, '$top=8']);
        getMoreData(newUrl, section);
      }
    } else if (section === 'attractions') {
      if (pagination === 'pre') {
        if (attcurrentPage - 1 === 1) {
          hidePreButton(paginationWrapper);
        }
        attcurrentPage --;
        changePageNum(paginationWrapper, attcurrentPage);
        onlyActAndAtt.minusAttractionsSkip(length);
        const skip = onlyActAndAtt.getAttractionsSkip();
        const newUrl = Control.setApiUrl(baseUrl, 'ScenicSpot?', ['$format=JSON', `$skip=${skip}`, '$top=20']);
        getMoreData(newUrl, section);
      } else {
        attcurrentPage ++;
        changePageNum(paginationWrapper, attcurrentPage);
        if (attcurrentPage > 1) {
          showPreButton(paginationWrapper);
        }
        onlyActAndAtt.addAttractionsSkip(length);
        const skip = onlyActAndAtt.getAttractionsSkip();
        const newUrl = Control.setApiUrl(baseUrl, 'ScenicSpot?', ['$format=JSON', `$skip=${skip}`, '$top=20']);
        getMoreData(newUrl, section);
      }
    } else if (section === 'food') {
      if (pagination === 'pre') {
        if (foodCurrentPage - 1 === 1) {
          hidePreButton(paginationWrapper);
        }
        foodCurrentPage --;
        onlyFoodAndHotels.minusFoodSkip(length);
        changePageNum(paginationWrapper, foodCurrentPage);
        const skip = onlyFoodAndHotels.getFoodSkip();
        const newUrl = Control.setApiUrl(baseUrl, 'Restaurant?', ['$format=JSON', `$skip=${skip}`, '$top=20']);
        getMoreData(newUrl, section);
      } else {
        foodCurrentPage ++;
        changePageNum(paginationWrapper, foodCurrentPage);
        if (foodCurrentPage > 1) {
          showPreButton(paginationWrapper);
        }
        onlyFoodAndHotels.addFoodSkip(length);
        const skip = onlyFoodAndHotels.getFoodSkip();
        const newUrl = Control.setApiUrl(baseUrl, 'Restaurant?', ['$format=JSON', `$skip=${skip}`, '$top=20']);
        getMoreData(newUrl, section);
      }
    } else if (section === 'hotels') {
      if (pagination === 'pre') {
        if (hotelsCurrentPage - 1 === 1) {
          hidePreButton(paginationWrapper);
        }
        hotelsCurrentPage --;
        onlyFoodAndHotels.munisHotelSkip(length);
        changePageNum(paginationWrapper, hotelsCurrentPage);
        const skip = onlyFoodAndHotels.getHotelSkip();
        const newUrl = Control.setApiUrl(baseUrl, 'Hotel?', ['$format=JSON', `$skip=${skip}`, '$top=20']);
        getMoreData(newUrl, section);
      } else {
        hotelsCurrentPage ++;
        changePageNum(paginationWrapper, hotelsCurrentPage);
        if (hotelsCurrentPage > 1) {
          showPreButton(paginationWrapper);
        }
        onlyFoodAndHotels.addHotelSkip(length);
        const skip = onlyFoodAndHotels.getHotelSkip();
        const newUrl = Control.setApiUrl(baseUrl, 'Hotel?', ['$format=JSON', `$skip=${skip}`, '$top=20']);
        getMoreData(newUrl, section);
      }
    }
  }
  function hidePreButton (currentWrapper) {
    currentWrapper.children[0].style.display = 'none';
  }
  function showPreButton (currentWrapper) {
    currentWrapper.children[0].style.display = 'inline-block';
  }
  function changePageNum (currentWrapper, pageNum) {
    currentWrapper.children[1].innerText = pageNum;
  }


  function getMoreData (newUrl, sectionName) {
    if (sectionName === 'activities') {
      getData(newUrl).then(data => {
        console.log(data);
        onlyActAndAtt.setActivitiesArr(data);
        onlyActAndAtt.renderActivities(data);
      });
    } else if (sectionName === 'attractions') {
      getData(newUrl).then(data => {
        console.log(data);
        onlyActAndAtt.renderAttractions(data);
      });
    } else if (sectionName === 'food') {
      getData(newUrl).then(data => {
        console.log(data);
        Control.setFoodArr(data);
        onlyFoodAndHotels.render(document.querySelector('[data-list="food"]') ,onlyFoodAndHotels.createFoodIdem(data));
      });
    } else if (sectionName === 'hotels') {
      getData(newUrl).then(data => {
        console.log(data);
        Control.setHotelsArr(data);
        onlyFoodAndHotels.render(document.querySelector('[data-list="hotels"]') ,onlyFoodAndHotels.createHotelIdem(data));
      });
    }
  }


  return {
    initialize
  };

})();

export { Pagination };