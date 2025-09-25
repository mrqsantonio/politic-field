
function generateErrors() {
    const errors = {
        FailedToJoinRoom: {
            error: "Failed to join room."
        },
        FailedToLeaveRoom : {
            error: "Failed to leave the room"
        },
        NotReady: {
            error: "Failed to mark as ready"
        },
        FailedToCommitTopic: {
            error: "Failed to commit to topic"
        },
        FailedToCommitGuess: {
            error: "Failed to commit a guess"
        },
        RoomNotFound: {
            error: "Room not found"
        }
    }

    return Object.fromEntries(
        Object.entries(errors).map(([key, value], index) => [
            key,
            {
            ...value,
            id: index,
            },
        ])
    )
}


export default generateErrors()