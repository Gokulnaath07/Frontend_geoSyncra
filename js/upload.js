// Upload.js

document.addEventListener("DOMContentLoaded", () => {
    // DOM elements
    const uploadForm = document.getElementById("uploadForm");
    const getLocationButton = document.getElementById("getLocationButton");
    const geoLocationInput = document.getElementById("geoLocation");
    const uploadStatus = document.getElementById("uploadStatus");

    // Function to get the current location
    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    geoLocationInput.value = `${latitude}, ${longitude}`;
                },
                (error) => {
                    console.error("Error getting location:", error.message);
                    geoLocationInput.value = "Unable to retrieve location";
                }
            );
        } else {
            geoLocationInput.value = "Geolocation not supported by this browser";
        }
    };

    // Event listener for the "Get Location" button
    getLocationButton.addEventListener("click", (e) => {
        e.preventDefault(); // Prevent form submission
        getCurrentLocation();
    });

    // Form submission handler
    uploadForm.addEventListener("submit", (e) => {
        e.preventDefault(); // Prevent page reload on form submission

        // Create a FormData object to hold form data
        const formData = new FormData(uploadForm);

        // Send form data to server
        fetch("https://insightful-generosity-production.up.railway.app/uploadImages", {
            method: "POST",
            body: formData,
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Failed to upload data");
                }
            })
            .then((data) => {
                uploadStatus.textContent = "Upload successful!";
                uploadStatus.style.color = "green";
                console.log("Response from server:", data);
            })
            .catch((error) => {
                console.error("Upload error:", error);
                uploadStatus.textContent = "Upload failed. Please try again.";
                uploadStatus.style.color = "red";
            });
    });
});
