import qs from "qs";
import axios from "axios";

const Axios = axios.create({
    baseURL: "/",
    timeout: 10000,
    responseType: "json",
    withCredentials: true, // 是否允许带cookie这些
    headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
    }
});

// POST 传参序列化(添加请求拦截器)
Axios.interceptors.request.use(config => {
        if (['post', 'put', 'delete'].includes(config.method)) {
            config.data = qs.stringify(config.data);
        }
        // 若是有做鉴权token , 就给头部带上token
        if (localStorage.token) {
            config.headers.Authorization = localStorage.token;
        }
        return config;
    }, error => {
        return Promise.reject(error.data);
    }
);

//返回状态判断(添加响应拦截器)
Axios.interceptors.response.use(async res => {
        return res.data
    }, error => {
        // 返回 response 里的错误信息
        return error.data
    }
);

export default {
    install: function(Vue, Option) {
        Object.defineProperty(Vue.prototype, "$axios", { value: Axios });
    }
};

// https://blog.csdn.net/crper/article/details/77619067