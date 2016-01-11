// file: test-lightbox.js
var jsdom    = require('mocha-jsdom');
var expect   = require('chai').expect;
var lightbox = require('../website/script');

describe('Lightbox App', function () {

  describe('app_state', function () {
    it('should have initial values', function () {
      expect(lightbox.app_state.page_index).to.equal(0);
      expect(lightbox.app_state.photo_data).to.include.members([]);
    });
  });

  describe('nav_arrow()', function () {
    it('should go to the next page', function () {
      lightbox.app_state.photo_data = null; // stifle render
      lightbox.app_state.page_index = 3;
      lightbox.nav_arrow(1);
      expect(lightbox.app_state.page_index).to.equal(4);
    });
    it('should go to the previous page', function () {
      lightbox.app_state.photo_data = null; // stifle render
      lightbox.app_state.page_index = 3;
      lightbox.nav_arrow(-1);
      expect(lightbox.app_state.page_index).to.equal(2);
    });
    it('should cycle around the front', function () {
      lightbox.app_state.photo_data = null; // stifle render
      lightbox.app_state.alt_length = 9;
      lightbox.app_state.page_index = 0;
      lightbox.nav_arrow(-1);
      expect(lightbox.app_state.page_index).to.equal(9);
    });
    it('should cycle around the back', function () {
      lightbox.app_state.photo_data = null; // stifle render
      lightbox.app_state.alt_length = 9;
      lightbox.app_state.page_index = 9;
      lightbox.nav_arrow(1);
      expect(lightbox.app_state.page_index).to.equal(0);
    });
  });

  describe('nav_thumb()', function () {
    it('should seek to a specific page', function () {
      lightbox.app_state.photo_data = null; // stifle render
      lightbox.nav_thumb(1);
      expect(lightbox.app_state.page_index).to.equal(1);
    });
  });

  describe('request_photos()', function () {
    jsdom();
    it('should setup JSONP request', function () {
      lightbox.request_photos();
      var script = document.getElementsByTagName('script')[0];
      expect(script.src).to.be.a('string');
      expect(script.src).to.include('api.flickr.com');
    });
  });

  describe('img_url()', function () {
    var photo = {'farm': 'FARM', 'server': 'SERVER', 'id': 'ID', 'secret': 'SECRET'};
    it('should return image url', function () {
      var url = lightbox.img_url(photo);
      expect(url).to.equal('https://farmFARM.staticflickr.com/SERVER/ID_SECRET_b.jpg');
    });
    it('should return sized url', function () {
      var size = 'Z';
      var url = lightbox.img_url(photo, size);
      expect(url).to.equal('https://farmFARM.staticflickr.com/SERVER/ID_SECRET_' + size + '.jpg');
    });
  });

  describe('build_thumbs()', function () {
    jsdom();
    it('should populate thumbnails', function () {
      var thumb = document.createElement('div');
      thumb.id = 'thumbnails';
      var body = document.getElementsByTagName('body')[0];
      body.appendChild(thumb);
      var data = [{'id': 33, 'secret': 'foo'}, {'id': 66, 'secret': 'bar'}];
      lightbox.build_thumbs(data);
      var imgs = thumb.children;
      expect(imgs[0].className).to.equal('thumbnail selected');
      expect(imgs[0].src).to.include('33_foo_t.jpg');
      expect(imgs[1].className).to.equal('thumbnail');
      expect(imgs[1].src).to.include('66_bar_t.jpg');
    });
  });

  describe('render_view()', function () {
    jsdom();
    it('has first/middle/last behavior', function () {
      var thumb = document.createElement('div');
      thumb.id = 'thumbnails';
      var image = document.createElement('div');
      image.id = 'photo_image';
      var title = document.createElement('div');
      title.id = 'photo_title';
      var back = document.createElement('div');
      back.id = 'left_arrow'
      var next = document.createElement('div');
      next.id = 'right_arrow'
      var body = document.getElementsByTagName('body')[0];
      body.appendChild(thumb);
      body.appendChild(image);
      body.appendChild(title);
      body.appendChild(back);
      body.appendChild(next);
      var data = [{'id': 33, 'secret': 'foo', 'title': 'thirty three'},
                  {'id': 66, 'secret': 'bar', 'title': 'sixty six'},
                  {'id': 99, 'secret': 'baz', 'title': 'ninety nine'}];
      lightbox.render_view(data, 0);
      expect(image.style.backgroundImage).to.include('33_foo_b.jpg');
      expect(title.innerHTML).to.equal('thirty three');
      expect(back.style.visibility).to.equal('hidden');
      expect(next.style.visibility).to.equal('visible');
      lightbox.render_view(data, 1);
      expect(image.style.backgroundImage).to.include('66_bar_b.jpg');
      expect(title.innerHTML).to.equal('sixty six');
      expect(back.style.visibility).to.equal('visible');
      expect(next.style.visibility).to.equal('visible');
      lightbox.render_view(data, 2);
      expect(image.style.backgroundImage).to.include('99_baz_b.jpg');
      expect(title.innerHTML).to.equal('ninety nine');
      expect(back.style.visibility).to.equal('visible');
      expect(next.style.visibility).to.equal('hidden');
    });
  });

  describe('error_mode()', function () {
    jsdom();
    it('should render error view', function () {
      var image = document.createElement('div');
      image.id = 'photo_image';
      var title = document.createElement('div');
      title.id = 'photo_title';
      var right = document.createElement('div');
      right.id = 'copyright'
      var body = document.getElementsByTagName('body')[0];
      body.appendChild(image);
      body.appendChild(title);
      body.appendChild(right);
      var message = 'Oops, something is broken here!';
      lightbox.error_mode(message);
      expect(image.style.backgroundImage).to.include('broken-window.jpg');
      expect(title.innerHTML).to.equal(message);
      expect(right.style.visibility).to.equal('hidden');
    });
  });

});
