// Helper function to select DOM elements
const DOMselector = (attributeType, elementName) => {
  return (window[elementName] = document.querySelector(`${attributeType}${elementName}`));
};

// Helper function to select DOM elements and retrieve their values
const DOMselectorWithValue = (attributeType, elementName) => {
  return (window[elementName] = document.querySelector(`${attributeType}${elementName}`).value);
};

// Select the sign-up message element
DOMselector("#", "signUp_message");

// Function to validate password
const isPasswordValid = (pwd) => {
  return /[A-Za-z]/.test(pwd);
};

// Function to validate username availability
let userNameValidator = (userName) => {
  if (database.some((formerUser) => formerUser.name === userName)) {
    let userNameInUse = `Username: ${userName} is already in use`;
    signUp_message.innerText = userNameInUse;
    throw new Error(userNameInUse);
  }
  return userName;
};

// Function to validate password match and strength
const passwordValidator = (signUp__pwd1, signUp__pwd2) => {
  if (signUp__pwd1 === signUp__pwd2 && isPasswordValid(signUp__pwd1)) {
    return signUp__pwd1;
  }
  throw new Error(`Invalid password: ${signUp__pwd1}`);
};

// Counter for assigning user IDs
let idCounter = 100;

// UserRegistrationSystem constructor
function UserRegistrationSystem(userName, signUp__pwd1, signUp__pwd2) {
  this.name = userNameValidator(userName);
  this.pwd = passwordValidator(signUp__pwd1, signUp__pwd2);
  this.id = idCounter++;
}

// Simulated database for users
const database = [];

// Function to add a user to the database
const addToDatabase = (user) => {
  database.push(user);
  console.log(`Database: ${JSON.stringify(database)}`);
};

// Sign-up form submission handler
const signUpSystem = (event) => {
  event.preventDefault();

  DOMselectorWithValue("#", "signUp__pwd1");
  DOMselectorWithValue("#", "signUp__pwd2");
  DOMselectorWithValue(".", "userName");

  try {
    const user = new UserRegistrationSystem(userName, signUp__pwd1, signUp__pwd2);
    console.log(`Current user: ${JSON.stringify(user)}`);
    login__form.classList.remove("formHidden");
    signUp__form.classList.add("formHidden");
    event.target.reset();
    addToDatabase(user);
  } catch (error) {
    console.error(error.message);
  }
};

// Login form submission handler
const loginSystem = (event) => {
  event.preventDefault();
  DOMselector("#", "login_message");
  DOMselectorWithValue("#", "login__inputName");
  DOMselectorWithValue("#", "login__inputpwd");

  const currentUser = database.find((user) => user.name === login__inputName && user.pwd === login__inputpwd);
  if (currentUser) {
    console.log("SUCCESS");
    login_message.innerHTML = "ACCESS GRANTED";
    login_message.style.color = "green";
    window.location.href = '../coinCards/coinCard.html'
  } else {
    login_message.innerHTML = "ACCESS DENIED";
    login_message.style.color = "red";
    console.log(`${currentUser} DENIED!`);
    login__form.reset();
  }
};

// Event listener for sign-up form submission
DOMselector(".", "signUp__form").addEventListener("submit", signUpSystem);

// Event listener for login form submission
DOMselector(".", "login__form").addEventListener("submit", loginSystem);

// Event listener for switching to sign-up form
document.querySelector(".signup-link").addEventListener("click", (e) => {
  login__form.classList.add("formHidden");
  signUp__form.classList.remove("formHidden");
});

// Event listener for switching to login form
document.querySelector(".login-link").addEventListener("click", (e) => {
  login__form.classList.remove("formHidden");
  signUp__form.classList.add("formHidden");
});
