const clientID = `95ofWRXE9TNMajndAtajSIGr61moKg8UHva9C8jswPwnIsKhhV`;
const clientSecret = `iEGxRKohdA4MToAQZypx4eTJZx66ramkA8pcm7aZ`
const grantType = 'client_credentials';
const baseUrl = "https://api.petfinder.com/v2/animals";

const globalState = {
    currentPage: window.location.pathname,
    pagination: {
    page: 1,
    totalPages: 1,
    totalResults: 0,
    },
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
        const result = await fetch(`${url}&page=${currentPageToStorage()}`, {
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
                displayDogs(data)
                })();
    } catch(error) {
        console.error('Error executing API calls.', error)
    }
}





// display 20 dogs
async function displayDogs(data) {
    // clear prev results
    document.querySelector('#adoptable-dogs').innerHTML = "";
    // document.querySelector('#heading').innerHTML = "";
    document.querySelector('#pagination').innerHTML = "";

    console.log(data.animals);
    const animals = data.animals;
    const dynamicHeader = document.querySelector('.dynamic-header');
    dynamicHeader.textContent = `${data.pagination.count_per_page} of ${data.pagination.total_count} animals`;

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

    displayPagination(data.pagination);
}

function roundMiles(dogdistance) {
    return Math.round(dogdistance);
}

function displayPagination(pagination) {
    console.log(pagination)
    const div = document.createElement('div');
    div.classList.add('pagination');
    div.innerHTML = `
            <p class="btn btn-primary" id="prev">Prev</p>
            <p class="btn btn-primary" id="next">Next</p>
            <div class="page-counter">Page ${pagination.current_page} of ${pagination.total_pages}</div>`

    document.querySelector('#pagination').appendChild(div);

    // disable prev button if on first page
    if (globalState.pagination.page === 1) {
        document.querySelector('#prev').disabled = true;
    }

    // disable next button if on last page
    if (globalState.pagination.page === globalState.pagination.totalPages) {
        document.querySelector('#next').disabled = true;
    }

    // let currentPage = currentPageToStorage();

    // next page
    document.querySelector('#next').addEventListener('click', async () => {
        globalState.pagination.page++;
        // currentPageToStorage();
        localStorage.setItem('currentPage', JSON.stringify(currentPageToStorage() + 1));
        // console.log(globalState.pagination.page)
        currentPageToStorage();
        const storedFormData = loadFormData();
        // console.log(currentPageToStorage())
        const modifiedData = checkEmpty(storedFormData)
        await executeApiCalls(modifiedData); 
    })

    document.querySelector('#prev').addEventListener('click', async () => {
        globalState.pagination.page--;
        // console.log(globalState.pagination.page)
        const storedFormData = loadFormData();
        // console.log(storedFormData)
        const modifiedData = checkEmpty(storedFormData)
        await executeApiCalls(modifiedData); 
    })
}

// Event listener for next page button
// document.getElementById('nextPageButton').addEventListener('click', function () {
//     currentPage++;
//     fetchData(currentPage);
// });

// // Event listener for previous page button
// document.getElementById('prevPageButton').addEventListener('click', function () {
//     if (currentPage > 1) {
//         currentPage--;
//         fetchData(currentPage);
//     }
// });

// // You can also provide input for users to jump to a specific page
// document.getElementById('jumpToPageButton').addEventListener('click', function () {
//     const pageInput = document.getElementById('pageInput').value;
//     if (pageInput && !isNaN(pageInput) && pageInput > 0) {
//         currentPage = parseInt(pageInput);
//         fetchData(currentPage);
//     }
// });




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
        addToFavoritesButton.addEventListener('click', () => saveForLater(dog.animal));
        
}

function getAnimalsFromStorage() {
    let savedAnimals;

    if (localStorage.getItem('savedAnimals') === null) {
        // set it to an empty array
        savedAnimals = [];
    } else {
        // then we want to add them to the array (have to parse to get array)
        savedAnimals = JSON.parse(localStorage.getItem('savedAnimals'));
    }
    return savedAnimals;
}



function currentPageToStorage() {
    let currentPage;

    if (localStorage.getItem('currentPage') === null) {
        // set it to an empty array
        currentPage = 1;
    } else {
        // then we want to add them to the array (have to parse to get array)
        currentPage = JSON.parse(localStorage.getItem('currentPage'));
    }
    console.log(currentPage)
    return currentPage;
}

