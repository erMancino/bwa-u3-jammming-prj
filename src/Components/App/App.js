import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults:[
        {
          name: 'Wish you were here',
          artist: 'Pink Floyd',
          album: 'Shine on you Crazy Diamond'
        },
        {
          name: 'Ausencia',
          artist: 'Goran Bregovic',
          album: 'Elderlezi'
        },
        {   name: 'Nella pioggia',
          artist: 'Vinicio Capossela',
          album: 'Canzoni a Manovella'
        }
      ],
    playlistName: "My Playlist",
    playlistTracks: [
      {
        name: 'Time',
        artist: 'Pink Floyd',
        album: 'The Dark Side of the Moon'
      },
      {
        name: 'Time Has Told Me',
        artist: 'Nick Drake',
        album: 'Five Leaves Left'
      }
    ]
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track) {
    let tracks = this.state.playlistTracks;
    if (!tracks.includes(track)) {
      tracks.push(track);
      this.setState({playlistTracks: tracks});
      let results = this.state.searchResults
      let index = results.indexOf(track);
      results.splice(index, 1);
      this.setState({searchResults: results});
    }
  }

  removeTrack(track) {
    let tracks = this.state.playlistTracks;
    if (tracks.includes(track)) {
      let index = tracks.indexOf(track);
      tracks.splice(index, 1);
      this.setState({playlistTracks: tracks});
    }
  }

  savePlaylist() {
    let trackUris = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackUris).then(() => {
      this.setState({
        playlistName: 'New Playlist',
        searchResults: []
      });
    })
  }

  updatePlaylistName(newName) {
    this.setState({playlistName: newName});
  }

  search(searchTerm) {
    Spotify.search(searchTerm).then(searchResults => {
      this.setState({searchResults: searchResults});
    });
    console.log(searchTerm);
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
            <SearchBar onSearch={this.search}/>
            <div className="App-playlist">
              <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
              <Playlist
                playlistName={this.state.playlistName}
                playlistTracks={this.state.playlistTracks}
                onRemove={this.removeTrack}
                onNameChange={this.updatePlaylistName}
                onSave = {this.savePlaylist}/>
            </div>
        </div>
      </div>
    );
  }
}

export default App;
