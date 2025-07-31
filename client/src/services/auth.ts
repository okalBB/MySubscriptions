export function saveToken(jwt: string) {
  localStorage.setItem('jwt', jwt)
}

export function getToken() {
  return localStorage.getItem('jwt')
}

export function logout() {
  localStorage.removeItem('token')
  window.location.href = '/'
}
