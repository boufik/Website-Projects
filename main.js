// 1) Sound Data - For the sound boxes located in the bottom of the webpage
const sounds = [
    {
        id: '1',
        name: 'Water Fountain Samarina',
        audioSrc: './Sounds/spring-2min.mp3',
        imageSrc: './Photos/vrysh-moutselia.png',
        volume: 0,
        isPlaying: false
    },
    {
        id: '2',
        name: 'Singing Cicadas',
        audioSrc: './Sounds/cicada-4min.mp3',
        imageSrc: './Photos/cicadas.png',
        volume: 0,
        isPlaying: false
    },
    {
        id: '3',
        name: 'Mountain Breeze',
        audioSrc: './Sounds/breeze-4min.mp3',
        imageSrc: './Photos/breeze2.jpg',
        volume: 0,
        isPlaying: false
    },
    {
        id: '4',
        name: 'Chirping Birds',
        audioSrc: './Sounds/birds-4min.mp3',
        imageSrc: './Photos/birds2.jpg',
        volume: 0,
        isPlaying: false
    }
];




// 2) Load the sounds
const audioElements = {};                               // Example: audioElements = {"1": audio1, "2": audio2, ...., "N": audioN}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeSounds();
    renderSoundGrid();
});

function initializeSounds() {
    sounds.forEach(sound => {
        const audio = new Audio(sound.audioSrc);        // Create an "audio" object = instance of the "Audio" class, based on the JSON-formated variable "sound"
        audio.loop = true;
        audio.volume = sound.volume / 100;
        audio.preload = 'none';
        audioElements[sound.id] = audio;
    });
}

function renderSoundGrid() {
    // Select the "div#soundGrid", that will host the sound boxes at the bottom of the webpage
    const soundGrid = document.getElementById('soundGrid');
    // Set grid columns based on number of sounds
    soundGrid.className = 'sound-grid cols-2';
    // Clear existing content
    soundGrid.innerHTML = '';
    // For each sound, create a sound box and append it as a child of the parent "div#soundGrid"
    sounds.forEach(sound => {
        const soundBox = createSoundBox(sound);
        soundGrid.appendChild(soundBox);
    });
}

function createSoundBox(sound) {
    const soundBox = document.createElement('div');
    soundBox.className = 'sound-box';
    
    soundBox.innerHTML = `
        <div class="sound-background" style="background-image: url('${sound.imageSrc}')"></div>
        <div class="sound-overlay"></div>
        <div class="sound-content">
            <div class="sound-title">
                <h3 class="sound-name">${sound.name}</h3>
            </div>
            
            <div class="sound-controls">
                <div class="volume-control">
                    <div class="volume-slider-container">
                        <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            value="${sound.volume}"
                            class="volume-slider"
                            oninput="handleVolumeChange('${sound.id}', this.value)"
                        />
                        <div class="volume-value">${sound.volume}</div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    return soundBox;
}




// 3) Additional
function handleVolumeChange(soundId, newVolume) {
    const sound = sounds.find(s => s.id === soundId);
    const audio = audioElements[soundId];
    
    if (!sound || !audio) return;
    
    sound.volume = parseInt(newVolume);
    audio.volume = sound.volume / 100;
    
    // Auto-play when volume is above 0, pause when 0
    if (sound.volume > 0 && !sound.isPlaying) {
        audio.play().catch(e => console.log('Audio play failed:', e));
        sound.isPlaying = true;
    } else if (sound.volume === 0 && sound.isPlaying) {
        audio.pause();
        sound.isPlaying = false;
    }
    
    // Update volume value display
    const soundBox = document.querySelector(`[oninput*="${soundId}"]`).closest('.sound-box');
    const volumeValue = soundBox.querySelector('.volume-value');
    volumeValue.textContent = sound.volume;
    // Update slider track color
    updateSliderTrack(soundBox.querySelector('.volume-slider'), sound.volume);
}

function updateSliderTrack(slider, value) {
    const percentage = value;
    slider.style.background = `linear-gradient(to right, 
        rgba(16, 185, 129, 0.6) 0%, 
        rgba(16, 185, 129, 0.6) ${percentage}%, 
        rgba(255, 255, 255, 0.2) ${percentage}%, 
        rgba(255, 255, 255, 0.2) 100%)`;
}

// Initialize slider tracks on load
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const sliders = document.querySelectorAll('.volume-slider');
        sliders.forEach(slider => {
            updateSliderTrack(slider, slider.value);
        });
    }, 100);
});

// Utility class for hiding elements
document.head.insertAdjacentHTML('beforeend', `
    <style>
        .hidden { display: none !important; }
    </style>
`);