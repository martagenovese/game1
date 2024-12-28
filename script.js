document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('backgroundMusic');
    const musicModal = document.getElementById('musicModal');
    const acceptMusic = document.getElementById('acceptMusic');
    const declineMusic = document.getElementById('declineMusic');

    // Check if the user has already accepted the music
    if (localStorage.getItem('musicAccepted') === 'true') {
        const currentTime = localStorage.getItem('musicCurrentTime');
        if (currentTime) {
            audio.currentTime = parseFloat(currentTime);
        }
        audio.play().catch(error => {
            console.log('Audio playback failed:', error);
        });
    } else {
        // Show the modal
        musicModal.style.display = 'block';
    }

    acceptMusic.addEventListener('click', () => {
        localStorage.setItem('musicAccepted', 'true');
        audio.play().catch(error => {
            console.log('Audio playback failed:', error);
        });
        musicModal.style.display = 'none';
    });

    declineMusic.addEventListener('click', () => {
        localStorage.setItem('musicAccepted', 'false');
        musicModal.style.display = 'none';
    });

    // Save the current time of the audio before the page unloads
    window.addEventListener('beforeunload', () => {
        localStorage.setItem('musicCurrentTime', audio.currentTime);
    });
});