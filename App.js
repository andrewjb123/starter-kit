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
  ViroQuad,
  ViroARPlaneSelector,
  ViroMaterials
} from '@viro-community/react-viro';


const HelloWorldSceneAR = (props) => {

  const Z_FLOOR = -0.4
  const Z_CEILING = 1

  const [state, setState] = useState({
    foundAnchor: null
  })

  const sceneRef = useRef(null)
  //const ballRef = useRef(null)

  const ballIndex = useRef(0)

  const balls = useRef([
    {
      ref: null,
      index: 0
    },
    {
      ref: null,
      index: 1
    },
    {
      ref: null,
      index: 2
    },
    {
      ref: null,
      index: 3
    },
    {
      ref: null,
      index: 4
    },
    {
      ref: null,
      index: 5
    },
    {
      ref: null,
      index: 6
    },
    {
      ref: null,
      index: 7
    },
    {
      ref: null,
      index: 8
    },
    {
      ref: null,
      index: 9
    }
  ])

  const ballProperties = {
    friction: 1.6,
    type: 'Dynamic',
    mass: 0.5,
    enabled: true,
    useGravity: true,
    shape: { type: 'Sphere', params: [0.14] },
    restitution: 0.15,
    torque: [0, 0, 0]
  }

  ViroMaterials.createMaterials({
    heart: {
      lightingModel: "Blinn",
      diffuseColor: '#ffff00'
    },
    floor: {
      lightingModel: "Blinn",
      diffuseColor: '#000',
      colorWriteMask: ['alpha']
    },
  });

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

    sceneRef.current.getCameraOrientationAsync().then((camera) => {

      const startPosition = camera.position
      const forward = camera.forward

      sceneRef.current.performARHitTestWithRay(forward).then((results) => {

        if (results.length === 0) {
          return
        }
        balls.current[ballIndex.current].ref.getTransformAsync().then((transform) => {

          const pos = transform.position;

          const clickedPos = results[0].transform.position

          const pushStrength = 5
          const pushImpulse = [forward[0] * pushStrength, forward[1] * pushStrength, forward[2] * pushStrength]

          const pushPosition = getVelocityLine(clickedPos, pos, 1)

          balls.current[ballIndex.current].ref.setNativeProps({ position: startPosition, rotation: [0, 0, 0] })
          balls.current[ballIndex.current].ref.setNativeProps({ "physicsBody": null })

          balls.current[ballIndex.current].ref.setNativeProps({ "physicsBody": ballProperties });
          balls.current[ballIndex.current].ref.applyImpulse(pushImpulse, pushPosition)

          ballIndex.current++

          if (ballIndex.current == balls.current.length) {
            ballIndex.current = 0
          }
        })
      })
    })
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


  }


  return (
    <ViroARScene
      onTrackingUpdated={onInitialized}
      onAnchorFound={(anchor) => { onAnchorFound(anchor) }}
      onAnchorRemoved={(anchor) => { onAnchorRemoved(anchor) }}
      ref={(ref) => sceneRef.current = ref}>

      {state.foundAnchor && (
        <ViroARPlane anchorId={state.foundAnchor}>

          <ViroAmbientLight color={"#bbb"} />
          <ViroSpotLight innerAngle={5} outerAngle={90} direction={[0, -1, -.2]} position={[0, 3, 1]} color="#ffffff" castsShadow={true} />

          <ViroNode onClick={(position, source) => console.log('Click', position, source)}>
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

          <ViroBox
            position={[0, 0, -1]}
            scale={[4.0, 4.0, 0.01]}
            rotation={[-90, 0, 0]}
            dragType="FixedToPlane"
            physicsBody={{
              type: "Static",
              useGravity: false,
              mass: 0
            }}
            viroTag="Flooring"
            materials={['floor']}
          />

        </ViroARPlane>)
      }

      {
        balls.current.map(b =>
          <ViroBox
            key={"Ammo_" + b.index}
            ref={(obj) => { b.ref = obj }}
            scale={[.01, .01, .01]}
            physicsBody={ballProperties}
            viroTag={"Ammo_" + b.index}
            onCollision={onCollision}
            materials={['heart']}
          />
        )
      }

      {
        /*
        <ViroBox
          ref={(obj) => { ballRef.current = obj }}
          scale={[.01, .01, .01]}
          physicsBody={ballProperties}
          viroTag="Ammo"
          onCollision={onCollision}
          materials={['heart']}
        />
        */
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
    bottom: 50,
    height: 100,
    width: 100,
    left: (Dimensions.get('window').width / 2) - 50,
    backgroundColor: '#000',
    borderRadius: 80
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
