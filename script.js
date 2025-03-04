document.addEventListener("DOMContentLoaded", () => {
  // Configuración de Three.js
  const container = document.getElementById("model-container");
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ alpha: true });

  renderer.setSize(800, 800);
  container.appendChild(renderer.domElement);

  // Luz
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(0, 10, 10);
  scene.add(directionalLight);

  camera.position.z = 10;
  camera.lookAt(0, 0, 0);

  let mixer; // Para manejar las animaciones

  // Cargar el modelo
  const loader = new THREE.GLTFLoader();
  loader.load(
    "./src/loading/oiiaioooooiai_cat.glb", // Asegúrate de usar la ruta correcta
    function (gltf) {
      const model = gltf.scene;

      // Hacer el modelo más grande
      model.scale.set(12, 12, 12);

      // Ajustar posición
      model.position.set(-2, -2, 0); // Mover a la izquierda y abajo

      // Rotar ligeramente para ver la cara
      model.rotation.x = 0;
      model.rotation.y = Math.PI / 6; // Girar 30 grados
      model.rotation.z = 0;

      // Configurar animación
      mixer = new THREE.AnimationMixer(model);
      const clips = gltf.animations;

      // Reproducir todas las animaciones
      clips.forEach((clip) => {
        const action = mixer.clipAction(clip);
        action.play();
      });

      scene.add(model);

      // Reloj para la animación
      const clock = new THREE.Clock();

      function animate() {
        requestAnimationFrame(animate);

        // Actualizar animaciones
        if (mixer) {
          const delta = clock.getDelta();
          mixer.update(delta);
        }

        renderer.render(scene, camera);
      }
      animate();
    },
    function (xhr) {
      // Progreso de carga
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    function (error) {
      console.error("Error cargando el modelo:", error);
    }
  );

  // Ocultar loader después de 2 segundos
  setTimeout(() => {
    const loaderContainer = document.querySelector(".loader-container");
    loaderContainer.style.opacity = "0";
    setTimeout(() => {
      loaderContainer.style.display = "none";
    }, 500);
  }, 4000);

  const carousel = document.getElementById("carouselExampleFade");
  const videos = carousel.querySelectorAll("video");

  const handleVideoEnd = (video) => {
    const carousel = bootstrap.Carousel.getInstance(
      document.getElementById("carouselExampleFade")
    );
    carousel.next();
  };

  videos.forEach((video) => {
    video.addEventListener("ended", () => handleVideoEnd(video));
  });

  carousel.addEventListener("slide.bs.carousel", (event) => {
    const currentVideo =
      event.from !== undefined
        ? carousel.querySelector(".carousel-item.active video")
        : null;
    if (currentVideo) currentVideo.pause();
  });

  carousel.addEventListener("slid.bs.carousel", (event) => {
    const newVideo = carousel.querySelector(".carousel-item.active video");
    if (newVideo) {
      newVideo.currentTime = 0;
      newVideo.play();
    }
  });

  const musicIcon = document.querySelector(".music-icon");
  console.log("Icono de música:", musicIcon);

  const audio = new Audio("/src/audio/index.mp3");
  console.log("Audio creado:", audio);

  // Esperar a que el audio esté listo
  audio.addEventListener("loadeddata", () => {
    console.log("Audio cargado y listo para reproducir");
  });

  if (musicIcon) {
    musicIcon.classList.add("fa-play");

    musicIcon.addEventListener("click", () => {
      if (audio.paused) {
        audio.play();
        musicIcon.classList.remove("fa-play");
        musicIcon.classList.add("fa-pause");
      } else {
        audio.pause();
        musicIcon.classList.remove("fa-pause");
        musicIcon.classList.add("fa-play");
      }
    });

    // Cuando termina el audio, volver al icono de play
    audio.addEventListener("ended", () => {
      musicIcon.classList.remove("fa-pause");
      musicIcon.classList.add("fa-play");
    });
  }

  const fishGalery = document.querySelector(".gallery_fish");
  fishGalery.addEventListener("click", () => createCardsTops(fishGallery));

  const horseGalery = document.querySelector(".gallery_horse");
  horseGalery.addEventListener("click", () => createCardsTops(horseGallery));
});

function createCardsTops(gallery) {
  const containerGallery = document.querySelector(".gallery");
  containerGallery.innerHTML = "";

  // Crear el contenedor del carrusel
  const carouselWrapper = document.createElement("div");
  carouselWrapper.id = "videoCarousel";
  carouselWrapper.className = "carousel slide";
  carouselWrapper.setAttribute("data-bs-ride", "false");

  // Crear el contenedor interno del carrusel
  const carouselInner = document.createElement("div");
  carouselInner.className = "carousel-inner";

  // Crear los slides
  gallery.forEach((animal, index) => {
    const slide = document.createElement("div");
    slide.className = `carousel-item ${index === 0 ? "active" : ""}`;

    const card = document.createElement("div");
    card.className = "card_video";

    const title = document.createElement("h2");
    title.textContent = animal.title;

    const video = document.createElement("video");
    video.src = animal.video;
    video.controls = true;
    video.className = "card-video";

    card.appendChild(title);
    card.appendChild(video);
    slide.appendChild(card);
    carouselInner.appendChild(slide);
  });

  // Crear botones de control
  const prevButton = document.createElement("button");
  prevButton.className = "carousel-control-prev";
  prevButton.type = "button";
  prevButton.setAttribute("data-bs-target", "#videoCarousel");
  prevButton.setAttribute("data-bs-slide", "prev");
  prevButton.innerHTML = `
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Previous</span>
  `;

  const nextButton = document.createElement("button");
  nextButton.className = "carousel-control-next";
  nextButton.type = "button";
  nextButton.setAttribute("data-bs-target", "#videoCarousel");
  nextButton.setAttribute("data-bs-slide", "next");
  nextButton.innerHTML = `
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Next</span>
  `;

  // Ensamblar el carrusel
  carouselWrapper.appendChild(carouselInner);
  carouselWrapper.appendChild(prevButton);
  carouselWrapper.appendChild(nextButton);
  containerGallery.appendChild(carouselWrapper);

  // Inicializar el carrusel
  const carousel = new bootstrap.Carousel(carouselWrapper, {
    interval: false,
    wrap: true,
  });

  // Pausar videos cuando cambie el slide
  carouselWrapper.addEventListener("slide.bs.carousel", (event) => {
    const videos = carouselWrapper.querySelectorAll("video");
    videos.forEach((video) => video.pause());
  });
}

const fishGallery = [
  { title: "Bob el blob", video: "./src/videos/fishs/Bob.mp4" },
  { title: "Pescado Susto", video: "./src/videos/fishs/fish_slide.mp4" },
  { title: "Pescado Eslide", video: "./src/videos/fishs/fish_sliding.mp4" },
];

const horseGallery = [
  { title: "Caballo Barriendo", video: "./src/videos/horse/caballo_barriendo.mp4" },
  { title: "Caballo Volador", video: "./src/videos/horse/caballo_volador.mp4" },
  { title: "Caballo riendo", video: "./src/videos/horse/Caballo riendo.mp4" },
  { title: "Caballo Hablando", video: "./src/videos/horse/donpollo.mp4" },
  { title: "Caballo Espinner", video: "./src/videos/horse/spinning horse.mp4" },
];
