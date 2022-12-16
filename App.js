import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import {
  ViroARScene,
  ViroText,
  ViroConstants,
  ViroARSceneNavigator,
  Viro3DObject,
  ViroAmbientLight,
  ViroSpotLight,
} from '@viro-community/react-viro';

const HelloWorldSceneAR = () => {
  const [text, setText] = useState('Initializing AR...');

  function onInitialized(state, reason) {
    console.log('guncelleme', state, reason);
    //if (state === ViroConstants.TRACKING_NORMAL) {
    setText('Hello Worldx!');
    //} else if (state === ViroConstants.TRACKING_NONE) {
    // Handle loss of tracking
    //}
  }
  //https://github.com/ViroCommunity/samples/raw/main/ARDrivingCar/src/assets/car_body.vrx
  return (
    <ViroARScene onTrackingUpdated={onInitialized}>

      <ViroAmbientLight color={"#aaaaaa"} />
      <ViroSpotLight innerAngle={5} outerAngle={90} direction={[0, -1, -.2]} position={[0, 3, 1]} color="#ffffff" castsShadow={true} />

      <Viro3DObject
        source={{
          uri: 'https://github.com/andrewjb123/starter-kit/raw/master/rp_mei_posed_001_obj/rp_mei_posed_001_obj.vrx'
        }}

        position={[0, -1, -2]}
        scale={[.01, .01, .01]}
        type="VRX"
        dragType="FixedDistance" onDrag={() => { }}
      />
    </ViroARScene>
  );
};

export default () => {
  return (
    <ViroARSceneNavigator
      autofocus={true}
      initialScene={{
        scene: HelloWorldSceneAR,
      }}
      style={styles.f1}
    />
  );
};

var styles = StyleSheet.create({
  f1: { flex: 1 },
  helloWorldTextStyle: {
    fontFamily: 'Arial',
    fontSize: 30,
    color: '#ffffff',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
});
