import {
  checkTotalSize,
  element,
  findLinks,
  makeData,
  showErrorPopup,
} from './Service';
import request from './API/request';

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
  }

  async init() {
    this.addEventListeners();
    const posts = await request('GET', '', null);
    const postsJSON = await posts.json();
    this.drawPostList(postsJSON);
  }

  addEventListeners() {
    this.form.textForm.addEventListener('submit', this.sendPost);
    this.openFileUpload.addEventListener('click', this.openUploadWindow);
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

    request('POST', '', data);

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
    if (!this.fileInput.files.length) {
      return;
    }

    const validatedSize = checkTotalSize(e.target.files);
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
        this.addFilePreview(event.target.result);
      });
      reader.readAsDataURL(file);
    });
  }

  openUploadWindow(e) {
    e.preventDefault();
    this.fileInput.click();
  }

  addFilePreview(file) {
    const img = element('img', null, []);
    img.src = file;
    this.previewContainer.insertAdjacentElement('beforeend', img);
    this.file.push(file);
  }
}

export default Controller;
