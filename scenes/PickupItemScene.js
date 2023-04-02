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

const PickupItemSceneAR = (props) => {

    const viroProps = props.arSceneNavigator.viroAppProps
    const gameProps = viroProps.gameProps

    const Z_FLOOR = -0.4
    const Z_CEILING = 1

    const [state, setState] = useState({
        foundAnchor: null
    })

    const sceneRef = useRef(null)

    const pickupRef = useRef(null)

    ViroMaterials.createMaterials(gameProps.materials)
    ViroAnimations.registerAnimations(gameProps.animations)

    const onInitialized = (state, reason) => {
    }

    const onAnchorFound = (anchor) => {
        if (!state.foundAnchor && anchor.position[1] < Z_FLOOR) {
            setState((state) => ({ ...state, foundAnchor: anchor.anchorId }))

            if (viroProps.onInitialised) {
                viroProps.onInitialised()
            }
        }
    }

    const onAnchorRemoved = (anchor) => {
        console.log('onAnchorRemoved', anchor)

        if (state.foundAnchor) {
            //  setState({ foundAnchor: null })
        }
    }

    const getDistance = (positionOne, positionTwo) => {
        const dx = positionOne[0] - positionTwo[0]
        const dy = positionOne[1] - positionTwo[1]
        const dz = positionOne[2] - positionTwo[2]

        const distanceMeters = Math.sqrt(dx * dx + dy * dy + dz * dz)

        return distanceMeters
    }


    const onClick = (obj, position, source) => {

        sceneRef.current.getCameraOrientationAsync().then((camera) => {
            obj.ref.getTransformAsync().then(transform => {
                const meters = getDistance(transform.position, camera.position)

                if (meters >= gameProps.distanceMeters) {
                    if (viroProps.onWarning) {
                        viroProps.onWarning(gameProps.warning)
                    }
                }
                else {

                    if (viroProps.onClick) {

                        if (pickupRef.current) {
                            clearTimeout(pickupRef.current)
                            pickupRef.current = null
                        }

                        pickupRef.current = setTimeout(() => {
                            obj.ref.setNativeProps({
                                visible: false
                            })
                        }, obj.time * 1000)

                        viroProps.onClick('percentage-guage', { time: obj.time })
                    }
                }
            })
        })
    }

    return (
        <ViroARScene
            onTrackingUpdated={onInitialized}
            onAnchorFound={(anchor) => { onAnchorFound(anchor) }}
            onAnchorRemoved={(anchor) => { onAnchorRemoved(anchor) }}
            ref={(ref) => sceneRef.current = ref}>

            <ViroARPlane anchorId={state.foundAnchor}>
                <ViroAmbientLight color={"#bbb"} />
                <ViroSpotLight innerAngle={5} outerAngle={90} direction={[0, -1, -.2]} position={[0, 3, 1]} color="#ffffff" castsShadow={true} />

                {state.foundAnchor && gameProps.objects1.map((obj) => {
                    return <ViroNode
                        key={obj.tag}
                        ref={(ref) => obj.ref = ref}
                        onClick={(position, source) => onClick(obj, position, source)}>

                        <Viro3DObject
                            source={{
                                uri: obj.uri
                            }}
                            position={obj.position}
                            scale={obj.scale}
                            type="VRX"
                            dragType="FixedToPlane"
                            onDrag={() => { }}
                            viroTag={obj.tag}
                        />
                    </ViroNode>
                })}
            </ViroARPlane>

        </ViroARScene>
    )
}

export default PickupItemSceneAR