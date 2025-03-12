import { useState } from "react";
import JoinRoom from "../Components/JoinRoom";
import CreateRoom from "../Components/CreateRoom";

export enum Screen {
	HOME,
	JOIN,
	CREATE
}

export default function Home() {
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
