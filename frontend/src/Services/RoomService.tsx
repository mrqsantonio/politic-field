// [OPTIONS] /room                         - Returns settings options
// [POST]    /room                         - Creates a new room (returns the room ID)
// [GET]     /room/<id>                    - Creates a sse connection that returns all info on the room
// [POST]    /room/<id>/join?name&icon     - Adds a new user to the room (returns auth token)
// [POST]    /room/<id>/leave              - Removes current user
// [POST]    /room/<id>/ready              - Sets the current user as ready

export type Settings = {
    topicTime: number,
    guessTime: number
}

export enum State {
	Waiting,
	Topic,
	Guess,
	Reviewing
}

export type Player = {
    token: string,
    name: string,
    icon: number
}

export type Topic = {
    author_id: number,
    content: string
}

export type Guess = {
    topic_id: number,
    author_id: number,
    x: number,
    y: number
}

export type NewRoom = {
    room_id: string,
    player_id: number
}

export type Room = {
    id: string,
    settings: Settings,
    state: State,
    round: number,
    players: Player[],
    topics: Topic[],
    guesses: Guess[]
}

export type RoomUpdater = {
    roomID: string,
    onUpdate: (room: Room) => void,
    onError: (error: string) => void
}

export interface RoomService {
    getRoomSettings: () => Settings,
    createRoom: (settings: Settings) => NewRoom,
    // updateRoomSettings: (settings: Settings) => boolean,
    roomUpdater: (roomID: string, onUpdate: (room: Room) => void, onError: (error: string) => void) => RoomUpdater,
    joinRoom: (roomID: string) => string, // This should return an sucess/error messsage (returns playerToken)
    leaveRoom: (roomID: string, playerToken: string) => boolean, // This should return an sucess/error messsage
    markReady: (roomID: string, playerToken: string) => boolean, // This should  return an sucess/error messsage
    commitTopic: (roomID: string, playerToken: string, topic: Topic) => boolean, // This should  return an sucess/error messsage
    commitGuess: (roomID: string, playerToken: string, guess: Guess) => boolean // This should  return an sucess/error messsage
}
