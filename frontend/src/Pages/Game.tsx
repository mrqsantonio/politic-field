import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import WaitingRoom from "../Components/WaitingRoom"
import { State, Room } from "../Services/RoomService"
import DummyRoomService from "../Services/DummyRoomService"
import PlayerService from "../Services/PlayerService"

type GameParams = {
	id: string
}

export default function Game() {
	const navigate = useNavigate()

	const [room, setRoom] = useState<Room | undefined>(undefined)

	const gameParams = useParams<GameParams>()

	const roomService = DummyRoomService
	const playerService = PlayerService

	function onLeave() {
		if (room) {
			const authToken = playerService.getToken()
			if (authToken) {
				roomService.leaveRoom(room.id, authToken)
			}
		}
		navigate("/")
	}

	function onReady() {
		console.log("Starting...")
		if (room) {
			console.log("Authenticating user...")
			const authToken = playerService.getToken()
			if (authToken) {
				roomService.markReady(room.id, authToken)
				console.log("Marked as ready!")
				return;
			}
			// If code reaches here operation as failed this means the player should be removed from the room
			// Either by having an illegal/invalid token or because room is null
			console.error("Illegal Operation: tihs token is not valid on the current context")
			return;
		}
		console.error("Illegal Operation: ready on invalid room")
	}

	useEffect(() => {
		if (gameParams && gameParams.id) {
			const onUpdate = (room: Room) => {
				console.log(room)
				setRoom(room)
			}

			const onError = (error: string) => {
				console.error(error)
			}

			const roomUpdater = roomService.roomUpdater(gameParams.id, onUpdate, onError)

			return () => {
				roomUpdater.unsubscribe()
			}
		}
	}, [gameParams.id])

	// FIXME: room.state update isn't rendering the new component
	if (room) {
		console.log("State:", State[room.state])
		switch(room.state) {
			case State.Waiting:
				return <WaitingRoom room={room} onLeave={onLeave} onReady={onReady} />
			case State.Topic:
				return (
					<div>
						<h1>Choose a topic:</h1>
						<input type="text" placeholder="Topic" />
					</div>
				)
			default:
				return (
					<>
						<h1>Invalid game state?</h1>
					</>
				)
		}
	}
}
