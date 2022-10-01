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
    this.contextMenu = document.querySelector('.context-menu');
    this.Post = Post;
    this.file = [];
    this.previewContainer = null;
    this.pagination = [0, 9];

    this.addEventListeners = this.addEventListeners.bind(this);
    this.sendPost = this.sendPost.bind(this);
    this.fileInputOnChange = this.fileInputOnChange.bind(this);
    this.drawPostList = this.drawPostList.bind(this);
    this.openUploadWindow = this.openUploadWindow.bind(this);
    this.addFilePreview = this.addFilePreview.bind(this);
    this.clickEventRouter = this.clickEventRouter.bind(this);
    this.scroll = this.scroll.bind(this);
    this.showContextMenu = this.showContextMenu.bind(this);
    this.downloadImage = this.downloadImage.bind(this);
  }

  async init() {
    this.addEventListeners();
    const posts = await request(this.pagination, 'GET', '', null);
    const postsJSON = await posts.json();
    this.drawPostList(postsJSON, 'afterbegin');

    const dropZone = document.querySelector('#drop-zone');
    const dradAndDrop = new DragAndDrop(dropZone, this);
    dradAndDrop.init();
    this.postsContainer.scrollTop = this.postsContainer.scrollHeight;
  }

  clickEventRouter(event) {
    const selector = event.target.classList;

    if (!this.contextMenu.classList.contains('hidden')) {
      this.contextMenu.classList.add('hidden');
    }

    if (selector.contains('file-upload')) {
      this.openUploadWindow(event);
    }

    if (selector.contains('error-popup-btn')) {
      document.querySelector('.error-popup').remove();
    }

    if (selector.contains('context-menu')) {
      this.downloadImage(event);
    }
  }

  addEventListeners() {
    this.form.textForm.addEventListener('submit', this.sendPost);
    window.addEventListener('click', this.clickEventRouter);
    window.addEventListener('mousedown', this.showContextMenu);
    this.postsContainer.addEventListener('scroll', this.scroll);
    this.fileInput.addEventListener('change', this.fileInputOnChange);
    document.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  sendPost(e) {
    e.preventDefault();
    const time = Date.now();
    const post = new this.Post(this.form.textInput.value, time, 'user', this.file);
    const text = post.HTMLElement.querySelector('.post-content');

    text.innerHTML = findLinks(text);

    this.drawPost(post.HTMLElement, 'beforeend');
    this.postsContainer.scrollTop = this.postsContainer.scrollHeight;

    const data = makeData(post);

    request(this.pagination, 'POST', '', data)
      .then(() => { this.file = []; });

    this.form.clean();
    if (this.previewContainer) {
      this.previewContainer.remove();
    }
  }

  drawPost(post, where) {
    this.postsContainer.insertAdjacentElement(where, post);
  }

  drawPostList(postList, where) {
    for (let i = 0; i < postList.length; i += 1) {
      const { text, time, files } = postList[i];
      const post = new this.Post(text, time, 'user', files);
      const textElement = post.HTMLElement.querySelector('.post-content');

      textElement.innerHTML = findLinks(textElement);
      this.drawPost(post.HTMLElement, where);
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
    this.file = [];
    if (this.previewContainer) {
      this.previewContainer.remove();
    }
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

    if (format === 'video') {
      const videoElement = element('video', null, ['video-file']);
      videoElement.setAttribute('controls', 'controls');
      videoElement.src = file;
      this.previewContainer.insertAdjacentElement('beforeend', videoElement);
      this.file.push(file);
      return;
    }

    const img = element('img', null, []);
    img.src = file;
    this.previewContainer.insertAdjacentElement('beforeend', img);
    this.file.push(file);
  }

  async scroll(e) {
    let currentScroll;

    if (e.target.scrollTop === 0) {
      currentScroll = e.target.scrollHeight;
      this.pagination = this.pagination.map((el) => el + 10);
      const posts = await request(this.pagination, 'GET', '', null);
      const postsJSON = await posts.json();

      if (!postsJSON.length) {
        return;
      }

      this.drawPostList(postsJSON, 'afterbegin');
      this.postsContainer.scrollTop = e.target.scrollHeight - currentScroll;
    }
  }

  showContextMenu(e) {
    e.stopPropagation();

    if (e.button === 2 && e.target.tagName === 'IMG') {
      this.file = [];
      this.contextMenu.classList.remove('hidden');
      this.contextMenu.style.top = `${e.clientY - this.contextMenu.getBoundingClientRect().height}px`;
      this.contextMenu.style.left = `${e.clientX}px`;
      this.file.push(e.target.src);
    }
  }

  downloadImage() {
    const a = element('a', null, []);
    a.setAttribute('download', '');
    const [img] = this.file;
    a.href = img;
    a.click();
  }
}

export default Controller;
