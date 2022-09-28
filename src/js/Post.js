import { parseDate, element } from './Service';

class Post {
  constructor(text, time, type = 'user', img = null) {
    this.text = text;
    this.type = type;
    this.time = Number(time);
    this.img = img;
    this.HTMLElement = this.create();

    this.create = this.create.bind(this);
  }

  create() {
    const post = element('div', null, ['post']);
    const postTitle = element('div', `${parseDate(this.time)}`, ['post-title']);
    const postContent = element('div', this.text, ['post-content']);

    if (this.type === 'bot') {
      post.classList.add('bot');
    }

    post.insertAdjacentElement('afterbegin', postTitle);
    post.insertAdjacentElement('beforeend', postContent);

    if (this.img && this.img !== 'null') {
      const img = element('img');
      img.src = this.img;
      post.insertAdjacentElement('beforeend', img);
    }

    return post;
  }
}

export default Post;
