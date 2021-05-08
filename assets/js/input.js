//fatimah added foundation tag
$(document).foundation();

// function that receives ingridients
var recipeBulkTest // will delete later, for testing pusposes only
var test //might delete

//variable for reset button 5/8
var refreshButtonEl = $('#reset');

// click handler for search button
var mealIngredients = [];
$('#searchRecipeBtn').click(apiRecipes);

// This function calls the Spoonacular API
function apiRecipes() {
  console.log('worked!')
  //use meal ingredients to build the URL for the Ajax call
  //ajax calls the URL API and gets the info

  $.ajax({
    //use URL above
    url: `https://api.spoonacular.com/recipes/findByIngredients?apiKey=c163ad42a8f44434961017e44052c438&ingredients=tofu&number=4&ranking=1`,
    method: 'GET',
  })
  //response = info gathered from API
    .then(function (response) { // runs if no error happens
      console.log('Ajax Reponse \n-------------');
      console.log(response);
      // call searchedRecipes and give it the response
      searchedRecipes(response);
    })
    .catch(function (error) { // runs if an error happens
      console.log('error:', error);
    });
}

  //pulls picture and title of recipes
  function searchedRecipes(recipesBulk) {
    var recipes = [{
      'picture': recipesBulk[0].image,
      'name': recipesBulk[0].title,
      'recipeId': recipesBulk[0].id
    }]; //array for the images of the searched recipes 
    for (let index = 1; index < recipesBulk.length; index++) {
      recipes.push({
        'picture': recipesBulk[index].image,
        'name': recipesBulk[index].title,
        'recipeId': recipesBulk[index].id
      }); //array for the images of the searched recipes
      console.log(recipes)
    } 
    // $('#searchRecipeBtn').click()
    buildRecipesEl(recipes)
    return recipes
  }
 

  
function recipeInfo(iD) {
  $.ajax({
    url: `https://api.spoonacular.com/recipes/${iD}/information?apiKey=c163ad42a8f44434961017e44052c438`,
    method: 'GET',
  })
    .then(function (response) { // runs if no error happens
      console.log('Ajax Reponse \n-------------');
      console.log(response);
    })
    .catch(function (error) { // runs if an error happens
      console.log('error:', error);
    });
}


//event listener for the add to list btn
$('#clickme').on('click', function () {
  //check how long the mealIngriedents is 
  // If mealIngredients is less than 5 add new food to the array
    // append food item to item list
    // add food item to mealIngredients
  // If mealIngredients is greater than 5 give user feedback alert
  console.log('clicked on "add to list" btn')
  var ingredientInput = $('#ingredientsInput').val();
  $('#ingredientsInput').val('');
  console.log(ingredientInput)
  buildIngredientli(ingredientInput)
})

//function that builds the ingredient list element
function buildIngredientli (ingredient) {
  $('#gap').append(`<div class="callout" data-closable><button class="close-button" aria-label="Close alert" type="button" data-close><span aria-hidden="true">&#10008;</span></button> <p>${ingredient}</p></div>`)
}

//function that builds the recipe elements
function buildRecipesEl (suggestions) {
  for (let index = 0; index < suggestions.length; index++) {
    var containerEl = $('<div>');
    containerEl.addClass('recipe');
    containerEl.attr('id', `result-${index + 1}`)
    var headerEl = $('<h3>');
    var imageEl = $('<img>');
    imageEl.attr('src', suggestions[index].picture);
    imageEl.attr('alt', 'food image')
    headerEl.text(suggestions[index].name)
    containerEl.append(headerEl);
    containerEl.append(imageEl);
    $('#recipe-container').append(containerEl);
    console.log(suggestions)
    $('#recipe-container').children().eq(index).children('img').on('click', function(event) {  //click event for recipes images
      console.log(event.target)
    })
  }
 

}

// function for reset button//
refreshButtonEl.on('click', function () {
  location.reload();
});

// function that stores ingredients in case user refreshes the page
// function that clears all the ingredients


