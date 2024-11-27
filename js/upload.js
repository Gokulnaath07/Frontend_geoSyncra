

// Upload form event listener
document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Create a new FormData object
    const formData = new FormData(this);

    // Display status message
    const uploadStatus = document.getElementById('uploadStatus');
    uploadStatus.textContent = 'Uploading...';

    // Use fetch API to send the form data to your server
    fetch('http://localhost:5050/uploadImages', { // Use the correct endpoint
        method: 'POST',
        body: formData,
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Upload failed');
            }
            return response.json(); // Assuming your server returns JSON
        })
        .then(data => {

            uploadStatus.textContent = 'Upload successful'; // Display success message
            // Clear the form fields after successful upload
            document.getElementById('uploadForm').reset(); 
        })
        .catch(error => {
            uploadStatus.textContent = 'Error: ' + error.message; // Display error message
        });
});





// Function to get the user's current location
function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                document.getElementById('geoLocation').value = `${latitude},${longitude}`; // Set the input field value
            },
            error => {
                console.error('Error getting location:', error);
                alert('Unable to retrieve your location. Please enable location services.');
            }
        );
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}


