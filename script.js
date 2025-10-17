const apiBase = "https://www.themealdb.com/api/json/v1/1/";
const countrySelect = document.getElementById("countrySelect");
const randomBtn = document.getElementById("randomBtn");
const foodImage = document.getElementById("foodImage");
const foodName = document.getElementById("foodName");
const foodCountry = document.getElementById("foodCountry"); // ✅ added
const ingredientsList = document.getElementById("ingredientsList");
const favBtn = document.getElementById("favBtn");
const videoBtn = document.getElementById("videoBtn");
const favList = document.getElementById("favList");
const popup = document.getElementById("popup");

let currentMeal = null;
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// Load countries
async function loadCountries() {
  const res = await fetch(`${apiBase}list.php?a=list`);
  const data = await res.json();
  data.meals.forEach(m => {
    const option = document.createElement("option");
    option.value = m.strArea;
    option.textContent = m.strArea;
    countrySelect.appendChild(option);
  });
}

// Fetch a random meal
async function getRandomMeal(country = "") {
  let url = country ? `${apiBase}filter.php?a=${country}` : `${apiBase}random.php`;
  const res = await fetch(url);
  const data = await res.json();

  let meal;
  if (country && data.meals) {
    const random = Math.floor(Math.random() * data.meals.length);
    const mealId = data.meals[random].idMeal;
    const mealRes = await fetch(`${apiBase}lookup.php?i=${mealId}`);
    const mealData = await mealRes.json();
    meal = mealData.meals[0];
  } else {
    meal = data.meals[0];
  }

  displayMeal(meal);
}

// Display meal info
function displayMeal(meal) {
  currentMeal = meal;
  foodImage.src = meal.strMealThumb;
  foodName.textContent = meal.strMeal;

  // ✅ Added country name display here
  foodCountry.textContent = `Country: ${meal.strArea}`;

  ingredientsList.innerHTML = "";
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient) {
      const li = document.createElement("li");
      li.textContent = `${ingredient} - ${measure}`;
      ingredientsList.appendChild(li);
    }
  }
}

// Add to favorites
function addFavorite() {
  if (!currentMeal) return;
  const newFav = {
    idMeal: currentMeal.idMeal,
    name: currentMeal.strMeal,
    image: currentMeal.strMealThumb,
  };

  const exists = favorites.some(f => f.idMeal === newFav.idMeal);
  if (!exists) {
    favorites.push(newFav);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    renderFavorites();
  } else {
    alert("This food is already in your favorites!");
  }
}function addFavorite() {
  if (!currentMeal) return;

  const newFav = {
    idMeal: currentMeal.idMeal,
    name: currentMeal.strMeal,
    image: currentMeal.strMealThumb,
  };

  const exists = favorites.some(f => f.idMeal === newFav.idMeal);
  if (!exists) {
    favorites.push(newFav);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    renderFavorites();
    popup.textContent = "⭐ Added to favorites!";
    showPopup();
  } else {
    popup.textContent = "⚠️ This food is already in your favorites!";
    showPopup();
  }
}


// Render favorites
function renderFavorites() {
  favList.innerHTML = "";

  if (favorites.length === 0) {
    favList.innerHTML = "<li>No favorite foods yet!</li>";
    return;
  }

  favorites.forEach((food, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="food-info" data-id="${food.idMeal}">
        <img src="${food.image}" alt="${food.name}" class="fav-img">
        <span>${food.name}</span>
      </div>
      <button class="remove-fav" data-index="${index}">❌</button>
    `;
    favList.appendChild(li);
  });

  document.querySelectorAll(".food-info").forEach(item => {
    item.addEventListener("click", async (e) => {
      const id = e.currentTarget.getAttribute("data-id");
      const res = await fetch(`${apiBase}lookup.php?i=${id}`);
      const data = await res.json();
      displayMeal(data.meals[0]);
    });
  });

  document.querySelectorAll(".remove-fav").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const index = e.target.getAttribute("data-index");
      favorites.splice(index, 1);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      renderFavorites();
    });
  });
}

// Watch video
function watchVideo() {
  if (currentMeal && currentMeal.strYoutube) {
    window.open(currentMeal.strYoutube, "_blank");
  } else {
    showPopup();
  }
}

function watchVideo() {
  if (currentMeal && currentMeal.strYoutube) {
    window.open(currentMeal.strYoutube, "_blank");
  } else {
    popup.textContent = "❌ Video not available for this dish!";
    showPopup();
  }
}


// Event listeners
randomBtn.addEventListener("click", () => {
  const country = countrySelect.value;
  getRandomMeal(country);
});

favBtn.addEventListener("click", addFavorite);
videoBtn.addEventListener("click", watchVideo);

// Initial setup
loadCountries();
renderFavorites();

// === Background Particle Animation ===
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
canvas.style.position = 'fixed';
canvas.style.top = 0;
canvas.style.left = 0;
canvas.style.width = '100%';
canvas.style.height = '100%';
canvas.style.zIndex = 0;
canvas.style.pointerEvents = 'none';
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const particles = [];
const numParticles = 100;
for (let i = 0; i < numParticles; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 3 + 1,
    dx: (Math.random() - 0.5) * 0.5,
    dy: (Math.random() - 0.5) * 0.5,
    alpha: Math.random() * 0.7 + 0.3
  });
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0, 191, 255, ${p.alpha})`;
    ctx.fill();
    p.x += p.dx;
    p.y += p.dy;

    if (p.x < 0) p.x = canvas.width;
    if (p.x > canvas.width) p.x = 0;
    if (p.y < 0) p.y = canvas.height;
    if (p.y > canvas.height) p.y = 0;
  });
  requestAnimationFrame(animate);
}
animate();

function showPopup() {
  popup.style.display = "block";

  // Restart animation
  popup.style.animation = "none";
  // Trigger reflow to restart
  void popup.offsetWidth;
  popup.style.animation = "fade 3s ease";

  // Hide after 3 seconds
  setTimeout(() => {
    popup.style.display = "none";
  }, 3000);
}
