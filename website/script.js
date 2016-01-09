var photo_data = []; // from flickr API
var page_index = 0;  // selected photo

function request_photos() {
  // We could also show error_mode on timeout
  var args = {'jsoncallback': 'load_photos',
      'format': 'json',
      'method': 'flickr.people.getPublicPhotos',
      'api_key': '10e3bd8029bd2e9ef8b1447352535c67',
      'user_id': '46910958@N02'};
  var script = document.createElement('script');
  script.src = 'https://api.flickr.com/services/rest/?' +
      Object.keys(args).map(function (k) {return `${k}=${args[k]}`}).join('&');
  document.getElementsByTagName('head')[0].appendChild(script);
}

function load_photos(api_data) {
  try {
    photo_data = api_data['photos']['photo'];
    build_thumbs();
    render_view(0);
  } catch (e) {
    console.log(e);
    error_mode('Oops, please try back later.');
  }
}

function img_url(photo, size) {
  var size = size || 'b'; // [mstzb]
  return "https://farm" + photo['farm'] + ".staticflickr.com/" + photo['server'] +
      "/" + photo['id'] + "_" + photo['secret'] + "_" + size + ".jpg";
}

function build_thumbs() {
  var nav_html = '';
  for (var t = 0; t < photo_data.length; t++) {
    nav_html += `<img id='thumb_${t}' class='thumbnail ${t === 0 ? "selected" : ''}' ` +
        `onclick='render_view(${t})' src="${img_url(photo_data[t], 't')}">`;
  }
  document.getElementById('thumbnails').innerHTML = nav_html;
}

function nav_btn(next) {
  render_view(page_index + (next ? 1 : -1));
}

function render_view(page) {
  page_index = page;
  document.getElementById('photo_image').style.backgroundImage = "url('" + img_url(photo_data[page]) + "')";
  document.getElementById('photo_title').innerHTML = photo_data[page]['title'];
  document.getElementById('left_arrow').style.visibility = (page === 0) ? "hidden" : "visible";
  document.getElementById('right_arrow').style.visibility = (page < photo_data.length - 1) ? "visible" : "hidden";
  var thumbs = document.getElementsByClassName("thumbnail");
  for (var i = 0; i < thumbs.length; i++) {
    thumbs[i].className = (thumbs[i].id === "thumb_" + page) ? 'thumbnail selected' : 'thumbnail';
  }
}

function error_mode(message) {
  var img_url = 'https://gretchenrubin.com/wp-content/uploads/2013/02/broken-window.jpg';
  document.getElementById('photo_image').style.backgroundImage = "url('" + img_url + "')";
  document.getElementById('photo_title').innerHTML = message;
  document.getElementById('copyright').style.visibility = "hidden";
}
