Parse.initialize("T2ohPL57wnN8dpH4Ukemi4C0UNT2X4aDfQ4d4vP4", "x6TgegJwEkZBzCLtk1dOXNxjkdH9uTB5Yb2yFWZU");
var currentUser = Parse.User.current();
if(currentUser) {
	document.getElementById("login-modal").style.display = "none";
	document.getElementById("signup-modal").style.display = "none";
	document.getElementById("welcome").innerHTML = "Welcome " + currentUser.get("username");
	document.getElementById("home-modal").style.display = "inline";
}
else {
	document.getElementById("login-modal").style.display="inline";
	document.getElementById("signup-modal").style.display="none";
	document.getElementById("home-modal").style.display="none";
}
document.getElementById("signup-modal-show").onclick = function() {
		document.getElementById("login-modal").style.display = "none";
		document.getElementById("signup-modal").style.display = "inline";
		document.getElementById("home-modal").style.display = "none";
	};
document.getElementById("signup-modal-close").onclick = function() {
		document.getElementById("login-modal").style.display = "inline";
		document.getElementById("signup-modal").style.display = "none";
		document.getElementById("home-modal").style.display = "none";
	};
document.getElementById("login-form").onsubmit = function() {
	    var username = document.getElementById("login-username").value;
	    var password = document.getElementById("login-password").value;
	    Parse.User.logIn(username, password, {
	        success: function(user) {
	        	document.getElementById("login-modal").style.display = "none";
	        	document.getElementById("signup-modal").style.display = "none";
	        	currentUser = Parse.User.current();
	        	document.getElementById("welcome").innerHTML = "Welcome " + currentUser.get("username");
	        	document.getElementById("home-modal").style.display = "inline";
	        	chrome.storage.local.set({'current': currentUser.get("username")});
	    	},
	        error: function(user, error) {
	        	document.getElementById("login-password").value = "";
	        	document.getElementById("error-msg").innerHTML = error.message;
	        	document.getElementById("error-msg").style.display = "inline";
	        }
	    });
	    return false;
	};
document.getElementById("suform").onsubmit = function() {
		var user = new Parse.User();
		user.set("username", document.getElementById("signup-name").value);
		user.set("password", document.getElementById("signup-pass").value);
		user.signUp(null, {
			success: function(user) {
				document.getElementById("login-modal").style.display = "none";
	        	document.getElementById("signup-modal").style.display = "none";
	        	currentUser = Parse.User.current();
	        	document.getElementById("welcome").innerHTML = "Welcome " + currentUser.get("username");
	        	document.getElementById("home-modal").style.display = "inline";
	        	chrome.storage.local.set({'current': currentUser.get("username")});
			},
			error: function(user, error) {
				document.getElementById("signup-name").value = "";
				document.getElementById("signup-pass").value = "";
				document.getElementById("error-msg2").innerHTML = error.message;
				document.getElementById("error-msg2").style.display = "inline";
			}
		})
		return false;
	};
document.getElementById("logout").onclick = function() {
		Parse.User.logOut();
		document.getElementById("error-msg").style.display = "none";
		document.getElementById("error-msg2").style.display = "none";
		document.getElementById("login-modal").style.display = "inline";
		document.getElementById("signup-modal").style.display = "none";
		document.getElementById("home-modal").style.display = "none";
		chrome.storage.local.remove('current');
	};