//fatimah added foundation tag
$(document).foundation();

//variable for reset button 5/8
var resetButtonEl = $('#reset');
// click handler for search button
var mealIngredients = [];
var result = 1;

//When user adds an ingredient event listener for the "add to list" btn
$('#clickme').on('click', function () {
  //check how long the mealIngriedents is
  // If mealIngredients is less than 5 add new food to the array
  if (mealIngredients.length < 5) {
    // check if the ingridientsInput is empty
    if ($('#ingredientsInput').val() == "") {
      // if ingridentsInput is empty then give user feedback alert .... this needs to be changed to modal ''''SAVANNAH
      $('#addListItems').foundation('open');

      // alert('please enter the ingredient')
      return ;
    }
    // append food item to item list
    
    var ingredientInput = $('#ingredientsInput').val();
    buildIngredientli(ingredientInput)
    // add food item to mealIngredients gloabal array
    mealIngredients.push($('#ingredientsInput').val())
    //resets the placeholder for the ingredient input
    $('#ingredientsInput').val('');
  } else {
    // If mealIngredients is greater than 5 give user feedback alert .... this needs to be changed to modal '''''SAVANNAH
    $('#fiveIngredients').foundation('open');
    $('#ingredientsInput').val('');
  }
  console.log(mealIngredients)
})

