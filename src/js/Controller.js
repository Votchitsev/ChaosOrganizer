import { findLinks, desappearElement } from './Service';
import request from './API/request';

class Controller {
  constructor(form, Post) {
    this.form = form;
    this.postsContainer = document.querySelector('.posts-container');
    this.fileInput = document.querySelector('#file-upload');
    this.fileInputBtn = document.querySelector('.file-upload-label');
    this.Post = Post;

    this.addEventListeners = this.addEventListeners.bind(this);
    this.sendTextNote = this.sendTextNote.bind(this);
    this.fileInputOnChange = this.fileInputOnChange.bind(this);
  }

  async init() {
    this.addEventListeners();
    const posts = await request('GET', '', null);
    const postsJSON = await posts.json();
    this.drawPostList(postsJSON);
  }

  addEventListeners() {
    this.form.textForm.addEventListener('submit', this.sendTextNote);
    this.fileInput.addEventListener('change', this.fileInputOnChange);
  }

  sendTextNote(e) {
    e.preventDefault();

    const time = Date.now();
    const post = new this.Post(this.form.textInput.value, time);
    const text = post.HTMLElement.querySelector('.post-content');

    text.innerHTML = findLinks(text);

    this.drawPost(post.HTMLElement);
    this.postsContainer.scrollTop = this.postsContainer.scrollHeight;
    request('POST', '', {
      type: 'textPosts',
      time,
      content: {
        text: text.textContent,
      },
    });

    this.form.clean();
  }

  drawPost(post) {
    this.postsContainer.append(post);
  }

  drawPostList(postList) {
    for (let i = 0; i < postList.length; i += 1) {
      const { text } = postList[i].content;
      const { time } = postList[i];
      const post = new this.Post(text, time);
      const textElement = post.HTMLElement.querySelector('.post-content');

      textElement.innerHTML = findLinks(textElement);
      this.drawPost(post.HTMLElement);
    }
  }

  fileInputOnChange() {
    this.fileInputBtn.style.backgroundColor = '#ACE87E';

    const popupEl = document.createElement('div');
    popupEl.classList.add('desappeared-popup');
    popupEl.textContent = 'Файл выбран';
    document.querySelector('body').append(popupEl);

    const popup = document.querySelector('.desappeared-popup');
    desappearElement(popup);
  }
}

export default Controller;
