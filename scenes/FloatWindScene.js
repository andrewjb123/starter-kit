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
    ViroAnimations
} from '@viro-community/react-viro';

const FloatWindSceneAR = (props) => {

    const viroProps = props.arSceneNavigator.viroAppProps
    const gameProps = viroProps.gameProps

    const Z_FLOOR = -0.4
    const Z_CEILING = 1

    const [state, setState] = useState({
        foundAnchor: null
    })

    const sceneRef = useRef(null)

    const objects = useRef(gameProps.objects)
    const ballPhysics = gameProps.ballPhysics

    ViroMaterials.createMaterials(gameProps.materials)
    ViroAnimations.registerAnimations(gameProps.animations)

    const ballIndex = useRef(0)
    const balls = useRef([
        { index: 0, ref: null, visible: false },
        { index: 1, ref: null, visible: false },
        { index: 2, ref: null, visible: false },
        { index: 3, ref: null, visible: false },
        { index: 4, ref: null, visible: false },
        { index: 5, ref: null, visible: false },
        { index: 6, ref: null, visible: false },
        { index: 7, ref: null, visible: false },
        { index: 8, ref: null, visible: false },
        { index: 9, ref: null, visible: false }
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

        balls.current[ballIndex.current].ref.setNativeProps({ "visible": true })

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

                    const pushStrength = gameProps.ammoStrength
                    const pushImpulse = [forward[0] * pushStrength, forward[1] * pushStrength, forward[2] * pushStrength]

                    const pushPosition = getVelocityLine(clickedPos, pos, 1)

                    balls.current[ballIndex.current].ref.setNativeProps({ position: startPosition, rotation: [0, 0, 0] })
                    balls.current[ballIndex.current].ref.setNativeProps({ "physicsBody": null })
                    balls.current[ballIndex.current].ref.setNativeProps({ "physicsBody": ballPhysics });
                    balls.current[ballIndex.current].ref.applyImpulse(pushImpulse, pushPosition)

                    ballIndex.current++

                    if (ballIndex.current == balls.current.length) {
                        ballIndex.current = 0
                    }
                })
            })
        })
    }

    const onInitialized = (state, reason) => {

    }

    const onAnchorFound = (anchor) => {
        console.log('onAnchorFound', anchor)

        if (!state.foundAnchor && anchor.position[1] < Z_FLOOR) {
            setState({ foundAnchor: anchor.anchorId })

            viroProps.fireButton = fireButton

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

    const onCollision = (tag, b, c) => {
        console.log('Collision', tag, b, c)

        if (viroProps.onCollision) {
            viroProps.onCollision(0)
        }
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

                    {
                        objects.current.map(o =>
                            <ViroNode key={o.tag}>
                                <Viro3DObject
                                    viroTag={o.tag}
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
                                    animation={o.animation}
                                />
                            </ViroNode>
                        )
                    }

                    <ViroBox
                        viroTag="Flooring"
                        position={[0, 0, -1]}
                        scale={[4.0, 4.0, 0.01]}
                        rotation={[-90, 0, 0]}
                        dragType="FixedToPlane"
                        physicsBody={{
                            type: "Static",
                            useGravity: false,
                            mass: 0
                        }}
                        materials={['floor']}
                    />

                </ViroARPlane>)
            }

            {
                balls.current.map(b =>
                    <ViroSphere
                        key={"Ammo_" + b.index}
                        viroTag={"Ammo_" + b.index}
                        ref={(obj) => { b.ref = obj }}
                        scale={[.01, .01, .01]}
                        physicsBody={ballPhysics}
                        heightSegmentCount={20}
                        widthSegmentCount={20}
                        radius={1}
                        position={[0, 0, -2]}
                        materials={['ball']}
                        visible={b.visible}
                        onCollision={onCollision}
                    />
                )
            }

        </ViroARScene>
    )
}

export default FloatWindSceneAR