import { parseDate, element } from './Service';

class Post {
  constructor(text, time, type = 'user', img = null) {
    this.text = text;
    this.type = type;
    this.time = Number(time);
    this.img = img;

    this.create = this.create.bind(this);

    this.HTMLElement = this.create();
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

    if (this.img && this.img.length) {
      const imgContainer = element('div', null, ['post-img-container']);
      post.insertAdjacentElement('beforeend', imgContainer);

      Array.from(this.img).forEach((src) => {
        const img = element('img', null, []);
        img.src = src;
        imgContainer.append(img);
      });
    }

    return post;
  }
}

export default Post;
