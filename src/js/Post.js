import { parseDate } from './Service';

class Post {
  constructor(text, type = 'user') {
    this.text = text;
    this.type = type;
    this.HTMLElement = this.create();

    this.create = this.create.bind(this);
  }

  create() {
    const post = document.createElement('div');
    const postTitle = document.createElement('div');
    const postContent = document.createElement('div');

    post.classList.add('post');

    if (this.type === 'bot') {
      post.classList.add('bot');
    }

    postTitle.classList.add('post-title');
    postContent.classList.add('post-content');

    post.insertAdjacentElement('afterbegin', postTitle);
    post.insertAdjacentElement('beforeend', postContent);

    postTitle.textContent = `${parseDate(Date.now())}`;
    postContent.textContent = this.text;

    return post;
  }
}

export default Post;
