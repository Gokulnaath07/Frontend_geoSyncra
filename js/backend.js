/* Gokulnaath07 Backend Code
   Last Updated 10/31/2024
*/

/* 
   script.js (JavaScript for GeoSyncra website)
   ceg411
   Anna Crafton
   Last updated 10/24/2024
*/

// Function to search for locations
function searchLocation() {
    const location = document.getElementById('searchBar').value.toLowerCase();
    if (location) {
        // Redirect to viewImage.html with the location as a query parameter
        window.location.href = `viewImage.html?location=${encodeURIComponent(location)}`;
    } else {
        alert("Please enter a location to search.");
    }
}

// Function to get query parameters from the URL
function getQueryParams(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}
let currentPage = 0;
const pageSize = 3; // Number of items per page

function fetchImageDetails() {
    const location = getQueryParams('location');
    if (location) {
        const apiUrl = `https://insightful-generosity-production.up.railway.app/location/${location}?page=${currentPage}&size=${pageSize}`;
        console.log(`Fetching from URL: ${apiUrl}`);

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Images not found');
                }
                return response.json();
            })
            .then(data => {
                console.log(`Fetched data for page ${currentPage}:`, data);

                const article = document.querySelector('article');
                const images = data.content;
                const totalPages = data.totalPages;

                // Clear existing images without clearing entire article
                const imageElements = article.querySelectorAll('.image-details');
                imageElements.forEach(imageElement => imageElement.remove());

                // If there are images, render them
                if (images && images.length > 0) {
                    images.forEach(image => renderImageDetails(image, article));
                } else {
                    console.log("No images found for this page.");
                }

                // Update pagination controls
                updatePageControls(totalPages);
            })
            .catch(error => {
                console.error('Error:', error);
                alert(error.message);
            });
    } else {
        console.log('No location provided!');
    }
}

function renderImageDetails(image, article) {
    const imageElement = document.createElement('div');
    imageElement.className = 'image-details';

    imageElement.innerHTML = `
        <div class="image-info">
            <h4><strong>${image.name}</strong></h4>
            <p><strong>Place:</strong> ${image.location}</p>
            <p>${image.description}</p>
        </div>
        <button class="view-image-button" data-id="${image.id}">View Images</button>
        <div class="image-gallery" style="display: none;"></div>
        <button class="close-image-button" style="display: none;">Close Gallery</button>
        <button class="navigate-button" style="display: none;">Navigate</button>
        <div class="action-buttons" style="display:none;">
            <button class="like-button" data-id="${image.id}">Like</button>
            <button class="comment-button" data-id="${image.id}">Comment</button>
            <button class="add-image-button" data-id="${image.id}">Add Image</button>
        </div>
    `;

    article.appendChild(imageElement);

    const viewImageButton = imageElement.querySelector('.view-image-button');
    const imageGallery = imageElement.querySelector('.image-gallery');
    const closeGalleryButton = imageElement.querySelector('.close-image-button');
    const navigateButton = imageElement.querySelector('.navigate-button');
    const addImageButton = imageElement.querySelector('.add-image-button');
    const likeButton = imageElement.querySelector('.like-button');
    const commentButton = imageElement.querySelector('.comment-button');
    const actionButtons = imageElement.querySelector('.action-buttons');

    if (viewImageButton) {
        viewImageButton.addEventListener('click', () => {
            fetchImagesByParentId(image.id, imageGallery, closeGalleryButton);
            navigateButton.style.display = 'inline-block';
            actionButtons.style.display = 'inline-block'; // Show the action buttons
        });
    }

    if (closeGalleryButton) {
        closeGalleryButton.addEventListener('click', () => {
            imageGallery.style.display = 'none';
            closeGalleryButton.style.display = 'none';
            navigateButton.style.display = 'none';
            actionButtons.style.display = 'none'; // Hide the action buttons
        });
    }

    if (addImageButton) {
        addImageButton.addEventListener('click', () => {
            // Check if the form already exists
            const existingForm = document.getElementById('uploadForm');
            if (existingForm) {
                // If the form exists, remove it (close the form)
                existingForm.remove();
            } else {
                // If the form does not exist, create a new one
                const uploadForm = document.createElement('form');
                uploadForm.id = 'uploadForm';
                uploadForm.method = 'POST';
                uploadForm.enctype = 'multipart/form-data';
                uploadForm.style.marginTop = '20px';
                uploadForm.innerHTML = `
                    <input type="hidden" name="parentId" value="${image.id}">
                    <div>
                        <label for="imageName">Image Name:</label>
                        <input type="text" id="imageName" name="imageName" required>
                    </div>
                    <div>
                        <label for="imageFile">Select Image File:</label>
                        <input type="file" id="imageFile" name="imageFile" accept="image/*" required>
                    </div>
                    <button type="submit" class="upload-btn">Upload Image</button>
                `;
    
                // Add an event listener to handle form submission
                uploadForm.addEventListener('submit', (event) => {
                    event.preventDefault(); // Prevent default form submission
                    const formData = new FormData(uploadForm);
    
                    // Submit the form data to the backend API with the specific imageId in the URL
                    fetch(`https://insightful-generosity-production.up.railway.app/${image.id}/addChildImage`, {
                        method: 'POST',
                        body: formData,  // This includes the name and image file
                    })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Failed to upload image');
                            }
                            return response.json();
                        })
                        .then(result => {
                            alert('Image uploaded successfully');
                            console.log('Upload result:', result);
                            document.getElementById('uploadForm').reset();
                        })
                        .catch(error => {
                            console.error('Error during upload:', error);
                            alert(error.message);
                        });
                });
    
                // Append the form to the current `imageElement`
                imageElement.appendChild(uploadForm);
            }
        });
    }

    if (navigateButton) {
        navigateButton.addEventListener('click', () => {
            fetchGeoLocation(image.id); // Navigate using the fetched location
        });
    }
    if (commentButton) {
        commentButton.addEventListener('click', () => {
            // Redirect to the comment.html page with the imageId as a query parameter
            const imageId = commentButton.dataset.id;
            window.location.href = `comment.html?imageId=${imageId}`;
        });
    }
    if (likeButton) {

        likeButton.addEventListener('click', () => {
            // Get the current like count from the button's data attribute
            let currentLikeCount = parseInt(likeButton.dataset.likeCount) || 0;
            
            // Increment the like count
            currentLikeCount += 1;
            
            // Update the data attribute with the new like count
            likeButton.dataset.likeCount = currentLikeCount;
    
            // Send the updated like count to the backend
            fetch(`https://insightful-generosity-production.up.railway.app/${image.id}/like?like=${currentLikeCount}`, {
                method: 'PUT',
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to add like');
                }
                return response.json();
            })
            .then(result => {
                console.log('Like added successfully:', result);
                
                // Optionally, update the button text to show the updated like count
                likeButton.textContent = `${currentLikeCount}`;
            })
            .catch(error => {
                console.error('Error adding like:', error);
                alert(error.message);
            });
        });
        
    }
}

