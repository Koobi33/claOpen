import React, { Component } from 'react';
import { Text, View, TouchableOpacity, ImageBackground, AsyncStorage } from 'react-native';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import { FontAwesome, Ionicons,MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';

export default class CameraScreen extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    hasPermission: null,
    type: Camera.Constants.Type.back,
  };

  async componentDidMount() {
    this.getPermissionAsync()
  }
  saveVideoId = async (id) => {
    try {
      await AsyncStorage.setItem('videoId', id)
    } catch (e) {
      // saving error
    }
  };
  getPermissionAsync = async () => {
    // Camera roll Permission
    if (Platform.OS === 'ios') {
      const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
    // Camera Permission
    const {status} = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({hasPermission: status === 'granted'});
  };
  pickImage = async () => {
    this.props.navigation.navigate('List');
    // let result = await ImagePicker.launchImageLibraryAsync({
    //   mediaTypes: ImagePicker.MediaTypeOptions.Images,
    // });
  };
  handleCameraType = () => {
    const {cameraType} = this.state;

    this.setState({
      cameraType:
        cameraType === Camera.Constants.Type.back
          ? Camera.Constants.Type.front
          : Camera.Constants.Type.back
    })
  };
  takePicture = async () => {
    if (this.camera) {
      let photo = await this.camera.takePictureAsync({base64: true, quality: 0.2, width: 200});
      console.warn(photo);
      // await MediaLibrary.saveToLibraryAsync(photo);
      await axios.post('http://192.168.108.123:3000/api/video/upload', {
        'headers': {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: photo.base64,
      }).then((res) => {
          this.saveVideoId(res.data);
          console.warn(res);
        })
        .catch((err) => {
          console.error(err);
        })
    }
  };

  render() {
    const {hasPermission} = this.state;
    if (hasPermission === null) {
      return <View/>;
    } else if (hasPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{flex: 1}}>
          <Camera
            ref={ref => {
              this.camera = ref;
            }}
            style={{flex: 1}} type={this.state.cameraType}>
            <ImageBackground
              source={require('../t-pose-mask.png')}
              imageStyle={{
                opacity: 0.56,
                width: '100%',
                marginTop: '40%',
                paddingRight: '40%',
                paddingLeft: '40%',
                height: '60%'
              }}
              style={{flex: 1, width: '100%', height: '100%'}}
            >
              <View style={{flex: 1, flexDirection: "row", justifyContent: "space-between", margin: 20}}>
                <TouchableOpacity
                  onPress={() => this.pickImage()}
                  style={{
                    alignSelf: 'flex-end',
                    alignItems: 'center',
                    backgroundColor: 'transparent',
                  }}>
                  <Ionicons
                    name="ios-photos"
                    style={{color: "#fff", fontSize: 40}}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.takePicture()}
                  style={{
                    alignSelf: 'flex-end',
                    alignItems: 'center',
                    backgroundColor: 'transparent',
                  }}>
                  <FontAwesome
                    name="camera"
                    style={{color: "#fff", fontSize: 40}}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    alignSelf: 'flex-end',
                    alignItems: 'center',
                    backgroundColor: 'transparent',
                  }}
                  onPress={() => this.handleCameraType()}
                >
                  <MaterialCommunityIcons
                    name="camera-switch"
                    style={{color: "#fff", fontSize: 40}}
                  />
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </Camera>
        </View>
      );
    }
  }
};
