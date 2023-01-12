import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, PixelRatio, Dimensions, TouchableOpacity, Text } from 'react-native';
import {
  ViroARScene,
  ViroText,
  ViroBox,
  ViroARSceneNavigator,
  Viro3DObject,
  ViroAmbientLight,
  ViroSpotLight,
  ViroNode,
  ViroARPlane,
  ViroARPlaneSelector
} from '@viro-community/react-viro';


const HelloWorldSceneAR = (props) => {

  const Z_FLOOR = -0.4
  const Z_CEILING = 1

  const [state, setState] = useState({
    foundAnchor: null,
    boxShown: true,
    userPosition: [0, 0, 0]
  })

  const sceneRef = useRef(null)

  const onInitialized = (state, reason) => {

  }

  const getDistance = (positionOne, positionTwo) => {
    // Compute the difference vector between the two hit locations.
    const dx = positionOne[0] - positionTwo[0];
    const dy = positionOne[1] - positionTwo[1];
    const dz = positionOne[2] - positionTwo[2];

    // // Compute the straight-line distance.
    const distanceMeters = Math.sqrt(dx * dx + dy * dy + dz * dz);

    console.log(distanceMeters * 100)

    return distanceMeters
  }

  const fireButton = () => {

    setState((state) => ({
      ...state,
      boxShown: false
    }))

    setState((state) => ({
      ...state,
      boxShown: true
    }))

    if (sceneRef.current) {

      sceneRef
        .current
        .getCameraOrientationAsync().then((a) => {
          console.log(a)


          sceneRef
            .current
            .performARHitTestWithRay(a.forward)
            .then((results) => {


              for (var i = 0; i < results.length; i++) {

                const result = results[i]

                const missileSpeed = 15

                const dx = result.transform.position[0] - a.position[0]
                const dy = result.transform.position[1] - a.position[1]
                const dz = result.transform.position[2] - a.position[2]

                const d = Math.sqrt(dx * dx + dy * dy + dz * dz)

                const vx = dx / d * missileSpeed
                const vy = dy / d * missileSpeed
                const vz = dz / d * missileSpeed

                setState((state) => ({
                  ...state,
                  boxShown: true,
                  userPosition: [vx, vy, vz]
                }))


                setState((state) => ({
                  ...state,
                  boxLocation: a.position
                }));

                return;
                //}
              }

            })
        })
    }
  }


  useEffect(() => {
    props.arSceneNavigator.viroAppProps.fireButton = fireButton
  }, [])

  const onAnchorFound = (anchor) => {
    console.log('onAnchorFound', anchor)

    if (!state.foundAnchor && anchor.position[1] < Z_FLOOR) {
      setState({ foundAnchor: anchor.anchorId })
    }
  }

  const onAnchorRemoved = (anchor) => {
    //console.log('onAnchorRemoved', anchor)

    if (state.foundAnchor) {
      //  setState({ foundAnchor: null })
    }
  }

  const onCollision = (a, b, c) => {
    console.log('collision', a, b, c)
    setState((state) => ({
      ...state,
      boxShown: false
    }))
  }

  return (
    <ViroARScene
      onTrackingUpdated={onInitialized}
      onAnchorFound={(anchor) => { onAnchorFound(anchor) }}
      onAnchorRemoved={(anchor) => { onAnchorRemoved(anchor) }}
      ref={(ref) => sceneRef.current = ref}>

      {state.foundAnchor && <ViroARPlane anchorId={state.foundAnchor}>

        <ViroNode
          onClick={(position, source) => console.log('Click', position, source)}>

          <ViroAmbientLight color={"#aaaaaa"} />
          <ViroSpotLight innerAngle={5} outerAngle={90} direction={[0, -1, -.2]} position={[0, 3, 1]} color="#ffffff" castsShadow={true} />

          <Viro3DObject
            source={{
              uri: 'https://github.com/andrewjb123/starter-kit/raw/master/rp_mei_posed_001_obj/rp_mei_posed_001_obj.vrx'
            }}
            position={[0, 0, 0]}
            scale={[.009, .009, .009]}
            type="VRX"
            dragType="FixedToPlane"
            onDrag={() => { }}
            physicsBody={{
              type: 'Dynamic',
              useGravity: false,
              mass: 10000,
              shape: { type: 'Box', params: [0.4, 3, 1] }
            }}
            viroTag="MySpecialBox2"
          />
        </ViroNode>
      </ViroARPlane>}

      {state.boxShown && <ViroBox
        position={state.boxLocation}
        scale={[.05, .05, .05]}
        physicsBody={{
          type: 'Dynamic',
          useGravity: false,
          friction: 1,
          mass: 1,
          velocity: state.userPosition
        }}
        viroTag="MySpecialBox"
        onCollision={onCollision}
      />}

    </ViroARScene>
  );
};

export default function ARControl(props) {


  const [state, setState] = useState({
    fireButton: null
  })

  console.log('state', state)

  return (
    <View
      style={styles.f1}>
      <ViroARSceneNavigator
        autofocus={true}
        initialScene={{
          scene: HelloWorldSceneAR,
        }}
        viroAppProps={state}
        style={styles.f1}
      />

      <TouchableOpacity style={styles.fireButton} onPress={() => { if (state.fireButton) state.fireButton() }}>
        <Text>
          Fire
        </Text>
      </TouchableOpacity>

      <View style={styles.crossHair}>

      </View>
    </View>
  );
};

var styles = StyleSheet.create({
  f1: {
    position: 'absolute',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  },
  helloWorldTextStyle: {
    fontFamily: 'Arial',
    fontSize: 30,
    color: '#ffffff',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  fireButton: {
    position: 'absolute',
    bottom: 100,
    height: 100,
    width: 100,
    left: (Dimensions.get('window').width / 2) - 50,
    backgroundColor: '#fff'
  },
  crossHair: {
    position: 'absolute',
    width: 10,
    height: 10,
    backgroundColor: '#000',
    top: (Dimensions.get('window').height / 2) - 5,
    left: (Dimensions.get('window').width / 2) - 5
  }
});
