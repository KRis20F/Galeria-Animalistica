window.onload = () => {
    const audios = [
        { type: 'flac', src: './assets/audio/04-Wanted-U.flac' },
        { type: 'm4a', src: './assets/audio/04-Wanted-U.m4a' },
        { type: 'mp3', src: './assets/audio/04-Wanted-U.mp3' },
        { type: 'ogg', src: './assets/audio/04-Wanted-U.ogg' },
        { type: 'wav', src: './assets/audio/04-Wanted-U.wav' },
        { type: 'aac', src: './assets/audio/04-Wanted-U.aac' }
    ];

    const containerMusic = document.getElementById('containerMusic');
    let currentAudioIndex = null;
    const audioElements = [];
    
    const formatOpinions = {
        flac: "El formato FLAC es conocido por su alta calidad sin pérdida de datos. Su sonido es muy fiel al original.",
        m4a: "El formato M4A ofrece un buen equilibrio entre calidad de sonido y tamaño de archivo. Ideal para la música en dispositivos móviles.",
        mp3: "El MP3 es el formato más popular y compatible. Aunque tiene algo de compresión, sigue siendo excelente para la mayoría de los usuarios.",
        ogg: "El formato OGG es libre de regalías y ofrece buena calidad. Es menos compatible con algunos dispositivos, pero es muy eficiente.",
        wav: "El WAV es un formato sin compresión, ofreciendo calidad sin pérdidas, pero con un tamaño de archivo grande.",
        aac: "El AAC es un formato moderno que ofrece buena calidad a bitrates bajos. Es muy popular en servicios de streaming."
    };


    audios.forEach((audio, index) => {
        const divContainer = document.createElement('div');
        divContainer.classList.add('element-song', 'swiper-slide');

        divContainer.innerHTML = `
            <h3>Formato: ${audio.type}</h3>
            <img src="./assets/img/BALLADS.jpg" class="ballads" alt="Ballads">
            <audio controls>
                <source src="${audio.src}" type="audio/${audio.type === 'm4a' || audio.type === 'ogg' || audio.type === 'aac' ? 'mp4' : audio.type}">
            </audio>
            <div class="button-container">
                <button class="back" onclick="prevAudio()"><i class="fa-solid fa-backward"></i></button>
                <button class="play" onclick="togglePlay(${index})"><i class="fa-solid fa-play"></i></button>
                <button class="next" onclick="nextAudio()"><i class="fa-solid fa-forward"></i></button>
            </div>
        `;

        audioElements.push(divContainer.querySelector('audio'));
        containerMusic.appendChild(divContainer);

        divContainer.addEventListener('click', () => {
            updateOpinion(audio.type)
        })


    });

    async function stopAllAudios() {
        audioElements.forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        });
        document.querySelectorAll('.play i').forEach(icon => icon.classList.replace('fa-pause', 'fa-play'));
    }

    window.togglePlay = async (index) => {
        await stopAllAudios();
        const current = audioElements[index];

        if (current.paused) {
            try {
                await current.play();
                document.querySelectorAll('.play i')[index].classList.replace('fa-play', 'fa-pause');
                currentAudioIndex = index;
            } catch (error) {
                console.error("Error al reproducir el audio:", error);
            }
        }
    };

    function updateOpinion(type) {
        const opinionText = formatOpinions[type];
        document.getElementById('opinionText').textContent = opinionText;

        document.querySelector('.context-format').style.cssText = `
            display: grid;
            place-content: center;
        `;
        
        let x = document.querySelector('.close')
        x.addEventListener('click', () => {
            document.querySelector('.context-format').style.display = 'none';
        })


    }

    window.nextAudio = async () => {
        if (currentAudioIndex !== null && currentAudioIndex < audioElements.length - 1) {
            await togglePlay(++currentAudioIndex);
            swiper.slideTo(currentAudioIndex);
        }
    };

    window.prevAudio = async () => {
        if (currentAudioIndex !== null && currentAudioIndex > 0) {
            await togglePlay(--currentAudioIndex);
            swiper.slideTo(currentAudioIndex);
        }
    };

    window.changeVolume = (step) => {
        audioElements.forEach(audio => {
            audio.volume = Math.min(1, Math.max(0, audio.volume + step));
            console.log(`Volumen: ${Math.round(audio.volume * 100)}%`);
        });
    };

    window.toggleMute = () => {
        audioElements.forEach(audio => audio.muted = !audio.muted);
    };

    window.repeatAudio = () => {
        if (currentAudioIndex !== null) {
            audioElements[currentAudioIndex].currentTime = 0;
            audioElements[currentAudioIndex].play();
        }
    };

    window.seekAudio = (seconds) => {
        if (currentAudioIndex !== null) {
            const audio = audioElements[currentAudioIndex];
            audio.currentTime = Math.min(audio.duration, Math.max(0, audio.currentTime + seconds));
        }
    };
};

var swiper = new Swiper(".swiper", {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    initialSlide: 2,
    speed: 600,
    preventClicks: true,
    slidesPerView: "auto",
    coverflowEffect: {
        rotate: 0,
        stretch: 80,
        depth: 350,
        modifier: 1,
        slideShadows: true,
    },
    on: {
        click() {
            swiper.slideTo(this.clickedIndex);
        },
    },
    pagination: {
        el: ".swiper-pagination",
    },
});