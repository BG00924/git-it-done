var getUserRepos = function(user) {
    //formats the github api to accept any user
    var apiURL= "https://api.github.com/users/" + user + "/repos";
    // make a request to the url
    fetch(apiURL).then(function(response) {
        response.json().then(function(data) {
            console.log(data);
        });
    });
};

getUserRepos("microsoft");