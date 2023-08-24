const create = (tags, textContents) => {
    tags.forEach((tag, index) => {
      const element = document.createElement(tag);
      element.innerText = textContents[index];
      document.body.appendChild(element);
    });
  };

create("h3", "hello");