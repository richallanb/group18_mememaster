// Our main interface & object
var mememasterUploader = new uploader();
      
      $("#upload-modal-local-option").click(function(){
        $("#upload-modal-files-container").hide();
          mememasterUploader.clear(document.getElementById("upload-modal-files-container"));
          mememasterUploader.fileMode = true;
        $("#upload-modal-file-landing").show();
        $("#upload-modal-url-landing").hide();
        $("#upload-modal-web-option").removeClass( "upload-modal-menu-selected" );
        $("#upload-modal-local-option").addClass( "upload-modal-menu-selected" );
      });
      
      $("#upload-modal-web-option").click(function(){
        $("#upload-modal-files-container").hide();
          mememasterUploader.clear(document.getElementById("upload-modal-files-container"));
          mememasterUploader.fileMode = false;
        $("#upload-modal-url-landing").show();
        $("#upload-modal-file-landing").hide();
        $("#upload-modal-local-option").removeClass( "upload-modal-menu-selected" );
        $("#upload-modal-web-option").addClass( "upload-modal-menu-selected" );
      });
    
      
      $(function() {
        $("#upload-modal-browse").click(function(){
          performClick(document.getElementById("input-upload-modal-browse"));
        });
      });
      function performClick(node) {
        var evt = document.createEvent("MouseEvents");
        evt.initEvent("click", true, false);
        node.dispatchEvent(evt);
        
      }
      $(function() {$('#upload-modal-gallery-option').change(function(){
        $('#upload-modal-gallery-title').toggle();
        if (document.getElementById('upload-modal-gallery-option').checked)
          $('.upload-modal-cover-option').show();
        else
          $('.upload-modal-cover-option').hide();
      });});
      
     
      
      
         


      $(function() {
        $("#input-upload-modal-browse").change(function(){
          var modalFile = $("#input-upload-modal-browse")[0];
          if (modalFile.files.length > 0) {
            $("#upload-modal-files-container").show();

            mememasterUploader.display_files(modalFile,   document.getElementById("upload-modal-files-container"));
              
            
            //var name = "photo.jpg";
           
            //var parseFile = new Parse.File(name, file);
          }
        });
      });
      
      
     
      $(function() {  
      $("#upload-modal-done").click(function() {  
          //var modalFile = $("#input-upload-modal-browse")[0];
          if (mememasterUploader.fileMode == true) {
          if (mememasterUploader.modalFile.length > 0) {
            var tags = [];
            var nsfw = [];
            var cover = 0;
            var first_i=-1;
            var cover_applied = false;
            for (var i=0; i < mememasterUploader.modalFile.length; i++){
              var f = mememasterUploader.modalFile[i];
              if (f != null) {
                var currentTag = document.getElementById("upload-modal-tags-"+i).value;
                currentTag = currentTag.toLowerCase().replace(/\W/g," ").match(/([^\;^\s^\,])+/gi);
                if (first_i == -1)
                  first_i = i;
               // if (currentTag.length > 0)
                  tags[i] = currentTag;
                if (document.getElementById("upload-modal-cover-option-"+ i).checked) {
                  cover = i;
                  cover_applied = true;
                }
                nsfw[i] = document.getElementById("upload-modal-nsfw-option-" + i).checked;
              }
            }
            if (!cover_applied)
              cover = first_i;
            //alert("CA= " + cover_applied + " FI= " +first_i + " COVER= " + cover)
            mememasterUploader.upload_files(update_uploader,
document.getElementById("upload-modal-gallery-option").checked,
document.getElementById("upload-modal-gallery-title").value,tags,cover,nsfw);
        }
          } else{
            alert("This function hasn't been implemented yet.. Not by choice I assure you. Blame internet security.")
          }
      });  
    });
    
    function update_uploader(i, status){
      if (status < 3) {
      var value = ["","Uploading", "Uploaded"]
      document.getElementById("upload-modal-status-"+i).style.backgroundImage="url('anim/modal-loading.gif')";;
      if (status == 2)
        $("#upload-modal-files-" + i ).fadeOut(400);
        
      } else {
        $("#upload-modal-files-container").hide();
        $("#upload-modal").slideUp(400);  
        $("#blackout").fadeOut(700);
      }
    }
    
    function completion_task(id){
      location.href="memepage.html?gal="+id;
    }
    $("#url-entry").keyup(function(){
      mememasterUploader.displayURLFiles(document.getElementById("url-entry").value, document.getElementById("upload-modal-files-container"));
    });
