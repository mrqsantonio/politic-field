import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import WaitingRoom from "../Components/WaitingRoom"
import { State, Room, Player } from "../Services/RoomService"
import dummyRoomService from "../Services/DummyRoomService"

type GameParams = {
	id: string
}

export default function Game() {
	const navigate = useNavigate()

	const [room, setRoom] = useState<Room | undefined>(undefined)

	const gameParams = useParams<GameParams>()

	const roomService = dummyRoomService

	function onLeave() {
		// Send a leave request to server
		// Change path to /
		navigate("/")
	}

	function onReady() {
		// Send ready signal to server
		if (room) {
			const playerString = window.localStorage.getItem("player")
			if (playerString) {
				const player: Player = JSON.parse(playerString)
				roomService.markReady(room.id, player.token)
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

			roomService.roomUpdater(gameParams.id, onUpdate, onError)
		}
	}, [gameParams.id])

	console.log("Rendering Game", room)
	if (room) {
		switch(room.state) {
			case State.Waiting:
				return <WaitingRoom room={room} onLeave={onLeave} onReady={onReady} />
			default:
				return (
					<>
						<h1>Invalid game state?</h1>
					</>
				)
		}
	}
	return (
		<>
		</>
	)
}
