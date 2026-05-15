// --- Page Elements ---

const homePage = document.getElementById("homePage");
const appContent = document.getElementById("appContent");
const viewRecipesPage = document.getElementById("viewRecipesPage");

const goToAdd = document.getElementById("goToAdd");
const goToView = document.getElementById("goToView");
const viewAllBtn = document.getElementById("viewAllBtn");

// --- Form Elements ---
const recipeForm = document.getElementById("recipeForm");
const nameInput = document.getElementById("name");
const ingredientsInput = document.getElementById("ingredients");
const stepsInput = document.getElementById("steps");
const imageInput = document.getElementById("image");
const recentContainer = document.querySelector(".recent-container");
const cardsContainer = document.querySelector(".cards-container");

const modal = document.getElementById("recipeModal");
const modalName = document.getElementById("modalName");
const modalImage = document.getElementById("modalImage");
const modalIngredients = document.getElementById("modalIngredients");
const modalSteps = document.getElementById("modalSteps");
const closeModal = document.querySelector(".close");

// --- Local Storage Data ---
let recipes = JSON.parse(localStorage.getItem("recipes")) || [];

// --- Navigation ---
goToAdd.addEventListener("click", () => {
    homePage.style.display = "none";
    appContent.style.display = "block";
    viewRecipesPage.style.display = "none";
});

goToView.addEventListener("click", showViewPage);
viewAllBtn.addEventListener("click", showViewPage);

function showViewPage() {
    homePage.style.display = "none";
    appContent.style.display = "none";
    viewRecipesPage.style.display = "block";

    displayRecipes();
}

// --- Save Recipes Function ---
function saveRecipes() {
    localStorage.setItem("recipes", JSON.stringify(recipes));

    displayRecentRecepie();
    displayRecipes();
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
        recipeForm.reset();
        alert("Recipe added successfully!");
    };

    reader.readAsDataURL(imageInput.files[0]);
});

// --- Display Recent Recipe ---
function displayRecentRecipe() {
    recentContainer.innerHTML = "";

    if (recipes.length === 0) {
        recentContainer.innerHTML =
            "<p>No recent recipe added yet.</p>";
        return;
    }

    const latestRecipe = recipes[recipes.length - 1];
    const card = createRecipeCard(latestRecipe);

    recentContainer.appendChild(card);
}

// --- Display All Recipes ---
function displayRecipes() {
    cardsContainer.innerHTML = "";

    if (recipes.length === 0) {
        cardsContainer.innerHTML =
            "<p>No recipes found!</p>";
        return;
    }

    recipes.forEach((recipe, index) => {
        const card = createRecipeCard(recipe, index);
        cardsContainer.appendChild(card);
    });
}

// --- Create Recipe Card ---
function createRecipeCard(recipe) {
    const card = document.createElement("div");
    card.className = "recipe-card";

    const image = document.createElement("img");
    image.src = recipe.image;
    image.alt = recipe.name;

    const title = document.createElement("h3");
    title.textContent = recipe.name;

    const buttonContainer = document.createElement("div");
    buttonContainer.className = "card-buttons";

    const viewButton = document.createElement("button");
    viewButton.textContent = "View";

    viewButton.addEventListener("click", () => {
        showModal(recipe);
    });

    buttonContainer.appendChild(viewButton);
    card.append(image, title, buttonContainer);
    return card;
}

// --- Show Modal ---

function showModal(recipe) {
    modalName.textContent = recipe.name;
    modalImage.src = recipe.image;
    modalIngredients.textContent = recipe.ingredients;

    const stepsArray = recipe.steps
        .split(/\r?\n|,/)
        .map(step => step.trim())
        .filter(Boolean);

    modalSteps.innerHTML = stepsArray
        .map((step, index) =>
            `${index + 1}. ${step}`
        )
        .join("<br>");

    modal.style.display = "block";
}

// --- Close Modal ---
closeModal.addEventListener("click", () => {
    modal.style.display = "none";
});

window.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

// --- Initial Load ---
displayRecentRecipe();
displayRecipes();