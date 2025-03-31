import axios from 'axios'

//     const GetAuth: string | null = localStorage.getItem("auth");
//   let Token: string | null = null;

//   if (GetAuth) {
//     const parsedAuth = JSON.parse(GetAuth);
//     if (typeof parsedAuth === "object" && parsedAuth.token) {
//       Token = parsedAuth.token;
//     }
//   }

let userData: string | null = null
let userToken: any = null

export const PostMethod = (url: any, data?: any) => {
  return new Promise((resolve, reject) => {
    userData = localStorage.getItem('auth')
    const parsedUserData = JSON.parse(userData || '{}')

    axios
      .post(`${process.env.NEXT_PUBLIC_BASE_URL}/${url}`, data, {
        headers: {
          'Content-type': 'application/json',
          // 'Accept-Language': 'ar',
          token: parsedUserData.token || '',
        },
      })
      .then((res) => {
        resolve(res)
      })
      .catch((err) => reject(err))
  })
}

export const GetMethod = (url: any) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BASE_URL}/${url}`, {
        headers: {
          'Content-type': 'application/json',
          // 'Accept-Language': 'ar',
          token: userToken,
        },
      })
      .then((res) => {
        resolve(res)
      })
      .catch((err) => reject(err))
  })
}
