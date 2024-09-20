const movingText = document.getElementById('movingText');

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioContext.createAnalyser();

// Request access to the microphone
navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
        analyser.connect(audioContext.destination);

        // Set up the analyser
        analyser.fftSize = 2048;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        
        visualize();

        function visualize() {
            requestAnimationFrame(visualize);
            analyser.getByteFrequencyData(dataArray);
            
            // Get the average volume level
            const average = dataArray.reduce((a, b) => a + b) / bufferLength;

            // Adjust the scale of the SVG filter based on audio level
            const filter = document.querySelector('filter#n2 feDisplacementMap');
            filter.setAttribute('scale', average / 1); // Adjust scale as needed

            // Move the text based on audio level
            movingText.style.transform = `translateY(${average / 100})px`; // Adjust factor for desired effect
        }
    })
    .catch(error => {
        console.error('Error accessing microphone:', error);
    });
