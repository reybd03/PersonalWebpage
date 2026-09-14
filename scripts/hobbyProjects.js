const container = document.getElementById('Necrons');
const folderPath = '../pages/images/wh40k/necrons/'; // Path to your folder
const imageNames = ['Szeras']

let imageIndex = 1;

function loadImages() {
    const img = new Image();
    for (const name of imageNames) {
        
        img.src = `${folderPath}${name}_${imageIndex}.jpg`; // Assumes names like 1.jpg, 2.jpg
        console.log("image source: " +img.src);
        // If the image exists, append it and try the next one
        img.onload = function() {
            container.appendChild(img);
            imageIndex++;
            loadImages(); // Recursive call to check next image
        };

        // If the image doesn't exist, the loop stops gracefully
        img.onerror = function() {
            console.log(`Loaded ${imageIndex - 1} images.`);
        };
    };
}

// Start the loop
loadImages();