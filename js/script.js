'use strict';

const title = document.getElementsByTagName('h1')[0];

let screens = document.querySelectorAll('.screen');

const screenBtn = document.querySelector('.screen-btn');

const otherItemsPercent = document.querySelectorAll('.other-items.percent');
const otherItemsNumber = document.querySelectorAll('.other-items.number ');

const cmsOpen = document.querySelector('#cms-open');
const hiddenCmsVariants = document.querySelector('.hidden-cms-variants');
const cmsSelect = document.querySelector('#cms-select');
const cmsBlockInput = document.querySelector('.hidden-cms-variants .main-controls__input')
const cmsInput = document.querySelector('#cms-other-input');

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
    cmsPercent: 0,
    fullPrice: 0,
    servicePercentPrice: 0,
    rollback: 0,
    init: function () {
        this.addTitle();
        this.logger();

        startBtn.addEventListener('click', this.checkSelectScreen);
        screenBtn.addEventListener('click', this.addScreenBlock);

        cmsOpen.addEventListener('change', this.cmsBlockShow);
        cmsSelect.addEventListener('change', this.cmsShowInput);

        range.addEventListener('input', this.addRollback);

        resetBtn.addEventListener('click', this.reset);
    },
    addTitle: function () {
        document.title = title.textContent;
        this.title = title.textContent;
    },
    cmsBlockShow: function () {
        if (cmsOpen.checked) {
            hiddenCmsVariants.style.display = 'flex';
        } else {
            hiddenCmsVariants.style.display = 'none';
        }
    },
    cmsShowInput: function () {
        if (cmsSelect.options[cmsSelect.selectedIndex].value === "other") {
            cmsBlockInput.style.display = 'block';
        } else {
            cmsBlockInput.style.display = 'none';
        }
    },
    blockingSelect: function () {
        // Блокируем select, input и кнопку plus при нажатии кнопки рассчитать
        const select = document.querySelectorAll('select');
        const input = document.querySelectorAll('.screen input[type="text"]');

        select.forEach(function (item) {
            item.disabled = 'true';
        })
        input.forEach(function (item) {
            item.disabled = 'true';
        })

        screenBtn.disabled = 'true';
        cmsInput.disabled = 'true';

        startBtn.style.display = "none";
        resetBtn.style.display = "block";
    },
    unlockingSelect: function () {
        // Разблокируем select, input и кнопку plus при нажатии кнопки рассчитать
        const select = document.querySelectorAll('select');
        const input = document.querySelectorAll('.screen input[type="text"]');

        select.forEach(function (item) {
            item.disabled = false;
        })
        input.forEach(function (item) {
            item.disabled = false;
        })

        screenBtn.disabled = false;
        cmsInput.disabled = false;

        startBtn.style.display = "block";
        resetBtn.style.display = "none";
    },
    checkSelectScreen: function () {
        // Проверяем что бы value элементов select и input не были пустыми
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
            appData.blockingSelect();
            appData.start();

        } else alert('Введите тип и количество экранов!')
    },
    addScreenBlock: function () {
        // При нажатии кнопки plus добавляет новый блок screen
        const cloneScreen = screens[0].cloneNode(true);

        screens[screens.length - 1].after(cloneScreen);
        screens = document.querySelectorAll('.screen');
    },
    addRollback: function () {
        // При передвижении ползунка range меняется значение rollback
        rangeValue.textContent = range.value + "%";
        appData.rollback = range.value;

        appData.servicePercentPrice = appData.fullPrice - appData.fullPrice * (appData.rollback / 100);
        appData.showResult();
    },
    start: function () {
        // При нажатии кнопки рассчитать запускаются следующие методы
        this.addScreens();
        this.addServices();
        this.addCmsPercent();
        this.addPrices();
        this.showResult();

        this.logger();
    },
    addScreens: function () {
        // добавляем в массив appData.screens все экраны
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
        // перебираем все чекбоксы, и, если он выбран, добавляем в объект appData.servicesPrecent значение инпута
        otherItemsPercent.forEach(function (item) {
            const check = item.querySelector('input[type=checkbox]');
            const label = item.querySelector('label');
            const input = item.querySelector('input[type=text]');

            if (check.checked) {
                appData.servicesPrecent[label.textContent] = +input.value
            }
        })

        // перебираем все чекбоксы, и, если он выбран, добавляем в объект appData.servicesPrecent значение инпута
        otherItemsNumber.forEach(function (item) {
            const check = item.querySelector('input[type=checkbox]');
            const label = item.querySelector('label');
            const input = item.querySelector('input[type=text]');

            if (check.checked) {
                appData.servicesNumber[label.textContent] = +input.value
            }
        })
    },
    addCmsPercent: function () {
        if (cmsSelect.options[cmsSelect.selectedIndex].value === "other") {
            this.cmsPercent = +cmsInput.value;
        } else if (cmsSelect.options[cmsSelect.selectedIndex].value === "50") {
            this.cmsPercent = 50;
        }
    },
    addPrices: function () {
        // с помощью reduce перебираем массив appData.screens и суммируем свойсво price каждого объекта массива
        this.screenPrice = this.screens.reduce(function (sum, item) {
            return sum + item.price
        }, 0)

        // с помощью for in перебираем объект appData.servicesNumber и суммируем значения свойств
        for (let key in this.servicesNumber) {
            this.servicePricesNumber += this.servicesNumber[key];
        }

        for (let key in this.servicesPrecent) {
            this.servicePricesPercent += this.screenPrice * (this.servicesPrecent[key] / 100);
        }

        // с помощью for of перебираем массив appData.screens и суммируем значения свойств
        for (let key of this.screens) {
            this.screenCount += +key.count;
        }
        this.fullPrice = this.screenPrice + this.servicePricesNumber + this.servicePricesPercent;
        this.fullPrice = this.fullPrice + this.fullPrice * (this.cmsPercent / 100);
        this.servicePercentPrice = this.fullPrice - this.fullPrice * (this.rollback / 100);
    },
    showResult: function () {
        total.value = this.screenPrice;
        totalCount.value = this.screenCount;
        totalCountOther.value = this.servicePricesNumber + this.servicePricesPercent;
        fullTotalCount.value = this.fullPrice;
        totalCountRollback.value = this.servicePercentPrice;
    },
    reset: function () {
        appData.resetProperties();
        appData.resetCms();
        appData.resetCheckBox();
        appData.resetSelect();
        appData.unlockingSelect();
    },
    resetProperties: function () {
        this.screenPrice = 0;
        this.screenCount = 0;
        this.servicePricesNumber = 0;
        this.servicePricesPercent = 0;
        this.cmsPercent = 0;
        this.fullPrice = 0;
        this.servicePercentPrice = 0;
        this.screens = [];

        range.value = 0;

        this.addRollback();
    },
    resetCms: function () {
        hiddenCmsVariants.style.display = 'none';
    },
    resetCheckBox: function () {
        const check = document.querySelectorAll('input[type=checkbox]');

        check.forEach(function (item) {
            item.checked = false;
        })
    },
    resetSelect: function () {
        screens.forEach(function (screen, index) {
            if (index !== 0) {
                screen.remove();
            } else {
                const select = screen.querySelector('select');
                const input = screen.querySelector('input');

                select.value = '';
                input.value = '';
            }
        })
    },
    logger: function () {
        console.log(this);
    }
}

appData.init();