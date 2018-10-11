require('./foods')
require('./diary')
import 'bootstrap/dist/css/bootstrap.css';

$( document ).ready(function() {
    getFoods()
    filterFoods()
    getMeals()
    toggleFoodCreateMenu()
});

const toggleFoodCreateMenu = () => {
  $('#toggle-food-menu').click(function() {
    $('#create-food-form').slideToggle("slow");
  });
}

const getMeals = () => {
  fetch(`https://fast-meadow-36413.herokuapp.com/api/v1/meals`)
    .then(handleResponse)
    .then(getEachMeal)
    .then(errorLog)
};

const getEachMeal = (meals) => {
  return meals.forEach((meal) => {
    appendMeal(meal)
  });
};

const appendMeal = (meal) => {
  console.log("inside appendMeal", meal)
  console.log("inside AppendMeal", meal.foods)

  $('#meals-table-index').append(`
    <article id="meal-container-${meal.id}">
    <p class="meal-name">
      ${meal.name}
    </p>
    <p class="total-calories">
      total: ${calcCalories(meal.foods)}
    </p>
    `).append(addMealFoods(meal.foods, meal.id))
};

const calcCalories = (foods) => {
  const collectCalories = foods.map ( food => food.calories )
  const sumCalories = collectCalories.reduce((a, b) => a + b, 0);
  return sumCalories
}

const addMealFoods = (foods, id) => {
  return foods.forEach((food) => {
    appendMealFoods(food, id)
  });
}

const appendMealFoods = (food, id) => {
  $('#meals-table-index').append(`
    <article class="food-container">
    <p class="name">
      ${food.name}
    </p>
    <p class="calories">
      ${food.calories}
    </p>
    `)
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
        <div class="col-2">
          <p class="name">
          ${food.name}
          </p>
        </div>
        <div class="col-1">
          <p class="calories">
          ${food.calories}
          </p>
        </div>
        <div class="col-2">
          <p class="calories">
            <progress max="2000" value="${food.calories}"></progress>
          </p>
        </div>
        <div class="col-3">
          <button id="${food.id}" class="delete-food-btn hand-drawn-button dotted thin" aria-label="delete"><i class="fas fa-trash-alt"></i></button>
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
