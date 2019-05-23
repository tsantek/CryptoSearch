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


    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    const auth = firebase.auth()

    //  AUTH LOGIN


    // password checking
    let form = document.querySelector('.sign-up');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let email = document.querySelector('#signUpEmail').value
        let password = document.querySelector('#signUpPassword').value;

        auth.createUserWithEmailAndPassword(email, password)
            .then(user => {
                console.log(user)
                document.querySelector('.modal-title').innerHTML = "Wellcome to Crypto Search";
                document.querySelector('.modal-body').innerHTML = "Fowarding to Dashboard....";
                $('.modal').modal('show');
                setTimeout(function() {
                    window.location.href = "./dashboard.html";
                }, 2000);
            }).catch(function(error) {
                // An error happened.
                console.log(error)
            });

    })



})