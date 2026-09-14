const container = document.getElementById('Necrons');
const folderPath = '../pages/images/wh40k/necrons/'; // Path to your folder
let imageIndex = 1;

function loadImages() {
    const img = new Image();
    img.src = `${folderPath}${imageIndex}.jpg`; // Assumes names like 1.jpg, 2.jpg

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
}

// Start the loop
loadImages();