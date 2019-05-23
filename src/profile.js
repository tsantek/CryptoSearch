document.addEventListener('DOMContentLoaded', function() {
    const firebaseConfig = {
        apiKey: "AIzaSyCsSbBmNmX5zSnRTb3Opgi8BCFFkTwWWdY",
        authDomain: "cryptosearch-12b58.firebaseapp.com",
        databaseURL: "https://cryptosearch-12b58.firebaseio.com",
        projectId: "cryptosearch-12b58",
        storageBucket: "cryptosearch-12b58.appspot.com",
        messagingSenderId: "906511613182",
        appId: "1:906511613182:web:ff8b006441814616"
    };

    // firebase.initializeApp(firebaseConfig);

    // const db = firebase.firestore()



    let form = document.querySelector('form');
    // fireBase(db);
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let searchCoin;
        searchCoin = e.target[0].value;
        aboutCoin(searchCoin);
        showCoin(searchCoin)
    })
})



function showCoin(searchCoin, db) {


    // let favButt = document.querySelector('.favorite-button');
    // let favCoins = document.querySelectorAll('.favorite-item');

    // let arrFavCoins = []
    // for (let i = 0; i < favCoins.length; i++) {
    //     arrFavCoins.push(favCoins[i].name)
    // }

    // if (arrFavCoins.includes(searchCoin)) {
    //     document.querySelector('.favorite-button').innerHTML = "FAV";
    //     document.querySelector('.favorite-button').addEventListener('click', (e) => {
    //         let selected = document.querySelector('.coin-name').innerHTML;
    //         console.log(selected)
    //         document.querySelector('.favorite-button').innerHTML = "FAV NOOOT";
    //     })
    // }

    // if (!arrFavCoins.includes(searchCoin)) {
    //     let selected = document.querySelector('.coin-name').innerHTML;
    //     console.log(searchCoin)
    //     document.querySelector('.favorite-button').innerHTML = "FAV NOOOT";
    //     document.querySelector('.favorite-button').addEventListener('click', (e) => {
    //         let selected = document.querySelector('.coin-name').innerHTML;
    //         console.log(selected)
    //         document.querySelector('.favorite-button').innerHTML = "FAV";
    //     })
    // }





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
                                colors: ['#f3f3f3', 'transparent'],
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




// FIREBASE


// function fireBase(db) {

//     function getMyInfo(collectionName) {
//         return new Promise((resolve, reject) => {
//             db.collection(collectionName).get()
//                 .then((querySnapshot) => {
//                     querySnapshot.forEach((doc) => {
//                         const coins = doc.data()
//                         resolve(coins)
//                     });
//                 })
//                 .catch(e => {
//                     reject(e)
//                 })
//         })
//     }

//     getMyInfo("favorites")
//         .then(coins => {

//             // adding favorit list from server
//             let arrCoins = coins.favorites;
//             for (let i = 0; i < arrCoins.length; i++) {
//                 document.querySelector('.favorites-coins').innerHTML += ` <a class="favorite-item" name=${arrCoins[i]} >  ${arrCoins[i]} </a> `
//             }
//             // click on list is selecting the right one
//             let arrFav = document.querySelectorAll('.favorite-item');
//             for (let i = 0; i < arrFav.length; i++) {
//                 arrFav[i].addEventListener('click', (e) => {
//                     let favoriteCoint = e.target.name
//                     aboutCoin(favoriteCoint, arrCoins);
//                     showCoin(favoriteCoint);
//                 })
//             }
//         })
//         .catch(e => {
//             alert(e)
//         })


















//     function handleBioSave(arrCoins) {
//         console.log(arrCoins)
//         db.collection("favorites").doc("RMAgnEjKJqpKwy2PZeet").update({
//                 favorites: arrCoins
//             })
//             .then(function() {
//                 document.querySelector('.favorites-coins').innerHTML = "TEST"
//                 console.log("PASSED")
//             })
//             .catch(function(error) {
//                 console.error("Error writing document: ", error);
//             });
//     }

// document.querySelector('.fav-coin').addEventListener('click', (e) => {
//     // handleBioSave(arrCoins)
//     console.log(arrCoins)
// })
// }


















// function favoriteCoin(db, fav, searchCoin) {

//     function getFavorites(favorites) {
//         return new Promise((resolve, reject) => {
//             db.collection(favorites).get()
//                 .then((querySnapshot) => {
//                     querySnapshot.forEach((doc) => {
//                         const favorite = doc.data()
//                         resolve(favorite)
//                     });
//                 })
//                 .catch(e => {
//                     reject(e)
//                 })
//         })
//     }

//     getFavorites("favorites", fav, searchCoin)
//         .then(favorite => {
//             for (key in favorite) {
//                 if (key === "santek.vg@gmail.com") {
//                     // console.log(favorite[key])
//                     if (favorite[key].length === 0) {
//                         document.querySelector('.favorites-coins').innerHTML += `
//                         <a class="favorite-item"> You don't have any favorites </a>
//                         `
//                     }
//                     for (let i = 0; i < favorite[key].length; i++) {
//                         // put all favorites in fav
//                         fav.push(favorite[key][i])

//                     }
//                 }
//                 showFav(fav);
//             }

//             let arrFav = document.querySelectorAll('.favorite-item');
//             for (let i = 0; i < arrFav.length; i++) {
//                 arrFav[i].addEventListener('click', (e) => {
//                     let favoriteCoint = e.target.name
//                     aboutCoin(favoriteCoint, fav);
//                     showCoin(favoriteCoint, fav);
//                 })
//             }
//         })
//         .catch(e => {
//             alert(e)
//         })
// }


// LIST FAVORITES 
// function showFav(fav) {
//     for (let i = 0; i < fav.length; i++) {
//         document.querySelector('.favorites-coins').innerHTML += `
//         <a class="favorite-item" name=${fav[i]} >  ${fav[i]} </a>
//         `
//     }
// }


// function favoritesIncludes(searchCoin, fav) {

//     if (fav.includes(searchCoin)) {
//         console.log(searchCoin)
//         document.querySelector('.favorite-button').innerHTML = "FAV"
//     }

//     if (!fav.includes(searchCoin)) {
//         console.log(searchCoin)
//         document.querySelector('.favorite-button').innerHTML = "FAV NOOOT"
//     }

// }
// // ADD new one

// function updateFav(fav, searchCoin) {
//     let favorite = document.querySelector('.favorite-button');
//     console.log(fav)

//     favorite.addEventListener('click', (e) => {
//         if (favorite.innerHTML === "FAV NOOOT") {
//             fav.push(searchCoin)
//             document.querySelector('.favorites-coins').innerHTML = "Favorites"
//             showFav(fav)
//             let arrFav = document.querySelectorAll('.favorite-item');
//             for (let i = 0; i < arrFav.length; i++) {
//                 arrFav[i].addEventListener('click', (e) => {
//                     let favoriteCoint = e.target.name
//                     aboutCoin(favoriteCoint, fav);
//                     showCoin(favoriteCoint, fav);
//                 })
//             }
//             console.log(fav)
//         }
//     })
// }

// // REMOVE ONE

// function removeFav(fav, searchCoin, db) {

//     let favorite = document.querySelector('.favorite-button');
//     favorite.addEventListener('click', (e) => {
//         if (favorite.innerHTML === "FAV") {
//             console.log(favorite)

//             for (var i = fav.length - 1; i >= 0; i--) {
//                 if (fav[i] === searchCoin) {
//                     fav.splice(i, 1);
//                 }
//             }


//             document.querySelector('.favorites-coins').innerHTML = "Favorites"


//             showFav(fav)
//             updateFav(fav)

//             // UPDATE LIST
//             let arrFav = document.querySelectorAll('.favorite-item');
//             for (let i = 0; i < arrFav.length; i++) {
//                 arrFav[i].addEventListener('click', (e) => {
//                     let favoriteCoint = e.target.name
//                     aboutCoin(favoriteCoint, fav);
//                     showCoin(favoriteCoint, fav);
//                 })
//             }

//             console.log(fav)
//         }
//     })
// }



// function updateFav(fav, db) {
//     db.collection("favorites").doc("RMAgnEjKJqpKwy2PZeet").update({
//         "santek.vg@gmail.com": fav
//     })
// }