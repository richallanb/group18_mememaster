/*function getImage(info, tab) {
	console.log("info: " + JSON.stringify(info));
	console.log("tab: " + JSON.stringify(tab));
	var imgSrc = info.srcUrl;
	var srcUrl = info.pageUrl;
	chrome.tabs.create({
						"url": "infobar.html",
						"index": tab.index
					});
}

chrome.contextMenus.create({
 							"title": "Add to MemeMaster",
 							"contexts":["image"],
 							"onclick": getImage
 						});
*/
Parse.initialize("T2ohPL57wnN8dpH4Ukemi4C0UNT2X4aDfQ4d4vP4", "x6TgegJwEkZBzCLtk1dOXNxjkdH9uTB5Yb2yFWZU");
// Set up context menu at install time.
var memeDreamMM = {};

chrome.runtime.onInstalled.addListener(function() {
	var id = chrome.contextMenus.create({"title": "Add to MemeMaster", "contexts":["image"],
                                         "id": "MemeMaster"});
	chrome.storage.local.set({'addInfo': false});
});

// add click event
chrome.contextMenus.onClicked.addListener(onClickHandler);

// The onClicked callback function.
function onClickHandler(info, tab) {
	chrome.storage.local.get('current', function(items) {
		if(items.current) {
			memeDreamMM.imgSrc = info.srcUrl;
			memeDreamMM.srcUrl = info.pageUrl;
			var canvas = document.createElement("canvas");
			var ctx = canvas.getContext("2d");
			var img = new Image();
			img.crossorigin = "Anonymous";
			img.src = memeDreamMM.imgSrc;
			img.onload = function() {
				canvas.width = img.width;
				canvas.height = img.height;
				ctx.drawImage(img, 0, 0);
				memeDreamMM.dataURL = canvas.toDataURL("image/*");
				chrome.storage.local.set({'imgSrc': memeDreamMM.dataURL});
				canvas = null;
			}
			var canvas2 = document.createElement("canvas");
			var ctx2 = canvas2.getContext("2d");
			var img2 = new Image();
			img2.crossorigin = "Anonymous";
			img2.src = memeDreamMM.imgSrc;
			img2.onload = function() {
				if(img2.height > 300) {
					img2.width *= 300/img2.height;
					img2.height = 300;
				}
				if(img2.width > 300) {
					img2.height *= 300/img2.width;
					img2.width = 300;
				}
				canvas2.width = img2.width;
				canvas2.height = img2.height;
				ctx2.drawImage(img2, 0, 0, img2.width, img2.height);
				memeDreamMM.thumb = canvas2.toDataURL("image/jpeg").split("base64,")[1];
				canvas2 = null;
			}
			chrome.windows.create({
									url: "infobar.html",
									type: "detached_panel"
									},
									function(mWindow) {
										memeDreamMM.popUp = mWindow.id;
										memeDreamMM.magic = true;
									});
		}
		else {
			alert("Please log in to Meme Master first.");
		}
	});
};
chrome.windows.onFocusChanged.addListener(function(windowId) {
	if(memeDreamMM.magic && windowId != memeDreamMM.popUp) {
		memeDreamMM.magic = false;
		chrome.windows.remove(memeDreamMM.popUp);
	}
});
chrome.windows.onRemoved.addListener(function(windowId) {
	if(windowId == memeDreamMM.popUp) {
		var parser = new Parse.File("default.jpeg", {base64: memeDreamMM.dataURL.split("base64,")[1]});
		parser.save().then(function() {
			var newgallery = new Parse.Object("gallery");
			var gal_img_rel = newgallery.relation("images");
			chrome.storage.local.get('imgTitle', function(items) {
				if(items.imgTitle) {
					newgallery.set("title", items.imgTitle.replace(/\W/g," "));
					newgallery.set("title_to_lower", [items.imgTitle.replace(/\W/g," ").toLowerCase()]);
					chrome.storage.local.remove('imgTitle')
				}
				else {
					newgallery.set("title", ["extension"]);
					newgallery.set("title_to_lower", ["extension"]);
				}
			})
			chrome.storage.local.get('imgTags', function(items) {
				if(items.imgTags) {
					newgallery.set("tags", items.imgTags.toLowerCase().replace(/\W/g," ").match(/([^\;^\s^\,])+/gi));
					chrome.storage.local.remove('imgTags');
				}
				else {
					newgallery.set("tags", []);
				}
			});
			newgallery.set("public", false);
			newgallery.set("likes", 0);
			newgallery.set("total_likes", 0);
			newgallery.set("user", Parse.User.current());
			newgallery.set("nsfw", true);
			var images = new Parse.Object("images");
			chrome.storage.local.get('imgNote', function(items) {
				if(items.imgNote) {
					images.set("note", items.imgNote);
					chrome.storage.local.remove('imgNote');
				}
				else {
					images.set("note", "");
				}
			});
			images.set("url", memeDreamMM.srcUrl);
			images.set("pic", parser);
			images.set("gallery", newgallery);
			var thParser = new Parse.File("th_default.jpeg", { base64: memeDreamMM.thumb});
			thParser.save().then(function() {
				images.set("thumb", thParser);
				images.save(null, {
					success: function(imageResult) {
						// successfully added
						newgallery.set("cover", imageResult);
						gal_img_rel.add(imageResult);
						newgallery.save().then(function(galleryResult) {
							var user = Parse.User.current();
							var user_gal_rel = user.relation("galleries");
							user_gal_rel.add(galleryResult);
							user.save();
						})
					},
					error: function(imageResult, error) {
						alert(error.message);
					}
				});
			});
		});
	}
});