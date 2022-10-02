import { element, getFileFormat } from './Service';

class Video {
  constructor(controller) {
    this.controller = controller;
    this.playBtn = document.querySelector('.file-upload.video');
    this.data = [];
    this.videoStreamElement = null;
    this.playBtnState = 'play';

    this.changePlayBtnStyle = this.changePlayBtnStyle.bind(this);
    this.makeFilePreview = this.makeFilePreview.bind(this);
    this.closeStream = this.closeStream.bind(this);
  }

  async create() {
    this.changePlayBtnStyle('stop');
    this.playBtnState = 'stop';
    this.videoStreamElement = element('video', null, ['stream-video']);
    this.videoStreamElement.play();
    document.documentElement.append(this.videoStreamElement);

    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: 500,
      },
    });

    this.videoStreamElement.srcObject = stream;

    const recorder = new MediaRecorder(stream);

    recorder.addEventListener('dataavailable', (e) => {
      this.data.push(e.data);
    });

    recorder.addEventListener('stop', () => {
      this.makeFilePreview();
      this.closeStream();
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
      this.playBtn.classList.remove('video');
      return;
    }

    this.playBtn.classList.remove('stop');
    this.playBtn.classList.add('video');
  }

  makeFilePreview() {
    this.data.forEach((item) => {
      const reader = new FileReader();
      reader.addEventListener('load', (event) => {
        this.controller.addFilePreview(event.target.result, getFileFormat(event.target.result));
      });
      reader.readAsDataURL(item);
    });
  }

  closeStream() {
    this.videoStreamElement.remove();
  }
}

export default Video;
