
function APIController(e) {

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
            
        });

        const data = await result.json();
        console.log(data);
        // console.log(data.access_token);
        return data.access_token;
    }

        async function _getType() {
        // you need to have the await here!!!
        const accessToken = await _getToken();
        // console.log(accessToken)

        const result2 = await fetch(`https://api.petfinder.com/v2/animals?type=dog&page=1`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization' : ' Bearer ' + `${accessToken}`}
        })

        const dogs = await result2.json();
        console.log(dogs)
        return dogs;
    }
    return _getType();
}


// display 20 dogs
async function displayDogs() {
    // use destructuring {} to get just the results array from that object
    const { animals } = await APIController();
    console.log(animals);

    animals.forEach(dog => {
        const dogCardDiv = document.createElement('div');
        dogCardDiv.classList.add('card');
        dogCardDiv.innerHTML = `
          <a href="index.html?id=${dog.id}">
            ${
                dog.photos.length >= 1
                ? `<img
                    src="${dog.photos[0].full}"
                    class="card-img-top"
                    alt="${dog.name}"
                    />` 
                : `<img
                    src="../images/no-image.jpg"
                    class="card-img-top"
                    alt="${dog.name}"
                    />` 
            }
          </a>
          <div class="card-body">
          <h5 class="card-title">${dog.name}</h5>
                    <p class="card-text">
                        <p class="supporting-text">${dog.gender}</p>
                        <p class="supporting-text">${dog.breeds.primary}</p>
                        
                    </p>
          </div>`;

          document.querySelector('#adoptable-dogs').appendChild(dogCardDiv)
    })
}

const globalState = {
    currentPage: window.location.pathname,
};

console.log(globalState)
// Below is a router, so wherever we want to run a function in response to a certain page, we'll put it inside that corresponding case


// Init app
function init() {
    switch(globalState.currentPage) {
        // case '/':
        case '/index.html':
            displayDogs()
            break;
        case `/new.html`:
            displayLocationDogs()
            break;
        // case '/movie-details.html':
        //     console.log('Movie Details');
        //     break;
        // case '/tv-details.html':
        //     console.log('TV Details');
        //     break;
        // case '/search.html':
        //     console.log('Search');
        //     break;
    }

    // highlightActiveLink();
}

document.addEventListener('DOMContentLoaded', init);

const petForm = document.getElementById('pet-form');

petForm.addEventListener('submit', fetchByParams)

function fetchByParams(e) {
    e.preventDefault(); 

    const zip = document.querySelector('#zip').value;
    petForm.action = `${window.location.pathname}`;
    console.log(petForm.action)

    nextStep();
    return zip;
}

