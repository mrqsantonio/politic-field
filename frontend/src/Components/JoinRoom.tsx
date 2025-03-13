import { useState } from "react"
import DummyRoomService from "../Services/DummyRoomService"
import { useNavigate } from "react-router"
import PlayerService, { PlayerInfo } from "../Services/PlayerService"

type JoinRoomProps = {
	back: () => void
}

export default function JoinRoom({ back }: JoinRoomProps) {
	const navigate = useNavigate()

	const roomService = DummyRoomService
	const playerService = PlayerService

	const [roomID, setRoomID] = useState<string>("")
	const [joinButton, setJoinButton] = useState<boolean>(false)

	if (!joinButton && roomID.length == 6 && RegExp("[0-9a-z]").test(roomID)) {
		setJoinButton(true)
	}

	function onRoomIDChange(event: React.ChangeEvent<HTMLInputElement>) {
		const code: string = event.target.value
		if ((code.length <= 6 && RegExp("[0-9a-z]").test(code)) || code == "") {
			setRoomID(code)
		}
	}

	async function onPaste() {
		const code = await navigator.clipboard.readText()
		if ((code.length == 6 && RegExp("[0-9a-z]").test(code))) {
			setRoomID(code)
		}
		
	}

	function onJoin() {
		if(roomID && roomID.length == 6) {
			const playerInfo: PlayerInfo = playerService.getPlayer()
			const roomInvite = roomService.joinRoom(roomID, playerInfo)
			if (roomInvite) {
				playerService.joinRoom(roomInvite)
				navigate(`/${roomInvite.roomID}`)
			}
		}
	}

	return (
		<>
			<div>
				<h1>Join Room</h1>
				<input type="text" onChange={onRoomIDChange} pattern="[0-9a-z]{6}" value={roomID} placeholder="Room ID" />
				<button onClick={onPaste}>Paste</button>
				<button onClick={onJoin} disabled={!joinButton}>Join {joinButton ? "t": "f"}</button>
				<button onClick={() => { back() }}>Back</button>
			</div>
		</>
	)
}
