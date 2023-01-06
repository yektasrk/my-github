const error = document.querySelector('.error');
const msg = document.querySelector('.msg');

// check if data for username exists in cache; if not, send request to server and get the response and cache it
// and call functions to show result
async function getProfile(e) {
    removeErrorAndMsg();
    let username = document.getElementById("username").value;
    e.preventDefault();
    let data = await JSON.parse(window.localStorage.getItem(username));
    console.log(data);
    if (data != null) {
        showMsg("Loaded from cache");
        showProfile(data);
        return;
    }
    try {
        let response = await fetch(`https://api.github.com/users/${username}`);
        if (response.status != 200) {
            if (response.status == 404) {
                showError("Username does not exist!");
            }
            removeProfile();
            return Promise.reject(`Request failed with error ${response.status}`);
        }

        let resp = await response.json();
        console.log(resp);
        showMsg("Fetched from API");
        showProfile(resp);
        window.localStorage.setItem(username, JSON.stringify(resp));
    } catch (e) {
        console.log(e);
    }
}

// show profile to user
// if a field is null, it will be hidden from the profile
function showProfile(obj) {
    document.getElementById("name").innerText = obj.name
    document.getElementById("blog").text = obj.blog
    document.getElementById("blog").href = obj.blog
    document.getElementById("location").innerText = obj.location
    document.getElementById("avatar").src = obj.avatar_url
    document.getElementById("bio").innerText = obj.bio
}

// remove profile (if shown)
function removeProfile() {
    document.getElementById("name").innerText = ""
    document.getElementById("blog").innerText = ""
    document.getElementById("location").innerText = ""
    document.getElementById("avatar").src = ""
    document.getElementById("bio").innerText = ""
}

// show error 
function showError(title) {
    error.style.display = "block";
    error.innerText = "* " + title;
}

// show msg 
function showMsg(title) {
    msg.style.display = "block";
    msg.innerText = "* " + title;
}

// remove error and msg (if shown)
function removeErrorAndMsg() {
    error.style.display = "none"
    error.innerHTML = ""
    msg.style.display = "none"
    msg.innerHTML = ""
}

document.getElementById('submit').addEventListener('click', getProfile);