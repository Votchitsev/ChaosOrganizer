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

async function desappearElement(element) {
  let time = 0;
  const el = element;
  el.style.opacity = 1;

  const interval = setInterval(() => {
    el.style.opacity -= 0.1;
    time += 300;
    if (time === 3000) {
      el.remove();
      clearInterval(interval);
    }
  }, 300);
}

export { parseDate, findLinks, desappearElement };
