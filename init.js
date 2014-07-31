Parse.initialize("T2ohPL57wnN8dpH4Ukemi4C0UNT2X4aDfQ4d4vP4", "x6TgegJwEkZBzCLtk1dOXNxjkdH9uTB5Yb2yFWZU");
// Use this for checking whether the user is logged in
var loggedIn=false;

/* Modal display */
    $(function() {  
      $("#upload-modal-show").click(function() { 
          var rect = document.getElementById("upload-modal-show").getBoundingClientRect();
          document.getElementById("upload-modal").style.top = (rect.top + 40) + "px";
          document.getElementById("upload-modal").style.left = (rect.left-200) + "px";
          $("#upload-modal").slideDown(400);
          $("#blackout").fadeIn(700);
      });  
    });
      
    $(function() {  
      $(".upload-modal-close").click(function() {  
          $("#upload-modal").slideUp(400);  
          $("#blackout").fadeOut(700);
          $("#upload-modal-files-container").hide();
          mememasterUploader.clear(document.getElementById("upload-modal-files-container"));
      });  
    }); 
      
    $(function() {  
      $("#blackout").click(function() {  
          $("#upload-modal").slideUp(400);  
          $("#blackout").fadeOut(700);
      });  
    });


    function parseURL(val) {
      var result = -1,
          tmp = [];
      var items = location.search.substr(1).split("&");
      for (var index = 0; index < items.length; index++) {
          tmp = items[index].split("=");
          
          if (tmp[0] === val) result = decodeURIComponent(tmp[1]);
      }
      return result;
    }

    /* Grabbing username from the current session */
    welcome_message(Parse.User.current());
    function welcome_message (user){
      if (user && document.getElementById("welcome-message")) {
        // If logged in
        loggedIn = true;
        var avatar = user.get("avatar");
        
        document.getElementById("welcome-message").innerHTML= "<h4 class=\"no-bold\"><em>Welcome back</em>, </h4><div class=\"menu\"><ul><li class=\"submenu-entry\"><a class=\"user-page\">" + user.get("username") + "</a></li></ul>\
<ul class=\"submenu\">\
		<li onclick=\"signOut();\">Sign Out</li>\
        </ul></div>";
        if (false) { // replace with avatar later
          
          document.getElementById("userimg").innerHTML = "<a  href=\"userpage.html?user="+ user.id +"\"><img src=\"" + avatar.url() + "\" alt=\""+ user.get("username") +"\"></a>";
          stretchContainers();
        }
      }
      else {
        // Not logged in
        $(".navmenu").hide();
        $("#user-container").hide();
      }
    }
      
      function stretchContainers() {
        $(".stretch-container").each(function(){
        // Uncomment the following if you need to make this dynamic
        //var refH = $(this).height();
        //var refW = $(this).width();
        //var refRatio = refW/refH;
        var parent = this;
        $(this).find("img").load(function(){
        // Hard coded value...
        var conH = $(parent).height();
        var conW = $(parent).width();
        var refRatio = conW/conH;
        //alert(conH);
        var img = $(parent).find("img");
        var imgH = img.height();
        var imgW = img.width();
        var imgRatio = (imgW/imgH);
        //alert("H" + imgH +" W " +imgW);
        if ( imgRatio < refRatio ) {
          img.width(conW+"px");
            img.height((conH*(imgH/imgW))+"px");
            
        } else if (imgRatio > refRatio){
            img.height(conH+"px");
            img.width((conW*imgRatio)+"px");
        } else {
          
          img.height(conH+"px");
          img.width(conW+"px");
        }
        });
        });
    }

function dateDiff(today, date){
  // get total seconds between the times
  var ndate =  Date.parse(date);
  var ntoday = Date.parse(today);
var delta = Math.abs(ntoday - ndate) / 1000;

// calculate (and subtract) whole days
var days = Math.floor(delta / 86400);
delta -= days * 86400;

// calculate (and subtract) whole hours
var hours = Math.floor(delta / 3600) % 24;
delta -= hours * 3600;

// calculate (and subtract) whole minutes
var minutes = Math.floor(delta / 60) % 60;
delta -= minutes * 60;

// what's left is seconds
var seconds = delta % 60;  // in theory the modulus is not required
  var text="";
  if (days > 0){
    text = days + " Day(s) ago";
    return text;
  }
  else if (hours > 0){
    text = hours + " Hour(s) and "+ minutes + " Minutes ago";
    return text;
  }
  else if (minutes > 0) {
    text = minutes + " Minute(s) ago";
    return text;
  } else if (seconds > 0) {
    text = seconds + " Second(s) ago";
    return text;
  } else{
    text = "moments ago";
    return text;
  }
}
function signOut(){
      Parse.User.logOut();
      window.location.href = "./"
    }
function checkLogin(){
  if (!loggedIn)
    window.location.href="./";
}

(function($){
	$.fn.styleddropdown = function(){
		return this.each(function(){
			var obj = $(this)
			obj.find('.submenu-entry').hover(function() { //onclick event, 'list' fadein
        var submenu = obj.find('.submenu');
        
        submenu.css("top", ($(this).position().top+23) + "px");
        submenu.css("left", ($(this).position().left) + "px");
			submenu.fadeIn(400);
			
			$(document).keyup(function(event) { //keypress event, fadeout on 'escape'
				if(event.keyCode == 27) {
				obj.find('.submenu').fadeOut(400);
				}
			});
			
			obj.find('.submenu').hover(function(){ },
				function(){
					$(this).fadeOut(400);
				});
			});
      
      obj.find('.submenu-entry').click(function() { //onclick event, 'list' fadein
        var submenu = obj.find('.submenu');
        
        submenu.css("top", (obj.position().top+25) + "px");
        submenu.css("left", (obj.position().left+5) + "px");
			submenu.fadeIn(400);
			
			$(document).keyup(function(event) { //keypress event, fadeout on 'escape'
				if(event.keyCode == 27) {
				obj.find('.submenu').fadeOut(400);
				}
			});
			
			obj.find('.submenu').hover(function(){ },
				function(){
					$(this).fadeOut(400);
				});
			});
			
			obj.find('.submenu li').click(function() { //onclick event, change field value with selected 'list' item and fadeout 'list'
		
			obj.find('.submenu').fadeOut(400);
			});
		});
	};
})(jQuery);
    $(function(){
	$('.menu').styleddropdown();
});
/*
$(function() {
    $( document ).tooltip();
  });*/