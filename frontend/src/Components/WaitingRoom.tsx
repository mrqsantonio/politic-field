import { useState } from "react"
import { Room } from "../Services/RoomService"

type WaitingRoomProps = {
	room: Room | undefined
	onLeave: () => void,
	onReady: () => void
}

enum Visibility {
	Hidden,
	Visible
}

enum CopyState {
	Copiable,
	Copied,
	Empty
}

export default function WaitingRoom({ room, onLeave, onReady}: WaitingRoomProps) {
	const [codeVisibility, setCodeVisibility] = useState(Visibility.Hidden)
	const [copyState, setCopyState] = useState(room ? CopyState.Copiable : CopyState.Empty)

	const codeText = codeVisibility == Visibility.Visible ? (room ? room.id : "--------") : "######"
	const codeVisibilityToogleText = codeVisibility == Visibility.Visible ? "Hide" : "Show"
	const copyText = copyState == CopyState.Copied ? "Copied!" : "Copy"
	const copyEmptyTag = copyState == CopyState.Empty? "disable" : ""

	const COPY_RESET_DELAY: number = 3_000

	function onCodeVisibilityToogleClick() {
		setCodeVisibility(codeVisibility == Visibility.Hidden ? Visibility.Visible : Visibility.Hidden)
	}

	function onCodeCopy() {
		// Copy code
		if (room) {
			navigator.clipboard.writeText(room.id)
			setCopyState(CopyState.Copied)
			setTimeout(() => {
				setCopyState(CopyState.Copiable)
			}, COPY_RESET_DELAY)
		}
	}

	return (
		<>
			<div>
				<h1>Room</h1>
				{
					room ?
					<>
						<div>
							<div>
								<h2>Code: {codeText}</h2>
								<button onClick={onCodeVisibilityToogleClick}>{codeVisibilityToogleText}</button>
								<button className={`${copyEmptyTag}`.trim()} onClick={onCodeCopy}>{copyText}</button>
							</div>
							<h2>Players</h2>
							<ul>
								{
									room ? room.players.map((player, index) => {
										return (
											<li key={index}>
												<div>
													<img src={`./icons/${player.icon}`}></img>
													<h1>{player.name}</h1>
												</div>
											</li>
										)
									})
									: <></>
								}
							</ul>
						</div>
						<div>
							<h2>Settings</h2>

							<div>
								<h3>Topic Time: {room.settings.topicTime}</h3>
							</div>
							<div>
								<h3>Guess Time: {room.settings.guessTime}</h3>
							</div>
						</div>
					</>
					:
					<>
						<div>
							<img src="loading"></img>
							<h3>Loading...</h3>
						</div>
					</>
				}

				<button onClick={onReady}>Ready</button>
				<button onClick={onLeave}>Leave</button>
			</div>
		</>
	)
}
