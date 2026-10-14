const photos = [
  {
    src: "assets/img/galleria/foto-01.jpg",
    title: "Titolo della foto",
    author: "Autore"
  },
  {
    src: "assets/img/galleria/foto-02.jpg",
    title: "Tramonto al lago",
    author: "Mario Rossi"
  },
  {
    src: "assets/img/galleria/foto-03.jpg",
    title: "Titolo della foto",
    author: "Nome dell’autore"
  }
];

let currentIndex = 0;

const albumImg = document.getElementById("album-img");
const albumTitle = document.getElementById("album-title");
const albumAuthor = document.getElementById("album-author");
const albumCounter = document.getElementById("album-counter");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");

function showPhoto(index) {
  const photo = photos[index];

  albumImg.src = photo.src;
  albumImg.alt = photo.title;
  albumTitle.textContent = photo.title;
  albumAuthor.textContent = "di " + photo.author;
  albumCounter.textContent = (index + 1) + " / " + photos.length;
}

prevBtn.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + photos.length) % photos.length;
  showPhoto(currentIndex);
});

nextBtn.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % photos.length;
  showPhoto(currentIndex);
});

showPhoto(currentIndex);