/* ----------------------- */
/* ----------------------- */
/* --- Uploader Object --- */      
/* ----------------------- */
/* ----------------------- */
/* THUMBNAIL SIZE */      
MAX_HEIGHT = 300;
MAX_WIDTH=300;

function uploader () {

   this.modalFile = [];
   this.urlList = [];
   this.fileMode = true;
   this.body = {content: []};
   this.status = {value: 0};
   var parent = this;
  
   /* Upload each file from our file dialog to parse */
   this.clear = (function(target){
         this.modalFile.length = 0;
         this.urlList.length = 0;
         this.body.content.length = 0;
         target.innerHTML = "";
   });
  
   this.displayURLFiles=(function(urlString, target){
     var body = "";
     if (urlString.length > 0){
       parent.urlList = urlString.match(/([^\n^\s^\,^\;])+/gi);
       //alert(parent.urlList);
       $("#upload-modal-files-container").show();
       for (var i = 0; i < parent.urlList.length; i++) {
         
         
                     body += file_display_builder(i, parent.urlList[i], parent.urlList[i].substring(parent.urlList[i].lastIndexOf('/')+1));
                      //target.innerHTML = newbody;
         
        var img = new Image()
        img.src = parent.urlList[i];
        img.onload = function(parent, body, target,i) {return (function(e) {
   
            var myBlob = this.response;
            
            target.innerHTML = body;
            stretchContainers();
            
         
        });
       }(parent,body, target,i);
       
                                    
            
       }
     }
   });
  
   this.uploadURLFiles = (function (urlList, updater, gallery, title, tags, cover, nsfw){
     for (var i = 0; i < urlList.length; i++) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', urlList[i], true);
        xhr.responseType = 'blob';
        xhr.onload = function(e) {
          if (this.status == 200) {
            var myBlob = this.response;
            // myBlob is now the blob that the object URL pointed to.
            parent.modalFile[i] = myBlob;
            parent.modalFile[i].name = urlList[i].substring(urlList[i].lastIndexOf('/')+1);
            if (i == urlList.length){
              parent.upload_files(updater,gallery,title,tags,cover,nsfw)
            }
          }
        };
        xhr.send();
     }
   });
 
