var issueContainerEl = document.getElementById('issues-container');
var limitWarningEl = document. getElementById('limit-warning');
var repoNameEl = document.getElementById('repo-name'); 

var getRepoIssues = function(repo) {
    //console.log(repo);
    var apiURL = "https://api.github.com/repos/" + repo + "/issues?direction=asc";
    fetch(apiURL).then(function(response) {
        //request was successful
        if (response.ok) {
            response.json().then(function(data) {
                // passes reponse data to DOM function
                displayIssues(data);

                //check if api has paginated issues; ones over 30
                if (response.headers.get("link")) {
                    //console.log("repo has more than 30 issues");
                    displayWarning(repo);
                }
            });
        }
        else {
            //alert("There was a problem with your request!");
            //if not successful, redirect to home page
            document.location.replace("./index.html");
        }
    });
};
var displayIssues = function(issues) {
    if (issues.length === 0) {
        issueContainerEl.textContent = "This repo has no open issues!";
        return;
    };
    for(var i = 0; i < issues.length; i++){
        //create a link element to take users to the issue on github
        var issueEl = document.createElement("a");
        issueEl.classList = "list-item flex-row justify-space-between align-center";
        //every issue obbj has this property which links to full issue on github
        issueEl.setAttribute("href", issues[i].html_url);
        //opens in new tab
        issueEl.setAttribute("target", "_blank");
        // create span to hold issue title
        var titleEl = document.createElement("span");
        titleEl.textContent = issues[i].title;
        //append to container
        issueEl.appendChild(titleEl);
        //create a type element
        var typeEl = document.createElement("span");
        //check if issue is an actual issue or a pull request
        if (issues[i].pull_request) {
            typeEl.textContent = "(Pull Request)";
        } else {
            typeEl.textContent = "(Issue)";
        }
        //append to container
        issueEl.appendChild(typeEl);
        issueContainerEl.appendChild(issueEl);
    };
};

var displayWarning = function(repo) {
    //add text to warning container
    limitWarningEl.textContent = "To see more than 30 issues, visit ";
    //creates link to the repo's issues
    var linkEl = document.createElement("a");
    linkEl.textContent = "See More Issues on GitHub.com";
    //causes the <a> to take you to the repo's issues
    linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
    //open link in new page
    linkEl.setAttribute("target", "_blank");
    //append to warning container
    limitWarningEl.appendChild(linkEl);
}

var getRepoName = function() {
    // grab repo name from url query string
    var queryString = document.location.search;
    var repoName = queryString.split("=")[1];
    //console.log(repoName);
    //conditional statement will only display the repo name and make 
        //the fetch call if the value for repoName exists
    if (repoName) {
        //displays repo name on the page
        repoNameEl.textContent = repoName;
        getRepoIssues(repoName);
    }
    //redirects to main pafe if repoName wasn't given exist
    else {
        document.location.replace("./index.html");
    }
}

getRepoName();
