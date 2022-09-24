import Controller from './Controller';
import Form from './Form';
import Post from './Post';

document.addEventListener('DOMContentLoaded', () => {
  const form = new Form();
  const controller = new Controller(form, Post);
  controller.init();
});
