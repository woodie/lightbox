// file: test-lightbox.js

"use strict";

var jsdom    = require('mocha-jsdom');
var expect   = require('chai').expect;
var lightbox = require('../website/script');

var set_divs = function (doc, keys) {
  if (typeof document !== 'undefined') {
    var body = doc.getElementsByTagName('body')[0];
    var divs = {};
    for (let key of keys) {
      divs[key] = document.createElement('div');
      divs[key].id = key;
      body.appendChild(divs[key]);
    }
  }
  return divs;
};

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
      var divs = set_divs(document, ['thumbnails'])
      var data = [{'id': 33, 'secret': 'foo'}, {'id': 66, 'secret': 'bar'}];
      lightbox.build_thumbs(data);
      var imgs = divs['thumbnails'].children;
      expect(imgs[0].className).to.equal('thumbnail selected');
      expect(imgs[0].src).to.include('33_foo_t.jpg');
      expect(imgs[1].className).to.equal('thumbnail');
      expect(imgs[1].src).to.include('66_bar_t.jpg');
    });
  });

  describe('render_view()', function () {
    jsdom();
    it('has first/middle/last behavior', function () {
      var keys = 'thumbnails photo_image photo_title left_arrow right_arrow'.split(' ')
      var divs = set_divs(document, keys)
      var data = [{'id': 33, 'secret': 'foo', 'title': 'thirty three'},
                  {'id': 66, 'secret': 'bar', 'title': 'sixty six'},
                  {'id': 99, 'secret': 'baz', 'title': 'ninety nine'}];
      lightbox.render_view(data, 0);
      expect(divs['photo_image'].style.backgroundImage).to.include('33_foo_b.jpg');
      expect(divs['photo_title'].innerHTML).to.equal('thirty three');
      expect(divs['left_arrow'].style.visibility).to.equal('hidden');
      expect(divs['right_arrow'].style.visibility).to.equal('visible');
      lightbox.render_view(data, 1);
      expect(divs['photo_image'].style.backgroundImage).to.include('66_bar_b.jpg');
      expect(divs['photo_title'].innerHTML).to.equal('sixty six');
      expect(divs['left_arrow'].style.visibility).to.equal('visible');
      expect(divs['right_arrow'].style.visibility).to.equal('visible');
      lightbox.render_view(data, 2);
      expect(divs['photo_image'].style.backgroundImage).to.include('99_baz_b.jpg');
      expect(divs['photo_title'].innerHTML).to.equal('ninety nine');
      expect(divs['left_arrow'].style.visibility).to.equal('visible');
      expect(divs['right_arrow'].style.visibility).to.equal('hidden');
    });
  });

  describe('error_mode()', function () {
    jsdom();
    it('should render error view', function () {
      var keys = 'photo_image photo_title copyright'.split(' ')
      var divs = set_divs(document, keys)
      var message = 'Oops, something is broken here!';
      lightbox.error_mode(message);
      expect(divs['photo_image'].style.backgroundImage).to.include('broken-window.jpg');
      expect(divs['photo_title'].innerHTML).to.equal(message);
      expect(divs['copyright'].style.visibility).to.equal('hidden');
    });
  });

});
