const hairstyleOptions = document.querySelectorAll('.hairstyle-option');
const selectedHairstyleImg = document.getElementById('selectedHairstyle');
let selectedHairstyleUrl = selectedHairstyleImg.src;

// Handle hairstyle selection
hairstyleOptions.forEach(option => {
    option.addEventListener('click', () => {
        const optionImg = option.querySelector('img');
        if (optionImg && optionImg.src) {
            hairstyleOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            selectedHairstyleImg.src = optionImg.src;
            selectedHairstyleUrl = optionImg.src;
        }
    });
});

// Initialize gradio client and handle API calls
async function setupGradioClient() {
    const { Client } = await import("https://cdn.jsdelivr.net/npm/@gradio/client/dist/index.min.js");
    const client = await Client.connect("AIRI-Institute/HairFastGAN");
    
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

// Initialize everything
setupGradioClient().catch(console.error);
