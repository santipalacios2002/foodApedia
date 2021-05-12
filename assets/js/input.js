//fatimah added foundation tag
$(document).foundation();


var test //might delete

//variable for reset button 5/8
var resetButtonEl = $('#reset');

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
    url: `https://api.spoonacular.com/recipes/findByIngredients?apiKey=7b25b6057a3f4e83b5f38c6173d65341&ingredients=${ingredients}&number=4&ranking=1`,
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


//event listener for the add to list btn
$('#clickme').on('click', function () {
  //check how long the mealIngriedents is
  // If mealIngredients is less than 5 add new food to the array
  if (mealIngredients.length < 5) {
    // check if the ingridientsInput is empty
    if ($('#ingredientsInput').val() == "") {
      // if ingridentsInput is empty then give user feedback alert .... this needs to be changed to modal ''''SAVANNAH
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
    // If mealIngredients is greater than 5 give user feedback alert .... this needs to be changed to modal '''''SAVANNAH
    alert('you can only enter 5 ingredients')
    $('#ingredientsInput').val('');
  }
  console.log(mealIngredients)

})

//clear history
function showClear() {
  if (searchHistoryList.text() !== "") {
      clearHistoryBtn.removeClass("hide");
  }
}


//function that builds the ingredient list element
function buildIngredientli(ingredient) {
  $('#gap').append(`<div class="callout" data-closable><button class="close-button" aria-label="Close alert" type="button" data-close><span class="item ${ingredient}" aria-hidden="true">&#10008;</span></button> <p>${ingredient}</p></div>`)
  //if the 'x' is clicked, this function will get rid of the item in the main mealIngredients array
  $('#gap').on('click','.close-button', function(event){
      var deletedIngredient = event.target.classList[1];
      //if deletedIngredient exists in the mealIngredients then take it out of the mealIngredients array
      console.log(mealIngredients.indexOf(deletedIngredient))
      if (mealIngredients.indexOf(deletedIngredient) > -1) {
        mealIngredients.splice(mealIngredients.indexOf(deletedIngredient), 1);
      }
     });
}

//function that builds the recipe elements
function buildRecipesEl(suggestions) {
  for (let index = 0; index < suggestions.length; index++) {
    var containerEl = $('<div>');
    containerEl.addClass('recipe');
    containerEl.attr('id', `result-${index + 1}`)
    var headerEl = $('<h4>');
    headerEl.attr('style', 'font-family:Courgette, cursive; color:black')
    var imageEl = $('<img>');
    $('img').css('cursor', 'pointer');
    var redirectUrl = './recipe.html'
    
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
      localStorage.setItem("chosenMeal", JSON.stringify(event.target.className));
      localStorage.setItem('responseForBackBtn', JSON.stringify(suggestions));
    
      document.location.assign(redirectUrl)
     
    })
  }
  console.log("these are the suggestions", suggestions)

}



// function for reset button//
resetButtonEl.on('click', function () { //'''''SAVANNAH
  //load the responseForBackBtn information from the most recent search
    //if responseForBackBtn doesn't exist then don't build the information from recent search
  location.reload();
});

//funtion or straight js code that checks if there is some stored recipes  //'''''SAVANNAH
  //if stored recipe exists in sotrage then call the buildRecipesEl
  //if not, then do nothing



