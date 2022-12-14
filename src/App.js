import React, { Component } from "react";
// import Particles from 'react-particles-js';
import ParticlesBg from "particles-bg";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import Profile from "./components/Profile/Profile";
import Modal from "./components/Modal/Modal";
import "./App.css";

const initialState = {
  input:
    "https://img.freepik.com/free-photo/people-taking-selfie-together-registration-day_23-2149096795.jpg?w=2000",
  imageUrl: "",
  boxes: [],
  route: "signin",
  isProfileOpen: false,
  isSignedIn: false,
  user: {
    id: "",
    name: "",
    email: "",
    entries: 0,
    joined: "",
    age: 0,
    pet: "",
  },
};

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  componentDidMount() {
    this.onButtonSubmit();
    const token = window.sessionStorage.getItem("token");
    if (token) {
      fetch(`${process.env.REACT_APP_SERVER_URL}/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data && data.id) {
            fetch(`${process.env.REACT_APP_SERVER_URL}/profile/${data.id}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: token,
              },
            })
              .then((response) => response.json())
              .then((user) => {
                if (user && user.email) {
                  this.loadUser(user);
                  this.onRouteChange("home");
                }
              });
          }
        })
        .catch(console.log);
    }
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined,
      },
    });
  };

  calculateFaceLocation = (data) => {
    const image = document.getElementById("inputimage");
    const width = Number(image.width);
    const height = Number(image.height);
    return data.outputs[0].data.regions.map((face) => {
      const clarifaiFace = face.region_info.bounding_box;
      return {
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - clarifaiFace.right_col * width,
        bottomRow: height - clarifaiFace.bottom_row * height,
      };
    });
  };

  displayFaceBox = (boxes) => {
    this.setState({ boxes: boxes });
  };

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    fetch(`${process.env.REACT_APP_SERVER_URL}/imageurl`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: this.state.input,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        this.displayFaceBox(this.calculateFaceLocation(response));
      })
      .catch((err) => console.log(err));
  };

  onRouteChange = (route) => {
    if (route === "signout") {
      return this.setState(initialState);
    } else if (route === "home") {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: route });
  };

  toggleModal = () => {
    this.setState((state) => ({
      ...state,
      isProfileOpen: !state.isProfileOpen,
    }));
  };

  render() {
    const { imageUrl, boxes } = this.state;

    return (
      <div className="App">
        <ParticlesBg type="circle" bg={true} />

        <div>
          <Logo />
          <ImageLinkForm
            onInputChange={this.onInputChange}
            onButtonSubmit={this.onButtonSubmit}
          />
          <FaceRecognition boxes={boxes} imageUrl={imageUrl} />
        </div>
      </div>
    );
  }
}

export default App;
