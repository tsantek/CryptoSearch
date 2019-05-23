document.addEventListener('DOMContentLoaded', function() {

    let form = document.querySelector('form');



    firebaseLogin();

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let searchCoin;
        searchCoin = e.target[0].value.toUpperCase();
        showCoin(searchCoin);
        aboutCoin(searchCoin);
        getDataForChart(searchCoin);
    })

})

function showCoin(searchCoin) {
    fetch(`https://api.nomics.com/v1/currencies/sparkline?key=c70230f0d75bb35d650e00712558eba6&start=2019-05-01T00%3A00%3A00Z&end=2019-05-23T00%3A00%3A00Z`)
        .then(response => response.json())
        .then(data => {
            // console.log(data)
            for (let i = 0; i < data.length; i++) {
                if (searchCoin === data[i].currency) {
                    let pricesLenght = data[i].prices.length - 1;

                    document.querySelector('.coin-name').innerHTML = searchCoin;
                    document.querySelector('.coin-price').innerHTML = `${data[i].prices[pricesLenght]} USD`;
                }
            }
            // chartGoogleLine(data, searchCoin)
            chart(data, searchCoin)

        })
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
            googleCharts(data, searchCoin)
        })

}


function chart(data, searchCoin) {
    // console.log(data)
    // chart


    let options = {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    label: searchCoin,
                    borderColor: "#3e95cd",
                    fill: false
                }]
            },
            options: {
                title: {
                    display: true,
                    text: 'Coin'
                }
            }
        }
        // chart end
    for (let i = 0; i < data.length; i++) {
        if (searchCoin === data[i].currency) {
            console.log(data[i])
            data[i].prices.map((price, index) => {
                options.data.datasets[0].data.push(parseFloat(price))
                options.data.labels.push(index)
            })
        }
    }
    new Chart(document.getElementById("line-chart"), options);
}

function aboutCoin(searchCoin) {
    fetch("https://api.nomics.com/v1/dashboard?key=c70230f0d75bb35d650e00712558eba6")
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




function googleCharts(data, searchCoin) {
    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(drawChart);


    candleData = []

    for (let i = 0; i < data.length; i++) {
        let arr = [new Date(data[i].timestamp), parseFloat(data[i].low), parseFloat(data[i].open), parseFloat(data[i].close), parseFloat(data[i].high)]
        candleData.push(arr);
    }

    function drawChart() {
        var data = google.visualization.arrayToDataTable(candleData, true);

        var options = {
            legend: 'none',
            // bar: { groupWidth: '100%' }, // Remove space between bars.
            candlestick: {
                fallingColor: { strokeWidth: 0, fill: '#a52714' }, // red
                risingColor: { strokeWidth: 0, fill: '#0f9d58' } // green
            },
            chartArea: { left: '4%', top: "10%", width: '96%', height: '50%' }
        };

        var chart = new google.visualization.CandlestickChart(document.getElementById('chart_div'));

        chart.draw(data, options);
    }
}

function chartGoogleLine(dataCoin, searchCoin) {
    google.charts.load('current', { packages: ['corechart', 'line'] });
    google.charts.setOnLoadCallback(drawLogScales);

    function drawLogScales() {
        var data = new google.visualization.DataTable();
        data.addColumn('number', 'X');
        data.addColumn('number', searchCoin);

        let coin = []

        for (let i = 0; i < data.length; i++) {
            if (searchCoin === data[i].currency) {
                console.log(data[i])
                data[i].prices.map((price, index) => {
                    options.data.datasets[0].data.push(parseFloat(price))
                    options.data.labels.push(index)
                })
            }
        }

        console.log(coin)

        data.addRows([
            [0, 0],
            [1, 10],
            [2, 23],
            [3, 17],
            [4, 18],
            [5, 9]
        ]);

        var options = {
            hAxis: {
                logScale: true
            },
            vAxis: {
                logScale: false
            },
            colors: ['blue']
        };

        var chart = new google.visualization.LineChart(document.getElementById('chart_div_line'));
        chart.draw(data, options);
    }

}






function firebaseLogin() {


    const firebaseConfig = {
        apiKey: "AIzaSyCsSbBmNmX5zSnRTb3Opgi8BCFFkTwWWdY",
        authDomain: "cryptosearch-12b58.firebaseapp.com",
        databaseURL: "https://cryptosearch-12b58.firebaseio.com",
        projectId: "cryptosearch-12b58",
        storageBucket: "cryptosearch-12b58.appspot.com",
        messagingSenderId: "906511613182",
        appId: "1:906511613182:web:ff8b006441814616"
    };


    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    const db = firebase.firestore()

    //  AUTH LOGIN


    // password checking
    let form = document.querySelector('.modal-form');

    document.querySelector('.back-to-index').addEventListener('click', (e) => {
        window.location.href = "./index.html";
    })

    form.addEventListener('submit', (e) => {
        let userName = document.querySelector('#userName').value;
        let password = document.querySelector('#password').value;
        const auth = firebase.auth();
        e.preventDefault();
        const promise = auth.signInWithEmailAndPassword(userName, password);
        promise.catch(e => {
                console.log(e)
                document.querySelector('.error-message').innerHTML = e
                document.querySelector('.error-message').style.color = "red";
            })
            // form.reset();
    })

    document.querySelector('#logout').addEventListener('click', function() {
        firebase.auth().signOut();
    })

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            document.querySelector('#logout').innerText = "Logout"
                // console.log("loged in")
            $('.modal').modal('hide');
            // User is signed in.
        } else {
            document.querySelector('#logout').innerText = "Not Login"
            $('#myModal').modal('show');
            // document.querySelector('.main').style.display = "none";
            console.log("NOT LOGED IN")
                // No user is signed in.
            $('.modal').modal('show');
        }
    });


}