$( document ).ready(function() {
    getFoods()
    filterFoods()
});

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
    <p class="name">
      ${food.name}
    </p>
    <p class="calories">
      ${food.calories}
    </p>
    <button id="${food.id}" class="delete-food-btn" aria-label="delete">Delete</button>
    `)
};

const filterFoods = () => {
  $("#filter-foods").on("keyup", function() {
    let value = $(this).val().toLowerCase();
    $("#foods-table-index article").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
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

const errorLog = (error) => {
  console.error({ error })
};

$("#create-food-btn").on("click", addNewFood)
$("#foods-table-index").on("click", ".delete-food-btn", deleteFood)
