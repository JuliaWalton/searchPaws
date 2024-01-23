const clientID = `95ofWRXE9TNMajndAtajSIGr61moKg8UHva9C8jswPwnIsKhhV`;
const clientSecret = `iEGxRKohdA4MToAQZypx4eTJZx66ramkA8pcm7aZ`
const grantType = 'client_credentials';
const baseUrl = "https://api.petfinder.com/v2/animals";

const globalState = {
    currentPage: window.location.pathname,
};
// console.log(globalState);

async function _getToken() {
    try {
        const response = await fetch(`https://api.petfinder.com/v2/oauth2/token`, {
            method: 'POST',
        headers: {'Accept': 'application/json, text/plain, */*',
                'Content-Type':'application/x-www-form-urlencoded'}, 
        body: 
            `grant_type=${grantType}&client_id=${clientID}&client_secret=${clientSecret}`
        });

    if (!response.ok) {
        throw new Error(`HTTP error!!!!!!!! Status: ${response.status}`)
    }

    const responseData = await response.json();
    return responseData.access_token;

    } catch (error) {
    console.error('there was an error obtaining access token', error);
        throw error;
    }
}

async function _makeCall(endpoint) {
    const url = `${baseUrl}${endpoint}`;

    try {
        const accessToken = await _getToken();
        // console.log(accessToken)
        const result = await fetch(`${url}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization' : ' Bearer ' + `${accessToken}`}
    })
    const data = await result.json();
    console.log(data)
    return data;
    } catch (error) {
        console.error('Error: unable to make call', error)
    }
}


function checkEmpty(formData) {
        for (const [key, value] of Object.entries(formData)) {
        if (value === 'none' || value === '' || value === 'undefined') {
            delete formData[key];
            console.log(formData)
        } 
    }
    return formData;
    }
        


// Execute the API calls based on form data
const petForm = document.getElementById('pet-form');

petForm.addEventListener('submit', async (e) => {
    e.preventDefault(); 
    
    const animal = document.querySelector('#animal').value;
    const zip = document.querySelector('#zip').value;
    const gender = document.querySelector('#gender').value;
    const size = document.querySelector('#size').value;
    const age = document.querySelector('#age').value;
    const distance = document.querySelector('#distance').value;

    const formData = {
        type: `${animal}`,
        location: `${zip}`,
        gender: `${gender}`,
        size: `${size}`,
        age: `${age}`,
        distance: `${distance}`,
    }
    
    //     for (const [key, value] of Object.entries(formData)) {
    //     if (value === 'none' || value === '' || value === 'undefined') {
    //         delete formData[key];
    //         console.log(formData)
    //     } 
    // }
    const modData = checkEmpty(formData);

    // console.log(saveFormData(formData))
    saveFormData(modData);

    await executeApiCalls(modData);
})
    

function saveFormData(formData) {
    localStorage.setItem('formData', JSON.stringify(formData));
}

function loadFormData() {
    const savedFormData = localStorage.getItem('formData');
    return savedFormData 
    ? JSON.parse(savedFormData) 
    : [];
}

// function addAnimal(animal) {
//     const animalID =  window.location.search.split('=')[1];
//     console.log(animal);


// }


async function executeApiCalls(formData) {
    try {
        console.log(formData)
        const queryParams = new URLSearchParams(formData);
        
        console.log(queryParams.toString());

        const result = await _makeCall(`?` + queryParams.toString());
            (async () => {
                const data = await result;
                displayDogs(data.animals)
                })();
    } catch(error) {
        console.error('Error executing API calls.', error)
    }
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
                        src="images/no-image.jpg"
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

// display animal details
async function displayAnimalDetails() {
    console.log(window.location.search);
    const animalID =  window.location.search.split('=')[1];
    const dog = await _makeCall(`/${animalID}`);

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
                        src="images/no-image.jpg"
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
                <p>Spayed/Neutered: ${dog.animal.attributes.spayed_neutered}</p>
                <p>Special Needs: ${dog.animal.attributes.special_needs}</p>
                </div>
                <h4>Description</h4>
                <p>${dog.animal.description}</p>
                <p class="tags-container">Characteristics: ${dog.animal.tags}</p>
                <div class="details-description-grid">
                <a href="${dog.animal.url}" target="_blank" class="btn">Visit Homepage</a>
                <a href="saved.html" id="addToFavorites" class="btn saved">Add to <i class="fas fa-heart"></i></a>
                </div>
            </div>
        </div>`;
        document.querySelector('#animal-details').appendChild(div);

        const addToFavoritesButton = document.getElementById('addToFavorites');
        addToFavoritesButton.addEventListener('click', () => 
        
        saveForLater(dog.animal));
}

function saveForLater(animal) {
    console.log(animal)

    const savedAnimals = JSON.parse(localStorage.getItem('savedAnimals')) || [];

    console.log(savedAnimals)

    const isAnimalAlreadySaved = savedAnimals.some(savedAnimal => savedAnimal.id === animal.id)

        if (!isAnimalAlreadySaved) {
            savedAnimals.push(animal);
            localStorage.setItem('savedAnimals', JSON.stringify(savedAnimals));
        }

        displaySavedAnimals(savedAnimals)

}


// display saved animals
function displaySavedAnimals(savedAnimals) {
    savedAnimals.forEach(savedAnimal => {
        const savedAnimalElement = document.createElement('div');
        savedAnimalElement.innerHTML = `
        <div class="details-card">
            <div class="details-img">
                ${
                    savedAnimal.photos.length >= 1
                    ? `<img
                        src="${savedAnimal.photos[0].full}"
                        class="card-img-top"
                        alt="image of ${savedAnimal.name}"
                        />` 
                    : `<img
                        src="images/no-image.jpg"
                        class="card-img-top"
                        alt="there is no image for ${savedAnimal.name}"
                        />` 
                }
            </div>
        <p>${savedAnimal.name}</p>
        `;
    
    document.querySelector('#animal-saved').appendChild(savedAnimalElement);
})
}


// Below is a router, so wherever we want to run a function in response to a certain page, we'll put it inside that corresponding case
console.log(globalState.currentPage);

const storedFormData = loadFormData();

// Populate form fields with stored data
async function init() {
    switch(globalState.currentPage) {
        case '/searchPaws/':
        case '/searchPaws/index.html':
        case '/index.html':
            const modifiedData = checkEmpty(storedFormData)
            console.log(modifiedData)
            if(Object.keys(modifiedData).length === 0) {
                console.log('yay')
                // const result = _makeCall(``);
                // (async () => {
                // const data = await result;
                // displayDogs(data.animals)
                // })();
                await executeApiCalls(modifiedData); 
            } else {
                document.querySelector('#animal').value = storedFormData.type;
                document.querySelector('#zip').value = storedFormData.location;
                document.querySelector('#gender').value = storedFormData.gender;
                document.querySelector('#size').value = storedFormData.size;
                document.querySelector('#age').value = storedFormData.age;
                document.querySelector('#distance').value = storedFormData.distance;

                const modifiedData = checkEmpty(storedFormData)
                await executeApiCalls(modifiedData); 
                console.log('ugh')
            }
            
            break;
        case `/animal-details.html`:
        case '/searchPaws/amenities.html':
            displayAnimalDetails()
            break;
        case `/saved.html`:
        case '/searchPaws/saved.html':
            const savedAnimals = JSON.parse(localStorage.getItem('savedAnimals')) || [];
            displaySavedAnimals(savedAnimals);
            // const result = _makeCall(``);
            //     (async () => {
            //     const data = await result;
            //     saveForLater(data.animals)
            //     })();
            
            break;
    }

}
document.addEventListener('DOMContentLoaded', init);



