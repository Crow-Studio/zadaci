export function uploadFile(accept: string, cb: (content: string, file: File) => void) {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = accept

  document.body.appendChild(input)
  input.addEventListener('change', (e) => {
    const file = (e.target as HTMLInputElement).files![0]

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = String(e.target?.result)
      cb(content, file)
    }
    reader.readAsText(file)
  })
  input.click()
  input.remove()
}
