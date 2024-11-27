const imageId = getQueryParams('imageId'); // Get imageId from query parameter

// Function to fetch and display comments for the specific image
function fetchComments(imageId) {
    fetch(`http://localhost:5050/images/${imageId}/comment`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch comments');
            }
            return response.json(); // Assumes the API returns an array of comments
        })
        .then(comments => {
            const commentsList = document.getElementById('commentsList');
            commentsList.innerHTML = ''; // Clear any existing comments

            if (comments.length === 0) {
                const noComments = document.createElement('li');
                noComments.textContent = 'No comments yet. Be the first to comment!';
                commentsList.appendChild(noComments);
            } else {
                comments.forEach(comment => {
                    const listItem = document.createElement('li');
                    listItem.textContent = comment.comment; // Adjust according to API response structure
                    commentsList.appendChild(listItem);
                });
            }
        })
        .catch(error => {
            console.error('Error loading comments:', error);
            const errorItem = document.createElement('li');
            errorItem.textContent = 'Failed to load comments.';
            commentsList.appendChild(errorItem);
        });
}

// Function to upload a new comment
function uploadComment(event) {
    event.preventDefault(); // Prevent the form from submitting normally

    const commentText = document.getElementById('commentText').value;
    if (!commentText) {
        alert('Please enter a comment.');
        return;
    }

    // Send POST request to backend to add the comment
    fetch(`http://localhost:5050/${imageId}/comments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded', // Adjust content type as needed
        },
        body: new URLSearchParams({
            'comments': commentText,
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to upload comment');
        }
        return response.json(); // Assuming the response contains the saved comment
    })
    .then(data => {
        // Optionally, add the new comment directly to the list on the page
        const newComment = document.createElement('li');
        newComment.textContent = data.comment; // Adjust according to your API response
        document.getElementById('commentsList').appendChild(newComment);

        // Clear the input field after submission
        document.getElementById('commentText').value = '';
    })
    .catch(error => {
        console.error('Error uploading comment:', error);
        alert('Failed to post comment. Please try again later.');
    });
}

// Initialize comments when the page loads
window.onload = function() {
    if (imageId) {
        fetchComments(imageId);
    } else {
        alert("No image ID provided!");
    }

    // Set up the form submission handler
    document.getElementById('commentForm').addEventListener('submit', uploadComment);
};
