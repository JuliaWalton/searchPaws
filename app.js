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


const petForm = document.querySelector('#pet-form');

petForm.addEventListener('submit', fetchAnimals)

// fetch animals from API
function fetchAnimals(e) {
    e.preventDefault();

    let pets = {};

    // get user input
    const animal = document.querySelector('#animal').value;
    const zip = document.querySelector('#zip').value;

    // fetch pets
    // const petsCalling = petsCall(userLocation, petType);


pets.petsCall = function(userLocation, petType) {
	console.log(userLocation, petType);
	$.ajax({
		url: pets.petUrl,
		method: 'GET',
    crossDomain: true,
		dataType: 'jsonp',
		data : {
			key: pets.apiKey,
			location: userLocation,
    animal: petType,
    sex: petSex,
			format: 'json',
			count: 10,
			age: 'Senior',
			status: 'A'
		}  
	})
    
    
    
    .then(function(results){
        var petResults = results.petfinder.pets.pet;
		console.log(petResults);
		for (var i = 0; i < petResults.length; ++i) {
        var petName = petResults[i].name.$t;
        var petPhoto = petResults[i].media.photos.photo[0].$t;
        console.log(petName);
        console.log(petPhoto);
            pets.availablePets.append('<p>' + petName + '</p>');
        pets.availablePets.append('<div><img src="' + petPhoto + '"></div>')
        }
	});
};

$(document).ready(function() {
	pets.form();
});

}




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

        const result = await fetch(`https://api.petfinder.com/v2/types`, {
            method: 'GET',
            // mode: "no-cors",
            headers: {
                // 'Accept': "application/json",
                // 'Content-Type': 'application/json',
                // 'Access-Control-Allow-Headers': 'Content-Type',
                // 'Access-Control-Allow-Origin': '*',
                'Authorization' : ' Bearer ' + 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5NW9mV1JYRTlUTk1ham5kQXRhalNJR3I2MW1vS2c4VUh2YTlDOGpzd1B3bklzS2hoViIsImp0aSI6ImM1NDZlZDM1ZjBlM2RkMDdlOWMxNzcwNTRkYzc1NWQ1YmY2ZmM2NmI3MzhiY2FlOWM4MmYyYzI0ZjBlNjgwMGJhYzZlNTJmNzc4YTY0YjE4IiwiaWF0IjoxNzAzODcwNjI4LCJuYmYiOjE3MDM4NzA2MjgsImV4cCI6MTcwMzg3NDIyOCwic3ViIjoiIiwic2NvcGVzIjpbXX0.WVkykcYTE4_JFyn8_U0mAflxoGw9aLiHR4HvYGO79xC8W7PRqXWw62ozjQpzdnmosrzPvp16mXU_2srjDuB1koyxXEODhOfWJjKGjHLrZsz38Z5Tz82AmlnnViYbCSOivthGs8izKewplCVokcv_DL5EfRQ2niPcIpFpXf-PdKMNCJunVTLfsPl3MfW9qIXOEsuvGIjrEzajIbq7EApST7w7vBTFM6tzJHe6pgY8L6ZynXlxgf4Ha07G6hARWbbmZoXvjVlpZ6pGuv6bFlSheA1btqCRJlADzFq-I6vCDP0HP3Y9KFTvdM3c9m6ZcuRxFpxQLfjRsjM7wWmUEIfArA'}
        })

        const dogs = await result.json();
        console.log(dogs)
        return dogs;
    }
    console.log(_getToken())
    // console.log(_getType())
    return _getType();

});

console.log(APIController())