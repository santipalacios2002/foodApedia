
//function that returns recipe information for the actual recipe details 

    $.ajax({
      url: `https://api.spoonacular.com/recipes/${JSON.parse(localStorage.getItem("chosenMeal"))}/information?apiKey=aa7dd6ad9ad44ccea57351e7abb0daaf`,
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
    var headerEl = $('<h4>');
    headerEl.attr('style', 'color: black; background: beige; display: grid')
    var ulEl = $('<ul>');
    headerEl.text(detailedRecipe.title);
    containerEl.append(headerEl);
    containerEl.append(ulEl);
    containerEl.attr('style', 'width: 100px')
    for (let index = 0; index < detailedRecipe.extendedIngredients.length; index++) {
      var ingredientsliEl = $('<li>')
      ingredientsliEl.attr('style', 'color: black; background: beige; display: grid')
      ingredientsliEl.text(detailedRecipe.extendedIngredients[index].original)
      ulEl.append(ingredientsliEl)
    }
    buildinstructions(detailedRecipe.id);
    $(containerEl).insertBefore('footer')
  }
  
  function buildinstructions(id) {
    $.ajax({
      url: `https://api.spoonacular.com/recipes/${id}/analyzedInstructions?apiKey=aa7dd6ad9ad44ccea57351e7abb0daaf`,
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
  