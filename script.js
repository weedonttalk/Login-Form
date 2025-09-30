document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerForm');
  const fnameEl = document.getElementById('fname');
  const emailEl = document.getElementById('email');
  const passwordEl = document.getElementById('password');
  const togglePassword = document.getElementById('togglePassword');
  const message = document.getElementById('message');
  const modal = document.getElementById('successModal');
  const nameOutput = document.getElementById('nameOutput');

  togglePassword.addEventListener('click', () => {
    const show = passwordEl.type === 'password';
    passwordEl.type = show ? 'text' : 'password';
    togglePassword.textContent = show ? '🙈' : '👁';
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    message.textContent = '';

    const fname = fnameEl.value.trim();
    const email = emailEl.value.trim();
    const password = passwordEl.value.trim();

    if(!fname || !email || !password){
      message.style.color = 'red';
      message.textContent = 'Будь ласка, заповніть усі поля!';
      return;
    }
    if(password.length < 6){
      message.style.color = 'red';
      message.textContent = 'Пароль має містити мінімум 6 символів!';
      return;
    }

    try{
      const res = await fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ fname, email, password })
      });
      const data = await res.json();
      if(data.success){
        message.style.color = 'green';
        message.textContent = 'Реєстрація успішна!';
        nameOutput.innerHTML = '';
        if(window.WriteName){ window.WriteName(fname, nameOutput, {delayMs:180}); }
        else { nameOutput.textContent = fname; }
        if(typeof modal.showModal === 'function'){ modal.showModal(); } else { modal.setAttribute('open',''); }
        form.reset();
        togglePassword.textContent = '👁';
        passwordEl.type = 'password';
      } else {
        message.style.color = 'red';
        message.textContent = data.error || 'Невірні дані!';
      }
    }catch(err){
      console.error(err);
      message.style.color = 'red';
      message.textContent = 'Помилка серверу!';
    }
  });
});