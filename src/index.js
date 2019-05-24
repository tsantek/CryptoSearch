document.addEventListener('DOMContentLoaded', function() {
    ifIsSignIn();
    marketCap()
    getDataFromApiForTopTenCoins();
    time();
})

// data on page
function time() {
    var d = new Date();
    var n = d.getFullYear();
    document.querySelector('.time').innerText = n;
}

// geting data from API

function getDataFromApiForTopTenCoins() {
    fetch("https://api.nomics.com/v1/dashboard?key=2018-09-demo-dont-deploy-b69315e440beb145")
        .then(response => response.json())
        .then(data => {
            // sort by day open
            data.sort(function(a, b) {
                return b.dayOpen - a.dayOpen
            })

            for (let i = 0; i < 10; i++) {
                let currency = data[i].currency;
                let dayOpen = data[i].dayOpen;
                let dayOpenVolume = data[i].dayOpenVolume;
                let maxSupply = data[i].maxSupply;
                let high = data[i].high;
                let availableSupply = data[i].availableSupply;

                if (data[i].currency === null) {
                    currency = "-"
                }
                if (data[i].dayOpen === null) {
                    dayOpen = "-"
                }
                if (data[i].dayOpenVolume === null) {
                    dayOpenVolume = "-"
                }
                if (data[i].high === null) {
                    high = "-"
                }

                if (data[i].maxSupply === null) {
                    maxSupply = "-"
                }

                if (data[i].availableSupply === null) {
                    availableSupply = "-"
                }
                document.querySelector('.coin-data').innerHTML += `
                <tr>
                <th scope="col" class="currency">${currency}</th>
                <td scope="col" class="${currency}"></td>
                <td scope="col">${dayOpen}</td>
                <td scope="col">${dayOpenVolume}</td>
                <td scope="col">${high}</td>
                <td scope="col">${availableSupply}</td>
                <td scope="col">${maxSupply}</td>
                </tr>
                `

            }

            price();
        })
        .catch(e => {
            console.log(e);
        })

}

//  search for price 

function price() {
    setTimeout(function() {
        let arrCurrency = document.querySelectorAll('.currency');
        for (let i = 0; i < arrCurrency.length; i++) {
            fetch(`https://api.nomics.com/v1/markets/prices?key=2018-09-demo-dont-deploy-b69315e440beb145&currency=${arrCurrency[i].innerHTML}`)
                .then(response => response.json())
                .then(data => {
                    // console.log(data)
                    let arrCoins = document.querySelector(`.${arrCurrency[i].innerHTML}`);
                    for (let i = 0; i < data.length; i++) {
                        // console.log(data[i])
                        if (data[i].quote === "USD") {
                            arrCoins.innerHTML = `${data[i].price}`
                        } else {
                            arrCoins.innerHTML = `${data[i].price}`
                        }
                    }


                })
                .catch(e => console.log(e))
        }
    }, 50);
}

function marketCap() {

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


    fetch(`https://api.nomics.com/v1/market-cap/history?key=2018-09-demo-dont-deploy-b69315e440beb145&start=${year}-${month}-01T00%3A00%3A00Z&end=${year}-${month}-${day}T00%3A00%3A00Z`)
        .then(response => response.json())
        .then(data => {

            var options = {
                chart: {
                    height: 250,
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
                    text: `Market Cap in May`,
                    align: 'center'
                },
                grid: {
                    row: {
                        colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                        opacity: 0.5
                    },
                },
                yaxis: {
                    labels: {
                        formatter: function kFormatter(num) {
                            return Math.abs(num) > 999 ? Math.sign(num) * ((Math.abs(num) / 1000000000).toFixed(1)) + 'B' : Math.sign(num) * Math.abs(num)
                        }
                    },
                },
                xaxis: {
                    categories: [],
                    labels: {
                        datetimeFormatter: {
                            year: 'yyyy',
                            month: 'MMM \'yy',
                            day: 'dd MMM',
                            hour: 'HH:mm'
                        }
                    }
                }
            }

            var chart = new ApexCharts(
                document.querySelector("#chart-line"),
                options
            );

            chart.render();

            // console.log(data)
            for (let i = 0; i < data.length; i++) {
                options.series[0].data.push(data[i].market_cap);
            }

        })
        .catch(e => console.log(e))
}


function ifIsSignIn() {

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

    const auth = firebase.auth();
    //  AUTH LOGIN

    document.querySelector('.logout').addEventListener('click', function() {
        firebase.auth().signOut();
    })

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            console.log("loged in")
            document.querySelector('.dashboard').style.display = "block";
            document.querySelector('.logout').style.display = "block";
            document.querySelector('.signup').style.display = "none";
            document.querySelector('.login').style.display = "none";
            // User is signed in.
        } else {
            document.querySelector('.dashboard').style.display = "none";
            document.querySelector('.signup').style.display = "block";
            document.querySelector('.logout').style.display = "none";
            document.querySelector('.login').style.display = "block";

            console.log("NOT LOGED IN")
                // No user is signed in.
        }
    });


}