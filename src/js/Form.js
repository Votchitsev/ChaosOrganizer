class Form {
  constructor() {
    this.textForm = document.querySelector('.post-form');
    this.textInput = this.textForm.querySelector('input[type="text"]');
  }

  clean() {
    this.textInput.value = '';
  }
}

export default Form;
