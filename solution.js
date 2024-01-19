const globalState = {
    currentPage: window.location.pathname,
};
console.log(globalState)


async function APIController(endpoint) {
    console.log(endpoint)

    const clientID = `95ofWRXE9TNMajndAtajSIGr61moKg8UHva9C8jswPwnIsKhhV`;
    const clientSecret = `iEGxRKohdA4MToAQZypx4eTJZx66ramkA8pcm7aZ`
    const grantType = 'client_credentials';
    const baseUrl = "https://api.petfinder.com/v2/animals";
    const url = `${baseUrl}${endpoint}`;

    // private methods
    async function _getToken() {
        const result = await fetch(`https://api.petfinder.com/v2/oauth2/token`, {
            method: 'POST',
            headers: {'Accept': 'application/json, text/plain, */*',
                'Content-Type':'application/x-www-form-urlencoded'}, //  if this content-type is not set it wont work
            body: 
                `grant_type=${grantType}&client_id=${clientID}&client_secret=${clientSecret}`
            
        });
        const data = await result.json();
        console.log(data);
        // console.log(data.access_token);
        return data.access_token;
    }

        async function _makeCall() {
        // you need to have the await here!!!
        const accessToken = await _getToken();
        // console.log(accessToken)

        const result2 = await fetch(`${url}`, {
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
    return _makeCall();
}


// Execute the API calls based on form data
const petForm = document.getElementById('pet-form');
petForm.addEventListener('submit', executeApiCalls)

async function executeApiCalls(e) {
    const animal = document.querySelector('#animal').value;
    const zip = document.querySelector('#zip').value;
    const gender = document.querySelector('#gender').value;
    const size = document.querySelector('#size').value;
    const age = document.querySelector('#age').value;
    const distance = document.querySelector('#distance').value;

    e.preventDefault(); 

    const formData = {
        type: `${animal}`,
        location: `${zip}`,
        gender: `${gender}`,
        size: `${size}`,
        age: `${age}`,
        distance: `${distance}`,
    }

    for (const [key, value] of Object.entries(formData)) {
        if (value === 'none' || value === '') {
            delete formData[key];
            console.log(formData)
        } 
    }

    const queryParams = new URLSearchParams(formData);
    // console.log(queryParams.toString());

    const result = await APIController(`?` + queryParams.toString());
        (async () => {
            const data = await result;
            displayDogs(data.animals)
            })();
}


// display 20 dogs
async function displayDogs(animals) {
    document.querySelector('#adoptable-dogs').innerHTML = "";
    // console.log(animals);

    animals.forEach(dog => {
        const dogCardDiv = document.createElement('div');
        dogCardDiv.classList.add('card');
        dogCardDiv.innerHTML = `
            <a href="animal-details.html?id=${dog.id}">
                ${
                    dog.photos.length >= 1
                    ? `<img
                        src="${dog.photos[0].full}"
                        class="card-img-top"
                        alt="image of ${dog.name}"
                        />` 
                    : `<img
                        src="../images/no-image.jpg"
                        class="card-img-top"
                        alt="there is no image for ${dog.name}"
                        />` 
                }
            </a>
            <div class="card-body">
            <h5 class="card-title">${dog.name}</h5>
                        <p class="card-text">
                        <div class="details-description-flex">
                            <p class="supporting-text">${dog.age} |</p>
                            <p class="supporting-text">${dog.gender}</p>
                        </div>
                        <p class="supporting-text">${dog.breeds.primary}</p>
                            ${ dog.distance === null
                            ? `<p class="supporting-text">Location not specified</p>` 
                            : `<p class="supporting-text">${roundMiles(dog.distance)} miles away</p>`
                            }
            </div>`;
        
        document.querySelector('#adoptable-dogs').appendChild(dogCardDiv)
    })
}

function roundMiles(dogdistance) {
    return Math.round(dogdistance);
}


// const cards = document.querySelectorAll('card');

// cards.forEach((card) => {
//     card.addEventListener('click', displayAnimalDetails)
//     console.log('wtf')
// })

// display animal details
async function displayAnimalDetails() {
    // console.log(window.location.search);
    const animalID =  window.location.search.split('=')[1];
    const dog = await APIController(`/${animalID}`);

    const div = document.createElement('div');
    div.innerHTML = `
        <div class="details-card">
            <div class="details-img">
                ${
                    dog.animal.photos.length >= 1
                    ? `<img
                        src="${dog.animal.photos[0].full}"
                        class="card-img-top"
                        alt="image of ${dog.animal.name}"
                        />` 
                    : `<img
                        src="../images/no-image.jpg"
                        class="card-img-top"
                        alt="there is no image for ${dog.animal.name}"
                        />` 
                }
            </div>
            <div class="details-description">
                <div class="details-description-flex">
                    <h2 class="name">${dog.animal.name}</h2>
                    <p class="breed">${dog.animal.breeds.primary}</p>
                </div>
                <div class="details-description-flex">
                    <p>${dog.animal.age}</p>
                    <p>${dog.animal.gender}</p>
                    <p>${dog.animal.size}</p>
                </div>
                <h4>Contact Information</h4>
                <p>Email: ${dog.animal.contact.email}</p>
                <p>Phone: ${dog.animal.contact.phone}</p>
                <div class="details-description-flex">
                    <p>Address: ${dog.animal.contact.address.address1}</p>
                    <p>City: ${dog.animal.contact.address.city}</p>
                    <div class="details-description-flex">
                        <p>State: ${dog.animal.contact.address.state}</p>
                        <p>Country: ${dog.animal.contact.address.country}</p>
                    </div>
                </div>
                <h4>Attributes</h4>
                <div class="details-description-grid">
                <p>House Trained: ${dog.animal.attributes.house_trained}</p>
                <p>Current Shots: ${dog.animal.attributes.shots_current}</p>
                <p>Spayed or Neutered: ${dog.animal.attributes.spayed_neutered}</p>
                <p>Special Needs: ${dog.animal.attributes.special_needs}</p>
                </div>
                <h4>Description</h4>
                <p>${dog.animal.description}</p>
                <p class="tags-container">Characteristics: ${dog.animal.tags}</p>
                
                <a href="${dog.animal.url}" target="_blank" class="btn">Visit Homepage</a>
            </div>
        </div>`;
        document.querySelector('#animal-details').appendChild(div);
}


// Below is a router, so wherever we want to run a function in response to a certain page, we'll put it inside that corresponding case
console.log(globalState.currentPage);

function init() {
    switch(globalState.currentPage) {
        case '/searchPaws/':
        case '/searchPaws/index.html':
        case '/index.html':
            const result = APIController(``);
            // console.log(result)
            (async () => {
            const data = await result;
            displayDogs(data.animals)
            })()
            
            break;
        case `/animal-details.html`:
            displayAnimalDetails()
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

}

document.addEventListener('DOMContentLoaded', init);
