document.getElementById("fetch-posts").addEventListener("click", fetchPosts);

async function fetchUsers() {
  const response = await fetch("https://jsonplaceholder.typicode.com/users");
  return await response.json();
}

async function fetchPosts() {
  const postsContainer = document.getElementById("posts-container");
  const loadingSpinner = document.getElementById("loading");
  loadingSpinner.style.display = "block"; // Show loading spinner

  const users = await fetchUsers();
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  const posts = await response.json();
  displayPosts(posts, users);

  loadingSpinner.style.display = "none"; // Hide loading spinner after posts are fetched
}

function displayPosts(posts, users) {
  const postsContainer = document.getElementById("posts-container");
  postsContainer.innerHTML = "";

  posts.forEach((post) => {
    const user = users.find((user) => user.id === post.userId);
    const postElement = document.createElement("div");
    postElement.classList.add("post");
    postElement.innerHTML = `
      <h2>${post.title}</h2>
      <p>${post.body}</p>
      <div class="user-info">
        <p><strong>${user.name}</strong></p>
        <p>${user.email}</p>
      </div>

      <!-- Like and Dislike buttons and counts -->
      <div class="like-dislike">
        <button class="like-btn" title="Like">👍</button>
        <button class="dislike-btn" title="Dislike">👎</button>
      </div>

      <!-- Like and Dislike Counts -->
      <div class="like-count">
        <span class="like-count-label">Likes:</span> <span class="like-count-value">0</span>
      </div>
      <div class="dislike-count">
        <span class="dislike-count-label">Dislikes:</span> <span class="dislike-count-value">0</span>
      </div>
    `;

    postElement.addEventListener("click", () => fetchPostDetails(post.id));
    postsContainer.appendChild(postElement);

    // Select like and dislike buttons for updating their counts dynamically
    const likeButton = postElement.querySelector(".like-btn");
    const dislikeButton = postElement.querySelector(".dislike-btn");
    const likeCountSpan = postElement.querySelector(".like-count-value");
    const dislikeCountSpan = postElement.querySelector(".dislike-count-value");

    let likeCount = 0;
    let dislikeCount = 0;

    // Event listener for Like button
    likeButton.addEventListener("click", () => {
      likeCount++;
      likeCountSpan.textContent = likeCount; // Update like count
      likeButton.disabled = true; // Disable like button after clicking
      dislikeButton.disabled = true; // Optionally disable the dislike button
    });

    // Event listener for Dislike button
    dislikeButton.addEventListener("click", () => {
      dislikeCount++;
      dislikeCountSpan.textContent = dislikeCount; // Update dislike count
      dislikeButton.disabled = true; // Disable dislike button after clicking
      likeButton.disabled = true; // Optionally disable the like button
    });
  });
}

async function fetchPostDetails(postId) {
  const postDetailsElement = document.getElementById("post-details");
  const postResponse = await fetch(
    "https://jsonplaceholder.typicode.com/posts/" + postId
  );
  const post = await postResponse.json();
  const commentsResponse = await fetch(
    "https://jsonplaceholder.typicode.com/comments?postId=" + postId
  );
  const comments = await commentsResponse.json();
  displayPostDetails(post, comments);
}

function displayPostDetails(post, comments) {
  const postDetailsElement = document.getElementById("postDetails");
  postDetailsElement.innerHTML = `
        <h2>${post.title}</h2>
        <p>${post.body}</p>
        <h3>Comments</h3>
        ${comments
          .map(
            (comment) => `
          <div class="comment">
            <p><strong>${comment.name}</strong></p>
            <p>${comment.body}</p>
            <p>${comment.email}</p>
          </div>
        `
          )
          .join("")}
      `;

  const modal = document.getElementById("postModal");
  modal.style.display = "block";
  modal.style.opacity = 1; // Fade-in effect
}

const span = document.getElementsByClassName("close")[0];

// Close modal when user clicks on <span> (x)
span.onclick = function () {
  const modal = document.getElementById("postModal");
  modal.style.display = "none";
};

// Close modal when user clicks anywhere outside the modal
window.onclick = function (event) {
  const modal = document.getElementById("postModal");
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
