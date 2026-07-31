import { createSlice } from '@reduxjs/toolkit'
import request from '@/utils/request'
import { setToken as _setToken, getToken, removeToken } from '@/utils/token'
import { loginAPI, getProfileAPI } from '../../apis/user'
// 打印初始化时的 token
console.log('=== 用户模块初始化 ===')
console.log('从 localStorage 获取的 token:', getToken())

const userSlice = createSlice({
  name: 'user',
  initialState: {
    token: getToken() || '',
    userInfo: {}
  },
  reducers: {
    setToken(state, action) {
      console.log('=== 设置 token ===')
      console.log('新 token:', action.payload)
      state.token = action.payload
      _setToken(action.payload)
      console.log('设置后的 token:', state.token)
    },
    setUserInfo(state, action) {
      state.userInfo = action.payload
    },
    clearUserInfo(state) {
      state.token = ''
      state.userInfo = {}
      removeToken()
    }
  }
})

// 解构出action 函数
const { setToken, setUserInfo, clearUserInfo } = userSlice.actions
// 获取reducer函数
const userReducer = userSlice.reducer

const fetchToken = (loginForm) => {
  return async (dispatch) => {
    const res = await loginAPI(loginForm)
    // 尝试不同的方式获取 token
    let token = res.token || res.data?.token || res
    dispatch(setToken(token))
  }
}
const fetchUserInfo = () => {
  return async (dispatch) => {
    const res = await getProfileAPI()
    dispatch(setUserInfo(res.data || {}))
  }
}




export { fetchToken, setToken, fetchUserInfo, clearUserInfo }
export default userReducer