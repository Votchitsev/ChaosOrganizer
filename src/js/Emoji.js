class Emoji {
  constructor() {
    this.emojiBtn = document.querySelector('.post-form > .input-container > button');
    this.emojiList = document.querySelector('.emoji-list');

    this.openEmojiList = this.openEmojiList.bind(this);
  }

  init() {
    this.emojiBtn.addEventListener('click', this.openEmojiList);
  }

  openEmojiList(e) {
    if (e.pointerType === 'mouse') {
      this.emojiList.classList.toggle('visible-grid');
    }
  }
}

export default Emoji;
