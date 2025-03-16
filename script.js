document.addEventListener("DOMContentLoaded", () => {
  
  const container = document.getElementById("model-container");
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ alpha: true });

  renderer.setSize(800, 800);
  container.appendChild(renderer.domElement);

  
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(0, 10, 10);
  scene.add(directionalLight);

  camera.position.z = 10;
  camera.lookAt(0, 0, 0);

  let mixer; 

  
  const loader = new THREE.GLTFLoader();
  loader.load(
    "./src/loading/oiiaioooooiai_cat.glb", 
    function (gltf) {
      const model = gltf.scene;

      
      model.scale.set(12, 12, 12);

      
      model.position.set(-2, -2, 0); 

      
      model.rotation.x = 0;
      model.rotation.y = Math.PI / 6; 
      model.rotation.z = 0;

      
      mixer = new THREE.AnimationMixer(model);
      const clips = gltf.animations;

      
      clips.forEach((clip) => {
        const action = mixer.clipAction(clip);
        action.play();
      });

      scene.add(model);

      
      const clock = new THREE.Clock();

      function animate() {
        requestAnimationFrame(animate);

        
        if (mixer) {
          const delta = clock.getDelta();
          mixer.update(delta);
        }

        renderer.render(scene, camera);
      }
      animate();
    },
    function (xhr) {
      
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    function (error) {
      console.error("Error cargando el modelo:", error);
    }
  );

  
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

    
    audio.addEventListener("ended", () => {
      musicIcon.classList.remove("fa-pause");
      musicIcon.classList.add("fa-play");
    });
  }

  
  function createDefaultState() {
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = `
      <div class="default-video-container">
        <video autoplay loop muted playsinline>
          <source src="./src/videos/state.mp4" type="video/mp4">
        </video>
        <p class="default-message">Esperando a que veas los tops 5 jefe</p>
      </div>
    `;
  }

  
  createDefaultState();

  
  const buttons = document.querySelectorAll(".button_gallery");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const gallery = document.querySelector(".gallery");
      gallery.innerHTML = ""; 

      
      if (button.classList.contains("gallery_fish")) {
        createCardsTops(fishGallery);
      } else if (button.classList.contains("gallery_horse")) {
        createCardsTops(horseGallery);
      } else if (button.classList.contains("gallery_cat")) {
        createCardsTops(catGallery);
      } else if (button.classList.contains("gallery_fox")) {
        createCardsTops(foxGallery);
      }
    });
  });

  CreateMosaic(gallery_mosaic);

  
  const MUSIC_CONFIG = {
    src: "./src/audio/index.mp3",
    defaultVolume: 0.5,
    muteVolume: 0,
  };

  
  class BackgroundMusic {
    constructor(config) {
      this.audio = new Audio(config.src);
      this.audio.loop = true;
      this.audio.volume = config.defaultVolume;
      this.isMuted = false;
      this.button = null;
      this.config = config;
    }

    createButton() {
      this.button = document.createElement("button");
      this.button.className = "music-control";
      this.updateButtonIcon();
      document.body.appendChild(this.button);
      this.addEventListeners();
    }

    updateButtonIcon() {
      const iconClass = this.isMuted ? "fa-volume-xmark" : "fa-music";
      this.button.innerHTML = `<i class="fa-solid ${iconClass}"></i>`;
    }

    toggleMute() {
      this.isMuted = !this.isMuted;
      this.audio.volume = this.isMuted
        ? this.config.muteVolume
        : this.config.defaultVolume;
      this.updateButtonIcon();
    }

    addEventListeners() {
      
      this.button.addEventListener("click", () => this.toggleMute());

      
      const startMusic = () => {
        this.audio.play().catch((error) => {
          console.log("Autoplay prevented:", error);
        });
        document.removeEventListener("click", startMusic);
      };

      document.addEventListener("click", startMusic, { once: true });
    }

    init() {
      document.addEventListener("DOMContentLoaded", () => this.createButton());
    }
  }

  
  const backgroundMusic = new BackgroundMusic(MUSIC_CONFIG);
  backgroundMusic.init();

  
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const body = document.body;

  
  const overlay = document.createElement("div");
  overlay.className = "menu-overlay";
  body.appendChild(overlay);

  
  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      
      menuToggle.classList.toggle("active");
      navMenu.classList.toggle("active");
      overlay.classList.toggle("active");

      
      const icon = menuToggle.querySelector("i");
      if (navMenu.classList.contains("active")) {
        icon.classList.remove("fa-bars");
        icon.classList.add("fa-times");
        body.style.overflow = "hidden";
      } else {
        icon.classList.remove("fa-times");
        icon.classList.add("fa-bars");
        body.style.overflow = "";
      }
    });
  }

  
  overlay.addEventListener("click", () => {
    menuToggle.classList.remove("active");
    navMenu.classList.remove("active");
    overlay.classList.remove("active");
    body.style.overflow = "";

    const icon = menuToggle.querySelector("i");
    icon.classList.remove("fa-times");
    icon.classList.add("fa-bars");
  });

  
  document.querySelectorAll(".nav-list a").forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.classList.remove("active");
      navMenu.classList.remove("active");
      overlay.classList.remove("active");
      body.style.overflow = "";

      const icon = menuToggle.querySelector("i");
      icon.classList.remove("fa-times");
      icon.classList.add("fa-bars");
    });
  });

  
  const openButton = document.getElementById("openSvgPopup");
  const popup = document.getElementById("svgPopup");
  const closeButton = document.querySelector(".close-popup");

  if (openButton && popup && closeButton) {
    
    openButton.addEventListener("click", function (e) {
      e.preventDefault();
      popup.style.display = "block";
      document.body.style.overflow = "hidden";
      
    });

    
    const closePopup = () => {
      popup.style.display = "none";
      document.body.style.overflow = "";  
      document.body.style.paddingRight = ""; 
    };

    
    closeButton.addEventListener("click", closePopup);

    
    window.addEventListener("click", function (e) {
      if (e.target === popup) {
        closePopup();
      }
    });

    
    popup.querySelector(".popup-content").addEventListener("click", function (e) {
      e.stopPropagation();
    });
  } else {
    console.error("Elementos del popup no encontrados");
  }
});

