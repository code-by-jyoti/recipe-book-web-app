// --- Page Elements ---

const homePage = document.getElementById("homePage");
const appContent = document.getElementById("appContent");
const goToAdd = document.getElementById("goToAdd");
const goToView = document.getElementById("goToView");

// --- Form Elements ---
const recipeForm = document.getElementById("recipeForm");
const nameInput = document.getElementById("name");
const ingredientsInput = document.getElementById("ingredients");
const stepsInput = document.getElementById("steps");
const imageInput = document.getElementById("image");

// --- Local Storage Data ---
let recipes = JSON.parse(localStorage.getItem("recipes")) || [];

// --- Navigation ---
goToAdd.addEventListener("click", () => {
    homePage.style.display = "none";
    appContent.style.display = "block";
});

goToView.addEventListener("click", () => {
    alert("View Recipes feature will be added in next issue.");
});

// --- Save Recipes Function ---
function saveRecipes() {
    localStorage.setItem("recipes", JSON.stringify(recipes));
}

// --- Add Recipe Functionality ---
recipeForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (
        !nameInput.value ||
        !ingredientsInput.value ||
        !stepsInput.value
    ) {

        alert("Please fill all fields.");
        return;
    }

    if (!imageInput.files[0]) {
        alert("Please upload a recipe image.");
        return;
    }

    const reader = new FileReader();
    reader.onload = () => {
        const recipeData = {
            name: nameInput.value.trim(),
            ingredients: ingredientsInput.value.trim(),
            steps: stepsInput.value.trim(),
            image: reader.result
        };

        recipes.push(recipeData);
        saveRecipes();
        alert("Recipe added successfully!");
        recipeForm.reset();
    };

    reader.readAsDataURL(imageInput.files[0]);
});