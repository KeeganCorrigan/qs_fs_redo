$( document ).ready(function() {
    console.log( "ready!" );
    getFoods()
});

const getFoods = () => {
  console.log("in getFoods")
  fetch(`https://fast-meadow-36413.herokuapp.com/api/v1/foods`)
    .then(handleResponse)
    .then(getEachFood)
    .then(errorLog)
};

const postNewFood = (newFoodInfo) => {
  console.log("in postNewFood")

  fetch(`https://rails-quantified-self.herokuapp.com/api/v1/foods`, newFoodPayload(newFoodInfo))
    .then(handleResponse)
    .then(getFoods)
    .then(errorLog)
};

const addNewFood = (event) => {
  event.preventDefault();
  let name = $("#name").val()
  let calories = $("#calories").val()

  console.log("in addNewFood", name)
  console.log("in addNewFood", calories)

  postNewFood({ food: { name: name, calories: calories }})
}

const newFoodPayload = (body) => {
  console.log(body)
  return {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  }
};

const getEachFood = (foods) => {
  console.log("in getEachFoods", foods)
  return foods.forEach((food) => {
    appendFood(food)
  });
};

const appendFood = (food) => {
  console.log("in appendFood", food)
  $('#foods-table-index').append(`
    <article class="food-container">
    <p class="name">
      ${food.name}
    </p>
    <p class="calories">
      ${food.calories}
    </p>
    `)
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
