/* ================================
   LOAD RECIPES (with default)
================================ */

function loadRecipes() {
  let recipes = JSON.parse(localStorage.getItem("recipes"));

  // If no recipes found → load default Pav Bhaji
  if (!recipes || recipes.length === 0) {
    const defaultRecipe = {
      id: String(Date.now()),
      title: "Pav Bhaji",
      description: "A spicy, buttery Mumbai street-food dish made with mashed vegetables.",
      image: "",
      difficulty: "Medium",
      ingredients: [
        "2 cups mixed vegetables (potato, cauliflower, peas)",
        "2 onions (finely chopped)",
        "2 tomatoes (chopped)",
        "1 capsicum (chopped)",
        "2 tbsp pav bhaji masala",
        "Butter as needed",
        "Salt to taste",
        "Pav buns"
      ],
      steps: [
        "Boil potatoes, peas, and cauliflower until soft.",
        "Heat butter on tawa and sauté onions until golden.",
        "Add tomatoes and capsicum, cook until soft.",
        "Add pav bhaji masala and salt.",
        "Add boiled vegetables & mash everything well.",
        "Cook until smooth and buttery.",
        "Serve hot with buttered pav."
      ]
    };

    localStorage.setItem("recipes", JSON.stringify([defaultRecipe]));
    recipes = [defaultRecipe];
  }

  return recipes;
}

/* ================================
   SAVE RECIPES
================================ */

function saveRecipes(recipes) {
  localStorage.setItem("recipes", JSON.stringify(recipes));
}

/* ================================
   DISPLAY RECIPE LIST
================================ */

function displayRecipes(searchText = "", filterValue = "") {
  const recipeList = document.getElementById("recipe-list");
  recipeList.innerHTML = "";

  let recipes = loadRecipes();

  // Search filter
  if (searchText) {
    recipes = recipes.filter(r =>
      r.title.toLowerCase().includes(searchText.toLowerCase())
    );
  }

  // Difficulty filter
  if (filterValue) {
    recipes = recipes.filter(r => r.difficulty === filterValue);
  }

  // If no results
  if (recipes.length === 0) {
    recipeList.innerHTML = `<p class="empty">No recipes found.</p>`;
    return;
  }

  // Create cards
  recipes.forEach(recipe => {
    const card = document.createElement("div");
    card.className = "recipe-card";

    card.innerHTML = `
      <h3>${recipe.title}</h3>
      <p>${recipe.description}</p>
      <p class="tag">${recipe.difficulty}</p>
      <button onclick="viewRecipe('${recipe.id}')">View</button>
    `;

    recipeList.appendChild(card);
  });
}

/* ================================
   VIEW SINGLE RECIPE
================================ */

function viewRecipe(id) {
  const recipes = loadRecipes();
  const recipe = recipes.find(r => r.id === id);

  if (!recipe) return;

  localStorage.setItem("activeRecipe", JSON.stringify(recipe));
  window.location.href = "recipe.html";
}

/* ================================
   DISPLAY RECIPE DETAILS
================================ */

function loadRecipeDetail() {
  const recipe = JSON.parse(localStorage.getItem("activeRecipe"));
  if (!recipe) return;

  document.getElementById("title").innerText = recipe.title;
  document.getElementById("description").innerText = recipe.description;
  document.getElementById("difficulty").innerText = recipe.difficulty;

  // Ingredients list
  const ingList = document.getElementById("ingredients");
  recipe.ingredients.forEach(i => {
    const li = document.createElement("li");
    li.textContent = i;
    ingList.appendChild(li);
  });

  // Steps
  const stepList = document.getElementById("steps");
  recipe.steps.forEach(s => {
    const li = document.createElement("li");
    li.textContent = s;
    stepList.appendChild(li);
  });
}

/* ================================
   ADD NEW RECIPE
================================ */

function addRecipe(e) {
  e.preventDefault();

  const title = document.getElementById("new-title").value;
  const description = document.getElementById("new-description").value;
  const difficulty = document.getElementById("new-difficulty").value;
  const ingredients = document
    .getElementById("new-ingredients")
    .value.split("\n")
    .filter(Boolean);
  const steps = document
    .getElementById("new-steps")
    .value.split("\n")
    .filter(Boolean);

  const newRecipe = {
    id: String(Date.now()),
    title,
    description,
    difficulty,
    image: "",
    ingredients,
    steps
  };

  const recipes = loadRecipes();
  recipes.push(newRecipe);
  saveRecipes(recipes);

  window.location.href = "index.html";
}

/* ================================
   DELETE RECIPE
================================ */

function deleteRecipe() {
  const recipe = JSON.parse(localStorage.getItem("activeRecipe"));
  const recipes = loadRecipes().filter(r => r.id !== recipe.id);

  saveRecipes(recipes);
  window.location.href = "index.html";
}

/* ================================
   EDIT RECIPE
================================ */

function loadEditForm() {
  const recipe = JSON.parse(localStorage.getItem("activeRecipe"));
  if (!recipe) return;

  document.getElementById("edit-title").value = recipe.title;
  document.getElementById("edit-description").value = recipe.description;
  document.getElementById("edit-difficulty").value = recipe.difficulty;
  document.getElementById("edit-ingredients").value =
    recipe.ingredients.join("\n");
  document.getElementById("edit-steps").value = recipe.steps.join("\n");
}

function updateRecipe(e) {
  e.preventDefault();

  const recipe = JSON.parse(localStorage.getItem("activeRecipe"));
  const recipes = loadRecipes();

  const updatedRecipe = {
    ...recipe,
    title: document.getElementById("edit-title").value,
    description: document.getElementById("edit-description").value,
    difficulty: document.getElementById("edit-difficulty").value,
    ingredients: document
      .getElementById("edit-ingredients")
      .value.split("\n")
      .filter(Boolean),
    steps: document
      .getElementById("edit-steps")
      .value.split("\n")
      .filter(Boolean)
  };

  const index = recipes.findIndex(r => r.id === recipe.id);
  recipes[index] = updatedRecipe;

  saveRecipes(recipes);
  window.location.href = "index.html";
}

/* ================================
   SEARCH + FILTER HANDLER
================================ */

document.addEventListener("DOMContentLoaded", () => {
  const searchBox = document.getElementById("search");
  const filterSelect = document.getElementById("filter");

  if (searchBox) {
    searchBox.addEventListener("input", () => {
      displayRecipes(searchBox.value, filterSelect.value);
    });
  }

  if (filterSelect) {
    filterSelect.addEventListener("change", () => {
      displayRecipes(searchBox.value, filterSelect.value);
    });
  }

  // Home page render
  if (document.getElementById("recipe-list")) {
    displayRecipes();
  }
});
