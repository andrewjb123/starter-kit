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
  ViroMaterials,
  ViroAnimations
} from '@viro-community/react-viro';


const HelloWorldSceneAR = (props) => {

  const Z_FLOOR = -0.4
  const Z_CEILING = 1

  const [state, setState] = useState({
    foundAnchor: null
  })

  const sceneRef = useRef(null)

  const ballIndex = useRef(0)
  const balls = useRef([
    { ref: null, index: 0, visible: false },
    { ref: null, index: 1, visible: false },
    { ref: null, index: 2, visible: false },
    { ref: null, index: 3, visible: false },
    { ref: null, index: 4, visible: false },
    { ref: null, index: 5, visible: false },
    { ref: null, index: 6, visible: false },
    { ref: null, index: 7, visible: false },
    { ref: null, index: 8, visible: false },
    { ref: null, index: 9, visible: false }
  ])

  const ballProperties = {
    friction: 1.6,
    type: 'Dynamic',
    mass: 0.5,
    enabled: true,
    useGravity: false,
    shape: { type: 'Sphere', params: [0.14] },
    restitution: 0.15,
    torque: [0, 0, 0]
  }

  const objects = useRef([
    {
      uri: 'https://github.com/andrewjb123/starter-kit/raw/master/plane/plane.vrx',
      tag: 'Plane1',
      ref: null,
      position: [0, 1, 0],
      rotation: [0, 0, 0],
      scale: [.0003, .0003, .0003],
      animation: {
        run: true,
        loop: true,
        name: 'flight1'
      },
      physics: {
        type: "Static",
        useGravity: false,
        mass: 0,
        shape: { type: 'Box', params: [0.05, 0.05, 0.05] }
      }
    },
    {
      uri: 'https://github.com/andrewjb123/starter-kit/raw/master/plane/plane.vrx',
      tag: 'Plane2',
      ref: null,
      position: [0, 1.3, 1.8],
      rotation: [0, 90, 0],
      scale: [.0003, .0003, .0003],
      animation: {
        run: true,
        loop: true,
        name: 'flight2'
      },
      physics: {
        type: "Static",
        useGravity: false,
        mass: 0,
        shape: { type: 'Box', params: [0.05, 0.05, 0.05] }
      }
    }
  ])

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

    balls.current[ballIndex.current].visible = true

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

  ViroMaterials.createMaterials({
    heart: {
      lightingModel: "Blinn",
      diffuseColor: '#000'
    },
    floor: {
      colorWriteMask: ['alpha']
    },
  })

  ViroAnimations.registerAnimations({
    flight1: {
      properties: {
        positionZ: "+=0.0008",
        positionY: "+=0.0010",
        positionX: "-=0.0010"
      },
      easing: "Linear",
      duration: 1
    },
    flight2: {
      properties: {
        positionZ: "+=0.0008",
        positionY: "-=0.0006",
        positionX: "+=0.0010"
      },
      easing: "Linear",
      duration: 1
    }
  })


  useEffect(() => {
    props.arSceneNavigator.viroAppProps.fireButton = fireButton
  }, [])

  const onInitialized = (state, reason) => {

  }

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

          {/*<ViroNode onClick={(position, source) => console.log('Click', position, source)}>
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
            </ViroNode>*/}

          {
            objects.current.map(o =>
              <Viro3DObject
                key={o.tag}
                ref={(ref) => o.ref = ref}
                source={{
                  uri: o.uri
                }}
                position={o.position}
                scale={o.scale}
                rotation={o.rotation}
                type="VRX"
                dragType="FixedToPlane"
                physicsBody={o.physics}
                tag={o.tag}
                animation={o.animation}
              />
            )

            /*
                <ViroBox
                  position={o.position}
                  scale={[0.1, 0.1, 0.1]}
                  rotation={o.rotation}
                  physicsBody={{
                    type: "Static",
                    useGravity: false,
                    mass: 0
                  }}
                  viroTag={o.tag}
                  materials={['floor']}
                />


                  physicsBody={{
                    type: 'Static',
                    useGravity: false,
                    shape: { type: 'Box', params: o.shape }
                  }}
                  */
          }


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
}

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
})
