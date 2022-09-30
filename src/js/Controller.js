import {
  checkTotalSize,
  element,
  findLinks,
  makeData,
  showErrorPopup,
  getFileFormat,
} from './Service';
import request from './API/request';
import DragAndDrop from './DragAndDrop';

class Controller {
  constructor(form, Post) {
    this.form = form;
    this.postsContainer = document.querySelector('.posts-container');
    this.fileInput = document.querySelector('#file-input');
    this.openFileUpload = document.querySelector('.file-upload');
    this.Post = Post;
    this.file = [];
    this.previewContainer = null;

    this.addEventListeners = this.addEventListeners.bind(this);
    this.sendPost = this.sendPost.bind(this);
    this.fileInputOnChange = this.fileInputOnChange.bind(this);
    this.drawPostList = this.drawPostList.bind(this);
    this.openUploadWindow = this.openUploadWindow.bind(this);
    this.addFilePreview = this.addFilePreview.bind(this);
    this.clickEventRouter = this.clickEventRouter.bind(this);
  }

  async init() {
    this.addEventListeners();
    const posts = await request('GET', '', null);
    const postsJSON = await posts.json();
    this.drawPostList(postsJSON);

    const dropZone = document.querySelector('#drop-zone');
    const dradAndDrop = new DragAndDrop(dropZone, this);
    dradAndDrop.init();
    this.postsContainer.scrollTop = this.postsContainer.scrollHeight;
  }

  clickEventRouter(event) {
    const selector = event.target.classList;
    if (selector.contains('file-upload')) {
      this.openUploadWindow(event);
    }

    if (selector.contains('error-popup-btn')) {
      document.querySelector('.error-popup').remove();
    }
  }

  addEventListeners() {
    this.form.textForm.addEventListener('submit', this.sendPost);
    window.addEventListener('click', this.clickEventRouter);
    this.fileInput.addEventListener('change', this.fileInputOnChange);
  }

  sendPost(e) {
    e.preventDefault();
    const time = Date.now();
    const post = new this.Post(this.form.textInput.value, time, 'user', this.file);
    const text = post.HTMLElement.querySelector('.post-content');

    text.innerHTML = findLinks(text);

    this.drawPost(post.HTMLElement);
    this.postsContainer.scrollTop = this.postsContainer.scrollHeight;

    const data = makeData(post);

    request('POST', '', data)
      .then(() => { this.file = []; });

    this.form.clean();
    if (this.previewContainer) {
      this.previewContainer.remove();
    }
  }

  drawPost(post) {
    this.postsContainer.append(post);
  }

  drawPostList(postList) {
    for (let i = 0; i < postList.length; i += 1) {
      const { text, time, files } = postList[i];
      const post = new this.Post(text, time, 'user', files);
      const textElement = post.HTMLElement.querySelector('.post-content');

      textElement.innerHTML = findLinks(textElement);
      this.drawPost(post.HTMLElement);
    }
  }

  fileInputOnChange(e) {
    e.preventDefault();

    this.file = [];

    if (!this.fileInput.files.length) {
      return;
    }

    if (this.previewContainer) {
      this.previewContainer.remove();
    }

    const validatedSize = checkTotalSize(e.target.files, 10000000);
    if (!validatedSize) {
      showErrorPopup('Превышен максимальный размер передаваемых файлов (10 mb)');
      return;
    }

    this.previewContainer = element('div', null, ['filePreviewContainer']);
    this.form.textForm.insertAdjacentElement('beforebegin', this.previewContainer);
    this.previewContainer.style.top = `${this.openFileUpload.offsetTop - 160}px`;

    Array.from(this.fileInput.files).forEach((file) => {
      const reader = new FileReader();
      reader.addEventListener('load', (event) => {
        this.addFilePreview(event.target.result, getFileFormat(event.target.result));
      });
      reader.readAsDataURL(file);
    });
  }

  openUploadWindow(e) {
    e.preventDefault();
    this.fileInput.files = null;
    this.fileInput.click();
  }

  addFilePreview(file, format) {
    if (format === 'audio') {
      const audioElement = element('audio', null, []);
      audioElement.setAttribute('controls', '');
      audioElement.src = file;
      this.previewContainer.insertAdjacentElement('beforeend', audioElement);
      this.file.push(file);
      return;
    }

    const img = element('img', null, []);
    img.src = file;
    this.previewContainer.insertAdjacentElement('beforeend', img);
    this.file.push(file);
  }
}

export default Controller;
