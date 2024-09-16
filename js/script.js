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
    screenCount: 0,
    servicesPrecent: {},
    servicesNumber: {},
    servicePricesPercent: 0,
    servicePricesNumber: 0,
    fullPrice: 0,
    servicePercentPrice: 0,
    rollback: 0,
    init: function () {
        this.addTitle();

        startBtn.addEventListener('click', this.checkSelectScreen);
        screenBtn.addEventListener('click', this.addScreenBlock);
        range.addEventListener('input', this.addRollback);
    },
    addTitle: function () {
        document.title = title.textContent;
        this.title = title.textContent;
    },
    checkSelectScreen: function () {
        let arr = []

        screens.forEach(function (screen) {
            const selectValue = screen.querySelector('select').value;
            const inputValue = screen.querySelector('input').value;

            arr.push(selectValue, inputValue)
        })

        let result = arr.find(function (item) {
            return item === '';
        })

        if (result === undefined) {
            appData.start();
        } else alert('Введите тип и количество экранов!')
    },
    addScreenBlock: function () {
        const cloneScreen = screens[0].cloneNode(true);

        screens[screens.length - 1].after(cloneScreen);
        screens = document.querySelectorAll('.screen');
    },
    addRollback: function () {
        rangeValue.textContent = range.value + "%";
        appData.rollback = range.value;

        appData.servicePercentPrice = appData.fullPrice - appData.fullPrice * (appData.rollback / 100);
        appData.showResult();
    },
    start: function () {
        this.addScreens();
        this.addServices();
        this.addPrices();
        this.showResult();

        this.logger();
    },
    addScreens: function () {
        screens.forEach(function (screen, index) {
            const select = screen.querySelector('select');
            const input = screen.querySelector('input');
            const selectName = select.options[select.selectedIndex].textContent;

            appData.screens.push({
                id: index,
                name: selectName,
                price: +select.value * +input.value,
                count: input.value
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
        this.screenPrice = this.screens.reduce(function (sum, item) {
            return sum + item.price
        }, 0)

        for (let key in this.servicesNumber) {
            this.servicePricesNumber += this.servicesNumber[key];
        }

        for (let key in this.servicesPrecent) {
            this.servicePricesPercent += this.screenPrice * (this.servicesPrecent[key] / 100);
        }

        for (let key of this.screens) {
            this.screenCount += +key.count;
        }

        this.fullPrice = this.screenPrice + this.servicePricesNumber + this.servicePricesPercent;
        this.servicePercentPrice = this.fullPrice - this.fullPrice * (this.rollback / 100);
    },
    showResult: function () {
        total.value = this.screenPrice;
        totalCount.value = this.screenCount;
        totalCountOther.value = this.servicePricesNumber + this.servicePricesPercent;
        fullTotalCount.value = this.fullPrice;
        totalCountRollback.value = this.servicePercentPrice;
    },
    logger: function () {
        console.log(this);
    }
}

appData.init();