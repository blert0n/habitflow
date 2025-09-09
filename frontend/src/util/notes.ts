export const previewNoteContent = (html: string, maxLength = 30) => {
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = html
  const text = tempDiv.textContent || tempDiv.innerText || ''
  return text.slice(0, maxLength)
}
