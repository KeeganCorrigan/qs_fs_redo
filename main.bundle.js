/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

	"use strict";

	$(document).ready(function () {
	  getFoods();
	  filterFoods();
	  getMeals();
	});

	var getMeals = function getMeals() {
	  fetch("https://fast-meadow-36413.herokuapp.com/api/v1/meals").then(handleResponse).then(getEachMeal).then(errorLog);
	};

	var getEachMeal = function getEachMeal(meals) {
	  return meals.forEach(function (meal) {
	    appendMeal(meal);
	  });
	};

	var appendMeal = function appendMeal(meal) {
	  console.log("inside appendMeal", meal);
	  console.log("inside AppendMeal", meal.foods);
	  $('#meals-table-index').append("\n    <article id=\"meal-container-" + meal.id + "\">\n    <p class=\"name\">\n      " + meal.name + "\n\n    </p>").append(addMealFoods(meal.foods, meal.id));
	};

	var addMealFoods = function addMealFoods(foods, id) {
	  return foods.forEach(function (food) {
	    appendMealFoods(food, id);
	  });
	};

	var appendMealFoods = function appendMealFoods(food, id) {
	  $('#meals-table-index').append("\n    <article class=\"food-container\">\n    <p class=\"name\">\n      " + food.name + "\n    </p>\n    <p class=\"calories\">\n      " + food.calories + "\n    </p>\n    ");
	};

	var getFoods = function getFoods() {
	  fetch("https://fast-meadow-36413.herokuapp.com/api/v1/foods").then(handleResponse).then(getEachFood).then(errorLog);
	};

	var postNewFood = function postNewFood(newFoodInfo) {
	  fetch("https://fast-meadow-36413.herokuapp.com/api/v1/foods", newFoodPayload(newFoodInfo)).then(handleResponse).then(getFoods).then(errorLog);
	};

	var deleteFood = function deleteFood(event) {
	  var id = event.currentTarget.id;
	  fetch("https://fast-meadow-36413.herokuapp.com/api/v1/foods/" + id, {
	    method: "DELETE"
	  }).then(function (response) {
	    return deleteValidator(event, response);
	  });
	};

	var deleteValidator = function deleteValidator(event, response) {
	  if (response.ok) {
	    $("#foods-table-index").empty();
	    getFoods();
	  }
	};

	var addNewFood = function addNewFood(event) {
	  event.preventDefault();
	  var name = $("#name").val();
	  var calories = $("#calories").val();
	  postNewFood({ food: { name: name, calories: calories } });
	};

	var newFoodPayload = function newFoodPayload(body) {
	  return {
	    method: "POST",
	    headers: { "Content-Type": "application/json" },
	    body: JSON.stringify(body)
	  };
	};

	var getEachFood = function getEachFood(foods) {
	  return foods.forEach(function (food) {
	    appendFood(food);
	  });
	};

	var appendFood = function appendFood(food) {
	  $('#foods-table-index').append("\n    <article class=\"food-container\">\n    <p class=\"name\">\n      " + food.name + "\n    </p>\n    <p class=\"calories\">\n      " + food.calories + "\n    </p>\n    <button id=\"" + food.id + "\" class=\"delete-food-btn\" aria-label=\"delete\">Delete</button>\n    ");
	};

	var filterFoods = function filterFoods() {
	  $("#filter-foods").on("keyup", function () {
	    var value = $(this).val().toLowerCase();
	    $("#foods-table-index article").filter(function () {
	      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
	    });
	  });
	};

	var handleResponse = function handleResponse(response) {
	  return response.json().then(function (json) {
	    if (!response.ok) {
	      var error = {
	        status: response.status,
	        statusText: response.statusText,
	        json: json
	      };
	      return Promise.reject(error);
	    }
	    return json;
	  });
	};

	var errorLog = function errorLog(error) {
	  console.error({ error: error });
	};

	$("#create-food-btn").on("click", addNewFood);
	$("#foods-table-index").on("click", ".delete-food-btn", deleteFood);

/***/ })
/******/ ]);