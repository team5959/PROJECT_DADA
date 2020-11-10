import * as moment from 'moment-timezone'

export function convertToDate (timestamp: number): string {
  const d = moment(timestamp * 1000).tz('Asia/Seoul')
  return d.format('YYYY-MM-DDTHH:mm:ss')
}
