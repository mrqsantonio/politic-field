import { Room } from '../Services/RoomService'

const storageKey = "rooms"

export default class DummyRooms {
    getRoom(roomID: string): Room | null {
        const rooms = JSON.parse(localStorage.getItem(storageKey) || '[]')
        return rooms[roomID]
    }

    saveRoom(room: Room): boolean {
        const rooms = JSON.parse(localStorage.getItem(storageKey) || '[]')
        rooms[room.id] = room
        localStorage.setItem(storageKey, JSON.stringify(rooms))
        return true
    }

    private generateRoomId(rooms: Room[]): string {
        let newID = ""
        console.log(rooms)
        do {
            newID = Math.random().toString(36).slice(2, 8)
        } while(rooms.length > 0 && rooms.find((room) => { return room.id == newID }))
        return newID
    }

    newRoom(room: Room): boolean {
        const rooms = JSON.parse(localStorage.getItem(storageKey) || '{}')
        room.id = this.generateRoomId(rooms)
        rooms[room.id] = room
        localStorage.setItem(storageKey, JSON.stringify(rooms))
        return true
    }

}
