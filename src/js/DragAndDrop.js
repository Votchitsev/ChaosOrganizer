import { preventDefaults } from './Service';

class DragAndDrop {
  constructor(dropZoneElement, controller) {
    this.dropZoneElement = dropZoneElement;
    this.controller = controller;

    this.showDropZone = this.showDropZone.bind(this);
    this.hideDropZone = this.hideDropZone.bind(this);
    this.handeleDrop = this.handeleDrop.bind(this);
  }

  init() {
    ['dragenter', 'dragover'].forEach((event) => {
      document.addEventListener(event, this.showDropZone, false);
    });

    ['dragleave', 'drop'].forEach((event) => {
      this.dropZoneElement.addEventListener(event, this.hideDropZone, false);
    });

    ['dragenter', 'dragleave', 'dragover', 'drop'].forEach((event) => {
      this.dropZoneElement.addEventListener(event, preventDefaults, false);
    });

    this.dropZoneElement.addEventListener('drop', this.handeleDrop, false);
  }

  showDropZone() {
    this.dropZoneElement.classList.add('visible');
  }

  hideDropZone() {
    this.dropZoneElement.classList.remove('visible');
  }

  handeleDrop(e) {
    this.controller.fileInput.files = null;
    this.files = null;
    this.files = e.dataTransfer.files;
    this.controller.fileInput.files = this.files;
    const event = new Event('change');
    this.controller.fileInput.dispatchEvent(event);
  }
}

export default DragAndDrop;
