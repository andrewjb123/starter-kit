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
    velocity: [0, 0, 0]
  })

  const sceneRef = useRef(null)

  const onInitialized = (state, reason) => {

  }

  const getVelocityLine = (startPosition, endPosition, speed) => {

    const dx = endPosition[0] - startPosition[0]
    const dy = endPosition[1] - startPosition[1]
    const dz = endPosition[2] - startPosition[2]

    const d = Math.sqrt(dx * dx + dy * dy + dz * dz)

    const vx = dx / d * speed
    const vy = dy / d * speed
    const vz = dz / d * speed

    return [vx, vy, vz]
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

      sceneRef.current.getCameraOrientationAsync().then((camera) => {
        sceneRef.current.performARHitTestWithRay(camera.forward).then((results) => {

          for (var i = 0; i < results.length; i++) {

            const result = results[i]

            const startPosition = camera.position
            const endPosition = result.transform.position

            setState((state) => ({
              ...state,
              boxShown: true,
              velocity: getVelocityLine(startPosition, endPosition, 10),
              boxLocation: startPosition
            }))

            break
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
    console.log('onAnchorRemoved', anchor)

    if (state.foundAnchor) {
      //  setState({ foundAnchor: null })
    }
  }

  const onCollision = (tag, b, c) => {
    console.log('Collision', tag, b, c)
    setState((state) => ({
      ...state,
      velocity: [0, 0, 0]
    }))
  }

  return (
    <ViroARScene
      onTrackingUpdated={onInitialized}
      onAnchorFound={(anchor) => { onAnchorFound(anchor) }}
      onAnchorRemoved={(anchor) => { onAnchorRemoved(anchor) }}
      ref={(ref) => sceneRef.current = ref}>

      {state.foundAnchor && (
        <ViroARPlane anchorId={state.foundAnchor}>
          <ViroNode onClick={(position, source) => console.log('Click', position, source)}>
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
                type: 'Static',
                useGravity: false,
                shape: { type: 'Box', params: [0.5, 3, 1] }
              }}
              viroTag="Target"
            />
          </ViroNode>
        </ViroARPlane>)
      }

      {state.boxShown &&
        (
          <ViroBox
            position={state.boxLocation}
            scale={[.01, .01, .01]}
            physicsBody={{
              type: 'Dynamic',
              useGravity: true,
              mass: 5,
              velocity: state.velocity,
              //force: { position: state.boxLocation, value: [0, 0, 1] }
            }}
            viroTag="Ammo"
            onCollision={onCollision}
          />
        )
      }

    </ViroARScene>
  )
}

export default function ARControl(props) {

  const [appProps, setAppProps] = useState({
    fireButton: null
  })

  return (
    <View
      style={styles.f1}>
      <ViroARSceneNavigator
        autofocus={true}
        initialScene={{
          scene: HelloWorldSceneAR,
        }}
        viroAppProps={appProps}
        style={styles.f1}
      />

      <TouchableOpacity style={styles.fireButton} onPress={() => { if (appProps.fireButton) appProps.fireButton() }}>
        <Text>
          Fire
        </Text>
      </TouchableOpacity>

      <View style={styles.crossHair} />
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
    width: 5,
    height: 5,
    backgroundColor: '#000',
    top: (Dimensions.get('window').height / 2) - 2.5,
    left: (Dimensions.get('window').width / 2) - 2.5
  }
});
