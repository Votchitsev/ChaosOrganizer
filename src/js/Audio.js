import { getFileFormat } from './Service';

class Audio {
  constructor(controller) {
    this.controller = controller;
    this.playBtn = document.querySelector('.file-upload.audio');
    this.data = [];
    this.playBtnState = 'play';

    this.changePlayBtnStyle = this.changePlayBtnStyle.bind(this);
    this.create = this.create.bind(this);
  }

  async create() {
    this.changePlayBtnStyle('stop');
    this.playBtnState = 'stop';

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    const recorder = new MediaRecorder(stream);

    recorder.addEventListener('start', () => {
    });

    recorder.addEventListener('dataavailable', (event) => {
      this.data.push(event.data);
    });

    recorder.addEventListener('stop', () => {
      this.makeFilePreview();
      this.changePlayBtnStyle('start');
    });

    recorder.start();

    this.playBtn.addEventListener('click', () => {
      if (this.playBtnState === 'stop') {
        recorder.stop();
        this.playBtnState = 'play';
      }
    });
  }

  changePlayBtnStyle(style) {
    if (style === 'stop') {
      this.playBtn.classList.add('stop');
      this.playBtn.classList.remove('audio');
      return;
    }

    this.playBtn.classList.remove('stop');
    this.playBtn.classList.add('audio');
  }

  makeFilePreview() {
    this.controller.submitBtn.classList.remove('hidden');

    this.data.forEach((item) => {
      const reader = new FileReader();
      reader.addEventListener('load', (event) => {
        this.controller.addFilePreview(event.target.result, getFileFormat(event.target.result));
      });
      reader.readAsDataURL(item);
    });
  }
}

export default Audio;
