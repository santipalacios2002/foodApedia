var redirectUrl = './input.html'

//event listener when "Lets begin" button is pressed and user gets redirected to the input page

$('#start').on('click', function () {
    document.location.replace(redirectUrl)
  })