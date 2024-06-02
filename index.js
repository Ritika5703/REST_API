document.getElementById("fetch-posts").addEventListener("click", fetchPosts);

async function fetchUsers() {
  const response = await fetch("https://jsonplaceholder.typicode.com/users");
  return await response.json();
}

async function fetchPosts() {
  const postsContainer = document.getElementById("posts-container");
  const users = await fetchUsers();
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  const posts = await response.json();
  displayPosts(posts, users);
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
      `;
    postElement.addEventListener("click", () => fetchPostDetails(post.id));
    postsContainer.appendChild(postElement);
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
}

const span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  const modal = document.getElementById("postModal");
  modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  const modal = document.getElementById("postModal");
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