function createCardsTops(gallery) {
  const containerGallery = document.querySelector(".gallery");
  containerGallery.innerHTML = "";

  
  const carouselWrapper = document.createElement("div");
  carouselWrapper.id = "videoCarousel";
  carouselWrapper.className = "carousel slide";
  carouselWrapper.setAttribute("data-bs-ride", "false");

  
  const carouselInner = document.createElement("div");
  carouselInner.className = "carousel-inner";

  
  gallery.forEach((animal, index) => {
    const slide = document.createElement("div");
    slide.className = `carousel-item ${index === 0 ? "active" : ""}`;

    const card = document.createElement("div");
    card.className = "card_video";

    const title = document.createElement("h2");
    title.className = "card_video_title";
    title.textContent = animal.title;

    const video = document.createElement("video");
    video.src = animal.video;
    video.controls = true;
    video.className = "card-video";
    video.playsInline = true;
    video.preload = "metadata";
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    video.setAttribute("x5-playsinline", "");

    
    video.style.width = "100%";
    video.style.height = "auto";
    video.style.maxHeight = "70vh";

    
    video.addEventListener("loadedmetadata", () => {
      video.style.display = "block";
    });

    
    video.addEventListener("error", (e) => {
      console.error("Error loading video:", e);
      card.innerHTML += '<p class="error-message">Error al cargar el video</p>';
    });

    card.appendChild(title);
    card.appendChild(video);
    slide.appendChild(card);
    carouselInner.appendChild(slide);
  });

  
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

  
  carouselWrapper.appendChild(carouselInner);
  carouselWrapper.appendChild(prevButton);
  carouselWrapper.appendChild(nextButton);
  containerGallery.appendChild(carouselWrapper);

  
  const carousel = new bootstrap.Carousel(carouselWrapper, {
    interval: false,
    wrap: true,
  });

  
  carouselWrapper.addEventListener("slide.bs.carousel", (event) => {
    const videos = carouselWrapper.querySelectorAll("video");
    videos.forEach((video) => video.pause());
  });
}

