require('./foods')
require('./diary')

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
  debugger;
  let foodId = event.target.dataset.foodId
  let mealId = event.target.dataset.mealId
  postNewMealFood(foodId, mealId)
}

const postNewMealFood = (foodId, mealId) => {
  fetch(`https://fast-meadow-36413.herokuapp.com/api/v1/meals/${mealId}/foods/${foodId}`, {
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
  fetch(`https://fast-meadow-36413.herokuapp.com/api/v1/meals`)
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
      <article id="meal-container-${meal.id} class="meal-container"">
      <div class="row">
        <div class="col-2">
          <h4 class="meal-name"> ${meal.name} </h4>
        </div>
        <div class="col-2">
        <h5>(${calcCalories(meal.foods)} cal.)</h5>
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
        <h4>Name</h4>
      </div>
      <div class="col-2">
        <h4>Calories</h4>
      </div>
      <div class="col-5">
        <h4>% of meal total</h4>
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

  fetch(`https://fast-meadow-36413.herokuapp.com/api/v1/meals/${mealId}/foods/${foodId}`, {
    method: "DELETE"
  })
  .then(response => deleteValidator(event, response))
}

const appendMealFoods = (food, id, mealCalories) => {
  $('#meals-table-index').append(  `<article class="food-container">
      <div class="row align-items-center">
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
  fetch(`https://fast-meadow-36413.herokuapp.com/api/v1/foods`)
    .then(handleResponse)
    .then(getEachFood)
    .then(errorLog)
};

const postNewFood = (newFoodInfo) => {
  fetch(`https://fast-meadow-36413.herokuapp.com/api/v1/foods`, newFoodPayload(newFoodInfo))
    .then(handleResponse)
    .then(getFoods)
    .then(errorLog)
};

const deleteFood = (event) => {
  let id = event.currentTarget.id
  fetch(`https://fast-meadow-36413.herokuapp.com/api/v1/foods/${id}`, {
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
            <progress max="2000" value="${food.calories}"></progress>
          </p>
        </div>
        <div class="col-3">
          <button id="${food.id}" class="delete-food-btn hand-drawn-button dotted thin" aria-label="delete"><i class="fas fa-trash-alt"></i> Delete </button>
        </div>
      </div>

      <div>
        <div class="row align-items-center">
          <div class="col-3">
            <h4> ADD TO: </h4>
          </div>
          <div class="col-1">
            <button class="hand-drawn-button dotted thin add-to-btn" data-food-id="${food.id}" data-meal-id="1">BR</button>
          </div>
          <div class="col-1">
            <button class="hand-drawn-button dotted thin add-to-btn" data-food-id="${food.id}" data-meal-id="2">LU</button>
          </div>
          <div class="col-1">
            <button class="hand-drawn-button dotted thin add-to-btn" data-food-id="${food.id}" data-meal-id="3">SN</button>
          </div>
          <div class="col-1">
            <button class="hand-drawn-button dotted thin add-to-btn" data-food-id="${food.id}" data-meal-id="4">DI</button>
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

$("#create-food-btn").on("click", addNewFood)
$("#foods-table-index").on("click", ".delete-food-btn", deleteFood)
$("#foods-table-index").on("click", ".add-to-btn", addFoodToMeal)
$("#meals-table-index").on("click", ".remove-from-meal", removeMealFood)
