document.addEventListener('DOMContentLoaded', function() {

    let form = document.querySelector('form');

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

    const db = firebase.firestore();
    const auth = firebase.auth();
    //  AUTH LOGIN

    login(db, auth);


    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let searchCoin;
        searchCoin = e.target[0].value.toUpperCase();
        showCoin(searchCoin, auth, db);
        aboutCoin(searchCoin);
        getDataForChart(searchCoin);
    })


    firebaseLogin(auth, db);
    firebaseFav(db, auth);


})

function showCoin(searchCoin, auth, db) {
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

    fetch(`https://api.nomics.com/v1/currencies/sparkline?key=c70230f0d75bb35d650e00712558eba6&start=${year}-${month}-01T00%3A00%3A00Z&end=${year}-${month}-${day}T00%3A00%3A00Z`)
        .then(response => response.json())
        .then(data => {
            for (let i = 0; i < data.length; i++) {
                if (searchCoin === data[i].currency) {
                    let pricesLenght = data[i].prices.length - 1;

                    document.querySelector('.coin-name').innerHTML = searchCoin;
                    document.querySelector('.coin-price').innerHTML = `${data[i].prices[pricesLenght]} USD`;
                }
            }

            var docRef = db.collection("favorites").doc(auth.currentUser.email);
            document.querySelector('.not-favorite').innerHTML = `☆`;


            docRef.get().then((doc) => {
                for (let i = 0; i < doc.data().coins.length; i++) {
                    if (doc.data().coins[i].trim() === searchCoin) {
                        document.querySelector('.favorite').innerHTML = `★`;
                        document.querySelector('.not-favorite').innerHTML = ``;
                    }
                    if (doc.data().coins[i].trim() !== searchCoin) {
                        document.querySelector('.favorite').innerHTML = ``;
                        document.querySelector('.not-favorite').innerHTML = `☆`;
                    }
                }
            })

            document.querySelector('.not-favorite').addEventListener('click', (e) => {
                let fav = document.querySelector('.favorite');
                let notfav = document.querySelector('.not-favorite');
                fav.innerHTML = "★";
                notfav.innerHTML = "";
                let dataCoin = [];
                // GET FOR FIRE BASE
                var docRef = db.collection("favorites").doc(auth.currentUser.email);
                docRef.get().then(function(doc) {
                    if (doc.exists) {

                        for (let i = 0; i < doc.data().coins.length; i++) {
                            console.log(doc.data().coins[i]);
                            dataCoin.push(doc.data().coins[i])

                        }
                        dataCoin.push(document.querySelector('.coin-name').innerText)


                        // PUSH ON FIREBASE
                        db.collection("favorites").doc(auth.currentUser.email).set({
                                coins: dataCoin
                            })
                            .then(function() {
                                console.log("Document successfully written!");
                            })
                            .catch(function(error) {
                                console.error("Error writing document: ", error);
                            });
                        // CHECK FOR CHANGES
                        db.collection("favorites").doc(auth.currentUser.email)
                            .onSnapshot(function(doc) {
                                document.querySelector('.favorite-coin').innerHTML = "";
                                for (let i = 0; i < doc.data().coins.length; i++) {
                                    document.querySelector('.favorite-coin').innerHTML += `<a class="coin-favorite-item">${doc.data().coins[i]} </a>`
                                }

                            });

                    } else {
                        // doc.data() will be undefined in this case
                        console.log("No such document!");
                    }
                }).catch(function(error) {
                    console.log("Error getting document:", error);
                });
            });

            document.querySelector('.favorite').addEventListener('click', (e) => {
                let fav = document.querySelector('.favorite');
                let notfav = document.querySelector('.not-favorite');
                fav.innerHTML = "";
                notfav.innerHTML = "☆";


                let dataCoin = [];
                // GET FOR FIRE BASE
                var docRef = db.collection("favorites").doc(auth.currentUser.email);
                docRef.get().then(function(doc) {
                    if (doc.exists) {

                        for (let i = 0; i < doc.data().coins.length; i++) {
                            if (doc.data().coins[i] !== document.querySelector('.coin-name').innerHTML) {
                                dataCoin.push(doc.data().coins[i])
                            }
                        }
                        // PUSH ON FIREBASE
                        db.collection("favorites").doc(auth.currentUser.email).set({
                                coins: dataCoin
                            })
                            .then(function() {
                                console.log("Document successfully written!");
                            })
                            .catch(function(error) {
                                console.error("Error writing document: ", error);
                            });
                        // CHECK FOR CHANGES
                        db.collection("favorites").doc(auth.currentUser.email)
                            .onSnapshot(function(doc) {
                                document.querySelector('.favorite-coin').innerHTML = "";
                                for (let i = 0; i < doc.data().coins.length; i++) {
                                    document.querySelector('.favorite-coin').innerHTML += `<a class="coin-favorite-item">${doc.data().coins[i]} </a>`
                                }

                            });

                    } else {
                        // doc.data() will be undefined in this case
                        console.log("No such document!");
                    }
                }).catch(function(error) {
                    console.log("Error getting document:", error);
                });




            })


            // document.querySelector('.favorite').addEventListener('click', (e) => {
            //     let fav = document.querySelector('.favorite');
            //     if (fav.innerHTML === '☆') {
            //         fav.innerHTML = "★";
            //         let data = [];
            //         let coinsFav = document.querySelectorAll('.coin-favorite-item');
            //         for (let i = 0; i < coinsFav.length; i++) {
            //             data.push(coinsFav[i].innerHTML)
            //         }
            //         data.push(document.querySelector('.coin-name').innerHTML);
            //         console.log(data)
            // db.collection("favorites").doc(auth.currentUser.email).set({
            //         coins: data
            //     })
            //     .then(function() {
            //         document.querySelector('.favorite-coin').innerHTML = "";
            //         console.log("Document successfully written!");
            //     })
            //     .catch(function(error) {
            //         console.error("Error writing document: ", error);
            //     });


            // } else {
            //     fav.innerHTML = "☆"
            // let coinsFav = document.querySelectorAll('.coin-favorite-item');
            // let data = []
            // for (let i = 0; i < coinsFav.length; i++) {
            //     if (coinsFav[i].innerHTML.trim() !== document.querySelector('.coin-name').innerHTML) {
            //         data.push(coinsFav[i].innerHTML)
            //     }
            // }

            // console.log(data)
            // db.collection("favorites").doc(auth.currentUser.email).update({
            //         coins: data
            //     })
            //     .then(function() {
            //         document.querySelector('.favorite-coin').innerHTML = "";
            //         firebaseFav(db, auth)
            //         console.log("Document successfully written!");
            //     })
            //     .catch(function(error) {
            //         console.error("Error writing document: ", error);
            //     });
            // }
            // });

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
            data[i].prices.map((price, index) => {
                options.data.datasets[0].data.push(parseFloat(price))
                let dayAndMonth = new Date(data[i].timestamps[index]);
                options.data.labels.push(index + 1)
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
            }
            // ,
            // chartArea: { left: '4%', top: "10%", width: '90%', height: '50%' }
        };

        var chart = new google.visualization.CandlestickChart(document.getElementById('chart_div'));

        chart.draw(data, options);
    }
}





function firebaseLogin(auth, db) {

    // password checking

    document.querySelector('.back-to-index').addEventListener('click', (e) => {
        window.location.href = "./index.html";
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


function firebaseFav(db, auth) {
    db.collection("favorites").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            if (doc.id === auth.currentUser.email) {
                for (let i = 0; i < doc.data().coins.length; i++)
                    document.querySelector('.favorite-coin').innerHTML += `<a class="coin-favorite-item">${doc.data().coins[i]} </a>`
            }
        });
    });
}


function login(db, auth) {

    let form = document.querySelector('.modal-form');

    form.addEventListener('submit', (e) => {
        let userName = document.querySelector('#userName').value;
        let password = document.querySelector('#password').value;
        e.preventDefault();
        const promise = auth.signInWithEmailAndPassword(userName, password);
        promise.then(t => {
            location.reload(true)
        })
        promise.catch(e => {
                console.log(e)
                document.querySelector('.error-message').innerHTML = e
                document.querySelector('.error-message').style.color = "red";
            })
            // form.reset();
    })
}