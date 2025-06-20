import React from "react";
import YouTube from "react-youtube";

class YoutubePlayer extends React.Component {
  render() {
    const options = {
      height: "315",
      width: "560",
      playerVars: {
        autoplay: 1,
        controls: 1,
      },
    };

    return (
      <YouTube
        videoId="dQw4w9WgXcQ"
        options={options}
        onReady={this._onReady}
        id="video"
      />
    );
  }

  _onReady(event) {
    event.target.pauseVideo();
  }
}

export default YoutubePlayer;
