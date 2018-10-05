const $ = (selector) => {
  if (/^#\w+/.test(selector)) {
    return document.querySelectorAll(selector)[0];
  } else {
    return document.querySelectorAll(selector);
  }
}

const toCamelCase = (str) => {
  return str.replace(/\w\S*/g, (txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()));
}



