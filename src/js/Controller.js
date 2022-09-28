import { findLinks } from './Service';
import request from './API/request';

class Controller {
  constructor(form, Post) {
    this.form = form;
    this.postsContainer = document.querySelector('.posts-container');
    this.fileInput = document.querySelector('#file-input');
    this.openFileUpload = document.querySelector('.file-upload');
    this.Post = Post;
    this.file = null;

    this.addEventListeners = this.addEventListeners.bind(this);
    this.sendPost = this.sendPost.bind(this);
    this.fileInputOnChange = this.fileInputOnChange.bind(this);
    this.drawPostList = this.drawPostList.bind(this);
    this.openUploadWindow = this.openUploadWindow.bind(this);
    this.filePreview = this.filePreview.bind(this);
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

    const formData = new FormData();
    formData.append('type', 'post');
    formData.append('time', post.time);
    formData.append('text', post.text);
    formData.append('file', post.img);

    request('POST', '', formData);

    this.form.clean();
    document.querySelector('.filePreviewContainer').remove();
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

  fileInputOnChange() {
    const file = this.fileInput.files && this.fileInput.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', (e) => {
      this.file = e.target.result;
      this.filePreview();
    });

    reader.readAsDataURL(file);
  }

  openUploadWindow(e) {
    e.preventDefault();
    this.fileInput.click();
  }

  filePreview() {
    if (document.querySelector('.filePreviewContainer')) {
      document.querySelector('.filePreviewContainer').remove();
    }

    const img = document.createElement('img');
    img.src = this.file;

    const container = document.createElement('div');
    container.classList.add('filePreviewContainer');

    container.insertAdjacentElement('afterbegin', img);
    this.form.textForm.insertAdjacentElement('beforebegin', container);
    container.style.top = `${this.openFileUpload.offsetTop - container.getBoundingClientRect().height - 10}px`;
  }
}

export default Controller;