function updatePageControls(totalPages) {
    const pageControls = document.getElementById('pageControls');
    pageControls.innerHTML = `
        <button onclick="changePage(-1)" ${currentPage === 0 ? 'disabled' : ''}>Previous</button>
        <span>Page ${currentPage + 1} of ${totalPages}</span>
        <button onclick="changePage(1)" ${currentPage === totalPages - 1 ? 'disabled' : ''}>Next</button>
    `;
    console.log(`Page controls updated: Page ${currentPage + 1} of ${totalPages}`);
}

// Function to change the page
function changePage(direction) {
    console.log(`Changing page by ${direction}. Current page: ${currentPage}`); // Log page change
    currentPage += direction; // Update currentPage
    fetchImageDetails(); // Fetch details for the new page
}

window.onload = function() {
    console.log('Fetching image details...');
    fetchImageDetails(); // Fetch the initial page's images
};

function fetchImagesByParentId(parentId, imageGallery, closeGalleryButton) {
    fetch(`https://insightful-generosity-production.up.railway.app/${parentId}/child`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch image data');
            }
            return response.json(); // Expecting a list of images
        })
        .then(images => {
            imageGallery.innerHTML = ''; // Clear previous images

            images.forEach(imageData => {
                const img = document.createElement('img');
                img.src = `data:image/${imageData.imageType};base64,${imageData.imageData}`;
                img.alt = imageData.imageName;
                img.width = 200; // Set desired width
                img.style.display = 'inline-block'; // Display each image inline
                imageGallery.appendChild(img); // Add to the gallery
            });

            imageGallery.style.display = 'block'; // Show the gallery
            closeGalleryButton.style.display = 'inline-block'; // Show the close button
        })
        .catch(error => {
            console.error('Error loading images:', error);
            alert(error.message);
        });
}


// Function to fetch geolocation by image ID and navigate to Google Maps
function fetchGeoLocation(imageId) {
    fetch(`https://insightful-generosity-production.up.railway.app/images/${imageId}/geoLocation`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Geolocation not found');
            }
            return response.text(); // Assuming the server returns the geolocation as plain text
        })
        .then(geoLocation => {
            const [latitude, longitude] = geoLocation.split(','); // Split lat,long
            const mapUrl = `http://www.google.com/maps?q=${latitude},${longitude}`; 
            window.open(mapUrl, '_blank'); // Open in a new tab
        })
        .catch(error => {
            console.error('Error loading geolocation:', error);
            alert(error.message);
        });
}
