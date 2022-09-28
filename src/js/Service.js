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

export { parseDate, findLinks, element };
