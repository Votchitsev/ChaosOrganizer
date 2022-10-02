class Emoji {
  constructor() {
    this.emojiBtn = document.querySelector('.post-form > .input-container > #emoji-btn');
    this.emojiList = document.querySelector('.emoji-list');
    this.input = document.querySelector('.post-form > .input-container > input[type="text"]');

    this.openEmojiList = this.openEmojiList.bind(this);
    this.closeEmojiList = this.closeEmojiList.bind(this);
    this.addEmoji = this.addEmoji.bind(this);
    this.eventRoute = this.eventRoute.bind(this);
  }

  init() {
    this.emojiBtn.addEventListener('click', this.openEmojiList);
    document.addEventListener('click', this.eventRoute);
  }

  eventRoute(event) {
    const selector = event.target.classList;

    if (!selector.contains('emoji-list')) {
      if (this.emojiList.getElementsByClassName.display !== 'none' && event.target.id !== 'emoji-btn') {
        this.closeEmojiList();
      }
    }

    if (selector.contains('emoji')) {
      this.addEmoji(event);
    }
  }

  openEmojiList() {
    this.emojiList.classList.toggle('visible-grid');
  }

  closeEmojiList() {
    this.emojiList.classList.remove('visible-grid');
  }

  addEmoji(e) {
    const emoji = e.target.textContent;
    this.input.value += emoji;

    this.openEmojiList();
  }
}

export default Emoji;
