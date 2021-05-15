//fatimah added foundation tag
$(document).foundation();

//variable for reset button 5/8
var resetButtonEl = $('#reset');
// click handler for search button
var mealIngredients = [];
var result = 1;

//added click action on ingredient input
$('#ingredientsInput').on('keyup', function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    $('#clickme').click();
   }
});

//When user adds an ingredient event listener for the "add to list" btn
$('#clickme').on('click', function () {
  //check how long the mealIngriedents is
  // If mealIngredients is less than 5 add new food to the array
  if (mealIngredients.length < 5) {
    // check if the ingridientsInput is empty
    if ($('#ingredientsInput').val() == "") {
      // if ingridentsInput is empty then give user feedback modal
      $('#addListItems').foundation('open');
      return ;
    }
    // append food item to item list
    var ingredientInput = $('#ingredientsInput').val();
    buildIngredientli(ingredientInput)
    // add food item to mealIngredients global array
    mealIngredients.push($('#ingredientsInput').val())
    //resets the placeholder for the ingredient input
    $('#ingredientsInput').val('');
  } else {
    // If mealIngredients is greater than 5 give user feedback modal
    $('#fiveIngredients').foundation('open');
    $('#ingredientsInput').val('');
  }
})

//function that builds the ingredient element
function buildIngredientli(ingredient) {
  $('#gap').append(`<div class="callout" data-closable><button class="close-button" aria-label="Close alert" type="button" data-close><span class="item ${ingredient}" aria-hidden="true">&#10008;</span></button> <p>${ingredient}</p></div>`)
  //if the 'x' is clicked, this function will get rid of the item in the main mealIngredients array
  $('#gap').on('click', '.close-button', function (event) {
    var deletedIngredient = event.target.classList[1];
    //if deletedIngredient exists in the mealIngredients then take it out of the mealIngredients array
    if (mealIngredients.indexOf(deletedIngredient) > -1) {
      mealIngredients.splice(mealIngredients.indexOf(deletedIngredient), 1);
    }
  });
}

//click event that will trigger when you click on "search for recipe ideas"
$('#searchRecipeBtn').click(apiRecipes);

// This function calls the Spoonacular API
function apiRecipes() {
  if (mealIngredients.length === 0) {
    $('#addListItems').foundation('open');
    return
  } 
  if ($('#recipe-container').children().length !== 0) {
    $('#resetEverything').foundation('open');
    return
  }
  $('.hidden-container').attr('hidden', false)
  //initialize string of ingredients to be used on API
  var ingredients = '';
  //use mealIngredients to build string to be used for ingredients for the Ajax call
  for (let index = 0; index < mealIngredients.length; index++) {
    ingredients = ingredients.concat(`${mealIngredients[index]},`);
  }
  //ajax calls the URL API and gets the info//
  $.ajax({
    //use URL with mealIngredients from above
    url: `https://api.spoonacular.com/recipes/findByIngredients?apiKey=11f04c6602d54085bb3e661530e37699&ingredients=${ingredients}&number=4&ranking=1`,
    method: 'GET',
  })
    //response = info gathered from API
    .then(function (response) { // runs if no error happens
      // call searchedRecipes and give it the response
      searchedRecipes(response);
    })
    .catch(function (error) { // runs if an error happens
    });
}

//pulls picture, title and ID of recipes
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
    localStorage.setItem("recipes", JSON.stringify(recipes))
  }
  for (let index = 0; index < recipes.length; index++) {
    recipeInfo(recipes[index].recipeId)
  }

  return recipes
}

function recipeInfo(iD) {
  $.ajax({
    url: `https://api.spoonacular.com/recipes/${iD}/information?apiKey=11f04c6602d54085bb3e661530e37699`,
    method: 'GET',
  })
    .then(function (response) { // runs if no error happens
      localStorage.setItem(`${iD}`, JSON.stringify(response));
      buildRecipes(`${iD}`)
      buildChosenRecipeModal(`${iD}`)
    })
    .catch(function (error) { // runs if an error happens
    });
}

//event listener when "Lets begin" button is pressed and user gets redirected to the input page
$('#back').on('click', function () {
  document.location.replace(redirectUrl)
})

