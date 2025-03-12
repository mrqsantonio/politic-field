type JoinRoomProps = {
	back: () => void
}

export default function JoinRoom({ back }: JoinRoomProps) {
	
	return (
		<>
			<div>
				<h1>Join Room</h1>
				<input placeholder="Room ID" />
				<button>Paste</button>
				<button>Join</button>
				<button onClick={() => { back() }}>Back</button>
			</div>
		</>
	)
}
