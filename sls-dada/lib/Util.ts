import * as moment from 'moment-timezone'

export const convertToDate = (timestamp: number): string => {
  const d = moment(timestamp * 1000).tz('Asia/Seoul')
  return d.utc().format('YYYY-MM-DDTHH:mm:ss')
}
