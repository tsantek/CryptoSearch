document.addEventListener('DOMContentLoaded', function() {

    let form = document.querySelector('form');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let searchCoin;
        searchCoin = e.target[0].value;
        showCoin(searchCoin);
        aboutCoin(searchCoin);
    })

})

function showCoin(searchCoin) {
    fetch(`https://api.nomics.com/v1/currencies/sparkline?key=c70230f0d75bb35d650e00712558eba6&start=2019-05-01T00%3A00%3A00Z&end=2019-05-23T00%3A00%3A00Z`)
        .then(response => response.json())
        .then(data => {
            for (let i = 0; i < data.length; i++) {
                if (searchCoin === data[i].currency) {
                    let pricesLenght = data[i].prices.length - 1;

                    document.querySelector('.coin-name').innerHTML = searchCoin;
                    document.querySelector('.coin-price').innerHTML = `${data[i].prices[pricesLenght]} USD`;

                    var options = {
                        chart: {
                            height: 450,
                            type: 'line',
                            zoom: {
                                enabled: false
                            }
                        },
                        dataLabels: {
                            enabled: false
                        },
                        stroke: {
                            curve: 'straight'
                        },
                        series: [{
                            name: "Price",
                            data: data[i].prices
                        }],
                        title: {
                            text: `${searchCoin} in May`,
                            align: 'left'
                        },
                        grid: {
                            row: {
                                colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                                opacity: 0.5
                            },
                        },
                        xaxis: {
                            categories: [],
                        }
                    }

                    var chart = new ApexCharts(
                        document.querySelector("#chart-price"),
                        options
                    );

                    chart.render();
                }
            }
        })
    getDataForChart(searchCoin);


}

function getDataForChart(searchCoin) {
    let date = new Date();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let year = date.getFullYear();

    if (month < 10) {
        month = `0${date.getMonth() + 1}`
    }
    if (day < 10) {
        day = `0${ate.getDate()}`
    }


    fetch(`https://api.nomics.com/v1/exchange_candles?key=c70230f0d75bb35d650e00712558eba6&interval=1d&exchange=binance&market=${searchCoin}USDT&start=${year}-${month}-01T00%3A00%3A00Z&end=${year}-${month}-${day}T00%3A00%3A00Z`)
        .then(response => response.json())
        .then(data => {
            // CHART
            candleChart(data, searchCoin);
        })

}


// CANDLE CHART

function candleChart(data, searchCoin) {
    var options = {
        chart: {
            height: 350,
            type: 'candlestick',
        },
        series: [{
            data: []
        }],
        title: {
            text: `CandleStick Chart for ${searchCoin} `,
            align: 'left'
        },
        xaxis: {
            type: 'datetime'
        },
        yaxis: {
            tooltip: {
                enabled: true
            }
        }
    }

    for (let i = 0; i < data.length; i++) {
        let arr = {
            x: new Date(data[i].timestamp),
            y: [data[i].open, data[i].high, data[i].low, data[i].close]
        }
        options.series[0].data.push(arr);
    }


    var chart = new ApexCharts(
        document.querySelector("#chart-two"),
        options
    );

    chart.render();
}


function aboutCoin(searchCoin) {
    fetch("https://api.nomics.com/v1/dashboard?key=c70230f0d75bb35d650e00712558eba6")
        .then(response => response.json())
        .then(data => {
            for (let i = 0; i < data.length; i++) {
                if (searchCoin === data[i].currency) {
                    console.log(data[i])
                    document.querySelector('.availableSupply').innerHTML = `Available Supply ${data[i].availableSupply}`
                    document.querySelector('.dayOpen').innerHTML = `Day Open ${data[i].dayOpen}`
                    document.querySelector('.dayClose').innerHTML = ` Day Close ${data[i].close}`
                    document.querySelector('.high').innerHTML = `Total high ${data[i].high}`
                    document.querySelector('.weekOpen').innerHTML = `Week Open ${data[i].weekOpen}`
                    document.querySelector('.yearOpen').innerHTML = `Year Open ${data[i].yearOpen}`
                }
            }
        })
}