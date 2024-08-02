const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const loginForm = document.getElementById('loginForm');

function validateForm() {
    const email = emailInput.value;
    const password = passwordInput.value;
    const emailValid = email.includes('@') && email.includes('.');
    const passwordValid = password.length > 0;

    loginBtn.disabled = !(emailValid && passwordValid);
}

emailInput.addEventListener('input', validateForm);
passwordInput.addEventListener('input', validateForm);

loginForm.addEventListener('submit', function(event) {
    event.preventDefault();
    window.location.href = 'index.html';
});