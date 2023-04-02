import React, { useState, useEffect, useRef } from 'react'
import { View, StyleSheet, PixelRatio, Dimensions, TouchableOpacity, Text } from 'react-native'
import { ViroARSceneNavigator } from '@viro-community/react-viro'
import * as Animatable from 'react-native-animatable'
import FloatFireScene from './scenes/FloatFireScene'
import FloatWindScene from './scenes/FloatWindScene'
import GiveItemsScene from './scenes/GiveItemsScene'
import PickupItemScene from './scenes/PickupItemScene'

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
        uri: 'https://github.com/andrewjb123/starter-kit/raw/master/balloon/ballon.vrx',
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
          shape: { type: 'Box', params: [0.05, 0.05, 0.05] }
        }
      },
      {
        uri: 'https://github.com/andrewjb123/starter-kit/raw/master/balloon/ballon.vrx',
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
    objects1: [
      {
        uri: 'https://github.com/andrewjb123/starter-kit/raw/master/plane/plane.vrx',
        tag: 'Plane1',
        ref: null,
        position: [0, 1, 0],
        rotation: [0, 0, 0],
        scale: [.0006, .0006, .0006],
        lifeSpan: 10000,
        maxHits: 10,
        currentHits: 0,
        animation: {
          run: true,
          loop: true,
          name: 'flight1'
        },
        physics: {
          type: "Static",
          useGravity: false,
          shape: { type: 'Box', params: [0.05, 0.05, 0.05] }
        }
      },
      {
        uri: 'https://github.com/andrewjb123/starter-kit/raw/master/plane/plane.vrx',
        tag: 'Plane2',
        ref: null,
        position: [0, 1.3, 1.8],
        rotation: [0, 90, 0],
        scale: [.0006, .0006, .0006],
        lifeSpan: 10000,
        maxHits: 10,
        currentHits: 0,
        animation: {
          run: true,
          loop: true,
          name: 'flight2'
        },
        physics: {
          type: "Static",
          useGravity: false,
          shape: { type: 'Box', params: [0.05, 0.05, 0.05] }
        }
      },
      {
        uri: 'https://github.com/andrewjb123/starter-kit/raw/master/plane/plane.vrx',
        tag: 'Plane3',
        ref: null,
        position: [0, 1.3, -1.8],
        rotation: [0, 90, 0],
        scale: [.0006, .0006, .0006],
        lifeSpan: 10000,
        maxHits: 10,
        currentHits: 0,
        animation: {
          run: true,
          loop: true,
          name: 'flight2'
        },
        physics: {
          type: "Static",
          useGravity: false,
          shape: { type: 'Box', params: [0.05, 0.05, 0.05] }
        }
      },
      {
        uri: 'https://github.com/andrewjb123/starter-kit/raw/master/plane/plane.vrx',
        tag: 'Plane4',
        ref: null,
        position: [-1, 1.3, 1.8],
        rotation: [0, 90, 0],
        scale: [.0006, .0006, .0006],
        lifeSpan: 10000,
        maxHits: 10,
        currentHits: 0,
        animation: {
          run: true,
          loop: true,
          name: 'flight1'
        },
        physics: {
          type: "Static",
          useGravity: false,
          shape: { type: 'Box', params: [0.05, 0.05, 0.05] }
        }
      },
      {
        uri: 'https://github.com/andrewjb123/starter-kit/raw/master/plane/plane.vrx',
        tag: 'Plane5',
        ref: null,
        position: [-1, 1.1, 0],
        rotation: [0, 90, 0],
        scale: [.0006, .0006, .0006],
        lifeSpan: 10000,
        maxHits: 10,
        currentHits: 0,
        animation: {
          run: true,
          loop: true,
          name: 'flight2'
        },
        physics: {
          type: "Static",
          useGravity: false,
          shape: { type: 'Box', params: [0.05, 0.05, 0.05] }
        }
      }
    ],
    objects2: [
      {
        uri: 'https://github.com/andrewjb123/starter-kit/raw/master/plane/plane.vrx',
        tag: 'Plane6',
        ref: null,
        position: [0, 1, 0],
        rotation: [0, 0, 0],
        scale: [.0006, .0006, .0006],
        lifeSpan: 10000,
        maxHits: 10,
        currentHits: 0,
        animation: {
          run: true,
          loop: true,
          name: 'flight1'
        },
        physics: {
          type: "Static",
          useGravity: false,
          shape: { type: 'Box', params: [0.05, 0.05, 0.05] }
        }
      },
      {
        uri: 'https://github.com/andrewjb123/starter-kit/raw/master/plane/plane.vrx',
        tag: 'Plane6',
        ref: null,
        position: [0, 1.3, 1.8],
        rotation: [0, 90, 0],
        scale: [.0006, .0006, .0006],
        lifeSpan: 10000,
        maxHits: 10,
        currentHits: 0,
        animation: {
          run: true,
          loop: true,
          name: 'flight2'
        },
        physics: {
          type: "Static",
          useGravity: false,
          shape: { type: 'Box', params: [0.05, 0.05, 0.05] }
        }
      },
      {
        uri: 'https://github.com/andrewjb123/starter-kit/raw/master/plane/plane.vrx',
        tag: 'Plane8',
        ref: null,
        position: [0, 1.3, -1.8],
        rotation: [0, 90, 0],
        scale: [.0006, .0006, .0006],
        lifeSpan: 10000,
        maxHits: 10,
        currentHits: 0,
        animation: {
          run: true,
          loop: true,
          name: 'flight2'
        },
        physics: {
          type: "Static",
          useGravity: false,
          shape: { type: 'Box', params: [0.05, 0.05, 0.05] }
        }
      },
      {
        uri: 'https://github.com/andrewjb123/starter-kit/raw/master/plane/plane.vrx',
        tag: 'Plane9',
        ref: null,
        position: [-1, 1.3, 1.8],
        rotation: [0, 90, 0],
        scale: [.0006, .0006, .0006],
        lifeSpan: 10000,
        maxHits: 10,
        currentHits: 0,
        animation: {
          run: true,
          loop: true,
          name: 'flight1'
        },
        physics: {
          type: "Static",
          useGravity: false,
          shape: { type: 'Box', params: [0.05, 0.05, 0.05] }
        }
      },
      {
        uri: 'https://github.com/andrewjb123/starter-kit/raw/master/plane/plane.vrx',
        tag: 'Plane10',
        ref: null,
        position: [-1, 1.1, 0],
        rotation: [0, 90, 0],
        scale: [.0006, .0006, .0006],
        lifeSpan: 10000,
        maxHits: 10,
        currentHits: 0,
        animation: {
          run: true,
          loop: true,
          name: 'flight2'
        },
        physics: {
          type: "Static",
          useGravity: false,
          shape: { type: 'Box', params: [0.05, 0.05, 0.05] }
        }
      }
    ],
    objects3: [
      {
        uri: 'https://github.com/andrewjb123/starter-kit/raw/master/plane/plane.vrx',
        tag: 'Plane11',
        ref: null,
        position: [0, 1, 0],
        rotation: [0, 0, 0],
        scale: [.0006, .0006, .0006],
        lifeSpan: 10000,
        maxHits: 10,
        currentHits: 0,
        animation: {
          run: true,
          loop: true,
          name: 'flight1'
        },
        physics: {
          type: "Static",
          useGravity: false,
          shape: { type: 'Box', params: [0.05, 0.05, 0.05] }
        }
      },
      {
        uri: 'https://github.com/andrewjb123/starter-kit/raw/master/plane/plane.vrx',
        tag: 'Plane12',
        ref: null,
        position: [0, 1.3, 1.8],
        rotation: [0, 90, 0],
        scale: [.0006, .0006, .0006],
        lifeSpan: 10000,
        maxHits: 10,
        currentHits: 0,
        animation: {
          run: true,
          loop: true,
          name: 'flight2'
        },
        physics: {
          type: "Static",
          useGravity: false,
          shape: { type: 'Box', params: [0.05, 0.05, 0.05] }
        }
      },
      {
        uri: 'https://github.com/andrewjb123/starter-kit/raw/master/plane/plane.vrx',
        tag: 'Plane13',
        ref: null,
        position: [0, 1.3, -1.8],
        rotation: [0, 90, 0],
        scale: [.0006, .0006, .0006],
        lifeSpan: 10000,
        maxHits: 10,
        currentHits: 0,
        animation: {
          run: true,
          loop: true,
          name: 'flight2'
        },
        physics: {
          type: "Static",
          useGravity: false,
          shape: { type: 'Box', params: [0.05, 0.05, 0.05] }
        }
      },
      {
        uri: 'https://github.com/andrewjb123/starter-kit/raw/master/plane/plane.vrx',
        tag: 'Plane14',
        ref: null,
        position: [-1, 1.3, 1.8],
        rotation: [0, 90, 0],
        scale: [.0006, .0006, .0006],
        lifeSpan: 10000,
        maxHits: 10,
        currentHits: 0,
        animation: {
          run: true,
          loop: true,
          name: 'flight1'
        },
        physics: {
          type: "Static",
          useGravity: false,
          shape: { type: 'Box', params: [0.05, 0.05, 0.05] }
        }
      },
      {
        uri: 'https://github.com/andrewjb123/starter-kit/raw/master/plane/plane.vrx',
        tag: 'Plane15',
        ref: null,
        position: [-1, 1.1, 0],
        rotation: [0, 90, 0],
        scale: [.0006, .0006, .0006],
        lifeSpan: 10000,
        maxHits: 10,
        currentHits: 0,
        animation: {
          run: true,
          loop: true,
          name: 'flight2'
        },
        physics: {
          type: "Static",
          useGravity: false,
          shape: { type: 'Box', params: [0.05, 0.05, 0.05] }
        }
      }
    ]
  }

  const gameProps3 = {
    hasCrossHair: false,
    hasFireButton: false,
    materials: {
      ball: {
        lightingModel: "Blinn",
        diffuseColor: '#000'
      },
      floor: {
        lightingModel: "Blinn",
        diffuseColor: '#fff'
      }
    },
  }

  const gamePropsFlower = {
    hasCrossHair: false,
    hasFireButton: false,
    hasPercentageGuage: true,
    distanceMeters: 2,
    warning: 'Move within 2 meters of the flower to pick it',
    progressMessage: 'collecting',
    materials: {
      ball: {
        lightingModel: "Blinn",
        diffuseColor: '#000'
      },
      floor: {
        lightingModel: "Blinn",
        diffuseColor: '#fff'
      }
    },
    objects1: [
      {
        uri: "https://firebasestorage.googleapis.com/v0/b/tour-2e13f.appspot.com/o/3dmodels%2Fflower01%2Fflower01.vrx?alt=media&token=2ae2d162-21ba-451c-8dd7-515cd81b8d2e",
        tag: 'Flower1',
        ref: null,
        position: [-1, 0, 0],
        rotation: [0, 90, 0],
        scale: [.009, .009, .009],
        time: 2
      },
      {
        uri: "https://firebasestorage.googleapis.com/v0/b/tour-2e13f.appspot.com/o/3dmodels%2Fflower01%2Fflower01.vrx?alt=media&token=2ae2d162-21ba-451c-8dd7-515cd81b8d2e",
        tag: 'Flower2',
        ref: null,
        position: [0, 0, 0],
        rotation: [0, 90, 0],
        scale: [.01, .01, .01],
        time: 4
      },
      {
        uri: "https://firebasestorage.googleapis.com/v0/b/tour-2e13f.appspot.com/o/3dmodels%2Fflower02%2Fflower02.vrx?alt=media&token=d9c47f28-31de-49c0-856f-709e50031ef6",
        tag: 'Flower3',
        ref: null,
        position: [-1, 0, 0],
        rotation: [0, 90, 0],
        scale: [.006, .006, .006],
        time: 2
      },
      {
        uri: "https://firebasestorage.googleapis.com/v0/b/tour-2e13f.appspot.com/o/3dmodels%2Fflower02%2Fflower02.vrx?alt=media&token=d9c47f28-31de-49c0-856f-709e50031ef6",
        tag: 'Flower4',
        ref: null,
        position: [-1, 0, 0],
        rotation: [0, 90, 0],
        scale: [.009, .009, .009],
        time: 3
      },
      {
        uri: "https://firebasestorage.googleapis.com/v0/b/tour-2e13f.appspot.com/o/3dmodels%2Fflower01%2Fflower01.vrx?alt=media&token=2ae2d162-21ba-451c-8dd7-515cd81b8d2e",
        tag: 'Flower5',
        ref: null,
        position: [1, 0, 1.4],
        rotation: [0, 90, 0],
        scale: [0.01, 0.01, 0.01],
        time: 3
      },
    ]
  }


  const [state, setState] = useState({
    initialised: false
  })

  const percentageGuageRef = useRef(null)
  const warningRef = useRef(null)

  const onFireButtonAssigned = () => {
    //setState(() => ({ ...state }))
  }

  const onCollision = () => {
    console.log('try collide')
  }

  const onClick = (type, params) => {

    const scaleDown = {
      0: {
        scaleX: 0.2,
      },
      1: {
        scaleX: 1,
      }
    }

    if (type === 'percentage-guage') {
      setState((state) => ({
        ...state,
        guage: {
          time: params.time
        },
        warningMessage: null
      }))

      if (percentageGuageRef.current) {
        percentageGuageRef.current.animate(scaleDown, params.time * 1000).then(() => {

          setState((state) => ({
            ...state,
            guage: null
          }))
        })
      }
    }
  }

  const onWarning = () => {

    setState((state) => ({
      ...state,
      warningMessage: appProps.gameProps.warning
    }))

    if (warningRef.current) {
      warningRef.current.animate('flash', 1000)
    }
  }

  const onInitialised = () => {
    setState((state) => ({
      ...state,
      initialised: true
    }))
  }

  const [appProps, setAppProps] = useState({
    fireButton: null,
    onInitialised: onInitialised,
    gameProps: gamePropsFlower,
    onFireButtonAssigned: onFireButtonAssigned,
    onClick: onClick,
    onWarning: onWarning,
    onCollision: onCollision
  })

  return (
    <View
      style={styles.container}>
      <ViroARSceneNavigator
        autofocus={true}
        initialScene={{
          scene: PickupItemScene,
        }}
        viroAppProps={appProps}
        style={styles.container}
      />

      {state.initialised && appProps.gameProps.hasFireButton && <TouchableOpacity style={styles.fireButton} onPress={() => { if (appProps.fireButton) appProps.fireButton() }}>

      </TouchableOpacity>}

      {state.initialised && appProps.gameProps.hasCrossHair && <View style={styles.crossHair} />}


      {
        state.warningMessage &&
        <Animatable.View
          ref={(ref) => warningRef.current = ref}
          style={styles.warning}>
          <Text style={styles.warningText}>
            {state.warningMessage}
          </Text>
        </Animatable.View>
      }


      {
        state.initialised && appProps.gameProps.hasPercentageGuage && <View style={styles.percentageGuage}>
          <Animatable.View
            ref={(ref) => percentageGuageRef.current = ref}
            iterationCount={1}
            delay={0}
            style={styles.percentageGuageBar}>
          </Animatable.View>

          {state.guage && <Text style={styles.percentageMessage}>{appProps.gameProps.progressMessage}</Text>}
        </View>
      }
    </View>
  )
}

var styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  },
  percentageGuage: {
    position: 'absolute',
    left: Dimensions.get('window').width / 2 - 150,
    bottom: 50,
    height: 30,
    width: 300,
    borderRadius: 30,
    backgroundColor: '#28b04c',
    padding: 3,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center'
  },
  percentageGuageBar: {
    width: 294,
    height: 24,
    backgroundColor: '#19e64f',
    borderRadius: 30
  },
  percentageMessage: {
    position: 'absolute',
    color: '#000',
    fontSize: 7,
    top: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase'
  },
  warning: {
    position: 'absolute',
    bottom: 100,
    height: 60,
    width: Dimensions.get('window').width,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  warningText: {
    color: '#fff'
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
