exports.pdfThumbnail = function(image_url) {
   var ext  = image_url.substring(image_url.lastIndexOf('.'));
   if((ext === '.pdf') || (ext === '.doc')) {
      var TRANSFORM_URL = 'https://res.cloudinary.com/shimmyshimmycocobop/image/upload/w_120,h_180,c_fill/';
      var filename = image_url.substring((image_url.lastIndexOf('/') +1), (image_url.length -4));
      var full_url = TRANSFORM_URL + filename + ".png";
      return full_url;
   }
   else return image_url;
}

