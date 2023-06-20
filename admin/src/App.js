import { Admin, Resource, ShowGuesser, fetchUtils } from 'react-admin'
import restProvider from 'ra-data-simple-rest'
import { UserList, UserShow } from './Users'
import { PostList, PostShow } from './Posts'

const serverURL = process.env.REACT_APP_SERVER_URL 

const authProvider = {
  login: ({ username, password }) => {
    const request = new Request(`${serverURL}/api/adminLogin`, {
      method: 'POST',
      body: JSON.stringify({ email: username, password }),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    })
    return fetch(request)
      .then((response) => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error(response.statusText)
        }
        return response.json()
      })
      .then((auth) => {
        localStorage.setItem('auth', JSON.stringify(auth))
      })
      .catch(() => {
        throw new Error('Network error')
      })
  },
  checkAuth: () =>
    localStorage.getItem('auth') ? Promise.resolve() : Promise.reject(),
  getPermissions: () => {
    // Required for the authentication to work
    return Promise.resolve()
  },
  checkError: (error) => {
    return Promise.resolve()
  },
  logout: () => {
    localStorage.removeItem('auth')
    return Promise.resolve()
  },
}

const httpClient = (url, options = {}) => {
  if (!options.headers) {
    options.headers = new Headers({ Accept: 'application/json' })
  }
  const { access_token } = JSON.parse(localStorage.getItem('auth'))
  console.log(access_token)
  options.headers.set('Authorization', access_token)
  return fetchUtils.fetchJson(url, options)
}
const dataProvider = restProvider(`${serverURL}/api`, httpClient)

function App() {
  return (
    <Admin authProvider={authProvider} dataProvider={dataProvider}>
      <Resource name="user" list={UserList} show={UserShow} />
      <Resource name="post" list={PostList} show={PostShow} />
    </Admin>
  )
}

export default App
