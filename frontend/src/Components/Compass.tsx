import { useEffect, useRef } from 'react'
import '../Style/compass.css'

type Spectrum = {
    A: string,
    B: string
}

type Position = {
    icon: number,
    name: string,
    x: number,
    y: number
}

export default function Compass() {

    const horizontalSpectrum: Spectrum = {
        A: "LEFT",
        B: "RIGHT"
    }

    const verticalSpectrum: Spectrum = {
        A: "LIBERAL",
        B: "CONSERVATIVE"
    }

    const stands: Position[] = []

    const canvasRef = useRef<HTMLCanvasElement | null>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const context = canvas.getContext("2d")
        if (!context) return

        // Resize canvas
        const rect = canvas.getBoundingClientRect()
        canvas.width = rect.width
        canvas.height = rect.height

        const width = canvas.width
        const height = canvas.height

        const originX = width / 2  // X-axis origin (center)
        const originY = height / 2 // Y-axis origin (center)

        // Clear canvas
        context.clearRect(0, 0, width, height)

        // Set line style
        context.strokeStyle = "#999"
        context.lineWidth = 1

        // Draw X-axis (horizontal)
        context.beginPath()
        context.moveTo(0, originY)
        context.lineTo(width, originY)
        context.stroke()

        // Draw Y-axis (vertical)
        context.beginPath()
        context.moveTo(originX, 0)
        context.lineTo(originX, height)
        context.stroke()
    }, [/* Update on: hover, click, page resize*/])

    /* TODO: Canvas must contain
     * left-right spectrum
     * top-bottom spectrum
     * support for multiple icon
     * on hover animations
     * anti icon collision algorithm 
    */

    // Anti icon collision algorithm should assure the two icon placed on top
    // of each other should display in a different matter to be viewed properly


    function onClick() {
        // Handle onClick
    }

    function onHover(e: React.MouseEvent<HTMLCanvasElement>) {
        const canvas = canvasRef.current
        if (!canvas) return
        // This must be abstracted
        const rectBounds = canvas.getBoundingClientRect()
        const x = e.clientX - rectBounds.left
        const y = e.clientY - rectBounds.top

        const context = canvas.getContext("2d")
        if (!context) return
    }

    function render() {

    }

    return (
        <div className="compass">
            <div className="cmp-bar">
                {/* top bar */}
                <div>{/* left Corner */}</div>
                <div>{verticalSpectrum.A}</div>
                <div>{/* right Corner */}</div>
            </div>
            <div className="cmp-mid">
                {/* middle */}
                <div>
                    {
                        /* left bar */
                        horizontalSpectrum.A
                    }
                </div>
                <canvas ref={canvasRef} onMouseMove={onHover} />
                <div>
                    {
                        /* right bar */
                        horizontalSpectrum.B
                    }
                </div>
            </div>
            <div className="cmp-bar">
                {/* bot bar */}
                <div>{/* left Corner */}</div>
                <div>{verticalSpectrum.B}</div>
                <div>{/* right Corner */}</div>
            </div>
        </div>
        
    )
} 