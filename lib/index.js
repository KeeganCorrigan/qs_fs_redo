require('./foods')

import 'bootstrap/dist/css/bootstrap.css';

$(document).ready(function() {
    getFoods()
    getMeals()
    filterFoods()
    toggleFoodCreateMenu()
    totalCalories()
});

const toggleFoodCreateMenu = () => {
  $('#toggle-food-menu').click(function() {
    $('#create-food-form').slideToggle("slow");
  });
}

const addFoodToMeal = (event) => {
  event.preventDefault();
  let foodId = event.target.dataset.foodId
  let mealId = event.target.dataset.mealId
  postNewMealFood(foodId, mealId)
}

const postNewMealFood = (foodId, mealId) => {
  fetch(`https://warm-cove-85701.herokuapp.com/api/v1/meals/${mealId}/foods/${foodId}`, {
    method: "POST"
  })
  .then(response => mealFoodValidator(event, response))
};

const mealFoodValidator = (event, response) => {
  if (response.ok) {
    $("#meals-table-index").empty()
    getMeals()
    totalCalories()
  }
}

const getMeals = () => {
  fetch(`https://warm-cove-85701.herokuapp.com/api/v1/meals`)
    .then(handleResponse)
    .then(getEachMeal)
    .then(errorLog)
};

const getEachMeal = (meals) => {
  totalCalories(meals)
  return meals.forEach((meal) => {
    appendMeal(meal)
  });
};

const renderMealProgressBar = (mealName) => {
  if (mealName.toLowerCase() === "breakfast") {
    return 500
  } else if (mealName.toLowerCase() === "snack") {
    return 300
  } else if (mealName.toLowerCase() === "lunch") {
    return 600
  } else if (mealName.toLowerCase() === "dinner") {
    return 600
  }
}

const appendMeal = (meal) => {
  let mealCalories = renderMealProgressBar(meal.name)

  $('#meals-table-index').append(`
      <article id="meal-container-${meal.id} class="meal-container">
      <div class="row meal-row align-items-center">
        <div class="col-2">
          <h4 class="meal-name"> ${meal.name} </h4>
        </div>
        <div class="col-2">
        <h5 class="mealfoods-calories-heading">(${calcCalories(meal.foods)} cal.)</h5>
        </div>
        <div class="col-4">
          <progress max="${mealCalories}" value="${calcCalories(meal.foods)}"> </progress>
          <span class="total-calories">
        </div>
        <div class="col-3">
          <h5>(% PLANNED)</h5>
        </div>
      </div>
    </article>
    <div class="row">
      <div class="col-3">
        <h4>Food</h4>
      </div>
      <div class="col-2">
        <h4>Calories</h4>
      </div>
      <div class="col-5">
        <h4>% of meal</h4>
      </div>
    </div>
      `).append(addMealFoods(meal.foods, meal.id, mealCalories))
};

const calcCalories = (foods) => {
  const collectCalories = foods.map ( food => food.calories )
  const sumCalories = collectCalories.reduce((a, b) => a + b, 0);
  return sumCalories
}

const totalCalories = (meals) => {
  if (meals) {
    let foods = Array.from(meals, meal => meal.foods).flat()
    let totalCalories = calcCalories(foods)

    renderTotalCalories(totalCalories)
  }
}

const renderTotalCalories = (totalCalories) => {
  $('#total-calories').html(`<h2><i class="fas fa-cookie-bite"></i> Total planned calories: ${totalCalories}</h2>`)
}

const addMealFoods = (foods, id, mealCalories) => {
  return foods.forEach((food) => {
    appendMealFoods(food, id, mealCalories)
  });
}

const removeMealFood = (event) => {
  let foodId = event.target.dataset.foodId
  let mealId = event.target.dataset.mealId

  fetch(`https://warm-cove-85701.herokuapp.com/api/v1/meals/${mealId}/foods/${foodId}`, {
    method: "DELETE"
  })
  .then(response => deleteValidator(event, response))
}

