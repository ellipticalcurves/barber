import { Client } from "https://cdn.jsdelivr.net/npm/@gradio/client/dist/index.min.js";

async function initializeApp() {
    const hairstyleOptions = document.querySelectorAll('.hairstyle-option');
    const selectedHairstyleImg = document.getElementById('selectedHairstyle');
    let selectedHairstyleUrl = '';

    // Set first hairstyle as default
    if (hairstyleOptions.length > 0) {
        selectedHairstyleImg.src = hairstyleOptions[0].src;
        selectedHairstyleUrl = hairstyleOptions[0].src;
        hairstyleOptions[0].classList.add('selected');
    }

    // Handle hairstyle selection
    hairstyleOptions.forEach(option => {
        option.addEventListener('click', () => {
            hairstyleOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            selectedHairstyleImg.src = option.src;
            selectedHairstyleUrl = option.src;
        });
    });

    // Initialize client
    const client = await Client.connect("AIRI-Institute/HairFastGAN");

    // Handle try hairstyle button click
    document.getElementById('tryHairstyle').addEventListener('click', async () => {
        try {
            const sourceResponse = await fetch("https://airi-institute-hairfastgan.hf.space/file=/tmp/gradio/dae2c0951aa02520c803eab2ea012d6a72cf0f28/0.png");
            const sourceImage = await sourceResponse.blob();
            
            const targetResponse = await fetch(selectedHairstyleUrl);
            const targetImage = await targetResponse.blob();
            
            const result = await client.predict("/swap_hair", { 
                face: sourceImage,
                shape: targetImage,
                color: null,
                blending: "Article",
                poisson_iters: 0,
                poisson_erosion: 1,
            });

            document.getElementById('outputImage').src = result.data[0].value.url;
        } catch (error) {
            console.error('Error processing hairstyle:', error);
        }
    });
}

// Initialize the application
initializeApp();
