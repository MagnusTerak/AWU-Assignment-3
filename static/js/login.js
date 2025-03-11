let showPassword = false; 

const registerMember = function(e, framework) { 
    e.preventDefault();
}

const profileState = function() {
    const loginBtn = document.querySelector(".loginBtn");

    if (localStorage.getItem("loggedIn")) {
        loginBtn.textContent = "Min profil";
        loginBtn.href = "/profile/profileSelection";
        
    } else {
        loginBtn.textContent = "Login";
        loginBtn.href = "/login/loginSelection";
    }
}

const LoggedState = function(state) {
    localStorage.setItem("loggedIn", state);
    profileState();
}

const AttemptLogin = function(e) {
    e.preventDefault();
    let warningText = document.querySelector(".loginWarning");
    let username = document.getElementById("usernameLogin");
    let password = document.getElementById("passwordLogin");

    if (localStorage.getItem("username") === username.value && localStorage.getItem("password") === password.value) {
        LoggedState(true);
        window.location.href = "/profile/profileSelection";
    } else {
        warningText.textContent = "Inloggning misslyckades, var vänlig och kolla igenom dina uppgifter."
    }
}

const checkPasswordStrength = function(password) {
    let strength = { message: "Ditt lösenord är svagt! Du kan förstärka det genom att använda special symboler, siffror, stora bokstäver & en längd på minst 8 tecken.", class: "weak"};

    if (password.length >= 8) {
        if (/[A-Z]/.test(password) && /[0-9]/.test(password) && /[!@#\$%\^&\*]/.test(password)) {
            strength.message = "Starkt lösenord!";
            strength.class = "strong"
        } else {
            strength.message = "Ditt lösenord är medelbra! Du kan förstärka det genom att använda special symboler, siffror & stora bokstäver.";
            strength.class = "medium";
        }
    }

    return strength;
}

const CreateAccount = function(e) {
    e.preventDefault();
    let form = document.getElementById("registerForm");

    localStorage.setItem("username", form.elements[0].value);
    localStorage.setItem("email", form.elements[1].value);
    localStorage.setItem("firstname", form.elements[2].value);
    localStorage.setItem("lastname", form.elements[3].value);
    localStorage.setItem("password", form.elements[4].value);

    history.back(); 
}

document.addEventListener("DOMContentLoaded", () => {
    profileState();

    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const logOutButton = document.getElementById("logOutButton");
    const registerPassword = document.getElementById("inputPassword");
    const profileDiv = document.getElementById("profileDiv");
    const selectionHeader = document.querySelector(".profileSelectionHeader");
    const hidePasswordBtn = document.getElementById("profileHidePassword");

    if (loginForm) {
        loginForm.addEventListener("submit", (e) => AttemptLogin(e));
    }

    if (registerForm) {
        registerForm.addEventListener("submit", (e) => CreateAccount(e))
    }
    
    if (logOutButton) {
        logOutButton.addEventListener("click", function(e) {
            e.preventDefault();
        
            localStorage.removeItem("loggedIn");
            localStorage.removeItem("username");
            localStorage.removeItem("email");
            localStorage.removeItem("firstname");
            localStorage.removeItem("lastname");
            localStorage.removeItem("password");
            window.location.href = "/";
        })
    }

    if (registerPassword) {
        registerPassword.addEventListener("input", function() {
            const password = this.value;
            const strengthMessage = document.getElementById("passwordStrength");
        
            strengthMessage.textContent = "";
        
            strengthMessage.classList.remove("weak", "medium", "strong");
        
            if (password.length === 0) {
                return;
            }
        
            const strength = checkPasswordStrength(password);
        
            strengthMessage.textContent = strength.message;
            strengthMessage.classList.add(strength.class);
        })
    }

    if (profileDiv) {
        const pUsername = document.getElementById("usernameProfile");
        const pEmail = document.getElementById("emailProfile");
        const pFirstname = document.getElementById("firstnameProfile");
        const pLastname = document.getElementById("lastnameProfile");
        const pPassword = document.getElementById("passwordProfile");

        pUsername.textContent = localStorage.getItem("username");
        pEmail.textContent = localStorage.getItem("email");
        pFirstname.textContent = localStorage.getItem("firstname");
        pLastname.textContent = localStorage.getItem("lastname");

        hidePassword();
    }

    if (selectionHeader) {
        selectionHeader.textContent = `Välkommen ${localStorage.getItem("firstname")}!`
    }

    if (hidePasswordBtn) {
        hidePasswordBtn.addEventListener("click", function() {
            showPassword = !showPassword;

            hidePassword();
        })
    }
});

const hidePassword = function(passwordLength) {
    let getHiddenPassword = function(passwordLength) {
        let passwordString = "";
    
        for (let index = 0; index < passwordLength; index++) {
            passwordString = passwordString + "*";
        }
    
        return passwordString  
    }

    const pPassword = document.getElementById("passwordProfile");

    if (showPassword) {
        pPassword.textContent = localStorage.getItem("password");
    } else {
        pPassword.textContent = getHiddenPassword(localStorage.getItem("password").length);
    }
}
