import { findLinks } from './Service';
import request from './API/request';

class Controller {
  constructor(form, Post) {
    this.form = form;
    this.postsContainer = document.querySelector('.posts-container');
    this.Post = Post;

    this.addEventListeners = this.addEventListeners.bind(this);
    this.sendTextNote = this.sendTextNote.bind(this);
  }

  async init() {
    this.addEventListeners();
    const posts = await request('GET', '', null);
    const postsJSON = await posts.json();
    this.drawPostList(postsJSON);
  }

  addEventListeners() {
    this.form.textForm.addEventListener('submit', this.sendTextNote);
  }

  sendTextNote(e) {
    e.preventDefault();

    const post = new this.Post(this.form.textInput.value);
    const text = post.HTMLElement.querySelector('.post-content');

    text.innerHTML = findLinks(text);

    this.drawPost(post.HTMLElement);
    this.postsContainer.scrollTop = this.postsContainer.scrollHeight;

    request('POST', '', {
      type: 'textPosts',
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
      const post = new this.Post(text);
      console.log(post);
      const textElement = post.HTMLElement.querySelector('.post-content');
      textElement.innerHTML = findLinks(textElement);
      this.drawPost(post.HTMLElement);
    }
  }
}

export default Controller;
