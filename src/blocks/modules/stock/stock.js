const createElement = (template) => {
    const newElement = document.createElement('div');
    newElement.innerHTML = template;

    return newElement.firstElementChild;
};

const url = '/_files/stock.json';

let cardStockTemplate = function (data) {
    return `<div class="stock__item">${data.mark} | ${data.model} | ${data.price} | ${data.run} | ${data.new}</div>`;
};

const settingsStockPage = {
    'stockBlock': $('.js-stock-list'),
    'filtersBlock': $('.js-stock-filter'),
    'allFilters': $('.js-filter'),
    'priceMinInput' : $('.js-price-min'),
    'priceMaxInput' : $('.js-price-max'),
    'submitBtn': $('.js-submit-filter'),
    'resetBtn': $('.js-reset-filter'),
    'filters' : ['mark', 'model', 'price'],
    'show': 6,
    'add': 6,
    'cardTpl': cardStockTemplate,
    'counterButton' : $('.js-auto-counter'),
};

// получение данных с сервера
function getStockJson(callback) {
    $.ajax({
        dataType: "json",
        url: url,
        success: function (stockData) {
            callback(stockData);
        }
    });
}
// сортировка по цене.
function sortPrice(a, b) {
    if (a['price'] > b['price']) {
        return 1;
    }
    if (a['price'] < b['price']) {
        return -1;
    }
    return 0;
}

