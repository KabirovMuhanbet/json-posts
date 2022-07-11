const wrapper = document.querySelector(".wrapper");
const box = document.querySelector(".posts");
const pagination = document.querySelector(".pagination");
const inputSearch = document.querySelector(".form__search");
const btn = document.querySelector(".form__btn");
const listItems = document.querySelectorAll(".pagination li");

const baseUrl = "https://jsonplaceholder.typicode.com/posts/";
let paginationItems = [];
let posts = [];
let copyPosts = [];
let itemsOnPage = 10;
let countOfPages;

btn.addEventListener("click", (e) => {
  e.preventDefault();
  const inputValue = inputSearch.value;
  const filteredPosts = posts.filter((post) => {
    return (
      post.title.toLowerCase().includes(inputValue.toLowerCase()) ||
      post.body.toLowerCase().includes(inputValue.toLowerCase())
    );
  });
  copyPosts = filteredPosts;
  postSlices(1);
  paginationLength(Math.ceil(copyPosts.length / itemsOnPage));
  copyPosts = posts;
});

const getPosts = async () => {
  try {
    const res = await fetch(baseUrl);
    posts = await res.json();
    copyPosts = posts;
    paginationLength(Math.ceil(posts.length / itemsOnPage));
    postSlices(1);
    listItems[0].classList.add("active");
  } catch (err) {
    console.log(err);
  }
};

getPosts();

const postSlices = (pageNum) => {
  let start = (pageNum - 1) * itemsOnPage;
  let end = start + itemsOnPage;
  let postSlice = copyPosts.slice(start, end);
  displayPosts(postSlice);
};

const getPostById = async (id) => {
  try {
    const res = await fetch(baseUrl + id);
    uniqPost = await res.json();
    showPostDetails(uniqPost)
  } catch (err) {
    console.log(err);
  }
};

const showPostDetails = (post) => {
  wrapper.innerHTML = "";
  wrapper.innerHTML = `<div class="post__detail">
  <h1 class="post__detail-title">${post.title}</h1>
  <p class="post__detail-text">${post.body}</p>
  <button class="post__detail-btn" onclick="location.reload()">All posts</button>
</div>`;
};

const displayPosts = (posts) => {
  if (posts) {
    box.innerHTML = "";
    posts.map((post) => {
      box.innerHTML += `<div class="posts__item" onclick="getPostById(${post.id})">
          <h4 class="posts__item-title text">${post.title}</h4>
          <p class="posts__item-text text">${post.body}</p>
      </div>`;
    });
  }
};

const paginationLength = (countOfPages) => {
  pagination.innerHTML = "";
  paginationItems.length = 0;
  for (let i = 1; i <= countOfPages; i++) {
    let paginationItem = document.createElement("li");
    paginationItem.innerHTML = i;
    pagination.appendChild(paginationItem);
    paginationItems.push(paginationItem);
  }
  
  paginationItems[0].classList.add("active");

  for (let item of paginationItems) {
    item.addEventListener("click", function () {
      let active = document.querySelector(".pagination li.active");
      if (active) {
        active.classList.remove("active");
      }
      active = this;
      this.classList.add("active");
      box.innerHTML = "";
      let pageNum = this.innerHTML;
      postSlices(pageNum);
    });
  }
};
