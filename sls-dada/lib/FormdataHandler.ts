import * as stream from 'stream'
import * as multiparty from 'multiparty'
import Dict = NodeJS.Dict

export interface ParsedPhoto {
  fieldName: string,
  originalFilename: string,
  path: string,
  headers: {
    'content-disposition': string,
    'content-type': string
  },
  size: number
}

function parser (str: stream.Readable): Promise<Dict<Array<ParsedPhoto>>> {
  const form = new multiparty.Form()

  return new Promise((resolve, reject) => {
    form.parse(str, (err, fields, files) => {
      if (err) {
        reject(err)
        return
      }

      resolve(files)
    })
  })
}

export async function parsePhotos (event, callback): Promise<void | Dict<ParsedPhoto[]>> {
  let str = new stream.Readable()
  str.push(event.body)

  // multiparty needs lowercase header key
  const header = {}
  const keys = Object.keys(event.headers)
  for (let n = keys.length - 1; n >= 0; n--) {
    header[keys[n].toLowerCase()] = event.headers[keys[n]]
  }
  str['headers'] = header

  str.push(null)

  return parser(str)
    .catch((err) => {
      console.error(err)
      callback(null, {
        statusCode: 401,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t parse photos'
      })
    })
    .then((files) => {
      return files
    })
}
