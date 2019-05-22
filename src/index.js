document.addEventListener('DOMContentLoaded', function() {
    getDataFromApiForTopTenCoins();
    price();
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
    }, 500);
}