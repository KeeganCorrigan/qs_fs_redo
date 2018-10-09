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
