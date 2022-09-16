const form = document.querySelector('#google-sheet');
const scriptURL= 'https://script.google.com/macros/s/AKfycbxii2YJ4eqS8xiodcOUWCgxoIzziyvA9jh4dQzU3ZYSQikewloy6uRouZflT1FXg80t/exec'

form.addEventListener('submit', e=>{
    e.preventDefault()
    fetch(scriptURL, {method: 'POST', body: new FormData(form)})
        .then(response => console.log('Success!', response))
        .catch(error => console.error('Error!', error.message))

    setTimeout("location.href = '/';", 1000)
})