
//function that returns recipe information for the actual recipe details 

    $.ajax({
<<<<<<< HEAD
      url: `https://api.spoonacular.com/recipes/${JSON.parse(localStorage.getItem("chosenMeal"))}/information?apiKey=b932102ca6a844bea90867914818585c`,
=======
      url: `https://api.spoonacular.com/recipes/${JSON.parse(localStorage.getItem("chosenMeal"))}/information?apiKey=c163ad42a8f44434961017e44052c438`,
>>>>>>> 8bf7ef1680128fb39f86677ca37ad34524d5d8ed
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
  
  
  //funciton that builds the info of the actual chosen recipe 
  function buildChosenRecipeEl(detailedRecipe) {
    var containerEl = $('<div>');
    containerEl.attr('class', 'instructions');
    var headerEl = $('<h3>');
    headerEl.attr('style', 'font-family: Courgette, cursive; text-decoration: underline; color: black; background-color:none ; display: grid; width:600%;')
    var ulEl = $('<ul>');
    var imageEl = $('<img>');
    imageEl.attr('src', detailedRecipe.image);
    imageEl.attr('alt', 'food image');
    headerEl.text(detailedRecipe.title);
    containerEl.append(headerEl);
    containerEl.append(imageEl);
    containerEl.append(ulEl);
    containerEl.attr('style', 'padding:10%')
    for (let index = 0; index < detailedRecipe.extendedIngredients.length; index++) {
      var ingredientsliEl = $('<li>')
      ingredientsliEl.attr('style', 'color: black; background-color:none ; font-size:20px; display: grid; width:600%;')
      ingredientsliEl.text(detailedRecipe.extendedIngredients[index].original)
      ulEl.append(ingredientsliEl)
    }
    buildinstructions(detailedRecipe.id);
    $('.row').append(containerEl)
    // $(containerEl).insertBefore('footer')
  }
  
  function buildinstructions(id) {
    $.ajax({
<<<<<<< HEAD
      url: `https://api.spoonacular.com/recipes/${id}/analyzedInstructions?apiKey=b932102ca6a844bea90867914818585c`,
=======
      url: `https://api.spoonacular.com/recipes/${id}/analyzedInstructions?apiKey=c163ad42a8f44434961017e44052c438`,
>>>>>>> 8bf7ef1680128fb39f86677ca37ad34524d5d8ed
      method: 'GET',
    })
    .then(function (response) { // runs if no error happens
      console.log('Ajax Reponse steps broken down\n-------------');
      console.log(response);
      var header2El = $('<h3>Instructions</h4>');
      header2El.attr('style', 'font-family: Courgette, cursive; text-decoration:underline; color: black; background-color: none; ; display: grid; width:600%');
      $('.instructions').append(header2El);
      if (response.length === 0) {
        console.log('it has no instructions')
      } else {
        var ulEl = $('<ul>');
        $('.instructions').append(ulEl);
        for (let index = 0; index < response[0].steps.length; index++) {
          var ingredientsliEl = $('<li>')
          ingredientsliEl.attr('style', 'color: black; background-color:none ; font-size:20px; display: grid; width:600%')
          ingredientsliEl.text(`${response[0].steps[index].number}. ${response[0].steps[index].step}`)
          ulEl.append(ingredientsliEl)
        }
      }
    })
    .catch(function (error) { // runs if an error happens
      console.log('error:', error);
    });
  }
  