import React, { useState, useEffect, useRef } from 'react'
import { View, StyleSheet, PixelRatio, Dimensions, TouchableOpacity, Text } from 'react-native'
import { ViroARSceneNavigator } from '@viro-community/react-viro'
import FloatFireScene from './scenes/FloatFireScene'
import FloatWindScene from './scenes/FloatWindScene'

export default function ARControl(props) {

  const gameProps2 = {
    ammoStrength: 5,
    materials: {
      ball: {
        lightingModel: "Blinn",
        diffuseColor: '#000'
      },
      floor: {
        colorWriteMask: ['alpha']
      }
    },
    animations: {
      flight1: {
        properties: {
          positionZ: "+=0.04",
          positionY: "+=0.05",
          positionX: "-=0.05"
        },
        easing: "Linear",
        duration: 1000
      },
      flight2: {
        properties: {
          positionZ: "+=0.04",
          positionY: "-=0.03",
          positionX: "+=0.05"
        },
        easing: "Linear",
        duration: 1000
      }
    },
    ballPhysics: {
      friction: 1.6,
      type: 'Dynamic',
      mass: 0.5,
      enabled: true,
      useGravity: false,
      shape: { type: 'Sphere', params: [0.14] },
      restitution: 0.15,
      torque: [0, 0, 0]
    },
    objects: [
      {
        uri: 'https://github.com/andrewjb123/starter-kit/raw/master/balloon/balloon.vrx',
        tag: 'Balloon1',
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
        uri: 'https://github.com/andrewjb123/starter-kit/raw/master/balloon/balloon.vrx',
        tag: 'Balloon2',
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
    ]
  }


  const gameProps1 = {
    ammoStrength: 5,
    materials: {
      ball: {
        lightingModel: "Blinn",
        diffuseColor: '#000'
      },
      floor: {
        colorWriteMask: ['alpha']
      }
    },
    animations: {
      flight1: {
        properties: {
          positionZ: "+=0.04",
          positionY: "+=0.05",
          positionX: "-=0.05"
        },
        easing: "Linear",
        duration: 1000
      },
      flight2: {
        properties: {
          positionZ: "+=0.04",
          positionY: "-=0.03",
          positionX: "+=0.05"
        },
        easing: "Linear",
        duration: 1000
      }
    },
    ballPhysics: {
      friction: 1.6,
      type: 'Dynamic',
      mass: 0.5,
      enabled: true,
      useGravity: false,
      shape: { type: 'Sphere', params: [0.14] },
      restitution: 0.15,
      torque: [0, 0, 0]
    },
    objects: [
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
    ]
  }


  const [state, setState] = useState({
    initialised: false
  })

  const onFireButtonAssigned = () => {
    setState(() => ({ ...state, initialised: true }))
  }

  const onCollision = () => {
    console.log('try collide')
  }

  const [appProps, setAppProps] = useState({
    fireButton: null,
    gameProps: gameProps2,
    onFireButtonAssigned: onFireButtonAssigned,
    onCollision: onCollision
  })

  return (
    <View
      style={styles.container}>
      <ViroARSceneNavigator
        autofocus={true}
        initialScene={{
          scene: FloatWindScene,
        }}
        viroAppProps={appProps}
        style={styles.container}
      />

      {state.initialised && <TouchableOpacity style={styles.fireButton} onPress={() => { if (appProps.fireButton) appProps.fireButton() }}>

      </TouchableOpacity>}

      <View style={styles.crossHair} />
    </View>
  )
}

var styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
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