const appendMealFoods = (food, id, mealCalories) => {
  $('#meals-table-index').append(  `<article class="food-container">
      <div class="row align-items-center mealfoods-item">
        <div class="col-3">
          <p class="name">
          ${food.name}
          </p>
        </div>
        <div class="col-2">
          <p class="calories">
          ${food.calories}
          </p>
        </div>
        <div class="col-4">
          <p class="calories">
            <progress max="${mealCalories}" value="${food.calories}"></progress>
          </p>
        </div>
        <div class="col-3">
          <button type="button" class="remove-from-meal hand-drawn-button dotted thin" aria-label="delete" data-food-id="${food.id}" data-meal-id="${id}"><i class="fas fa-backspace"></i> Remove</button>
        </div>
      </div>`)
};

const getFoods = () => {
  $("#foods-table-index").empty()
  fetch(`https://warm-cove-85701.herokuapp.com/api/v1/foods`)
    .then(handleResponse)
    .then(getEachFood)
    .then(errorLog)
};

const postNewFood = (newFoodInfo) => {
  fetch(`https://warm-cove-85701.herokuapp.com/api/v1/foods`, newFoodPayload(newFoodInfo))
    .then(handleResponse)
    .then(getFoods)
    .then(errorLog)
};

const deleteFood = (event) => {
  let id = event.currentTarget.id
  fetch(`https://warm-cove-85701.herokuapp.com/api/v1/foods/${id}`, {
    method: "DELETE"
  })
  .then(response => deleteValidator(event, response))
};

const deleteValidator = (event, response) => {
  if (response.ok) {
    $("#foods-table-index").empty()
    $("#meals-table-index").empty()
    getMeals()
    getFoods()
  }
}

const addNewFood = (event) => {
  event.preventDefault();
  let name = $("#name").val()
  let calories = $("#calories").val()

  $('#create-food-form').slideToggle("slow");
  clearNewFood();
  postNewFood({ food: { name: name, calories: calories }})
};

const postRecipeToFood = (event) => {
  event.preventDefault();

  let name = event.currentTarget.dataset.foodName
  let calories = event.currentTarget.dataset.calories

  $(event.currentTarget).toggle()

  clearNewFood();
  postNewFood({ food: { name: name, calories: calories }})
}

const newFoodPayload = (body) => {
  return {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  }
};

const getEachFood = (foods) => {
  return foods.forEach((food) => {
    appendFood(food)
  });
};

const appendFood = (food) => {
  $('#foods-table-index').append(`
    <article class="food-container">
      <div class="row align-items-center">
        <div class="col-2">
          <p class="name">
          ${food.name}
          </p>
        </div>
        <div class="col-2">
          <p class="calories">
          ${food.calories}
          </p>
        </div>
        <div class="col-4">
          <p class="calories">
            <progress max="2000" value="${food.calories}"></progress>
          </p>
        </div>
        <div class="col-2">
          <button id="${food.id}" class="delete-food-btn hand-drawn-button dotted thin" aria-label="delete"><i class="fas fa-trash-alt"></i> Delete </button>
        </div>
        <div class="col-2">
          <button id="${food.name}" data-calories="${food.calories}" class="add-recipe-btn hand-drawn-button dotted thin" aria-label="recipe">Add to Recipe</button>
        </div>
      </div>

      <div>
        <div class="row align-items-center">
          <div class="col-1">
            <h4><i class="fas fa-plus"></i></h4>
          </div>
          <div class="col-11">
            <button class="hand-drawn-button dotted thin add-to-btn" data-food-id="${food.id}" data-meal-id="1">Breakfast</button>

            <button class="hand-drawn-button dotted thin add-to-btn" data-food-id="${food.id}" data-meal-id="2">Lunch</button>

            <button class="hand-drawn-button dotted thin add-to-btn" data-food-id="${food.id}" data-meal-id="3">Snack</button>

            <button class="hand-drawn-button dotted thin add-to-btn" data-food-id="${food.id}" data-meal-id="4">Dinner</button>
          </div>
        </div>
      </div>
      `)
};

