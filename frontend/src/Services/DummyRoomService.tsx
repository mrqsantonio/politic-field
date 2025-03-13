import { PlayerInfo } from './PlayerService'
import { RoomInvite, Room, RoomService, Settings, State, Player, Topic, Guess, RoomUpdater } from './RoomService'

const rooms: Room[] = []

const updaters: RoomUpdater[] = []


function generatePlayerToken(players: Player[]): string {
    let newToken = ""
    do {
        newToken = Math.random().toString(36).slice(2, 18)
    } while(players.find((player) => { return player.token == newToken }))
    return newToken
}

function generateRoomID(): string {
    let newID = ""
    do {
        newID = Math.random().toString(36).slice(2, 8)
    } while(rooms.find((room) => { return room.id == newID }))
    return newID
}

function updateRoom(roomIndex: number, room: Room) {
    rooms[roomIndex] = room
    updaters.forEach((updater) => {
        if (updater.roomID == room.id) {
            updater.onUpdate(room)
        }
    })
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
            id: generateRoomID(),
            settings,
            state: State.Waiting,
            round: 0,
            players: [ player ],
            topics: [],
            guesses: []
        }
        updateRoom(rooms.length, newRoom)
        return {
            roomID: newRoom.id,
            authToken: player.token
        }
    },


    roomUpdater: function (roomID: string, onUpdate: (room: Room) => void, onError: (error: string) => void): RoomUpdater {
        const updater: RoomUpdater = {
            roomID,
            onUpdate,
            onError,
            unsubscribe: () => {}
        }
        updater.unsubscribe = () => {
            console.log("[Service] Unsubscribing...", roomID)
            const index = updaters.findIndex((updater) => { return updater.roomID == roomID })
            updaters.splice(index, 1)
        }
        const roomIndex = rooms.findIndex((room) => { return room.id == roomID })
        if (roomIndex >= 0) {
            onUpdate(rooms[roomIndex])
        }

        return updater
    },

    joinRoom: function (roomID: string, playerInfo: PlayerInfo): RoomInvite {
        const room = rooms.find((room) => { return room.id == roomID })
        if (room) {
            const player: Player = {
                ...playerInfo,
                token: generatePlayerToken(room.players)
            }
            const roomIndex = rooms.findIndex((room) => { return room.id == roomID })
            if (roomIndex >= 0) {
                room.players.push(player)
                updateRoom(roomIndex, room)
                return {
                    roomID: roomID,
                    authToken: player.token
                }
            }
        }
        return {
            roomID: "",
            authToken: ""

        } // Currently returning a empty string should mean that joining a room failed for some reason
    },

    leaveRoom: function (roomID: string, playerToken: string): boolean {
        const roomIndex = rooms.findIndex((room) => { return room.id == roomID })
        if (roomIndex >= 0) {
            const room = rooms[roomIndex]
            const playerIndex = room.players.findIndex((player) => { return player.token == playerToken })
            if (playerIndex >= 0) {
                room.players.splice(playerIndex, 1)
                updateRoom(roomIndex, room)
                return true
            }
        }
        return false
    },

    markReady: function (roomID: string, _playerToken: string): boolean {
        const room = rooms.find((room) => { return room.id == roomID })
        if (room) {
            const roomIndex = rooms.findIndex((r) => { return r.id == room.id })
            room.state = State.Topic
            updateRoom(roomIndex, room)
            return true
        }
        return false
    },

    commitTopic: function (roomID: string, playerToken: string, topic: Topic): boolean {
        const room = rooms.find((room) => { return room.id == roomID })
        if (room) {
            const playerIndex = room.players.findIndex((player) => { return player.token == playerToken })
            if (playerIndex >= 0) {
                const roomIndex = rooms.findIndex((r) => { return r.id == room.id })
                room.topics[playerIndex] = topic
                updateRoom(roomIndex, room)
                return true
            }
        }
        return false
    },
    
    commitGuess: function (roomID: string, playerToken: string, guess: Guess): boolean {
        const room = rooms.find((room) => { return room.id == roomID })
        if (room) {
            const playerIndex = room.players.findIndex((player) => { return player.token == playerToken })
            if (playerIndex >= 0) {
                const roomIndex = rooms.findIndex((r) => { return r.id == room.id })
                room.guesses[playerIndex] = guess
                updateRoom(roomIndex, room)
                return true
            }
        }
        return false
    }
}

export default DummyRoomService