//function that builds the ingredient element
function buildIngredientli(ingredient) {
  $('#gap').append(`<div class="callout" data-closable><button class="close-button" aria-label="Close alert" type="button" data-close><span class="item ${ingredient}" aria-hidden="true">&#10008;</span></button> <p>${ingredient}</p></div>`)
  //if the 'x' is clicked, this function will get rid of the item in the main mealIngredients array
  $('#gap').on('click', '.close-button', function (event) {
    var deletedIngredient = event.target.classList[1];
    //if deletedIngredient exists in the mealIngredients then take it out of the mealIngredients array
    console.log(mealIngredients.indexOf(deletedIngredient))
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
  console.log('worked!')
  //initialize string of ingredients to be used on API
  var ingredients = '';
  console.log(mealIngredients)
  //use mealIngredients to build string to be used for ingredients for the Ajax call
  for (let index = 0; index < mealIngredients.length; index++) {
    ingredients = ingredients.concat(`${mealIngredients[index]},`);
  }
  //ajax calls the URL API and gets the info
  $.ajax({
    //use URL with mealIngredients from above
    url: `https://api.spoonacular.com/recipes/findByIngredients?apiKey=aa7dd6ad9ad44ccea57351e7abb0daaf&ingredients=${ingredients}&number=4&ranking=1`,
    method: 'GET',
  })
    //response = info gathered from API
    .then(function (response) { // runs if no error happens
      console.log('Ajax Reponse from apiRecipes\n-------------');
      console.log(response);
      // call searchedRecipes and give it the response
      searchedRecipes(response);
    })
    .catch(function (error) { // runs if an error happens
      console.log('error:', error);
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
    console.log(recipes)
    localStorage.setItem("recipes", JSON.stringify(recipes))
  }
  for (let index = 0; index < recipes.length; index++) {
    recipeInfo(recipes[index].recipeId)
  }

  return recipes
}

function recipeInfo(iD) {
  $.ajax({
    url: `https://api.spoonacular.com/recipes/${iD}/information?apiKey=aa7dd6ad9ad44ccea57351e7abb0daaf`,
    method: 'GET',
  })
    .then(function (response) { // runs if no error happens
      console.log('Ajax Reponse from recipeInfo\n-------------');
      console.log(response);
      localStorage.setItem(`${iD}`, JSON.stringify(response));
      buildRecipesModal(`${iD}`)
      buildChosenRecipeModal(`${iD}`)
    })
    .catch(function (error) { // runs if an error happens
      console.log('error:', error);
    });
}

//event listener when "Lets begin" button is pressed and user gets redirected to the input page

$('#back').on('click', function () {
  document.location.replace(redirectUrl)
})

//function that builds the recipe elements for the modal to be called ..... this function needs to have the data-open
function buildRecipesModal(id) {
  var containerEl = $('<div>');
  containerEl.addClass('recipe');
  containerEl.attr('id', `result${id}`)
  var headerEl = $('<h4>');
  headerEl.attr('style', 'font-family:Courgette, cursive; color:black')
  var imageEl = $('<img>');
  $('img').css('cursor', 'pointer');
  // imageEl.attr('style', 'border: 3px solid black; box-shadow: 10px 10px 10px black; display: grid; gap:30px')
  imageEl.attr('src', JSON.parse(localStorage.getItem(id)).image);
  imageEl.attr('alt', 'food image')
  // imageEl.attr('class', suggestions[index].recipeId)
  imageEl.attr('data-open', `result${result}`) //added for modal
  headerEl.text(JSON.parse(localStorage.getItem(id)).title)
  containerEl.append(headerEl);
  containerEl.append(imageEl);
  $('#recipe-container').append(containerEl);
  console.log("these are the suggestions", id)
}

//funciton that builds the info of the actual chosen recipe .... this needs to be inside the modal
function buildChosenRecipeModal(localStoredID) {
  var containerEl = $('<div>');
  // containerEl.attr('style', 'padding:10%')
  var headerEl = $('<h4>');
  headerEl.attr('style', 'font-family: Courgette, cursive; text-decoration: underline; color: black; background-color:none ; display: grid; width:100%; justify-content: center;')
  var ulEl = $('<ul>');
  var imageEl = $('<img>');
  imageEl.attr('style', ' -webkit-transform: none;-ms-transform: none;transform: none;transition: none;')
  imageEl.attr('src', JSON.parse(localStorage.getItem(localStoredID)).image);
  imageEl.attr('alt', 'food image');
  headerEl.text(JSON.parse(localStorage.getItem(localStoredID)).title);
  var header2El = $('<h4>Instructions</h4>');
  header2El.attr('style', 'color: black; background: #b8a745; ; display: grid; width:100%');
  containerEl.append(headerEl);
  containerEl.append(imageEl);
  containerEl.append(ulEl);
  containerEl.append(header2El);
  for (let index = 0; index < JSON.parse(localStorage.getItem(localStoredID)).extendedIngredients.length; index++) {
    var ingredientsliEl = $('<li>')
    ingredientsliEl.attr('style', 'color: black; background-color:none ; font-size:20px; display: grid; width:100%;')
    ingredientsliEl.text(JSON.parse(localStorage.getItem(localStoredID)).extendedIngredients[index].original)
    ulEl.append(ingredientsliEl)
  }
  var ulInstructionsEl = $('<ul>');
  for (let index = 0; index < JSON.parse(localStorage.getItem(localStoredID)).analyzedInstructions[0].steps.length; index++) {
    var ingredientsliEl = $('<li>')
    ingredientsliEl.attr('style', 'color: black; background:#b8a745 ; display: grid; width:100%')
    ingredientsliEl.text(`${JSON.parse(localStorage.getItem(localStoredID)).analyzedInstructions[0].steps[index].number}. ${JSON.parse(localStorage.getItem(localStoredID)).analyzedInstructions[0].steps[index].step}`)
    ulInstructionsEl.append(ingredientsliEl)
  }
  containerEl.append(ulInstructionsEl);
    $(`#result${result}`).append(containerEl)
    result++;
  }

  //clear history
  function showClear() {
    if (searchHistoryList.text() !== "") {
      clearHistoryBtn.removeClass("hide");
    }
  }

  // function for reset button//
  resetButtonEl.on('click', function () {
    localStorage.clear();
    location.reload();
  });

$('.reveal').on('click', function(event){
  console.log(event)
  console.log(event.target)
})

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
