import { useState } from "react"
import DummyRoomService from "../Services/DummyRoomService"
import { useNavigate } from "react-router"
import PlayerService, { PlayerInfo } from "../Services/PlayerService"
import { Settings } from "../Services/RoomService"

type CreateRoomProps = {
	back: () => void
}

export default function CreateRoom({ back }: CreateRoomProps) {
	const [topicTime, setTopicTime] = useState<number>(20)
	const [guessTime, setGuessTime] = useState<number>(20)

	const roomService = DummyRoomService
	const playerService = PlayerService
	const navigate = useNavigate()

	function onCreate() {
		const settings: Settings = {
			topicTime,
			guessTime
		}
		const playerInfo: PlayerInfo = playerService.getPlayer()
		const roomInvite = roomService.createRoom(settings, playerInfo)
		if (roomInvite) {
			playerService.joinRoom(roomInvite)
			navigate(`/${roomInvite.roomID}`)
		}
	}

	function onTopicTimeChange(event: React.ChangeEvent<HTMLInputElement>) {
		if (event != null && event.target != null && event.target.value != null)
		setTopicTime(parseInt(event.target.value))
	}

	function onGuessTimeChange(event: React.ChangeEvent<HTMLInputElement>) {
		if (event != null && event.target != null && event.target.value != null)
			setGuessTime(parseInt(event.target.value))
	}

	return (
		<>
			<div>
				<h1>Create Room</h1>
				<div>
					<h2>Settings:</h2>
					<div>
						<h3>Topic Time:</h3>
						<input type="range" min="5" max="120" value={topicTime} onChange={onTopicTimeChange} />
						<h3>{topicTime}</h3>
					</div>
					<div>
						<h3>Guess Time:</h3>
						<input type="range" min="5" max="120" value={guessTime} onChange={onGuessTimeChange} />
						<h3>{guessTime}</h3>
					</div>
				</div>
				<button onClick={onCreate}>Create</button>
				<button onClick={() => { back() }}>Back</button>
			</div>
		</>
	)
}
