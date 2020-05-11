/** https://liuhongwei3.github.io Inc.
 * Name: index.js
 * Date: 2020/5/10 14:41
 * Author: Tadm
 * Copyright (c) 2020 All Rights Reserved.
 */

import axios from 'axios'

export function request(config) {
  const instance = axios.create({
    baseURL: 'https://www.liulongbin.top:8888/api/private/v1/',
    timeout: 3000
  });

  instance.interceptors.request.use(config => {
    config.headers.Authorization = window.sessionStorage.getItem('token');
    return config
  },error => {
    console.log(error)
  })

  instance.interceptors.response.use(response => {
    return response
  },error => {
    console.log(error)
  })

  return instance(config) //  Promise
}
