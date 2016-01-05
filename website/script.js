var flickr_user_id = '46910958@N02';
var flickr_api_key = '10e3bd8029bd2e9ef8b1447352535c67';
var flickr_method  = 'flickr.people.getPublicPhotos';
var photo_data = []; // from flickr API
var page_index = 0;

function request_photos() {
  // We could also show error_mode on timeout
  var args = {'method': flickr_method,
             'api_key': flickr_api_key,
             'user_id': flickr_user_id,
        'jsoncallback': 'load_photos',
              'format': 'json'};
  var script = document.createElement('script');
  script.src = 'https://api.flickr.com/services/rest/?' +
      Object.keys(args).map(function (k) {return `${k}=${args[k]}`}).join('&');
  document.getElementsByTagName('head')[0].appendChild(script);
}

function load_photos(api_data) {
  try {
    photo_data = api_data['photos']['photo'];
    show_page(0);
  } catch (e) {
    console.log(e);
    error_mode('Oops, please try back later.');
  }
}

function show_page(offset) {
  var size = 'b'; // [mstzb]
  var index = page_index + offset;
  page_index = index;
  photo = photo_data[index];
  var img_url = "https://farm" + photo['farm'] + ".staticflickr.com/" +
      photo['server'] + "/" + photo['id'] + "_" + photo['secret'] + "_" + size + ".jpg";
  document.getElementById('photo_image').style.backgroundImage = "url('" + img_url + "')";
  document.getElementById('image_title').innerHTML = photo['title'];
  document.getElementById('left_arrow').style.visibility = (index === 0) ? "hidden" : "visible";
  document.getElementById('right_arrow').style.visibility = (index < photo_data.length - 1) ? "visible" : "hidden";
}

function error_mode(message) {
  var img_url = 'https://gretchenrubin.com/wp-content/uploads/2013/02/broken-window.jpg';
  document.getElementById('photo_image').style.backgroundImage = "url('" + img_url + "')";
  document.getElementById('image_title').innerHTML = message;
  document.getElementById('mouse_type').style.visibility = "hidden";

}
