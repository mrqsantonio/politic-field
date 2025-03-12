import { useState } from "react"
import dummyRoomService from "../Services/DummyRoomService"
import { useNavigate } from "react-router"

type CreateRoomProps = {
	back: () => void
}

export default function CreateRoom({ back }: CreateRoomProps) {
	const [topicTime, setTopicTime] = useState<number>(20)
	const [guessTime, setGuessTime] = useState<number>(20)

	const roomService = dummyRoomService
	const navigate = useNavigate()


	function onCreate() {
		const newRoom = roomService.createRoom({
			topicTime,
			guessTime
		})
		if (newRoom) {
			window.localStorage.setItem("player", JSON.stringify({
				name: "Ramiro",
				token: newRoom.player_id,
				icon: 0
			}))
			navigate(`/${newRoom.room_id}`)
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
