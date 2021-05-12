var redirectUrl = './input.html'

//function that returns recipe information for the actual recipe details 

$.ajax({
  url: `https://api.spoonacular.com/recipes/${JSON.parse(localStorage.getItem("chosenMeal"))}/information?apiKey=c163ad42a8f44434961017e44052c438`,
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


//event listener when "Lets begin" button is pressed and user gets redirected to the input page

$('#back').on('click', function () {
  document.location.replace(redirectUrl)
})


//funciton that builds the info of the actual chosen recipe 
function buildChosenRecipeEl(detailedRecipe) {
  var containerEl = $('<div>');
  containerEl.attr('class', 'instructions');
  var headerEl = $('<h4>');
  headerEl.attr('style', 'font-family: Courgette, cursive; text-decoration: underline; color: black; background-color:none ; display: grid; width:100%;')
  var ulEl = $('<ul>');
  var imageEl = $('<img>');
  imageEl.attr('style', ' -webkit-transform: none;-ms-transform: none;transform: none;transition: none;')
  imageEl.attr('src', detailedRecipe.image);
  imageEl.attr('alt', 'food image');
  headerEl.text(detailedRecipe.title);
  containerEl.append(headerEl);
  containerEl.append(imageEl);
  containerEl.append(ulEl);
  containerEl.attr('style', 'padding:10%')
  for (let index = 0; index < detailedRecipe.extendedIngredients.length; index++) {
    var ingredientsliEl = $('<li>')
    ingredientsliEl.attr('style', 'color: black; background-color:none ; font-size:20px; display: grid; width:100%;')
    ingredientsliEl.text(detailedRecipe.extendedIngredients[index].original)
    ulEl.append(ingredientsliEl)
  }
  buildinstructions(detailedRecipe.id);
  $('.row').append(containerEl)
  // $(containerEl).insertBefore('footer')
}

function buildinstructions(id) {
  $.ajax({
    url: `https://api.spoonacular.com/recipes/${id}/analyzedInstructions?apiKey=c163ad42a8f44434961017e44052c438`,
    method: 'GET',
  })
    .then(function (response) { // runs if no error happens
      console.log('Ajax Reponse steps broken down\n-------------');
      console.log(response);
      var header2El = $('<h4>Instructions</h4>');
      header2El.attr('style', 'color: black; background: #b8a745; ; display: grid; width:100%');
      $('.instructions').append(header2El);
      if (response.length === 0) {
        console.log('it has no instructions')
      } else {
        var ulEl = $('<ul>');
        $('.instructions').append(ulEl);
        for (let index = 0; index < response[0].steps.length; index++) {
          var ingredientsliEl = $('<li>')
          ingredientsliEl.attr('style', 'color: black; background:#b8a745 ; display: grid; width:100%')
          ingredientsliEl.text(`${response[0].steps[index].number}. ${response[0].steps[index].step}`)
          ulEl.append(ingredientsliEl)
        }
      }
    })
    .catch(function (error) { // runs if an error happens
      console.log('error:', error);
    });
}
