import { Player, RoomInvite } from "./RoomService"

export type PlayerInfo = {
    name: string,
    icon: number
}

const PLAYER_STORAGE_KEY = "player"
const AUTH_STORAGE_KEY = "token"

const NUMBER_OF_ICONS = 16



function generateNewPlayer(): PlayerInfo {
    function generateName(): string {
        const names = ["José", "Mário", "André", "Pedro", "Luís", "Rui", "Paulo", "Rita", "Mariana", "Bruno"]
        const surnames = ["Aguiar-Branco", "Machado", "Ventura", "Pinto", "Rocha", "Montenegro", "Raimundo", "Cruz", "Mortágua", "Matias"]
        function randomElement(list: string[]): string {
            const random = Math.floor(Math.random() * list.length)
            return list[random]
        }
        return `${randomElement(names)} ${randomElement(surnames)}`
    }

    return {
        name: generateName(),
        icon: Math.round(Math.random() * (NUMBER_OF_ICONS - 1))
    }
}

const PlayerService = {

    getPlayer: function (): PlayerInfo {
        const playerString = window.localStorage.getItem(PLAYER_STORAGE_KEY)
        if (playerString) {
            const player: PlayerInfo = JSON.parse(playerString)
            if (player) {
                return player
            }
            window.localStorage.removeItem(PLAYER_STORAGE_KEY)
        }
        const newPlayer = generateNewPlayer()
        window.localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(newPlayer))
        return newPlayer
    },

    joinRoom : function (roomInvite: RoomInvite) {
        const token = window.localStorage.getItem(AUTH_STORAGE_KEY)
        if (token) {
            window.localStorage.removeItem(AUTH_STORAGE_KEY)
        }
        window.localStorage.setItem(AUTH_STORAGE_KEY, roomInvite.authToken)
    },
    
    getToken: function (): string | null {
        return window.localStorage.getItem(AUTH_STORAGE_KEY)
    }
}

export default PlayerService