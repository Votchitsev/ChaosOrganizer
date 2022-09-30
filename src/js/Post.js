import { parseDate, element, getFileFormat } from './Service';

class Post {
  constructor(text, time, type = 'user', file = null) {
    this.text = text;
    this.type = type;
    this.time = Number(time);
    this.file = file;

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

    if (this.file.length && this.file[0]) {
      const fileContainer = element('div', null, ['post-img-container']);
      post.insertAdjacentElement('beforeend', fileContainer);

      Array.from(this.file).forEach((src) => {
        if (getFileFormat(src) === 'audio') {
          const audioElement = element('audio', null, []);
          audioElement.setAttribute('controls', '');
          audioElement.src = src;
          fileContainer.append(audioElement);
          return;
        }

        if (getFileFormat(src) === 'video') {
          const videoElement = element('video', null, ['video-file']);
          videoElement.setAttribute('controls', 'controls');
          videoElement.src = src;
          fileContainer.append(videoElement);
          return;
        }

        const img = element('img', null, []);
        img.src = src;
        fileContainer.append(img);
      });
    }

    return post;
  }
}

export default Post;
