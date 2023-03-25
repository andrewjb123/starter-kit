import React, { useState, useEffect, useRef } from 'react';
import {
    ViroARScene,
    ViroBox,
    ViroSphere,
    Viro3DObject,
    ViroAmbientLight,
    ViroSpotLight,
    ViroNode,
    ViroARPlane,
    ViroMaterials,
    ViroAnimations,
    ViroARCamera,
    ViroText,
    ViroFlexView,
    ViroOrbitCamera
} from '@viro-community/react-viro';

const GiveItemsSceneAR = (props) => {

    const viroProps = props.arSceneNavigator.viroAppProps
    const gameProps = viroProps.gameProps

    const Z_FLOOR = -0.4
    const Z_CEILING = 1

    const [state, setState] = useState({
        foundAnchor: null
    })

    const sceneRef = useRef(null)

    const objectRef = useRef(null)

    ViroMaterials.createMaterials(gameProps.materials)
    ViroAnimations.registerAnimations(gameProps.animations)

    const onInitialized = (state, reason) => {

    }

    const onAnchorFound = (anchor) => {
        //console.log('onAnchorFound', anchor)

        if (!state.foundAnchor && anchor.position[1] < Z_FLOOR) {
            setState((state) => ({ ...state, foundAnchor: anchor.anchorId }))

            if (viroProps.onFireButtonAssigned) {
                viroProps.onFireButtonAssigned({
                    result: true
                })
            }
        }
    }

    const onAnchorRemoved = (anchor) => {
        console.log('onAnchorRemoved', anchor)

        if (state.foundAnchor) {
            //  setState({ foundAnchor: null })
        }
    }

    const onCollision = (tag) => {
        console.log('collide', tag)

        setState((state) => ({ ...state, itemHanded: true }))
        //viroProps.onCollision(0)
    }

    const onCameraTransformUpdate = (camera) => {
        if (objectRef.current) {
            objectRef.current.setNativeProps({ position: camera.position, up: camera.up, rotation: camera.rotation, forward: camera.forward })
        }
    }

    return (
        <ViroARScene
            onTrackingUpdated={onInitialized}
            onAnchorFound={(anchor) => { onAnchorFound(anchor) }}
            onAnchorRemoved={(anchor) => { onAnchorRemoved(anchor) }}
            onCameraTransformUpdate={(camera) => onCameraTransformUpdate(camera)}
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

                </ViroARPlane>)
            }

            <ViroNode ref={(ref) => objectRef.current = ref} visible={!state.itemHanded}>



                <Viro3DObject

                    onClick={(position, source) => console.log('Click', position, source)}
                    source={{
                        uri: 'https://github.com/andrewjb123/starter-kit/raw/master/plane/plane.vrx'
                    }}
                    position={[0, -0.2, -0.7]}
                    scale={[.0004, .0004, .0004]}
                    rotation={[0, 180, 0]}
                    type="VRX"
                    viroTag="Object"
                    onCollision={(tag) => onCollision(tag)}
                    physicsBody={{
                        type: 'Static',
                        mass: 0,
                        enabled: true,
                        useGravity: false,
                        shape: { type: 'Sphere', params: [0.14] }
                    }}
                />


            </ViroNode>
        </ViroARScene>
    )
}

export default GiveItemsSceneAR