function saveForLater(animal) {
    let savedAnimals = getAnimalsFromStorage();
    console.log(savedAnimals);

    const isAnimalAlreadySaved = savedAnimals.some(savedAnimal => savedAnimal.id === animal.id)

        if (!isAnimalAlreadySaved) {
            savedAnimals.unshift(animal);
            localStorage.setItem('savedAnimals', JSON.stringify(savedAnimals));
        }

        displaySavedAnimals(savedAnimals)

}

function removeItem(e) {
    const animal = e.target.parentElement.parentElement;
    // console.log('wha')
    if (e.target.classList.contains('remove-animal')) {
        if (confirm('Are you sure you want to remove this pet?')) {
            animal.remove();
            removeItemFromStorage(animal);
        }
    }
}


function removeItemFromStorage(animal) {
    let savedAnimals = getAnimalsFromStorage();
    const id = animal.querySelector('.backToDetails').getAttribute('id');

        // filter out item to be remover
        savedAnimals = savedAnimals.filter((array) => {
            console.log(array.id);
            return array.id != id
        });

         console.log(savedAnimals);

        // reset to localStorage
        localStorage.setItem('savedAnimals', JSON.stringify(savedAnimals));
}



function clearAllAnimals() {
    const clearAnimalsBtn = document.querySelector('.clear-all');
    let animalsContainer = document.querySelector('.animal-saved');

    clearAnimalsBtn.addEventListener('click', () => {
        while(animalsContainer.firstChild) {
        animalsContainer.removeChild(animalsContainer.firstChild);
    }

    localStorage.removeItem('savedAnimals');

    })
}

clearFormInputs()

function clearFormInputs() {
switch(globalState.currentPage) {
        case '/searchPaws/':
        case '/searchPaws/index.html':
        case '/index.html':
        const clearSearchBtn = document.querySelector('.clear-search');
        const formElements = document.querySelectorAll('input, select');

        clearSearchBtn.addEventListener('click', async () => {
            localStorage.removeItem('formData');
            localStorage.removeItem('currentPage');

            formElements.forEach(element => {
                // console.log(element.tagName)
                if (element.type === 'text' || element.type === 'number') {
                    element.value = '';
                } else if (element.tagName) {
                    element.value = 'none';
                }
            })
            const storedFormData = loadFormData();
            console.log(storedFormData)
            const modifiedData = checkEmpty(storedFormData)
            await executeApiCalls(modifiedData); 

    })
   

    break;
}
}


// function clearAnimalStorage(item) {
        
// }

// display saved animals
function displaySavedAnimals(savedAnimals) {
    savedAnimals.forEach(savedAnimal => {
        const savedAnimalElement = document.createElement('div');
        savedAnimalElement.innerHTML = `
        <div class="details-card saved">
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
            <div class="details-description">
                <i class="remove-animal fas fa-times"></i>
                <div class="details-description-flex">
                    <h2 class="name">${savedAnimal.name}</h2>
                    <p class="breed">${savedAnimal.breeds.primary}</p>
                </div>
                <div class="details-description-flex">
                    <p>${savedAnimal.age}</p>
                    <p>${savedAnimal.gender}</p>
                    <p>${savedAnimal.size}</p>
                </div>
                <div class="details-description-flex">
                    <p>Address: ${savedAnimal.contact.address.address1}</p>
                    <p>City: ${savedAnimal.contact.address.city}</p>
                    <div class="details-description-flex">
                        <p>State: ${savedAnimal.contact.address.state}</p>
                        <p>Country: ${savedAnimal.contact.address.country}</p>
                    </div>
                </div>
                <a href="animal-details.html?id=${savedAnimal.id}" id=${savedAnimal.id} class="backToDetails btn">See Details</a>
        </div>
        `;

    
    document.querySelector('#animal-saved').appendChild(savedAnimalElement);

    const backToDetailsButton = document.querySelector('.backToDetails');
    backToDetailsButton.addEventListener('click', () => displayAnimalDetails());

    const removeAnimalButtons = document.querySelectorAll('.remove-animal');
    removeAnimalButtons.forEach((button) => {
        // console.log('clicked')
        button.addEventListener('click', removeItem);
    })
    
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
                // console.log('ugh')
                
                
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
            clearAllAnimals()
            // const result = _makeCall(``);
            //     (async () => {
            //     const data = await result;
            //     saveForLater(data.animals)
            //     })();
            
            break;
    }

}
document.addEventListener('DOMContentLoaded', init);