//function that builds the recipe elements for the modal to be called
function buildRecipes(id) {
  var containerEl = $('<div>');
  containerEl.addClass('recipe');
  containerEl.attr('id', `result${id}`)
  var headerEl = $('<h4>');
  headerEl.attr('style', 'font-family:Courgette, cursive; color:black')
  var imageEl = $('<img>');
  $('img').css('cursor', 'pointer');
  imageEl.attr('src', JSON.parse(localStorage.getItem(id)).image);
  imageEl.attr('alt', 'food image')
  imageEl.attr('data-open', `result${result}`) //added for modal
  headerEl.text(JSON.parse(localStorage.getItem(id)).title)
  containerEl.append(headerEl);
  containerEl.append(imageEl);
  $('#recipe-container').append(containerEl);
}

//funciton that builds the info of the actual chosen recipe
function buildChosenRecipeModal(localStoredID) {
  var containerEl = $('<div>');
  var headerEl = $('<h4>');
  headerEl.attr('style', 'font-family: Courgette, cursive; text-decoration: underline; color: black; background-color:none ; display: grid; width:100%; justify-content: center;')
  var ulEl = $('<ul>');
  var imageEl = $('<img>');
  imageEl.attr('style', ' -webkit-transform: none;-ms-transform: none;transform: none;transition: none;')
  imageEl.attr('src', JSON.parse(localStorage.getItem(localStoredID)).image);
  imageEl.attr('alt', 'food image');
  headerEl.text(JSON.parse(localStorage.getItem(localStoredID)).title);
  var header2El = $('<h4>Instructions</h4>');
  header2El.attr('style', 'color: black ; display: grid; width:100%');
  containerEl.append(headerEl);
  containerEl.append(imageEl);
  containerEl.append(ulEl);
  containerEl.append(header2El);
  for (let index = 0; index < JSON.parse(localStorage.getItem(localStoredID)).extendedIngredients.length; index++) {
    var ingredientsliEl = $('<li>')
    ingredientsliEl.attr('style', 'color: black;  ; font-size:30px; display: grid; width:100%;')
    ingredientsliEl.text(JSON.parse(localStorage.getItem(localStoredID)).extendedIngredients[index].original)
    ulEl.append(ingredientsliEl)
  }
  var ulInstructionsEl = $('<ul>');
  if (JSON.parse(localStorage.getItem(localStoredID)).analyzedInstructions[0].steps.length === 0 ) {
    var ingredientsliEl = $('<li>')
    var anchor = $('<a>')
    ingredientsliEl.attr('style', 'color: black ; display: grid; width:100%')
    ingredientsliEl.text(`For more information, please visit: `)
    ingredientsliEl.append(anchor)
    anchor.text('This website')
    anchor.attr('href', `${JSON.parse(localStorage.getItem(localStoredID)).sourceUrl}`)
    anchor.attr('target', '_blank')
    ulInstructionsEl.append(ingredientsliEl)
  } else {
    for (let index = 0; index < JSON.parse(localStorage.getItem(localStoredID)).analyzedInstructions[0].steps.length; index++) {
      var ingredientsliEl = $('<li>')
      ingredientsliEl.attr('style', 'color: black ; display: grid; width:100%')
      ingredientsliEl.text(`${JSON.parse(localStorage.getItem(localStoredID)).analyzedInstructions[0].steps[index].number}. ${JSON.parse(localStorage.getItem(localStoredID)).analyzedInstructions[0].steps[index].step}`)
      ulInstructionsEl.append(ingredientsliEl)
    }
  }
  containerEl.append(ulInstructionsEl);
    $(`#result${result}`).append(containerEl)
    result++;
  }

  // function for reset button//
  resetButtonEl.on('click', function () {
    localStorage.clear();
    location.reload();
  });

//function that prints the recipe
function printDiv(recipeChosen) {
  var divContents = document.getElementById(recipeChosen).innerHTML;
  var a = window.open('', '', 'height=800, width=800');
  a.document.write('<html>');
  a.document.write('<body ><br>');
  a.document.write(divContents);
  a.document.write('</body></html>');
  a.document.close();
  a.print();
}
