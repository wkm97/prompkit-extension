export const isEditableElement = (element: Element) => {
  const tagName = element.tagName.toLowerCase();
  if (tagName === 'textarea') return true;
  if (tagName === 'input') return true;
  if (element.getAttribute("contenteditable") === "true") return true
  return false;
}

export const getFirstEditableElement = (): HTMLElement => {
  const textarea = document.querySelector("textarea");
  if (textarea) return textarea;

  const input = document.querySelector("input");
  if (input) return input;

  const editable = document.querySelector('[contenteditable="true"]') as HTMLElement;
  if(editable) return editable

  return undefined
}

export const randomId = () => {
  return Math.random().toString(36).substring(2, 9);
}

export const capitalize = (word) => {
  return word
    .split('')
    .map((letter, index) =>
      index ? letter.toLowerCase() : letter.toUpperCase(),
    )
    .join('');
}