const filterFoods = () => {
  $("#filter-foods").on("keyup", function() {
    let value = $(this).val().toLowerCase();
    $("#foods-table-index article").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1 )
    });
  });
};

const handleResponse = (response) => {
  return response.json()
    .then((json) => {
      if (!response.ok) {
        const error = {
          status: response.status,
          statusText: response.statusText,
          json
        };
        return Promise.reject(error)
      }
      return json
    })
};

const clearNewFood = () => {
  $("#name").val("")
  $("#calories").val("")
}

const errorLog = (error) => {
  console.error({ error })
};

let foodsForRecipes = []
let foodForRecipesCalories = 0

const buildRecipeArray = (event) => {
  if (foodsForRecipes.length < 5) {
    foodsForRecipes.push(event.currentTarget.id)
    foodForRecipesCalories += parseInt(event.currentTarget.dataset.calories)
    $('#food-recipe-amount').html(`<p class="hand-drawn-button dotted thin recipe-number ">  ${foodsForRecipes.length}      <p>`)
  }

  if (foodsForRecipes.length == 1) {
    $(".clear-recipe-btn").toggle()
  }

  if (foodsForRecipes.length == 5) {
    $('.add-recipe-btn').attr('disabled', true)
    $('.add-recipe-btn').addClass('disabled-btn')
    $('.add-recipe-btn').html('<i class="fas fa-ban"></i>')
  }
};

const buildRecipePath = () => {
  return foodsForRecipes.map(food => "&allowedIngredient[]=" + food.replace(/\s/g, '')).join('')
}

const getRecipes = (event) => {
 const recipePath = buildRecipePath()
 $('#recipes-table-index').empty()
 fetch(`https://api.yummly.com/v1/api/recipes?_app_id=9fa7654f&_app_key=025d8edd63531b17ec8390e1b7a92fc5${recipePath}`)
    .then(response => response.json())
    .then(response => appendRecipes(response.matches))
}

const generateRecipe = (event) => {
  buildRecipeArray(event)
  getRecipes(event)
}

const clearRecipes = () => {
  foodsForRecipes = []
  foodForRecipesCalories = 0
  $(".clear-recipe-btn").toggle()
  $('.add-recipe-btn').attr('disabled', false)
  $('.add-recipe-btn').removeClass('disabled-btn')
  $('.add-recipe-btn').html('Add to Recipe')
  $('#food-recipe-amount').empty()
  $('#recipes-table-index').empty()
}

const appendRecipes = (recipes) => {
  return recipes.slice(0, 5).forEach((recipe) => {
    appendRecipe(recipe)
  });
}

const appendRecipe = (recipe) => {
  $('#recipes-table-index').append(`
    <div class="card recipe-container">
      <img class="card-img-top" src="${recipe.imageUrlsBySize[90]}" alt="Card image cap">
      <div class="card-body">
        <h5 class="card-title recipe-name">Recipe Name</h5>
        <p class="card-text">${recipe.recipeName}</p>
        <a href="https://yummly.com/recipe/${recipe.id}" class="hand-drawn-button dotted thin">View Recipe</a>
        <button class="hand-drawn-button dotted thin add-recipe-to-food-btn" data-food-name="${recipe.recipeName}" data-calories="${foodForRecipesCalories}">Add Food</button>
      </div>
    </div>
    `)
}

$("#recipes-table-index").on("click", ".add-recipe-to-food-btn", postRecipeToFood)
$(".navbar").on("click", "#clear-recipe-btn", clearRecipes)
$("#create-food-btn").on("click", addNewFood)
$("#foods-table-index").on("click", ".add-recipe-btn", generateRecipe)
$("#foods-table-index").on("click", ".delete-food-btn", deleteFood)
$("#foods-table-index").on("click", ".add-to-btn", addFoodToMeal)
$("#meals-table-index").on("click", ".remove-from-meal", removeMealFood)
