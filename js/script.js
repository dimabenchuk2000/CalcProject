'use strict';

const title = document.getElementsByTagName('h1')[0];

let screen = document.querySelectorAll('.screen');

const screenBtn = document.querySelector('.screen-btn');

const percent = document.querySelectorAll('.other-items.percent');
const number = document.querySelectorAll('.other-items.number ');

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
    services: {},
    allServicePrices: 0,
    fullPrice: 0,
    servicePercentPrice: 0,
    rollback: 10,
    start: function () {
        this.asking();
        this.addPrices();
        this.getFullPrice();
        this.getServicePercentPrices();
        this.getTitle();

        this.logger();
    },
    isNumber: function (num) {
        if (num === 0) return false;
        return !isNaN(parseFloat(num)) && isFinite(num);
    },
    isString: function (str) {
        return !isNaN(str);
    },
    asking: function () {
        do {
            this.title = prompt("Как называется ваш проект?", "Верстка по кайфу");
        } while (this.isString(this.title))

        for (let i = 0; i < 2; i++) {
            let name;
            do {
                name = prompt("Как типы экранов нужно разработать?", "Простые, Сложные, Интерактивные (Выбрать один)");
            } while (this.isString(name))
            let price = 0;

            do {
                price = +prompt("Сколько будет стоить данная работа?", 10000);
            } while (!this.isNumber(price))

            this.screens.push({ id: i, name: name, price: price });
        }

        for (let i = 0; i < 2; i++) {
            let name;
            do {
                name = prompt("Какой дополнительный тип услуги нужен?", "Метрика");
            } while (this.isString(name))
            let price = 0;

            do {
                price = +prompt("Сколько это будет стоить?", 1000);
            } while (!this.isNumber(price))

            this.services[name + '_' + i] = price;
        }

        this.adaptive = confirm("Нужен ли адаптив на сайте?");
    },
    addPrices: function () {
        this.screenPrice = this.screens.reduce(function (sum, item) {
            return sum + item.price
        }, 0)

        for (let key in this.services) {
            this.allServicePrices += this.services[key];
        }
    },
    getFullPrice: function () {
        this.fullPrice = this.screenPrice + this.allServicePrices;
    },
    getServicePercentPrices: function () {
        this.servicePercentPrice = this.fullPrice - this.fullPrice * (this.rollback / 100);
    },
    getTitle: function () {
        this.title = this.title.trim()[0].toUpperCase() + this.title.trim().substring(1).toLowerCase();
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
        console.log(this.title);
        console.log(this.fullPrice);
        console.log(this.servicePercentPrice);
        console.log(this.getRollbackMessage(this.fullPrice));
        console.log(this.services);
        console.log(this.screens);

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
        console.log(screen);
    }
}

appData.start();