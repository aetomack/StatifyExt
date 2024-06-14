import styles from './css/app.module.scss';
import React from 'react';

const CLIENT_ID = "59ce9c1fe3c94dfdacedb9c57e229ad2";
const REDIRECT_URI = "http://localhost:3000";  // Ensure this matches your Spotify app settings
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "token";

interface State {
  count: number;
  accessToken: string | null;
  topSong: string | null;
}

class App extends React.Component<{}, State> {
  state: State = {
    count: 0,
    accessToken: null,
    topSong: null,
  };

  componentDidMount() {
    // Assuming the access token is already stored in localStorage
    const token = window.localStorage.getItem("token");
    if (token) {
      this.setState({ accessToken: token }, () => {
        this.fetchTopSong();
      });
    }
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

  onButtonClick = () => {
    this.setState((state) => ({
      count: state.count + 1,
    }));
  };

  render() {
    const { count, topSong } = this.state;

    return (
      <div className={styles.container}>
        <div className={styles.title}>{"My Custom App!"}</div>
        <button className={styles.button} onClick={this.onButtonClick}>{"Count up"}</button>
        <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>Login to Spotify</a>
        <div className={styles.counter}>{count}</div>
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
