// Hairstyle dictionary
const hairstyles = {
    style1: {
        url: "https://airi-institute-hairfastgan.hf.space/file=/tmp/gradio/90e42560c5b2e8086c47fe34f0b20599a26abb71/1.png",
        alt: "Hairstyle 1"
    },
    style2: {
        url: "7.png",
        alt: "Hairstyle 2"
    }
    // Add more hairstyles here
};

// Generate hairstyle grid
function generateHairstyleGrid() {
    const grid = document.querySelector('.hairstyle-grid');
    grid.innerHTML = ''; // Clear existing content
    
    Object.entries(hairstyles).forEach(([key, style], index) => {
        const div = document.createElement('div');
        div.className = 'photo-container hairstyle-option';
        if (index === 0) div.classList.add('selected');
        
        const img = document.createElement('img');
        img.src = style.url;
        img.alt = style.alt;
        
        div.appendChild(img);
        grid.appendChild(div);
    });
}

const selectedHairstyleImg = document.getElementById('selectedHairstyle');
let selectedHairstyleUrl = selectedHairstyleImg.src;

// Handle hairstyle selection
function handleHairstyleSelection() {
    const hairstyleOptions = document.querySelectorAll('.hairstyle-option');
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
}

// Initialize gradio client and handle API calls
async function setupGradioClient() {
    try {
        const { Client } = await import("https://cdn.jsdelivr.net/npm/@gradio/client/dist/index.min.js");
        const client = await Client.connect("AIRI-Institute/HairFastGAN", {
            hf_token: undefined  // Add your HuggingFace token here if needed
        });
        
        document.getElementById('tryHairstyle').addEventListener('click', async () => {
            try {
                const loadingDiv = document.createElement('div');
                loadingDiv.className = 'loading';
                loadingDiv.textContent = 'Processing...';
                document.querySelector('.style-options').appendChild(loadingDiv);

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
                document.querySelector('.loading').remove();
            } catch (error) {
                console.error('Error:', error);
                alert('Error processing image. Please try again.');
                document.querySelector('.loading')?.remove();
            }
        });
    } catch (error) {
        console.error('Failed to initialize:', error);
    }
}

// Initialize everything
function initializeApp() {
    generateHairstyleGrid();
    handleHairstyleSelection();
    const hairstyleOptions = document.querySelectorAll('.hairstyle-option');
    const selectedHairstyleImg = document.getElementById('selectedHairstyle');
    let selectedHairstyleUrl = selectedHairstyleImg.src;

    // Set first hairstyle as default
    if (hairstyleOptions.length > 0) {
        const firstOptionImg = hairstyleOptions[0].querySelector('img');
        selectedHairstyleImg.src = firstOptionImg.src;
        selectedHairstyleUrl = firstOptionImg.src;
    }
}

setupGradioClient().catch(console.error);
initializeApp();
