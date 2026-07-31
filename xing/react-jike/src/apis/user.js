import request from '@/utils/request'
export function loginAPI(formData) {
  return request({
    url: '/authorizations',
    method: 'POST',
    data: formData
  })

}
export function getProfileAPI() {
  return request({
    url: '/user/profile',
    method: 'GET'
  })
}