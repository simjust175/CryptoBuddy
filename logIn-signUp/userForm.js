
//function to shorten the constent use of  "document.queryDOMSelector"
const DOMselector = (attributeType, elementName) => {
  return window[elementName] = document.querySelector(
    `${attributeType}${elementName}`
  );
};

const DOMselectorWithValue = (attributeType, elementName) => {
  return window[elementName] = document.querySelector(
    `${attributeType}${elementName}`
  ).value;
};

DOMselector("#", "h1");

//regex for the password & length.
const pwdValidator = (pwd) => {
  const pwdValidation = /[A-Za-z]/;///^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
  return pwdValidation.test(pwd);
};


//  user name validator.
let userNameValidater = (userName) => {
  database.filter((formerUser) =>{  
    if (formerUser.name === userName) {  // formerUser.name,includes(userName)
      throw new Error(`username: ${userName} is already in use`);
    }
  })
  return userName
};


//  password validation function.
const pwdAllSystemsValidator = (signUp__pwd1, signUp__pwd2) => {
  if ((pwdValidator(signUp__pwd1)) && signUp__pwd1 === signUp__pwd2) {
    console.log(`signUp__pwd1 == ${signUp__pwd1}`);
    return signUp__pwd1;
  } else {
    throw new Error(`pwd: ${signUp__pwd1} is incorrect`)
  }
};

// Main registration system.
let idCounter = 100
function UserRegistratinSystem(userName, signUp__pwd1, signUp__pwd2){
  this.name = userNameValidater(userName);
  this.pwd = pwdAllSystemsValidator(signUp__pwd1, signUp__pwd2);
  this.id = idCounter++;

}

// add new 'user' to database(simulated).
let database = [];
const addToDatabase = (user) => {
  database.push(user);
  console.log(database);
};


// sign-up main function
const signUpSystem = (event)=>{
  event.preventDefault();
  DOMselectorWithValue("#", "signUp__pwd1");
  DOMselectorWithValue("#", "signUp__pwd2");
  DOMselectorWithValue("#", "userName");
  try {
    const user = new UserRegistratinSystem(userName, signUp__pwd1, signUp__pwd2);
    console.log(`current user:${user}`);
    login__form.classList.remove("formHidden");
    event.target.classList.add("formHidden");
    event.target.reset(); // resets the input fields.
    addToDatabase(user); // add the user to the user-Database(array).
  } catch (error) {
    console.error(error.message);
  }
}



//  sign-up event:
DOMselector(".", "signUp__form").addEventListener("submit", signUpSystem);

// main log-in event.
DOMselector(".", "login__form").addEventListener("submit",(event)=>{
  event.preventDefault();
  DOMselectorWithValue("#", "login__inputName");
  DOMselectorWithValue("#", "login__inputpwd");
  database.filter((currentUser) => {
    h1.innerHTML = "";
    if (loginName === currentUser.name && loginPwd === currentUser.pwd) {
      console.log(currentUser);
      console.log("SUCCESS");
      h1.innerHTML = "ACCESS GRANTED";
      h1.style.color = "green";
      return true;
    } else {
      h1.innerHTML = "ACCESS DENIED";
      h1.style.color = "red";
      console.log(currentUser);
      console.log("DENIED!!");
      login__form.reset();
      return false;
    }
  });
});

document.querySelector("#link__signUp").addEventListener("click", (e) => {
  // event.preventDefault();
  login__form.classList.add("formHidden");
  signUp__form.classList.remove("formHidden");
});

document.querySelector("#link__login").addEventListener("click", (e) => {
  // event.preventDefault();
  login__form.classList.remove("formHidden");
  signUp__form.classList.add("formHidden");
});
