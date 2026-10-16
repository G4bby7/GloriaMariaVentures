

document.getElementById("contactForm").addEventListener("submit", function (event) {
  event.preventDefault(); 


  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();


  const nameError = document.getElementById("nameError");
  const emailError = document.getElementById("emailError");
  const messageError = document.getElementById("messageError");
  const successMsg = document.getElementById("successMsg");

  
  nameError.textContent = "";
  emailError.textContent = "";
  messageError.textContent = "";
  successMsg.textContent = "";

  let isValid = true;

 
  if (name === "") {
    nameError.textContent = "Please enter your name.";
    isValid = false;
  }


  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email === "") {
    emailError.textContent = "Please enter your email.";
    isValid = false;
  } else if (!emailPattern.test(email)) {
    emailError.textContent = "Please enter a valid email (example: name@gmail.com).";
    isValid = false;
  }

  if (message.length < 10) {
    messageError.textContent = "Message must be at least 10 characters.";
    isValid = false;
  }

  
  if (isValid) {
    
    const messages = JSON.parse(localStorage.getItem("messages")) || [];
    messages.push({ name: name, email: email, message: message });


    localStorage.setItem("messages", JSON.stringify(messages));

    successMsg.textContent = "Thank you, " + name + "! Your message has been sent.";
    this.reset(); 
  }
});
