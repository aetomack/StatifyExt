import React from 'react';
import styles from './css/app.module.scss';

const CLIENT_ID = "59ce9c1fe3c94dfdacedb9c57e229ad2";
const REDIRECT_URI = "http://localhost:8080";  // Ensure this matches your Spotify app settings
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "token";

interface State {
  accessToken: string | null;
  topSong: string | null;
}

class App extends React.Component<{}, State> {
  state: State = {
    accessToken: null,
    topSong: null,
  };

  componentDidMount() {
    // Check if the URL contains an access token
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    if (!token && hash) {
      token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token"))?.split("=")[1];

      if (token) {
        window.location.hash = "";
        window.localStorage.setItem("token", token);
      }
    }

    this.setState({ accessToken: token }, () => {
      if (this.state.accessToken) {
        this.fetchTopSong();
      }
    });
  }

  fetchTopSong = async () => {
    const { accessToken } = this.state;

    if (!accessToken) return;

    try {
      const response = await fetch("https://api.spotify.com/v1/me/top/tracks?limit=1", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch top song");
      }

      const data = await response.json();
      const topSong = data.items[0]?.name || "No top song found";

      this.setState({ topSong });
    } catch (error) {
      console.error("Error fetching top song:", error);
    }
  };

  render() {
    const { topSong } = this.state;

    return (
      <div className={styles.container}>
        <div className={styles.title}>{"My Custom App!"}</div>
        {!this.state.accessToken && (
          <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>
            Login to Spotify
          </a>
        )}
        {topSong && (
          <div className={styles.topSong}>
            {"Top Song: "}{topSong}
          </div>
        )}
      </div>
    );
  }
}

export default App;
