document.addEventListener('DOMContentLoaded', function() {

    let form = document.querySelector('form');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let searchCoin;
        // console.log(e.target[0].value)
        searchCoin = e.target[0].value;

        // console.log(searchCoin)
        showCoin(searchCoin);
    })
})

function showCoin(searchCoin) {
    fetch(`https://api.nomics.com/v1/markets/prices?key=2018-09-demo-dont-deploy-b69315e440beb145&currency=${searchCoin}`)
        .then(response => response.json())
        .then(data => {
            for (let i = 0; i < data.length; i++) {
                if (data[i].quote === "USD") {
                    // console.log(data[i])
                    document.querySelector('.coin-name').innerHTML = searchCoin;
                    document.querySelector('.coin-price').innerHTML = `${data[i].price} ${data[i].quote}`;
                    document.querySelector('.coin-time').innerHTML = new Date();
                }
            }
        })
    getDataForChart(searchCoin);


}

function getDataForChart(searchCoin) {
    let date = new Date();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    if (month < 10) {
        month = `0${date.getMonth() + 1}`
    }
    if (day < 10) {
        day = `0${ate.getDate()}`
    }


    fetch(`https://api.nomics.com/v1/exchange_candles?key=2018-09-demo-dont-deploy-b69315e440beb145&interval=1d&exchange=binance&market=${searchCoin}USDT&start=2019-${month}-01T00%3A00%3A00Z&end=2019-${month}-${day}T00%3A00%3A00Z`)
        .then(response => response.json())
        .then(data => {
            // CHART

            var options = {
                chart: {
                    height: 450,
                    type: 'area',
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
                    data: []
                }],
                title: {
                    text: `Opening price in May for ${searchCoin}`,
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
                document.querySelector("#chart"),
                options
            );

            chart.render();


            // console.log(data)
            for (let i = 0; i < data.length; i++) {
                // console.log(data[i])
                options.series[0].data.push(data[i].open);
            }
        })
}