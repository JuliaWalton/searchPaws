const APIController = (function() {
    const clientID = `95ofWRXE9TNMajndAtajSIGr61moKg8UHva9C8jswPwnIsKhhV`;
    const clientSecret = `iEGxRKohdA4MToAQZypx4eTJZx66ramkA8pcm7aZ`
    const grantType = 'client_credentials';

    // private methods
    async function _getToken() {

        const result = await fetch(`https://api.petfinder.com/v2/oauth2/token`, {
            method: 'POST',
            headers: {'Accept': 'application/json, text/plain, */*',
                'Content-Type':'application/x-www-form-urlencoded'}, // this line is important, if this content-type is not set it wont work
            body: 
                `grant_type=${grantType}&client_id=${clientID}&client_secret=${clientSecret}`
                // 'client_id' : `5ofWRXE9TNMajndAtajSIGr61moKg8UHva9C8jswPwnIsKhhV`,
                // 'client_secret' : `mE7btI0X2YuBtkK1cURlkOpwUaTWrb3JCIysdDpq`,
                // 'grant_type' : 'client_credentials'
            
        });

        const data = await result.json();
        console.log(data);
        // console.log(data.access_token);
        return data.access_token;
    }

        async function _getType() {

        const accessToken = await _getToken();
        console.log(accessToken)

        const result2 = await fetch(`https://api.petfinder.com/v2/animals?type=dog&page=2`, {
            method: 'GET',
            // mode: "no-cors",
            headers: {
                'Accept': 'application/json',
                // 'Access-Control-Allow-Origin': 'http://127.0.0.1:5501/',
                'Content-Type': 'application/json',
                // 'Access-Control-Allow-Headers': 'Content-Type',
                // 'Access-Control-Allow-Origin': 'Content-Type',
                'Authorization' : ' Bearer ' + `${accessToken}`}
        })

        const dogs = await result2.json();
        console.log(dogs)
        return dogs;
        
    
    }

    // _getToken();
    return _getType();
})


console.log(APIController())