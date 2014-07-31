var imgSrc = chrome.storage.local.get('imgSrc', function(items) {
	if(items.imgSrc) {
		document.getElementById("meme").src=items.imgSrc;
		chrome.storage.local.remove('imgSrc');
	}
});
document.getElementById("imgAttr").onsubmit = function() {
		var title = document.getElementById("imgTitle").value;
	    var tags = document.getElementById("imgTags").value;
	    var note = document.getElementById("imgNote").value;
	    var nsfw = document.getElementById("nsfwBox").checked;
	    if(title != "") {
	    	chrome.storage.local.set({'imgTitle': title});
	    }
	    if(tags != "") {
	    	chrome.storage.local.set({'imgTags': tags});
	    }
	    if(note != "") {
	    	chrome.storage.local.set({'imgNote': note});
	    }
	    chrome.storage.local.set({'nsfw': {value: nsfw}});
	    chrome.windows.getCurrent(function(window) {
	    	chrome.storage.local.remove('magic');
	    	chrome.windows.remove(window.id);
	    })
	    return false;
	};