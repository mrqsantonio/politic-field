import DummyRoomArray from '../DummyClasses/DummyRooms'
import { PlayerInfo } from './PlayerService'
import { RoomError, RoomInvite, Room, RoomService, Settings, State, Player, Topic, Guess, RoomUpdater } from './RoomService'
import RoomErrors from '../Errors/RoomErrors'
// TODO: Add a player dummy service for when using the DummyRoomService
// TOOD: Add UI feedback when clicking Ready on lobby
// FIXME: When Marked as ready, UI doesn't update
// TODO: Make sure that the UI updates everytime the room updates (first time it is saved to local storage MUST be after listening)
const dummyRooms = new DummyRoomArray()

function generatePlayerToken(players: Player[]): string {
    let newToken = ""
    do {
        newToken = Math.random().toString(36).slice(2, 18)
    } while(players.find((player) => { return player.token == newToken }))
    return newToken
}

const DummyRoomService: RoomService = {
    getRoomSettings: function (): Settings {
        return {
            topicTime: 5,
            guessTime: 5
        }
    },
    
    createRoom: function (settings: Settings, playerInfo: PlayerInfo): RoomInvite {
        const player = {
            ...playerInfo,
            token: generatePlayerToken([])
        }
        const newRoom: Room = {
            id: '',
            settings,
            state: State.Waiting,
            round: 0,
            players: [ player ],
            topics: [],
            guesses: []
        }
        dummyRooms.newRoom(newRoom)
        return {
            roomID: newRoom.id,
            authToken: player.token
        }
    },


    roomUpdater: function (roomID: string, onUpdate: (room: Room) => void, onError: (error: string) => void): RoomUpdater {
        window.addEventListener("storage", (event) => {
            let oldRoom: Room | null = null
            console.log("checking event", event)
            if (event && event.storageArea) {
                const rooms = JSON.parse(event.storageArea.getItem("rooms") || '{}')
                console.log(rooms)
                const room = rooms[roomID]
                console.log(room)
                if (oldRoom !== room) {
                    console.log("Calling updater")
                    onUpdate(room)
                }
            }
        })
        const updater: RoomUpdater = {
            roomID,
            onUpdate,
            onError,
            unsubscribe: () => {}
        }
        updater.unsubscribe = () => {
            console.log("[DummyRoomService] Unsubscribing...", roomID)
        }
        onUpdate(dummyRooms.getRoom(roomID)!!)

        return updater
    },

    joinRoom: function (roomID: string, playerInfo: PlayerInfo): RoomInvite | RoomError {
        const room = dummyRooms.getRoom(roomID)
        console.log(room)
        if (room) {
            const player: Player = {
                ...playerInfo,
                token: generatePlayerToken(room.players)
            }
            room.players.push(player)
            if (!dummyRooms.saveRoom(room)) return RoomErrors.FailedToJoinRoom
            return {
                roomID: roomID,
                authToken: player.token
            }
        }
        return RoomErrors.RoomNotFound
    },

    leaveRoom: function (roomID: string, playerToken: string): true | RoomError {
        const room = dummyRooms.getRoom(roomID)
        if(room) {
            const playerIndex = room.players.findIndex((player) => { return player.token == playerToken })
            if (playerIndex >= 0) {
                room.players.splice(playerIndex, 1)
                dummyRooms.saveRoom(room)
                return true
            }
        }
        return RoomErrors.FailedToLeaveRoom
    },

    markReady: function (roomID: string, _playerToken: string): true | RoomError {
        const room = dummyRooms.getRoom(roomID)
        if (room) {
            room.state = State.Topic
            dummyRooms.saveRoom(room)
            return true
        }
        return RoomErrors.NotReady
    },

    commitTopic: function (roomID: string, playerToken: string, topic: Topic): true | RoomError {
        const room = dummyRooms.getRoom(roomID)
        if (room) {
            const playerIndex = room.players.findIndex((player) => { return player.token == playerToken })
            if (playerIndex >= 0) {
                room.topics[playerIndex] = topic
                dummyRooms.saveRoom(room)
                return true
            }
        }
        return RoomErrors.FailedToCommitTopic
    },
    
    commitGuess: function (roomID: string, playerToken: string, guess: Guess): true | RoomError {
        const room = dummyRooms.getRoom(roomID)
        if (room) {
            const playerIndex = room.players.findIndex((player) => { return player.token == playerToken })
            if (playerIndex >= 0) {
                room.guesses[playerIndex] = guess
                dummyRooms.saveRoom(room)
                return true
            }
        }
        return RoomErrors.FailedToCommitGuess
    }
}

export default DummyRoomService
