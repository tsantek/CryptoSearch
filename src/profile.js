document.addEventListener('DOMContentLoaded', function() {

    let form = document.querySelector('form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let searchCoin;
        searchCoin = e.target[0].value;
        aboutCoin(searchCoin);
        showCoin(searchCoin);
    })
    favoriteCoin();
    // TEMP COIN SEARCH
    // let searchCoin = "ETH"

    // aboutCoin(searchCoin);
    // showCoin(searchCoin);
})

function showCoin(searchCoin) {
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

    fetch(`https://api.nomics.com/v1/currencies/sparkline?key=2018-09-demo-dont-deploy-b69315e440beb145&start=${year}-${month}-01T00%3A00%3A00Z&end=${year}-${month}-${day}T00%3A00%3A00Z`)
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


    fetch(`https://api.nomics.com/v1/exchange_candles?key=2018-09-demo-dont-deploy-b69315e440beb145&interval=1d&exchange=binance&market=${searchCoin}USDT&start=${year}-${month}-01T00%3A00%3A00Z&end=${year}-${month}-${day}T00%3A00%3A00Z`)
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
    fetch("https://api.nomics.com/v1/dashboard?key=2018-09-demo-dont-deploy-b69315e440beb145")
        .then(response => response.json())
        .then(data => {
            for (let i = 0; i < data.length; i++) {
                if (searchCoin === data[i].currency) {
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

function favoriteCoin(searchCoin) {

    const firebaseConfig = {
        apiKey: "AIzaSyCsSbBmNmX5zSnRTb3Opgi8BCFFkTwWWdY",
        authDomain: "cryptosearch-12b58.firebaseapp.com",
        databaseURL: "https://cryptosearch-12b58.firebaseio.com",
        projectId: "cryptosearch-12b58",
        storageBucket: "cryptosearch-12b58.appspot.com",
        messagingSenderId: "906511613182",
        appId: "1:906511613182:web:ff8b006441814616"
    };

    firebase.initializeApp(firebaseConfig);

    const db = firebase.firestore()
    const auth = firebase.auth()

    function getFavorites(favorites) {
        return new Promise((resolve, reject) => {
            db.collection(favorites).get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        const favorite = doc.data()
                        resolve(favorite)
                    });
                })
                .catch(e => {
                    reject(e)
                })
        })
    }

    getFavorites("favorites")
        .then(favorite => {
            for (key in favorite) {
                if (key === "santek.vg@gmail.com") {
                    // console.log(favorite[key])
                    if (favorite[key].length === 0) {
                        document.querySelector('.favorites-coins').innerHTML += `
                        <a class="favorite-item"> You don't have any favorites </a>
                        `
                    }
                    for (let i = 0; i < favorite[key].length; i++) {
                        document.querySelector('.favorites-coins').innerHTML += `
                        <a class="favorite-item" name=${favorite[key][i]} >  ${favorite[key][i]} </a>
                        `
                    }
                }
            }

            let x = document.querySelectorAll('.favorite-item');


        })
        .catch(e => {
            alert(e)
        })
}