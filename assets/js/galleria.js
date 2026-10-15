const photos = [
  {
    src: "assets/img/galleria/foto-01v.png",
    title: "Pagina inesistente, per esercitarsi",
    author: "Francesco"
  },
];

let currentIndex = 0;

const albumImg = document.getElementById("album-img");
const albumTitle = document.getElementById("album-title");
const albumAuthor = document.getElementById("album-author");
const albumCounter = document.getElementById("album-counter");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxChiudi = document.getElementById("lightbox-chiudi");

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

albumImg.addEventListener("click", () => {
  lightboxImg.src = albumImg.src;
  lightboxImg.alt = albumImg.alt;


  lightbox.classList.add("aperta");
  document.body.classList.add("lightbox-aperta");
});


lightboxChiudi.addEventListener("click", chiudiLightbox);


lightbox.addEventListener("click", (evento) => {
  if (evento.target === lightbox) {
    chiudiLightbox();
  }
});


document.addEventListener("keydown", (evento) => {
  if (evento.key === "Escape" && lightbox.classList.contains("aperta")) {
    chiudiLightbox();
  }
});


function chiudiLightbox() {
  lightbox.classList.remove("aperta");
  document.body.classList.remove("lightbox-aperta");
}
