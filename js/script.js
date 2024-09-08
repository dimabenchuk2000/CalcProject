'use strict';

const title = document.getElementsByTagName('h1')[0];

let screens = document.querySelectorAll('.screen');

const screenBtn = document.querySelector('.screen-btn');

const otherItemsPercent = document.querySelectorAll('.other-items.percent');
const otherItemsNumber = document.querySelectorAll('.other-items.number ');

const range = document.querySelector('.rollback input');
const rangeValue = document.querySelector('.rollback .range-value');

const total = document.getElementsByClassName('total-input')[0];
const totalCount = document.getElementsByClassName('total-input')[1];
const totalCountOther = document.getElementsByClassName('total-input')[2];
const fullTotalCount = document.getElementsByClassName('total-input')[3];
const totalCountRollback = document.getElementsByClassName('total-input')[4];

const startBtn = document.getElementsByClassName('handler_btn')[0];
const resetBtn = document.getElementsByClassName('handler_btn')[1];

const appData = {
    title: '',
    screens: [],
    screenPrice: 0,
    adaptive: true,
    servicesPrecent: {},
    servicesNumber: {},
    servicePricesPercent: 0,
    servicePricesNumber: 0,
    fullPrice: 0,
    servicePercentPrice: 0,
    rollback: 10,
    init: function () {
        appData.addTitle();

        startBtn.addEventListener('click', appData.start);
        screenBtn.addEventListener('click', appData.addScreenBlock);
    },
    addTitle: function () {
        document.title = title.textContent;
    },
    addScreenBlock: function () {
        const cloneScreen = screens[0].cloneNode(true);

        screens[screens.length - 1].after(cloneScreen);
        screens = document.querySelectorAll('.screen');
    },
    start: function () {
        appData.addScreens();
        appData.addServices();
        appData.addPrices();
        // appData.getServicePercentPrices();

        // appData.logger();
        console.log(appData);
        appData.showResult();
    },
    addScreens: function () {
        screens.forEach(function (screen, index) {
            const select = screen.querySelector('select');
            const input = screen.querySelector('input');
            const selectName = select.options[select.selectedIndex].textContent;

            appData.screens.push({
                id: index,
                name: selectName,
                price: +select.value * +input.value
            });
        })
    },
    addServices: function () {
        otherItemsPercent.forEach(function (item) {
            const check = item.querySelector('input[type=checkbox]');
            const label = item.querySelector('label');
            const input = item.querySelector('input[type=text]');

            if (check.checked) {
                appData.servicesPrecent[label.textContent] = +input.value
            }
        })

        otherItemsNumber.forEach(function (item) {
            const check = item.querySelector('input[type=checkbox]');
            const label = item.querySelector('label');
            const input = item.querySelector('input[type=text]');

            if (check.checked) {
                appData.servicesNumber[label.textContent] = +input.value
            }
        })
    },
    addPrices: function () {
        appData.screenPrice = appData.screens.reduce(function (sum, item) {
            return sum + item.price
        }, 0)

        for (let key in appData.servicesNumber) {
            appData.servicePricesNumber += appData.servicesNumber[key];
        }

        for (let key in appData.servicesPrecent) {
            appData.servicePricesPercent += appData.screenPrice * (appData.servicesPrecent[key] / 100);
        }

        appData.fullPrice = appData.screenPrice + appData.servicePricesNumber + appData.servicePricesPercent;
    },
    showResult: function () {
        total.value = appData.screenPrice;
        totalCountOther.value = appData.servicePricesNumber + appData.servicePricesPercent;
        fullTotalCount.value = appData.fullPrice;
    },
    getServicePercentPrices: function () {
        appData.servicePercentPrice = appData.fullPrice - appData.fullPrice * (appData.rollback / 100);
    },
    getRollbackMessage: function (price) {
        switch (true) {
            case price >= 30000:
                return "Даем скидку в 10%";
            case price >= 15000 && price < 30000:
                return "Даем скидку в 5%";
            case price >= 0 && price < 15000:
                return "Скидка не предусмотрена";
            case price < 0:
                return "Что-то пошло не так";
        }
    },
    logger: function () {
        console.log(appData.title);
        console.log(appData.fullPrice);
        console.log(appData.servicePercentPrice);
        console.log(appData.getRollbackMessage(this.fullPrice));
        console.log(appData.services);
        console.log(appData.screens);

        console.log(title);
        console.log(startBtn);
        console.log(resetBtn);
        console.log(screenBtn);
        console.log(percent);
        console.log(number);
        console.log(range);
        console.log(rangeValue);
        console.log(total);
        console.log(totalCount);
        console.log(totalCountOther);
        console.log(fullTotalCount);
        console.log(totalCountRollback);
        console.log(screens);
    }
}

appData.init();