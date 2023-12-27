// API Key
// 5ofWRXE9TNMajndAtajSIGr61moKg8UHva9C8jswPwnIsKhhV
// API Secret
// mE7btI0X2YuBtkK1cURlkOpwUaTWrb3JCIysdDpq

// async function getPets(e) {
//     e.preventDefault();

//     const res = await fetch(
//         "grant_type=client_credentials&client_id={5ofWRXE9TNMajndAtajSIGr61moKg8UHva9C8jswPwnIsKhhV}&client_secret={mE7btI0X2YuBtkK1cURlkOpwUaTWrb3JCIysdDpq}", "https://api.petfinder.com/v2/oauth2/token");
//     const data = await res.json();
//     console.log(data)
// }






// window.addEventListener('DOMContentLoaded', getPets)

// curl -d "grant_type=client_credentials&client_id={5ofWRXE9TNMajndAtajSIGr61moKg8UHva9C8jswPwnIsKhhV}&client_secret={mE7btI0X2YuBtkK1cURlkOpwUaTWrb3JCIysdDpq}" https://api.petfinder.com/v2/oauth2/token



const APIController = (function() {
    const clientID = `95ofWRXE9TNMajndAtajSIGr61moKg8UHva9C8jswPwnIsKhhV`;
    const clientSecret = `iEGxRKohdA4MToAQZypx4eTJZx66ramkA8pcm7aZ`
    const grantType = 'client_credentials';

    // private methods
    const _getToken = async () => {

        const result = await fetch(`https://api.petfinder.com/v2/oauth2/token`, {
            method: 'POST',
            headers: {'Accept': 'application/json, text/plain, */*',
                'Content-Type':'application/x-www-form-urlencoded'}, // this line is important, if this content-type is not set it wont work
            body: 
                'grant_type=client_credentials&client_id=95ofWRXE9TNMajndAtajSIGr61moKg8UHva9C8jswPwnIsKhhV&client_secret=iEGxRKohdA4MToAQZypx4eTJZx66ramkA8pcm7aZ'
                // 'client_id' : `5ofWRXE9TNMajndAtajSIGr61moKg8UHva9C8jswPwnIsKhhV`,
                // 'client_secret' : `mE7btI0X2YuBtkK1cURlkOpwUaTWrb3JCIysdDpq`,
                // 'grant_type' : 'client_credentials'
            
        });

        const data = await result.json();
        console.log(data);
        return data.access_token;
    }

    const _getType = async () => {

        const result = await fetch(`https://api.petfinder.com/v2/animals`, {
            method: 'GET',
            // mode: "no-cors",
            headers: {
                'Accept': "application/json", 
                'Access-Control-Allow-Origin': 'https://juliawalton.github.io/searchPaws/',
                'Authorization' : ' Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5NW9mV1JYRTlUTk1ham5kQXRhalNJR3I2MW1vS2c4VUh2YTlDOGpzd1B3bklzS2hoViIsImp0aSI6IjMyNzNjZWVkZjM4ZjA2ZDMwMzUzNzcxMzc1MzZkNDZiNTY5ZGQ5MzhmODFmYzI2M2M0NGQyMzlkZWU1YjMzZTNlMWE4ODZhNjIzYzRhODY3IiwiaWF0IjoxNzAzNjQyMTM0LCJuYmYiOjE3MDM2NDIxMzQsImV4cCI6MTcwMzY0NTczNCwic3ViIjoiIiwic2NvcGVzIjpbXX0.ktYpmdyYyrxPVe0uQO6EnVXda2KZXp9Y9s0bbijqLrrsTia5_WTF9U0OnXcq-TmVYrdKtknbIXdnQM4yH0BQo08az3vsywAIXoEv3q9D2u-wkB6jubPatI6ewwBehnrnu2SQ9TB5GEQ9T2C9ByQKNO9kgEy1Y9kWqKqkrgQDY9QXl1keM9qA_G3Cq28hHJ7ev6OX3dUkwlxhd8RJ_UWFoLiqYHmYM00OmowcukxCyK8O5Hq0TUJ95ncH9ogOBCu3rRIqe6cogaXcgVyj5lK4-nboy9a2sD-lR9Rbx64SbjQ8-zPKlXRYrV8KezQ6TsPA87XNtRNgB98EgY95x7vTbA'}
        })
        console.log(result)
        return result;
    }
    console.log(_getToken())
    // console.log(_getType())
    return _getType();

});

console.log(APIController())