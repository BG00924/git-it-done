var userFormEl = document.getElementById('user-form');
var nameInputEl = document.getElementById('username');
var repoContainerEl = document.getElementById('repos-container');
var repoSearchTerm = document.getElementById('repo-search-item');
var languageButtonsEl = document.getElementById('language-buttons')

var getUserRepos = function(user) {
    //formats the github api to accept any user
    var apiURL= "https://api.github.com/users/" + user + "/repos";
    // make a request to the url
    fetch(apiURL)
        .then(function(response) {
            //ok checks to make sure no error; request successful
            if (response.ok) {
                response.json().then(function(data) {
                    displayRepos(data, user);
                });
            } else {
                alert("Error: " + response.statusText);
            }
        })
        // detects 500s error or connectivity issues
        .catch(function(error) {
            //notice this ".catch" getting chained onto the end of the ".then" method
            alert("Unable to connect to GitHub");
        });
};

var formSubmitHandler = function(event) {
    event.preventDefault();
    //console.log(event);
    // gets the value from input element
    var username = nameInputEl.value.trim();
    if (username) {
        getUserRepos(username);
        nameInputEl.value = "";
    } else {
        alert("Please enter a GitHub username");
    }
};

var displayRepos = function(repos, searchTerm) {
    //console.log(repos);
    //console.log(searchTerm);
    //tells us if the user has no repos but does exist
    if (repos.length === 0) {
        repoContainerEl.textContent = "No repositories found.";
        return;
    }
    //clear old content
    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm;
    //loops over repos
    for (var i = 0; i < repos.length; i++) {
        //format repo name
        var repoName = repos[i].owner.login + "/" + repos[i].name;
        // create container for each repo
        var repoEl = document.createElement("a");
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);
        //create a span element to hold repository name
        var titleEl = document.createElement("span")
        titleEl.textContent = repoName;
        //append to container
        repoEl.appendChild(titleEl);
        //create status element
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";
        //check if current repo has issues or not
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML = "<i class='fas fa-times status-icon icon-danger'></i>"
             + repos[i].open_issues_count + " issue(s)";
        } else {
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }
        
        //append to container
        repoEl.appendChild(statusEl);
        //append container to DOM
        repoContainerEl.appendChild(repoEl);
    }
};

var getFeaturedRepos = function(language) {
    //pulls repos based on entered language and featured desiring help on issues
    var apiUrl = "https://api.github.com/search/repositories?q=" + language +"+is:featured&sort=help-wanted-issues";
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                //console.log(data);
                displayRepos(data.items, language);
            });
            //console.log(response);
        } else {
            alert("Error: " + response.statusText);
        }
    });
};

//this function allows for one event handler to operate several buttons
var buttonClickHandler = function(event) {
    var language = event.target.getAttribute("data-language")
    //console.log(language);
    if (language) {
        getFeaturedRepos(language);
        //clear old content
        repoContainerEl.textContent = "";
    }
}

languageButtonsEl.addEventListener("click", buttonClickHandler)
userFormEl.addEventListener("submit", formSubmitHandler);
//getUserRepos("microsoft");