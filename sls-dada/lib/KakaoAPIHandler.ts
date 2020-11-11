import * as axios from 'axios'

export const getAddress = async (gps): Promise<any> => {
  return axios.default.get(`https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${gps.lng}&y=${gps.lat}`,
    {
      headers: {
        Authorization: `KakaoAK ${process.env.kakaokey}`
      }
    }).catch((err) => {
      console.error(err.toJSON())
      return
    }).then((res) => {
      const data = res['data']

      if (data['meta']['total_count'] === 0) {
        console.error('Cannot find location from gps')
        return
      }
      let address = data['documents'][0]['road_address'] // 도로명 주소
      if (address == null) {
        address = data['documents'][0]['address'] // 지번 주소
      }
      return address['address_name']
    })
}