function CreateMosaic(gallery) {
  const containerGallery = document.querySelector(".mosaic-container");

  if (!containerGallery) {
    console.error("No se encontró el contenedor del mosaico");
    return;
  }

  containerGallery.innerHTML = "";

  gallery.forEach((animal, index) => {
    const slide = document.createElement("div");
    slide.className = `mosaic-item ${index === 0 ? "active" : ""}`;

    const img = document.createElement("img");
    img.src = animal.video;
    img.alt = animal.title;
    img.loading = "lazy";

    const overlay = document.createElement("div");
    overlay.className = "mosaic-overlay";
    overlay.innerHTML = `<h3>${animal.title}</h3>`;

    slide.appendChild(img);
    slide.appendChild(overlay);
    containerGallery.appendChild(slide);
  });
}

const fishGallery = [
  { title: "Bob el blob", video: "./src/videos/fishs/Bob.mp4" },
  { title: "Pescado Susto", video: "./src/videos/fishs/fish_slide.mp4" },
  { title: "Pescado Eslide", video: "./src/videos/fishs/fish_sliding.mp4" },
  {
    title: "pez con audífonos",
    video: "./src/videos/fishs/pez baila con audífonos.mp4",
  },
  {
    title: "nombre muy largo",
    video: "./src/videos/fishs/Terraria flying fish meme.mp4",
  },
];

const horseGallery = [
  {
    title: "Caballo Barriendo",
    video: "./src/videos/horse/caballo_barriendo.mp4",
  },
  { title: "Caballo Volador", video: "./src/videos/horse/caballo_volador.mp4" },
  { title: "Caballo riendo", video: "./src/videos/horse/Caballo riendo.mp4" },
  { title: "Caballo Hablando", video: "./src/videos/horse/donpollo.mp4" },
  { title: "Caballo Espinner", video: "./src/videos/horse/spinning horse.mp4" },
];

const catGallery = [
  { title: "Gato Gucci", video: "./src/videos/cats/gatito_gucci.mp4" },
  { title: "Gato Bailarín", video: "./src/videos/cats/gato_dance.mp4" },
  { title: "Gato Pianista", video: "./src/videos/cats/gato_pianista.mp4" },
  { title: "Gato Reflexivo", video: "./src/videos/cats/gato_reflexivo.mp4" },
  { title: "Gato Skater", video: "./src/videos/cats/gato_skate.mp4" },
];

const foxGallery = [
  { title: "Zorro Boop", video: "./src/videos/foxs/boop2.mp4" },
  { title: "Zorro Sorprendido", video: "./src/videos/foxs/foxy jumpscare.mp4" },
  { title: "Zorro Riendose", video: "./src/videos/foxs/Laughing fox.mp4" },
  { title: "Zorro Feliz", video: "./src/videos/foxs/zorro felix.mp4" },
  { title: "Zorro Saltarín", video: "./src/videos/foxs/zorro saltando.mp4" },
];

const gallery_mosaic = [
  { title: "Gato Gucci", video: "./src/img/gatito.jpg" },
  { title: "Zorro en la nieve", video: "./src/img/zorritos.avif" },
  { title: "Panda pendejo", video: "./src/img/descarga.jpg" },
  { title: "Lince Papu", video: "./src/img/lince_papu.jpg" },
  { title: "Perrito bonito", video: "./src/img/cachorro.jpg" },
  { title: "Un Leon", video: "./src/img/leon.jpg" },
  { title: "Una foca", video: "./src/img/foca.jpg" },
  { title: "Un Caballo", video: "./src/img/un_caballo.jpg" },
];
