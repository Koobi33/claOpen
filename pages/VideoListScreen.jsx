import React, { useState, useEffect } from 'react';
import { View, AsyncStorage, Button } from 'react-native';
import { Video } from 'expo-av';
import axios from 'axios';
// import AsyncStorage from '@react-native-community/async-storage';



function VideoListScreen() {

const getItemId = async () => {
  try {
   return  await AsyncStorage.getItem('videoId')
  } catch (e) {
    // saving error
  }
};
const [downloaded, setDownloaded] = useState(false);
const [video, setVideo] = useState(false);

useEffect(() => {
  console.warn(video);
}, [video]);

const fetchVideo = async () => {
  const id = await getItemId();
  console.warn(id);
  axios.get(`http://192.168.108.123:3000/api/video/${id}`).then((res) => {
    console.log(res);
    setDownloaded(true);
    setVideo(res.data);
  })
    .catch((err) => {
      console.error(err);
    });
};


  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Get Video" onPress={fetchVideo} />
      {
        downloaded &&
        <Video
          source={{video}}
          rate={1.0}
          volume={1.0}
          muted={false}
          resizeMode="cover"
          style={{width: 300, height: 300}}
          isLooping={true}
          isMuted={false}
          onError={() => {
          }}
          onFullscreenUpdate={() => {
          }}
          onIOSFullscreenUpdate={() => {
          }}
          onLoad={() => {
          }}
          onLoadStart={() => {
          }}
          onPlaybackStatusUpdate={() => {
          }}
          onReadyForDisplay={() => {
          }}
          positionMillis={0}
          posterSource={null}
          posterStyle={null}
          progressUpdateIntervalMillis={null}
          rotation={0}
          scaleX={0}
          scaleY={0}
          shouldCorrectPitch={false}
          shouldPlay={true}
          status={null}
          translateX={0}
          translateY={0}
          useNativeControls={false}
          usePoster={null}
        />
      }
        </View>
  )
}

export default VideoListScreen;
