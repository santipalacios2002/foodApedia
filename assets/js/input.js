//fatimah added foundation tag
$(document).foundation();


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
  var ingredients = '';
  console.log(mealIngredients)
  for (let index = 0; index < mealIngredients.length; index++) {
    ingredients = ingredients.concat(`${mealIngredients[index]},`);

  }
  //ajax calls the URL API and gets the info
  $.ajax({
    //use URL with mealIngredients from above
    url: `https://api.spoonacular.com/recipes/findByIngredients?apiKey=b932102ca6a844bea90867914818585c&ingredients=${ingredients}&number=4&ranking=1`,
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
  buildRecipesEl(recipes)
  return recipes
}


//function that returns recipe information for the actual recipe details 
function recipeInfo(iD) {
  $.ajax({
    url: `https://api.spoonacular.com/recipes/${iD}/information?apiKey=b932102ca6a844bea90867914818585c`,
    method: 'GET',
  })
    .then(function (response) { // runs if no error happens
      console.log('Ajax Reponse \n-------------');
      console.log(response);
      buildChosenRecipeEl(response)
    })
    .catch(function (error) { // runs if an error happens
      console.log('error:', error);
    });
}


//event listener for the add to list btn
$('#clickme').on('click', function () {
  //check how long the mealIngriedents is
  // If mealIngredients is less than 5 add new food to the array
  if (mealIngredients.length < 5) {
    // check if the ingridientsInput is empty
    if ($('#ingredientsInput').val() == "") {
      // if ingridentsInput is empty then give user feedback alert
      alert('please enter the ingredient')
      return;
    }
    // append food item to item list
    var ingredientInput = $('#ingredientsInput').val();
    buildIngredientli(ingredientInput)
    // add food item to mealIngredients
    mealIngredients.push($('#ingredientsInput').val())
    $('#ingredientsInput').val('');
  } else {
    // If mealIngredients is greater than 5 give user feedback alert
    alert('you can only enter 5 ingredients')
    $('#ingredientsInput').val('');
  }
  console.log(mealIngredients)

})

//function that builds the ingredient list element
function buildIngredientli(ingredient) {
  $('#gap').append(`<div class="callout" data-closable><button class="close-button" aria-label="Close alert" type="button" data-close><span class="item" aria-hidden="true">&#10008;</span></button> <p>${ingredient}</p></div>`)

}


//function that builds the recipe elements
function buildRecipesEl(suggestions) {
  for (let index = 0; index < suggestions.length; index++) {
    var containerEl = $('<div>');
    containerEl.addClass('recipe');
    containerEl.attr('id', `result-${index + 1}`)
    var headerEl = $('<h4>');
    headerEl.attr('style', 'font-family:Courgette, cursive; color:beige')
    var imageEl = $('<img>');
    
    // imageEl.attr('style', 'border: 3px solid black; box-shadow: 10px 10px 10px black; display: grid; gap:30px')
    imageEl.attr('src', suggestions[index].picture);
    imageEl.attr('alt', 'food image')
    imageEl.attr('class', suggestions[index].recipeId)
    headerEl.text(suggestions[index].name)
    containerEl.append(headerEl);
    containerEl.append(imageEl);
    $('#recipe-container').append(containerEl);
    $('#recipe-container').children().eq(index).children('img').on('click', function (event) {  //click event for recipes images
      //at the click of the event target, application will take you to the detailed recipe
      //by extracting the recipe ID and using it in the next API call
      console.log("this is the event target name", event.target.className)
      recipeInfo(event.target.className)
    })
  }
  console.log("these are the suggestions", suggestions)


}


//funciton that builds the info of the actual chosen recipe (we might put this in a new page):
function buildChosenRecipeEl(detailedRecipe) {
  var containerEl = $('<div>');
  containerEl.attr('class', 'instructions');
  var headerEl = $('<h4>');
  headerEl.attr('style', 'color: black; background: beige; display: grid')
  var ulEl = $('<ul>');
  headerEl.text(detailedRecipe.title);
  containerEl.append(headerEl);
  containerEl.append(ulEl);
  for (let index = 0; index < detailedRecipe.extendedIngredients.length; index++) {
    var ingredientsliEl = $('<li>')
    ingredientsliEl.attr('style', 'color: black; background: beige; display: grid')
    ingredientsliEl.text(detailedRecipe.extendedIngredients[index].original)
    ulEl.append(ingredientsliEl)
  }
  buildinstructions(detailedRecipe.id);
  // $('#recipe').append(containerEl)
  $(containerEl).insertBefore('footer')
 }

function buildinstructions(id) {
  $.ajax({
    url: `https://api.spoonacular.com/recipes/${id}/analyzedInstructions?apiKey=b932102ca6a844bea90867914818585c`,
    method: 'GET',
  })
  .then(function (response) { // runs if no error happens
    console.log('Ajax Reponse steps broken down\n-------------');
    console.log(response);
    var header2El = $('<h4>Instructions</h4>');
    header2El.attr('style', 'color: black; background: beige; display: grid');
    $('.instructions').append(header2El);
    if (response.length === 0) {
      console.log('it has no instructions')
    } else {
      var ulEl = $('<ul>');
      $('.instructions').append(ulEl);
      for (let index = 0; index < response[0].steps.length; index++) {
        var ingredientsliEl = $('<li>')
        ingredientsliEl.attr('style', 'color: black; background: beige; display: grid')
        ingredientsliEl.text(`${response[0].steps[index].number}. ${response[0].steps[index].step}`)
        ulEl.append(ingredientsliEl)
      }
    }
  })
  .catch(function (error) { // runs if an error happens
    console.log('error:', error);
  });
}



// function for reset button//
refreshButtonEl.on('click', function () {
  location.reload();
});

// function that stores ingredients in case user refreshes the page
// function that clears all the ingredients


//just a reminder we have a bug, if they x it out