function nextStep() {
    const zip = document.querySelector('#zip').value;
    console.log(zip)
    if (zip !== "") { 
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
            
        });

        const data = await result.json();
        console.log(data);
        // console.log(data.access_token);
        return data.access_token;
    }

        async function _getType() {
        // you need to have the await here!!!
        const accessToken = await _getToken();
        // console.log(accessToken)

        const result2 = await fetch(`https://api.petfinder.com/v2/animals?type=dog&location=${zip}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization' : ' Bearer ' + `${accessToken}`}
        })

        const dogs = await result2.json();
        console.log(dogs)
        return dogs;
    }
    // displayLocationDogs();
    return _getType();
}
}

// display 20 dogs
async function displayLocationDogs() {
    document.querySelector('#adoptable-dogs').innerHTML = "";
    // use destructuring {} to get just the results array from that object
    const { animals } = await nextStep();
    console.log(animals);

    animals.forEach(dog => {
        const dogCardDiv = document.createElement('div');
        dogCardDiv.classList.add('card');
        dogCardDiv.innerHTML = `
          <a href="index.html?id=${dog.id}">
            ${
                dog.photos.length >= 1
                ? `<img
                    src="${dog.photos[0].full}"
                    class="card-img-top"
                    alt="${dog.name}"
                    />` 
                : `<img
                    src="../images/no-image.jpg"
                    class="card-img-top"
                    alt="${dog.name}"
                    />` 
            }
          </a>
          <div class="card-body">
          <h5 class="card-title">${dog.name}</h5>
                    <p class="card-text">
                        <p class="supporting-text">${dog.gender}</p>
                        <p class="supporting-text">${dog.breeds.primary}</p>
                        <small class="text-muted">Distance: ${dog.distance}</small>
                    </p>
          </div>`;

          document.querySelector('#adoptable-dogs').appendChild(dogCardDiv)
    })
}


// // https://api.petfinder.com/v2/animals?type=dog&page=2&location=${endpoint}`, {

// const petForm = document.getElementById('pet-form');

// petForm.addEventListener('submit', fetchByParams)

// function fetchByParams(e) {
//     e.preventDefault(); 

//     // const animal = document.querySelector('#animal').value;
//     const zip = document.querySelector('#zip').value;
//     console.log(zip)
// // }
// if (zip !== "") { 
//     const clientID = `95ofWRXE9TNMajndAtajSIGr61moKg8UHva9C8jswPwnIsKhhV`;
//     const clientSecret = `iEGxRKohdA4MToAQZypx4eTJZx66ramkA8pcm7aZ`
//     const grantType = 'client_credentials';

//     // private methods
//     async function _getToken() {

//         const result = await fetch(`https://api.petfinder.com/v2/oauth2/token`, {
//             method: 'POST',
//             headers: {'Accept': 'application/json, text/plain, */*',
//                 'Content-Type':'application/x-www-form-urlencoded'}, // this line is important, if this content-type is not set it wont work
//             body: 
//                 `grant_type=${grantType}&client_id=${clientID}&client_secret=${clientSecret}`
//                 // 'client_id' : `5ofWRXE9TNMajndAtajSIGr61moKg8UHva9C8jswPwnIsKhhV`,
//                 // 'client_secret' : `mE7btI0X2YuBtkK1cURlkOpwUaTWrb3JCIysdDpq`,
//                 // 'grant_type' : 'client_credentials'
            
//         });

//         const data = await result.json();
//         console.log(data);
//         // console.log(data.access_token);
//         return data.access_token;
//     }


//     async function _getType() {

//         // you need to have the await here!!!
//         const accessToken = await _getToken();
//         console.log(accessToken)

//         // if theres a zipcode entry 

//         const result = await fetch(`https://api.petfinder.com/v2/animals?type=dog&location=${zip}`, {
//             method: 'GET',
//             // mode: "no-cors",
//             headers: {
//                 'Accept': 'application/json',
//                 // 'Access-Control-Allow-Origin': 'http://127.0.0.1:5501/',
//                 'Content-Type': 'application/json',
//                 // 'Access-Control-Allow-Headers': 'Content-Type',
//                 // 'Access-Control-Allow-Origin': 'Content-Type',
//                 'Authorization' : ' Bearer ' + `${accessToken}`}
//         })

//         const dogs = await result.json();
//         console.log(dogs)
//         return dogs;
//     }
//     _getType();
//     displayDogsByLocation();
//     }
    
    
// }


// // display 20 dogs
// async function displayDogsByLocation() {
//     // use destructuring {} to get just the results array from that object
//     const { animals } = await fetchByParams();
//     console.log(animals);

//     animals.forEach(dog => {
//         const dogCardDiv = document.createElement('div');
//         dogCardDiv.classList.add('card');
//         dogCardDiv.innerHTML = `
//           <a href="index.html?id=${dog.id}">
//             ${
//                 dog.photos.length >= 1
//                 ? `<img
//                     src="${dog.photos[0].full}"
//                     class="card-img-top"
//                     alt="${dog.name}"
//                     />` 
//                 : `<img
//                     src="../images/no-image.jpg"
//                     class="card-img-top"
//                     alt="${dog.name}"
//                     />` 
//             }
//           </a>
//           <div class="card-body">
//           <h5 class="card-title">${dog.name}</h5>
//                     <p class="card-text">
//                         <p class="supporting-text">${dog.gender}</p>
//                         <p class="supporting-text">${dog.breeds.primary}</p>
//                         <small class="text-muted">Distance: XX/XX/XXXX</small>
//                     </p>
//           </div>`;

//           document.querySelector('#adoptable-dogs').appendChild(dogCardDiv)
//     })
// }