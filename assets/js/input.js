// function that receives ingridients
var recipeBulkTest // will delete later, for testing pusposes only
var test //might delete
function apiRecipes(iOne, iTwo, iThree) {
  $.ajax({
    url: `https://api.spoonacular.com/recipes/findByIngredients?apiKey=c163ad42a8f44434961017e44052c438&ingredients=${iOne},${iTwo},${iThree}&number=4&ranking=1`,
    method: 'GET',
  })
    .then(function (response) { // runs if no error happens
      console.log('Ajax Reponse \n-------------');
      console.log(response);
      recipeBulkTest = response; // will delete later, for testing pusposes only
      test = searchedRecipes(response);
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
  console.log('clicked on "add to list" btn')
  var ingredientInput = $('#ingredientsInput').val();
  console.log(ingredientInput)
  buildIngredientli(ingredientInput)
})

//function that builds the ingredient list element
function buildIngredientli (ingredient) {
  $('#gap').append(`<div class="callout" data-closable><button class="close-button" aria-label="Close alert" type="button" data-close><span aria-hidden="true">&#10008;</span></button> <p>${ingredient}</p></div>`)
}


// function that stores ingredients in case user refreshes the page
// function that clears all the ingredients


