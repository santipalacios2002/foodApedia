// function that receives ingridients
var recipeBulkTest // will delete later, for testing pusposes only
function apiRecipes(iOne, iTwo, iThree) {
  $.ajax({
    url: `https://api.spoonacular.com/recipes/findByIngredients?apiKey=c163ad42a8f44434961017e44052c438&ingredients=${iOne},${iTwo},${iThree}&number=4&ranking=1`,
    method: 'GET',
  })
    .then(function (response) { // runs if no error happens
      console.log('Ajax Reponse \n-------------');
      console.log(response);
      recipeBulkTest = response; // will delete later, for testing pusposes only
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
    'name': recipesBulk[0].title
  }]; //array for the images of the searched recipes 
  for (let index = 1; index < recipesBulk.length; index++) {
    recipes.push({
      'picture': recipesBulk[index].image,
      'name': recipesBulk[index].title
    }); //array for the images of the searched recipes
    console.log(recipes)
  }
}





// function that stores ingredients in case user refreshes the page
// function that clears all the ingredients