const initStock = (settings) => {
    let {stockBlock, filtersBlock, allFilters, priceMinInput, priceMaxInput,
        submitBtn, resetBtn, filters, show, add, cardTpl, counterButton} = settings;

    return function () {

        let _initialStock = [];
        let _minPrice = 0;
        let _maxPrice = 100000000;
        let renderedItems = 0;
        const dafaultFiltersValues = {
            'mark' :  "all",
            'model' :  "all",
            'price-max' : "all",
            'price-min' : "all",
            'run' : true,
        };

        //кнопка показать еще
        const showMoreButton = createElement('<button class="button">Показать ещё</button>');
        function onShowMoreButtonClick() {
            renderedItems = renderedItems + add;
            const filtersValues = getFiltersValues();
            const filteredStock = getFilteredStock(_initialStock, filtersValues);
            showStock(stockBlock, filteredStock)
        }
        showMoreButton.addEventListener('click', onShowMoreButtonClick);

        function setInitialStock(stockData) {
            _initialStock.push(...stockData);
        }
        function getInitialStock() {
           return _initialStock;
        }

        // инициализация стока
        function stockInit(data) {

            // получаем фильтры и выводим их
            const filtersData = getFiltersData(filters, data);
            setFiltersData(filters, filtersData);

            priceMinInput.attr('min', _minPrice);
            priceMinInput.attr('max',_maxPrice);
            priceMaxInput.attr('min', _minPrice);
            priceMaxInput.attr('max',_maxPrice);

            allFilters.on('change', onFilterChange);
            submitBtn.on('click', onSubmitButtonClick);
            resetBtn.on('click', onResetButtonClick);
            setAmount(data, false);
            showStock(stockBlock, data);
        }

        // получаем данные для фильтров
        function getFiltersData(filters, data) {
            let filtersData = {};

            filters.forEach(filter => {
                filtersData[filter] = new Set();
                data.forEach(stockItem => {
                    filtersData[filter].add(stockItem[filter]);
                });

            });

            return filtersData;

        }

        // прописываем фильтры
        function setFiltersData(filters, filtersData, changedFilterName = '') {

            if (!changedFilterName) {
                for (let filter in filtersData) {
                    if (filtersData.hasOwnProperty(filter)) {
                        const currentFilterArr = Array.from(filtersData[filter]);

                        if (filter === 'price') {
                            let sortedPrices = currentFilterArr.sort(sortPrice);
                            _minPrice = sortedPrices[0];
                            _maxPrice = sortedPrices[sortedPrices.length - 1];
                        } else {
                            $(`[data-filter="${filter}"]`).empty();
                            $(`[data-filter="${filter}"]`).append(`<option value="all">Все</option>`);
                            currentFilterArr.forEach(option => {
                                $(`[data-filter="${filter}"]`).append(`<option value="${option}">${option}</option>`);
                            })
                        }
                    }
                }
            } else {
                if (changedFilterName === 'mark') {
                    const modelFilterArr = Array.from(filtersData["model"]);

                    $(`[data-filter="model"]`).empty();
                    $(`[data-filter="model"]`).append(`<option value="all">Все</option>`);

                    modelFilterArr.forEach(option => {
                        $(`[data-filter="model"]`).append(`<option value="${option}">${option}</option>`);
                    })
                }

            }

        }

        function setAmount(amount = [], reset = false) {

            if (reset) {
                counterButton.text('');
            } else {
                counterButton.text(amount.length);
            }
        }

        // изменение фильтров
        function onFilterChange(evt) {
            let filtersValues = getFiltersValues();

            if (evt.target.name === 'mark') {
                filtersValues['model'] = 'all';
            }

            const filteredStock = getFilteredStock(_initialStock, filtersValues);
            const filtersData = getFiltersData(filters, filteredStock);

            setAmount(filteredStock, false);

            if (evt.target.name === 'mark' || evt.target.name === 'model') {
                setFiltersData(filters, filtersData, evt.target.name);
            }
        }

        // получаем выбранные фильтры
        function getFiltersValues() {
            let filters = {};
            allFilters.each(function(i, val) {

                if (val.name === 'run') {
                    filters[val.name] = !val.checked;
                } else {
                    filters[val.name] = val.value !== '' ? val.value : 'all';
                }
            });

            return filters;
        }

        // вывод стока
        function showStock(stockBlock, data) {
            $('.js-count').text(data.length);

            let slicedStock = data.slice(renderedItems, renderedItems + show);

            if (data.length < 1) {
                stockBlock.append('<p>Отсутствуют авто по выбранных критериям. Измените данные фильтра.</p>');
            } else {
                slicedStock.forEach(item => {
                    stockBlock.append(cardTpl(item));
                });

                if (renderedItems + add < data.length) {
                    stockBlock.after(showMoreButton);
                } else {
                    showMoreButton.remove();
                }

            }
        }

        // фильтрация стока
        function getFilteredStock(data, filtersValues) {
            return data.filter(el => {
                return (
                    isSelectOk(el['mark'], filtersValues['mark']) &&
                    isSelectOk(el['model'], filtersValues['model']) &&
                    isNewOk(el['run'], el['new'], filtersValues['run']) &&
                    isPriceOk(el['price'], filtersValues['price-min'], filtersValues['price-max'],)
                )
            });
        }

        const isSelectOk = (el, val) => {
            if (val === 'all') {
                return true;
            }
            return val === el;
        };
        const isPriceOk = (price, min, max) => {
            if (min === 'all' && max === 'all') {
                return true;
            }
            if (min === 'all' && max !== 'all') {
                return price <= max;
            }
            if (min !== 'all' && max === 'all') {
                return price >= min;
            }
            return price >= min && price <= max;
        };
        const isNewOk = (run, newVal, filterRun) => {
            if (filterRun || newVal) {
                return true;
            }
            return run < 5000;
        };

        function onSubmitButtonClick() {
            const filtersValues = getFiltersValues();
            const filteredStock = getFilteredStock(_initialStock, filtersValues);
            stockBlock.empty();
            showStock(stockBlock, filteredStock);
        }

        function onResetButtonClick() {
            filtersBlock.trigger("reset");
            stockBlock.empty();
            renderedItems = 0;

            const filteredStock = getFilteredStock(_initialStock, dafaultFiltersValues);
            const filtersData = getFiltersData(filters, filteredStock);

            setAmount(filteredStock, false);
            setFiltersData(filters, filtersData, '');
            showStock(stockBlock, filteredStock);
        }

        // полкчаем данные с сервера и запкскаем stockInit
        getStockJson( function (stockData) {
            setInitialStock(stockData);
            stockInit(getInitialStock());
        });

    }
};

const mainStock = initStock(settingsStockPage);

mainStock();
