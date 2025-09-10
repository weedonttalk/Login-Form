document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  const message = document.getElementById("message");
  const passwordField = document.getElementById("password");
  const togglePassword = document.getElementById("togglePassword");

  // 👁 Показати/сховати пароль
  togglePassword.addEventListener("click", () => {
    if (passwordField.type === "password") {
      passwordField.type = "text";
      togglePassword.textContent = "🙈";
    } else {
      passwordField.type = "password";
      togglePassword.textContent = "👁";
    }
  });

  // Відправка форми на сервер
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      fname: document.getElementById("fname").value.trim(),
      lname: document.getElementById("lname").value.trim(),
      email: document.getElementById("email").value.trim(),
      password: passwordField.value.trim()
    };

    if (!data.fname || !data.lname || !data.email || !data.password) {
      message.style.color = "red";
      message.textContent = "Будь ласка, заповніть усі поля!";
      return;
    }

    if (data.password.length < 6) {
      message.style.color = "red";
      message.textContent = "Пароль має містити мінімум 6 символів!";
      return;
    }

    try {
      const response = await fetch("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      if (result.success) {
        message.style.color = "green";
        message.textContent = `Користувач ${data.fname} ${data.lname} зареєстрований!`;
        form.reset();
      } else {
        message.style.color = "red";
        message.textContent = result.error;
      }
    } catch (err) {
      message.style.color = "red";
      message.textContent = "Помилка серверу!";
      console.error(err);
    }
  });
});
