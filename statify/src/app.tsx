import styles from './css/app.module.scss'
import React from 'react'


const CLIENT_ID = "59ce9c1fe3c94dfdacedb9c57e229ad2"
const REDIRECT_URI = "https://localhost:3000"
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
const RESPONSE_TYPE = "token"
const [token, setToken] = useState("")

class App extends React.Component<{}, {count: number}> {
  state = {
    count: 0,
  };

  stopConfettiTimeout: NodeJS.Timeout | null = null;

  onButtonClick = () => {
    this.setState((state) => {
      return {
        count: state.count+1,
      }
    });
  };

  render() {
    return <>
      <div className={styles.container}>
        <div className={styles.title}>{"My Custom App!"}</div>
        <button className={styles.button} onClick={this.onButtonClick}>{"Count up"}</button>
        <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>Login to Spotify</a>
        <div className={styles.counter}>{this.state.count}</div>
      </div>
    </>
  } 
}

export default App;
