import { useState } from "react";
import JoinRoom from "./JoinRoom";
import CreateRoom from "./CreateRoom";

export enum Screen {
	HOME,
	JOIN,
	CREATE
}

export default function App() {
	const [showScreen, setShowScreen] = useState<Screen>(Screen.HOME)

	function back() {
		setShowScreen(Screen.HOME)
	}

	switch(showScreen) {
		case Screen.JOIN:
			return <JoinRoom back={back} />
		case Screen.CREATE:
			return <CreateRoom back={back} />
		default:
			return (
				<>
					<div>
						<button onClick={() => {setShowScreen(Screen.CREATE)}}>Create</button>
						<button onClick={() => {setShowScreen(Screen.JOIN)}}>Join</button>
					</div>
				</>
			)
	}
}
