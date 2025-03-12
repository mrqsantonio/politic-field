import { NewRoom, Room, RoomService, Settings, State, Player, Topic, Guess, RoomUpdater } from './RoomService'

const rooms: Room[] = []

const updaters: RoomUpdater[] = []

function generatePlayer(players: Player[], name?: string, icon?: number): Player {

    function generatePlayerToken(players: Player[]): string {
        let newToken = ""
        do {
            newToken = Math.random().toString(36).slice(2, 18)
        } while(players.find((player) => { return player.token == newToken }))
        return newToken
    }

    return {
        name: name ? name : generateName(),
        token: generatePlayerToken(players),
        icon: icon ? icon : Math.round(Math.random() * 15)
    }
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

function generateName(): string {
    const names = ["José", "Mário", "André", "Pedro", "Luís", "Rui", "Paulo", "Rita", "Mariana", "Bruno"]
    const surnames = ["Aguiar-Branco", "Machado", "Ventura", "Pinto", "Rocha", "Montenegro", "Raimundo", "Cruz", "Mortágua", "Matias"]
    function randomElement(list: string[]): string {
        const random = Math.floor(Math.random() * list.length)
        return list[random]
    }
    return `${randomElement(names)} ${randomElement(surnames)}`
}

const dummyRoomService: RoomService = {
    getRoomSettings: function (): Settings {
        return {
            topicTime: 5,
            guessTime: 5
        }
    },
    
    createRoom: function (settings: Settings): NewRoom {
        const newRoom: Room = {
            id: generateRoomID(),
            settings,
            state: State.Waiting,
            round: 0,
            players: [
                generatePlayer([])
            ],
            topics: [],
            guesses: []
        }
        rooms.push(newRoom)
        return {
            room_id: newRoom.id,
            player_id: 0 // Shouldn't this be the user token?
        }
    },


    roomUpdater: function (roomID: string, onUpdate: (room: Room) => void, onError: (error: string) => void): RoomUpdater {
        const updater: RoomUpdater = {
            roomID,
            onUpdate,
            onError
        }
        updaters.push(updater)
        const roomIndex = rooms.findIndex((room) => { return room.id == roomID })
        if (roomIndex >= 0) {
            onUpdate(rooms[roomIndex])
        }

        return updater
    },

    joinRoom: function (roomID: string): string {
        const room = rooms.find((room) => { return room.id == roomID })
        if (room) {
            const player: Player = generatePlayer(room.players)
            room.players.push(player)
            return player.token
        }
        return "" // Currently returning a empty string should mean that joining a room failed for some reason
    },

    leaveRoom: function (roomID: string, playerToken: string): boolean {
        const room = rooms.find((room) => { return room.id == roomID })
        if (room) {
            const playerIndex = room.players.findIndex((player) => { return player.token == playerToken })
            if (playerIndex >= 0) {
                room.players.splice(playerIndex, 1)
                return true
            }
        }
        return false
    },

    markReady: function (roomID: string, playerToken: string): boolean {
        const room = rooms.find((room) => { return room.id == roomID })
        console.log(rooms)
        if (room) {
            const roomIndex = rooms.findIndex((r) => { return r.id == room.id })
            room.state = State.Topic
            updateRoom(roomIndex, room)
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

export default dummyRoomService
