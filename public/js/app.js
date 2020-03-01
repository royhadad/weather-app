const weatherForm = document.querySelector('form');
const searchInput = document.querySelector('input');
const message1 = document.querySelector('#message1');
const message2 = document.querySelector('#message2');
weatherForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const location = searchInput.value;
    message1.innerHTML = 'loading...';
    message2.innerHTML = '';
    fetch(`/weather?address=${location}`)
        .then((res) => res.json())
        .then((data) => {
            if (data.error) {
                message1.innerHTML = data.error;
            } else {
                message1.innerHTML = data.summary;
                message2.innerHTML = data.location;
            }
        });
});