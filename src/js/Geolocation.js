import { element } from './Service';

class Geolocation {
  constructor(controller) {
    this.ctrl = controller;
    this.location = null;

    this.define = this.define.bind(this);
    this.makeGeoElement = this.makeGeoElement.bind(this);
  }

  define() {
    this.location = navigator.geolocation.getCurrentPosition(this.makeGeoElement);
  }

  makeGeoElement(position) {
    const geoElement = element('a', 'geo', ['geolocation']);
    geoElement.href = `http://google.com/maps/@${position.coords.latitude},${position.coords.longitude}`;

    this.ctrl.previewContainer = element('div', null, ['filePreviewContainer']);
    const input = document.querySelector('.post-form > input[type="text"]');
    input.value += geoElement;
  }
}

export default Geolocation;
