var app_state = {
  page_index: 0,
  photo_data: []
};

var nav_arrow = function (offset) {
  app_state.page_index = app_state.page_index + offset;
  render_view(app_state.photo_data, app_state.page_index);
};

var nav_thumb = function (page) {
  app_state.page_index = page;
  render_view(app_state.photo_data, app_state.page_index);
};

var load_photos = function (api_data) {
  try {
    app_state.photo_data = api_data['photos']['photo'];
    build_thumbs(app_state.photo_data);
    render_view(app_state.photo_data, 0);
  } catch (e) {
    console.log(e);
    error_mode('Oops, please try back later.');
  }
};

// We could also show error_mode on timeout
var request_photos = function () {
  var args = {'jsoncallback': 'load_photos',
      'format': 'json',
      'method': 'flickr.people.getPublicPhotos',
      'api_key': '10e3bd8029bd2e9ef8b1447352535c67',
      'user_id': '46910958@N02'};
  var script = document.createElement('script');
  script.src = 'https://api.flickr.com/services/rest/?' +
      Object.keys(args).map(function (k) {return `${k}=${args[k]}`}).join('&');
  document.getElementsByTagName('head')[0].appendChild(script);
};

var img_url = function (photo, size) {
  var size = size || 'b'; // [mstzb]
  return "https://farm" + photo['farm'] + ".staticflickr.com/" + photo['server'] +
      "/" + photo['id'] + "_" + photo['secret'] + "_" + size + ".jpg";
};

var build_thumbs = function (data) {
  html = '';
  for (var t = 0; t < data.length; t++) {
    html += `<img id='thumb_${t}' class='thumbnail${t === 0 ? " selected" : ""}' ` +
        `onclick='nav_thumb(${t})' src="${img_url(data[t], 't')}">`;
  }
  document.getElementById('thumbnails').innerHTML = html;
};

var render_view = function (photos, index) {
  if (photos === null) {
    return;
  } else if (photos.length === 0) {
    error_mode('Sorry, no photos in this album.');
    return;
  };
  document.getElementById('photo_image').style.backgroundImage = "url('" + img_url(photos[index]) + "')";
  document.getElementById('photo_title').innerHTML = photos[index]['title'];
  document.getElementById('left_arrow').style.visibility = (index === 0) ? "hidden" : "visible";
  document.getElementById('right_arrow').style.visibility = (index < photos.length - 1) ? "visible" : "hidden";
  var thumbs = document.getElementById("thumbnails").children;
  for (var i = 0; i < thumbs.length; i++) {
    thumbs[i].className = (thumbs[i].id === "thumb_" + index) ? 'thumbnail selected' : 'thumbnail';
  }
};

var error_mode = function (message) {
  var img_url = 'https://gretchenrubin.com/wp-content/uploads/2013/02/broken-window.jpg';
  document.getElementById('photo_image').style.backgroundImage = "url('" + img_url + "')";
  document.getElementById('photo_title').innerHTML = message;
  document.getElementById('copyright').style.visibility = "hidden";
};

// support testing with mocha
if (typeof module !== 'undefined') {
  module.exports = {
      app_state: app_state,
      nav_arrow: nav_arrow,
      nav_thumb: nav_thumb,
      load_photos: load_photos,
      request_photos: request_photos,
      img_url: img_url,
      build_thumbs: build_thumbs,
      render_view: render_view,
      error_mode: error_mode
  };
}
