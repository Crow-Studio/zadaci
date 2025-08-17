import { saveAs } from 'file-saver'

export function downloadJSON(fileName: string, content: object) {
  saveAs(new Blob([JSON.stringify(content, null, 2)], {
    type: 'application/json;charset=utf-8',
  }), `${fileName}.json`)
}

export function downloadHTML(fileName: string, html: string) {
  saveAs(new Blob([html], {
    type: 'text/html;charset=utf-8',
  }), `${fileName}.html`)
}

export function downloadTXT(fileName: string, html: string) {
  saveAs(new Blob([html], {
    type: 'text/plain;charset=utf-8',
  }), `${fileName}.txt`)
}
