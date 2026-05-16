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
const searchInput = document.getElementById("searchInput");

const modal = document.getElementById("recipeModal");
const modalName = document.getElementById("modalName");
const modalImage = document.getElementById("modalImage");
const modalIngredients = document.getElementById("modalIngredients");
const modalSteps = document.getElementById("modalSteps");
const commentInput = document.getElementById("commentInput");
const addCommentBtn = document.getElementById("addCommentBtn");
const closeModal = document.querySelector(".close");

// --- Local Storage Data ---
let recipes = JSON.parse(localStorage.getItem("recipes")) || [];
let editIndex = null;
let currentUser = "You";
let currentModalIndex = null;

// --- Back Button ---
function updateBackBtn() {
    const isHomePageVisible = homePage.style.display !== "none";

    backBtn.style.display = isHomePageVisible ? "none" : "block";
}

function showAddPage(addHistory = true) {
    homePage.style.display = "none";
    appContent.style.display = "block";
    viewRecipesPage.style.display = "none";

    updateBackBtn();

    if (addHistory) {
        history.pushState({ page: "add" }, "", "#add");
    }
}

function showViewPage(addHistory = true) {
    homePage.style.display = "none";
    appContent.style.display = "none";
    viewRecipesPage.style.display = "block";

    displayRecipes();
    updateBackBtn();

    if (addHistory) {
        history.pushState({ page: "view" }, "", "#view");
    }
}


// --- Navigation ---
goToAdd.addEventListener("click", showAddPage);

goToView.addEventListener("click", showViewPage);

viewAllBtn.addEventListener("click", showViewPage);

backBtn.addEventListener("click", () => {
    window.history.back();
});

window.addEventListener("popstate", (event) => {

    if (!event.state) {
        homePage.style.display = "flex";
        appContent.style.display = "none";
        viewRecipesPage.style.display = "none";
    }

    else if (event.state.page === "add") {
        showAddPage(false);
    }

    else if (event.state.page === "view") {
        showViewPage(false);
    }

    updateBackBtn();
});

// --- Save Recipes Function ---
function saveRecipes() {
    localStorage.setItem("recipes", JSON.stringify(recipes));

    displayRecentRecipe();
    displayRecipes();
}

// --- Add or edit recipe ---
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

    const handleRecipeData = (imageSource) => {
        const recipeData = {
            name: nameInput.value.trim(),
            ingredients: ingredientsInput.value.trim(),
            steps: stepsInput.value.trim(),
            image: imageSource,
            user: currentUser,
            comments: []
        };

        if (editIndex !== null) {
            recipeData.user = recipes[editIndex].user;
            recipeData.comments =recipes[editIndex].comments || [];

            recipes[editIndex] = recipeData;
            editIndex = null;
            alert("Recipe updated successfully!");
        }

        else {
            recipes.push(recipeData);
            alert("Recipe added successfully!");
        }

        saveRecipes();
        recipeForm.reset();
    };

    if (imageInput.files[0]) {
        const reader = new FileReader();

        reader.onload = () => {
            handleRecipeData(reader.result);
        };

        reader.readAsDataURL(imageInput.files[0]);
    }

    else if (editIndex !== null) {
        handleRecipeData(recipes[editIndex].image);
    }

    else {
        alert("Please upload a recipe image.");
        return;
    }
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
    const card = createRecipeCard(latestRecipe, recipes.length - 1);

    recentContainer.appendChild(card);
}

// --- Display All Recipes ---
function displayRecipes(filter = "") {
    cardsContainer.innerHTML = "";

    const filteredRecipes = recipes.filter(recipe => {
        return (
            recipe.name
                .toLowerCase()
                .includes(filter.toLowerCase()) ||
            recipe.ingredients
                .toLowerCase()
                .includes(filter.toLowerCase())
        );
    });

    if (filteredRecipes.length === 0) {
        cardsContainer.innerHTML =
            "<p>No recipes found!</p>";
        return;
    }

    filteredRecipes.forEach((recipe, index) => {
        const card = createRecipeCard(recipe, index);
        cardsContainer.appendChild(card);
    });
}

// --- Create Recipe Card ---
function createRecipeCard(recipe, index) {
    const card = document.createElement("div");
    card.className = "recipe-card";

    const image = document.createElement("img");
    image.src = recipe.image;
    image.alt = recipe.name;

    const title = document.createElement("h3");
    title.textContent = recipe.name;

    const buttonContainer = document.createElement("div");
    buttonContainer.className = "card-buttons";

    // View button
    const viewButton = document.createElement("button");
    viewButton.textContent = "View";

    viewButton.className = "view-btn";

    viewButton.addEventListener("click", () => {
        showModal(recipe, index);
    });

    buttonContainer.appendChild(viewButton);

    // Owner Buttons
    if(!recipe.user || recipe.user === currentUser) {
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.className = "edit-btn";

        editButton.addEventListener("click", () => {
            editRecipe(index);
        });

        // Delete Button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";

        deleteButton.addEventListener("click", () => {
            deleteRecipe(index);
        });

        buttonContainer.append(editButton, deleteButton);
    }

    card.append(image, title, buttonContainer);
    return card;
}

// --- Show Modal ---

function showModal(recipe, index) {
    currentModalIndex = index;
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

    displayComments(recipe);

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

// --- Comments System ---
function displayComments(recipe) {

    const commentsContainer = modal.querySelector(".comments-container");
    
    commentsContainer.innerHTML = "";
    
    if (!recipe.comments || recipe.comments.length === 0) {
        commentsContainer.innerHTML = "<p>No comments yet.</p>";
        
        return;
    }

    recipe.comments.forEach(comment => {
        const commentElement = document.createElement("p");
        
        commentElement.textContent = `${comment.user}: ${comment.text}`;
        commentsContainer.appendChild(commentElement);
    });
}

addCommentBtn.addEventListener("click", () => {
    const commentText = commentInput.value.trim();
    
    if (!commentText || currentModalIndex === null) return;
    
    // Create comments array if missing
    if (!recipes[currentModalIndex].comments) {
        recipes[currentModalIndex].comments = [];
    }

    recipes[currentModalIndex].comments.push({ user: currentUser, text: commentText });
    
    saveRecipes();
    
    displayComments(recipes[currentModalIndex]);
    commentInput.value = "";
});

// --- Edit Recipe ---
function editRecipe(index) {
    const recipe = recipes[index];

    nameInput.value = recipe.name;
    ingredientsInput.value = recipe.ingredients;
    stepsInput.value = recipe.steps;
    imageInput.value = "";

    editIndex = index;

    showAddPage();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

// --- Delete Recipe ---
function deleteRecipe(index) {
    const confirmDelete = confirm(
        "Are you sure you want to delete this recipe?"
    );

    if (!confirmDelete) {
        return;
    }

    recipes.splice(index, 1);
    saveRecipes();
    alert("Recipe deleted successfully!");
}

// --- Search ---
searchInput.addEventListener("input", (event) => {
    displayRecipes(event.target.value);
});

// --- Initial Load ---
displayRecentRecipe();
displayRecipes();
updateBackBtn();