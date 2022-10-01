import request from './API/request';

class Searcher {
  constructor(controller) {
    this.controller = controller;
    this.form = document.querySelector('.search-form');
    this.input = document.querySelector('.search-form > input');

    this.search = this.search.bind(this);
    this.sendRequest = this.sendRequest.bind(this);
    this.requestBlockedOn = this.requestBlockedOn.bind(this);
    this.requestBlockedOff = this.requestBlockedOff.bind(this);
  }

  init() {
    this.input.addEventListener('input', this.search);
    this.input.addEventListener('focus', this.requestBlockedOn);
    this.input.addEventListener('blur', this.requestBlockedOff);
  }

  search() {
    this.sendRequest();
  }

  async sendRequest() {
    this.controller.pagination = [0, 9];
    const response = await request(this.controller.pagination, 'GET', `&search=${this.input.value}`);
    const postList = await response.json();
    this.controller.postsContainer.innerHTML = '';
    this.controller.drawPostList(postList, 'afterbegin');
  }

  requestBlockedOn() {
    this.controller.requestBlocked = true;
  }

  requestBlockedOff() {
    this.controller.requestBlocked = false;
  }
}

export default Searcher;
