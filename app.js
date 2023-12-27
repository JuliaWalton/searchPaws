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
    const clientSecret = `mE7btI0X2YuBtkK1cURlkOpwUaTWrb3JCIysdDpq`
    const grantType = 'client_credentials';

    // private methods
    const _getToken = async () => {

        const result = await fetch(`https://api.petfinder.com/v2/oauth2/token`, {
            method: 'POST',
            headers: {'Accept': 'application/json, text/plain, */*',
                'Content-Type':'application/x-www-form-urlencoded'}, // this line is important, if this content-type is not set it wont work
            body: 
                'grant_type=client_credentials&client_id=95ofWRXE9TNMajndAtajSIGr61moKg8UHva9C8jswPwnIsKhhV&client_secret=mE7btI0X2YuBtkK1cURlkOpwUaTWrb3JCIysdDpq'
                // 'client_id' : `5ofWRXE9TNMajndAtajSIGr61moKg8UHva9C8jswPwnIsKhhV`,
                // 'client_secret' : `mE7btI0X2YuBtkK1cURlkOpwUaTWrb3JCIysdDpq`,
                // 'grant_type' : 'client_credentials'
            
        });

        const data = await result.json();
        console.log(data);
        return data.access_token;
    }

    const _getType = async () => {

        const result = await fetch(`https://api.petfinder.com/v2/animals?type=dog&page=2`, {
            method: 'GET',
            headers: {
                // 'Access-Control-Allow-Origin': '*',
                'Authorization': 'Bearer ' + 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5NW9mV1JYRTlUTk1ham5kQXRhalNJR3I2MW1vS2c4VUh2YTlDOGpzd1B3bklzS2hoViIsImp0aSI6IjFkYjY0ZjkxZGM4OGE0OWEzN2RlOThkYmNhNjRjMDRlOTY5Mzk1NTVhYzk1ZGU1ZTVkODEyODlhNWM4NThiOWUxZjRkOTgxMzEwZDMxNDVkIiwiaWF0IjoxNzAzNjM5OTA1LCJuYmYiOjE3MDM2Mzk5MDUsImV4cCI6MTcwMzY0MzUwNSwic3ViIjoiIiwic2NvcGVzIjpbXX0.uY3plRPM7k5fXK0b-wB5wiFX6kZUedTg9TuFmzFlzogSB5BLDWxi_pPj3rGbZCnMvB60OY0EkfUJGXcW_UIQVRZjAQb3_3kQxtfeijcbed5Xxk6tKdqiU2WfcU8HqBnIZR1brfQC7S3w1uRcC-kjY61gXQbf_a6fiEENxBUJqcfU_OTCnC07gIPAQLwrW0439ANJfkjAlAC2YTIcE_KGkewi3sw9gVxcKpco_p_h1_xCgOJWqLnF92KSGVnE1sOEYZmn3iHxl1JwwoCnvWOzsj1HCtoUviRhX7do48cFk5G3eaLKiYFDT18R4lg-k-9NlRS5bGF8DO1gqpYBrnyPpw',}
        })
        console.log(result)
        return result;
    }
    console.log(_getToken())
    // console.log(_getType())
    return _getType();

});

console.log(APIController())