/* Upload each file from our file dialog */
   this.upload_files = (function (updater, gallery, title, tags, cover,nsfw) {
       // Calculate real length of how many files in our blob collection
         var realLength = 0;
         for (var c = 0; c < this.modalFile.length; c++){
           if (this.modalFile[c] != null)
             realLength += 1;
         }
       
        // alert("cover value = "+ cover);
         var parseFile = []; // The image
         var parseFileThumb = []; // A resized thumbnail
         var user = Parse.User.current(); // The user
         var user_gal_rel = user.relation("galleries"); // Stating that we're related to a gallery
         var catTags = ""; // a Concatenation of all tags
         var newgallery; // Our new gallery
         var gal_img_rel; // The images related to that gallery
         
         
     // Concatenate all tags no longer needed
         /*for (var t = 0;t<tags.length; t++){
           if (tags[t].length > 0)
           catTags = catTags +  tags[t]+";";
         }*/
     
       // If gallery is checked we have a title and all images should be uploaded to a single gallery
        if (gallery) {
            //alert(gallery + "t");
           var titleList = title.toLowerCase().replace(/\W/g," ").match(/([^\s])+/gi);
           //titleList = arrayToLower(titleList);
           // Convert tags to 1d array
           var tags1D=[];
           for(var i = 0; i < tags.length; i++)
           {
               tags1D = tags1D.concat(tags[i]);
           }
           var nsfwSingle = false;
           for (var i =0; i< nsfw.length; i++){
             if (nsfw[i])
               nsfwSingle = true;
           }
           newgallery = new Parse.Object("gallery");
           gal_img_rel = newgallery.relation("images");
           newgallery.set("title", title);
          // We need a lowercase title for searching
           newgallery.set("title_to_lower", titleList);
           newgallery.set("tags", tags1D);
           newgallery.set("public", false);
           newgallery.set("likes",0);
           newgallery.set("total_likes", 0);
           newgallery.set("user", user);
           newgallery.set("nsfw", nsfwSingle);
        }
     
         for (var i = 0; i < this.modalFile.length; i++){
           // Since we delete files by making them null
           if (this.modalFile[i] != null) {
             
             // Send out our current status Uploading
             updater(i, 1);
             // Setup our image file for upload
             parseFile[i] = new Parse.File (this.modalFile[i].name, 
                                              this.modalFile[i]);
             
             
             //Give it a thumbnail name for later
             var nameth = "th_"+parent.modalFile[i].name;
             // Generate a title name for non-galleries
             var nonGalleryTitle = parent.modalFile[i].name.substring(0,parent.modalFile[i].name.length-4);
             nonGalleryTitle = nonGalleryTitle.replace(/\W/g," ");
             var nonGalleryTitleList = nonGalleryTitle.toLowerCase().match(/([^\s])+/gi);
      
             /* Thumbfile Generation using Canvas */
              var resCanvas = document.createElement("canvas");
              var resReader = new FileReader();
              
              resReader.readAsDataURL(this.modalFile[i]);
             resReader.onload = function( parseFile, parseFileThumb, user, user_gal_rel, catTags, newgallery,
                                         gal_img_rel, i, updater, newstatus, length,nonGalleryTitle,gallery,nameth,nsfw) { return (function(e){
                var src = e.target.result;
                var img = new Image();
                img.src = src;
                var dataURL;
                //alert("i" + i +"  user" + user.id);
                img.onload = function(){
                  if(img.height > MAX_HEIGHT) {
                    img.width *= MAX_HEIGHT / img.height;
                    img.height = MAX_HEIGHT;
                  }
                  if(img.width > MAX_WIDTH) {
                    img.height *= MAX_WIDTH / img.width;
                    img.width = MAX_WIDTH;
                  }
                  var ctx = resCanvas.getContext("2d");
                  ctx.clearRect(0, 0, resCanvas.width, resCanvas.height);
                  resCanvas.width = img.width;
                  resCanvas.height = img.height;
                  ctx.drawImage(img, 0, 0, img.width, img.height);
                  dataURL = resCanvas.toDataURL("image/jpeg");
                  //document.getElementById('resize-img').src = dataURL;
                  
                  // Thumb was generated and turned into a blob
                  var base64 = dataURL.split('base64,')[1];
                  parseFileThumb[i] = new Parse.File(nameth, { base64: base64 });
                  
                  
                  // Now we save orignal file
                  parseFile[i].save().then(function(){
                  /* Once in here our file has been saved */
                    //alert("Image saved" + " PT =" + parseFileThumb[i] + " user = " + user.id );
                  
                  
                    
                  // Create our images object
                  var images = new Parse.Object("images");
                  // Assign our various image attributes
                  images.set("note", "");
                  images.set("url", "");
                  images.set("url_only",false);
                  // Assign the file
                  images.set("pic", parseFile[i]);
                  // Here we simply give the gallery id
                  images.set("gallery", newgallery);
                  
                  // Now we save our thumbnail
                  parseFileThumb[i].save().then(function(){
                    // Assign the thumbnail
                    //alert("Thumbnail saved");
                    images.set("thumb", parseFileThumb[i]);
                    
                    // Now we save the image entry
                    images.save(null, {
                      success: function(images) {
                          //alert("Image saved");
                          // Now we're ready to save the gallery
                          if (gallery) {
                           // If we have the gallery option set, we need a single cover image
                           // And the gallery was setup for us from earlier
                           if (i == cover)
                              newgallery.set("cover",images);
                           } else {
                             
                             // If gallery option off we need to create a new gallery for each image
                              newgallery = new Parse.Object("gallery");
                              gal_img_rel = newgallery.relation("images");
                             // alert(nonGalleryTitle);
                              newgallery.set("title", nonGalleryTitle); 
                            //  alert(nonGalleryTitleList + " "+ nonGalleryTitleList.length);
                              newgallery.set("title_to_lower", nonGalleryTitleList); 
                              //alert(tags + " "+ tags.length);
                              newgallery.set("tags", tags[i]);
                              newgallery.set("public", false);
                              newgallery.set("likes",0);
                              newgallery.set("total_likes", 0);
                              newgallery.set("user", user);
                              newgallery.set("cover",images);
                              newgallery.set("nsfw",nsfw[i]);
                          }
                          // We keep adding images to our relation
                          gal_img_rel.add(images);
                          newgallery.save().then(function(newgallery)
                          {
						                    // We finally save our gallery
                                // And add it to the user's relations
                                user_gal_rel.add(newgallery);
                                // This image is now done so we update it
                                updater(i, 2);
                                // We keep track of how many images have finished
                                parent.status.value += 1;
                                // If all images are finished we save our user data
                                if (parent.status.value == length) {
                                  // Then we save the user's new information
                                  user.save().then(function(){
                                  updater(i, 3);
                                  parent.status.value = 0;
                                  // And we do whatever we do when we complete.
                                  if (gallery)
                                    completion_task(newgallery.id);
                                  else
                                    location.href="/home.html";
                                   });
                                  
                                }

                          });
			                  
                      },
                      error: function(images, error) {
                        // Execute any logic that should take place if the save fails.
                        // error is a Parse.Error with an error code and description.
                       // alert('Failed to create new object, with error code: ' + error.message);
                      }
                    });
                  });
              }(), function(error) {
                // The file either could not be read, or could not be saved to Parse.
              });
             };
              });
                 }(parseFile, parseFileThumb, user, user_gal_rel, catTags, newgallery,  gal_img_rel, i, updater, this.status, realLength,nonGalleryTitle,gallery,nameth,nsfw);
           }
         }
         // Empty our list.
         
         this.modalFile.length = 0;
         this.body.content.length = 0;
         //target.innerHTML = "";
       });

   /* Display the files from our file dialog into a target */

   this.display_files = (function (newModalFile, target) {
     
     
    //Retrieve all the files from the FileList object
    if (newModalFile.files.length > 0) {
        var x = this.modalFile.length;
        for (var y=0, f; f=newModalFile.files[y]; y++) {
            // Append the new files to our old filelist
            this.modalFile[x + y]  = f;
            $("#upload-modal-files-" + x  + y ).show();
            var r = new FileReader();
            r.onload = (function(newbody, newf, x, y) {
                return function(e) {
                    var contents = e.target.result;
                    var shortfname = "";
                    if (newf.name.length - 8 > 25)
                      shortfname = newf.name.substring(0, 25) + "... " + newf.name.substring(newf.name.length-4, newf.name.length);
                    else
                      shortfname = newf.name;
                    newbody.content[x+y] = file_display_builder(x + y, contents, shortfname);
                    //target.innerHTML = newbody;

                    target.innerHTML = target.innerHTML + newbody.content[x+y]; 
                    stretchContainers();
                };
            })(this.body, this.modalFile[x+y], x, y);
            if (this.modalFile[x + y] .type=="image/gif") {
              var shortfname = "";
              if (shortfname.length - 8 > 25)
                shortfname = this.modalFile[x + y].name.substring(0, 25) + "... " + this.modalFile[x + y].name.substring(this.modalFile[x + y].name.length-4, this.modalFile[x + y].name.length);
              else
                shortfname = this.modalFile[x+y].name;
              this.body.content[x+y] = file_display_builder(x+y, "sprites/60x60_no_preview.png", shortfname);
              target.innerHTML = target.innerHTML + this.body.content[x+y];
              //stretchContainers();
            } else
              r.readAsDataURL(this.modalFile[x + y]);
        } 
       /*for (z = 0; z < this.modalFile.length; z++)
        if (this.modalFile[z] != null)
        console.log(z+ " modalF: " + this.modalFile[z].name);
    console.log("--------------------------------------");
    console.log("--------------------------------------");*/
    } else {
        //If a file fails to load.
    }
   
  });

  this.remove_file = (function(i, container){
    this.modalFile[i] = null;
    this.body.content[i] = "";
   /* for (z = 0; z < this.modalFile.length; z++)
      if (this.modalFile[z] != null)
      console.log(z+ " modalF: " + this.modalFile[z].name);
    console.log("--------------------------------------");
    console.log("--------------------------------------");*/
    //alert(this.modalFile.length);
    $("#upload-modal-files-" + i ).hide(400);/*, 
    function(container, newbody) {
                                        // Redraw the upload box
                                        container.innerHTML = "";
                                        for (var p = 0; p < newbody.content.length; p++){
                                            container.innerHTML = container.innerHTML + newbody.content[p];
                                          }
                                        }(container, this.body));*/
  });
}
function arrayToLower(array){
  var newArray = new Array();
  for (var i = 0; i < array.length; i++){
    newArray[i] = array[i].toLower();
    newArray[i] = newArray[i].replace(/\W/g," ");
  }
  return newArray;
}
function file_display_builder(i, src, filename) {
  var cover;
  var closeDisplay = "display:block;"
  if (document.getElementById('upload-modal-gallery-option').checked)
    cover = "initial";
  else
    cover = "none";
  if (mememasterUploader.fileMode)
    closeDisplay = "display:block;";
  else
    closeDisplay = "display:none;";
  
  return ("<article id=\"upload-modal-files-" + i  + "\" class=\"upload-modal-file\"><section class=\"upload-modal-file stretch-container\"><img class=\"upload-modal-file-pic\" src=\"" + src + "\" id=\"upload-modal-file-pic-" + i + "\" alt=\"" + filename + "\"></section><aside class=\"upload-modal-file\"><div style=\"width:250px;float:left;\"><ul class=\"upload-modal\"><li class=\"upload-modal-file\"><input type=\"text\" class=\"upload-modal-tags\" id=\"upload-modal-tags-" + i + "\" placeholder=\"Tags\"></li><li class=\"upload-modal-file\" style=\"margin-top:3px;\"><input type=\"checkbox\" id=\"upload-modal-nsfw-option-" + i + "\"><label for=\"upload-modal-nsfw-option-" + i + "\">NSFW</label></li><li class=\"upload-modal-file\" style=\"margin-top:10px;\"><input type=\"checkbox\" style=\"display:"+ cover +";\" class=\"upload-modal-cover-option\" id=\"upload-modal-cover-option-" + i + "\"><label class=\"upload-modal-cover-option\" style=\"display:"+ cover +";\" for=\"upload-modal-cover-option-" + i + "\">Cover</label></li></div></ul><div style=\"margin: 3px 0 0 20px;float:left;\"><div onclick=\"mememasterUploader.remove_file(" + i + ",document.getElementById('upload-modal-files-container'))\" class=\"upload-modal-file-delete\" id=\"upload-modal-file-delete\" style=\""+closeDisplay+"\"></div></div></aside><footer id=\"upload-modal-status-" + i + "\" class=\"upload-modal-file\">" + filename + "</footer></article>");

}

/*document.getElementById('upload-modal-files-container').innerHTML = file_display_builder(0, "thumb_test.jpg", "thumb_test.jpg")
   $("#upload-modal-files-container").show();*/