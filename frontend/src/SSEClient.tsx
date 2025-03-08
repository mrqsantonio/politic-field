import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'

const SSEClient: React.FC = () => {
    const [message, setMessage] = useState<string | null>(null)

    const [searchParams, _] = useSearchParams()
    const port = searchParams.get("p")

    useEffect(() => {
        if (port == null) return
        const eventSource = new EventSource(`http://localhost:${port}/events`)

        eventSource.onmessage = (event) => {
            // This will be triggered when the server sends a message
            console.log(event.data)
            setMessage(event.data)
        }

        eventSource.onerror = (error) => {
            console.error("Error with SSE connection", error)
            eventSource.close()
        }

        // Cleanup on unmount
        return () => {
            eventSource.close()
        }
    }, [port])

    return (
        <div>
            <h1>Server-Sent Events</h1>
            <p>{message ? message : "Waiting for events..."}</p>
        </div>
    )
}

export default SSEClient
