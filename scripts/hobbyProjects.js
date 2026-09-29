const modelDiv = document.getElementById("NecronName");
const modelName = document.createElement("a");
const container = document.getElementById("NecronsPics");
const folderPath = "../pages/images/wh40k/necrons/"; // Path to your folder
const imageNames = ["Szeras"];
/*
Faction = Imperium | Necrons | Chaos
Sub-Faction = Blood Ravens (Dark Red | Tan) | Death Watch (Black | Silver) | Nihilakh (Turquoise | Gold) | World Eaters (Red)
*/

let imageIndex = 1;

function loadImages() {
  const img = new Image();
  for (const name of imageNames) {
    if (imageIndex == 1) {
      modelName.innerText = name;
      modelName.href = "#";
      modelName.classList.add("subMenuToggle");
      modelName.setAttribute("id", "nihilakh");

      modelDiv.prepend(modelName);
    }
    img.src = `${folderPath}${name}_${imageIndex}.jpg`; // Assumes names like {modelName}_{index}.jpg
    img.style.width = "200px";
    img.style.height = "150px";
    img.style.objectFit = "cover";

    console.log("image source: " + img.src);
    // If the image exists, append it and try the next one
    img.onload = function () {
      container.appendChild(img);
      imageIndex++;
      loadImages(); // Recursive call to check next image
    };

    // If the image doesn't exist, the loop stops gracefully
    img.onerror = function () {
      console.log(`Loaded ${imageIndex - 1} images.`);
    };
  }
}

// Start the loop
loadImages();

document.addEventListener("DOMContentLoaded", () => {
  const hobbyToggles = document.querySelectorAll(".subMenuToggle");

  hobbyToggles.forEach((hobbyToggle) => {
    hobbyToggle.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const currentSubmenu = hobbyToggle.nextElementSibling;
      const isOpen = currentSubmenu.classList.contains("isOpen");

      // Close sibling submenus at the exact same nesting level
      const parentLi = hobbyToggle.closest("li");
      const siblingLis = parentLi.parentElement.children;

      Array.from(siblingLis).forEach((li) => {
        if (li !== parentLi) {
          li.querySelectorAll(".hobbySubmenu").forEach((sub) =>
            sub.classList.remove("isOpen"),
          );
          // li.querySelectorAll('.submenu-toggle').forEach(btn => btn.setAttribute('aria-expanded', 'false'));
        }
      });

      if (isOpen) {
        currentSubmenu.classList.remove("isOpen");
      } else {
        currentSubmenu.classList.add("isOpen");
      }

      console.log("Clicked!");
    });
  });
});
