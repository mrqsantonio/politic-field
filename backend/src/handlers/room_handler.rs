use rocket::State;
use rocket::serde::json::Json;

use crate::models::app_model::{AppState};
use crate::models::room_model::{NewRoom};
use crate::services::room_service::{generate_room_id};

// [POST] /room                         - Creates a new room (returns the room ID)
// [GET]  /room/<id>                    - Creates a sse connection that returns all info on the room
// [POST] /room/<id>/join?name&icon     - Adds a new users to the room (returns auth token)
// [POST] /room/<id>/leave              - Adds a new users to the room (returns auth token)
// [POST] /room/<id>/ready              - Sets the current user as ready

#[post("/")]
pub fn create_room(data: &State<AppState>) -> Json<NewRoom> {
    // MOST return a UserID and Room ID
    Json(
        NewRoom {
            room_id: generate_room_id(data),
            player_id: 0
        }
    )

}

/*
#[post("/")]
fn create_room() -> Json<Room> {
    // MOST return a UserID and Room ID
    Json(
        Room {
            id: "abc".to_string(),
            settings: Settings {
                topic_time: 5, guess_time: 5
            },
            state: GameState::Waiting,
            round: 0,
            players: Vec::new(),
            topics: Vec::new(),
            guesses: Vec::new()
        }
    )

}
*/
