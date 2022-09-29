function parseDate(datetime) {
  const date = new Date(datetime);
  const day = String(date.getDate()).length === 2 ? `${date.getDate()}` : `0${date.getDate()}`;
  const month = String(date.getMonth()).length === 2 ? `${date.getMonth()}` : `0${date.getMonth()}`;
  const hour = String(date.getHours()).length === 2 ? `${date.getHours()}` : `0${date.getHours()}`;
  const minutes = String(date.getMinutes()).length === 2 ? `${date.getMinutes()}` : `0${date.getMinutes()}`;

  return `${day}.${month}.${date.getFullYear()} ${hour}:${minutes}`;
}

function findLinks(text) {
  return text.textContent.split(/\s/)
    .map((word) => {
      if (word.match(/^https?:\/\/.+/g)) {
        return `<a href="${word}">${word}</a>`;
      }
      return word;
    }).join(' ');
}

function element(selector, text = null, classList = []) {
  const el = document.createElement(selector);

  if (classList.length) {
    classList.forEach((cls) => el.classList.add(cls));
  }

  if (text) {
    el.textContent = text;
  }

  return el;
}

function makeData(post) {
  const formData = new FormData();
  formData.append('type', 'post');
  formData.append('time', post.time);
  formData.append('text', post.text);

  post.img.forEach((file) => {
    formData.append('file', file);
  });
  return formData;
}

function checkTotalSize(fileList, limit) {
  const totalSize = Array.from(fileList)
    .reduce((currentFile, nextFile) => currentFile + nextFile.size, 0);
  return totalSize <= limit;
}

function showErrorPopup(errorMessage) {
  const errorPopup = element('div', null, ['error-popup']);
  const errorPopupContent = element('div', errorMessage, ['error-popup-message']);
  const errorPopupBtn = element('button', null, ['error-popup-btn']);
  errorPopupBtn.textContent = 'OK';
  errorPopup.insertAdjacentElement('afterbegin', errorPopupContent);
  errorPopup.insertAdjacentElement('beforeend', errorPopupBtn);

  document.querySelector('body').append(errorPopup);
}

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

export {
  parseDate,
  findLinks,
  element,
  makeData,
  checkTotalSize,
  showErrorPopup,
  preventDefaults,
};
