type CreateRoomProps = {
	back: () => void
}

export default function CreateRoom({ back }: CreateRoomProps) {
	
	return (
		<>
			<div>
				<h1>Create Room</h1>
				<div>
					<h2>Options:</h2>
				</div>
				<button>Create</button>
				<button onClick={() => { back() }}>Back</button>
			</div>
		</>
	)
}
