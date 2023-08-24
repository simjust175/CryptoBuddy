//function to shorten the constent use of  "document.queryDOMSelector"
const DOMselector = (attributeType, elementName) => {
  return (window[elementName] = document.querySelector(
    `${attributeType}${elementName}`
  ));
};

const DOMselectorWithValue = (attributeType, elementName) => {
  return (window[elementName] = document.querySelector(
    `${attributeType}${elementName}`
  ).value);
};

DOMselector("#", "signUp_message");

//regex for the password & length.
const isPasswordValid = (pwd) => {
  const pwdValidation = /[A-Za-z]/; ///^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
  return pwdValidation.test(pwd);
};
// const isPasswordValid = (pwd) => /[A-Za-z]/.test(pwd); ??

//  user name validator checks if username is availble.
let userNameValidater = (userName) => {
  if (database.some((formerUser) => formerUser.name === userName)) {
    throw new Error(`username: ${userName} is already in use`);
  }
  return userName;
};

//  password validation function.
const passwordValidator = (signUp__pwd1, signUp__pwd2) => {
  if (signUp__pwd1 === signUp__pwd2 && isPasswordValid(signUp__pwd1)) {
    console.log(`signUp__pwd1 == ${signUp__pwd1}`);
    return signUp__pwd1;
  }
  throw new Error(`Invalid password: ${signUp__pwd1}`);
};

// Main registration system.
let idCounter = 100;
function UserRegistrationSystem(userName, signUp__pwd1, signUp__pwd2) {
  this.name = userNameValidater(userName);
  this.pwd = passwordValidator(signUp__pwd1, signUp__pwd2);
  this.id = idCounter++;
}

// add new 'user' to database(simulated);
const database = []; //simulated database;
const addToDatabase = (user) => {
  database.push(user);
  console.log(database);
  // return JSON.stringify(database);
};

// sign-up main function
const signUpSystem = (event) => {
  event.preventDefault();

  DOMselectorWithValue("#", "signUp__pwd1");
  DOMselectorWithValue("#", "signUp__pwd2");
  DOMselectorWithValue(".", "userName");

  try {
    const user = new UserRegistrationSystem(
      userName,
      signUp__pwd1,
      signUp__pwd2
    );
    console.log(`current user: ${user}`);
    login__form.classList.remove("formHidden");
    signUp__form.classList.add("formHidden");
    event.target.reset(); // resets the input fields.
    addToDatabase(user); // add the user to the user-Database(array).
  } catch (error) {
    console.error(error.message);
  }
};

//  sign-up event:
DOMselector(".", "signUp__form").addEventListener("submit", signUpSystem);

// main log-in event.
DOMselector(".", "login__form").addEventListener("submit", loginSystem(event))

const loginSystem = (event) => {
  event.preventDefault();

  DOMselector("#", "login_message");
  DOMselectorWithValue("#", "login__inputName");
  DOMselectorWithValue("#", "login__inputpwd");

  database.filter((currentUser) => {
    h1.innerHTML = "";
    if (loginName === currentUser.name && loginPwd === currentUser.pwd) {
      console.log(currentUser);
      console.log("SUCCESS");
      login_message.innerHTML = "ACCESS GRANTED";
      login_message.style.color = "green";
      return true;
    } else {
      login_message.innerHTML = "ACCESS DENIED";
      login_message.style.color = "red";
      console.log(currentUser);
      console.log("DENIED!!");
      login__form.reset();
      return false;
    }
  });
};



document.querySelector(".signup-link").addEventListener("click", (e) => {
  // event.preventDefault();
  login__form.classList.add("formHidden");
  signUp__form.classList.remove("formHidden");
});

document.querySelector(".login-link").addEventListener("click", (e) => {
  // event.preventDefault();
  login__form.classList.remove("formHidden");
  signUp__form.classList.add("formHidden");
});
