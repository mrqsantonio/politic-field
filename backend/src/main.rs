use rocket::{get, routes};
use rocket::response::stream::{Event, EventStream};
use rocket::tokio::time::{self, Duration};
use rocket::serde::json::Json;
use serde::{Serialize, Deserialize};
use rand::Rng;
use std::sync::Mutex;

#[macro_use] extern crate rocket;

#[cfg(test)] mod tests;

const ROOM_ID_LENGTH: usize = 6;

#[derive(Serialize, Deserialize)]
struct Settings {
    topic_time: u32,
    guess_time: u32
}

#[derive(Serialize, Deserialize)]
enum State {
	Waiting,
	Topic,
	Guess,
	Reviewing
}

#[derive(Serialize, Deserialize)]
struct Player {
    id: u32,
    name: String,
    icon: u32
}

#[derive(Serialize, Deserialize)]
struct Topic {
    author_id: u32,
    content: String
}

#[derive(Serialize, Deserialize)]
struct Guess {
    topic_id: u32,
    author_id: u32,
    x: u32,
    y: u32
}

#[derive(Serialize, Deserialize)]
struct Room {
    id: String,
    settings: Settings,
    state: State,
    round: u32,
    players: Vec<Player>,
    topics: Vec<Topic>,
    guesses: Vec<Guess>
}

#[derive(Serialize, Deserialize)]
struct NewRoom {
    room_id: String,
    player_id: u32
}


// const ROOMS: Mutex<Vec<Room>> = Mutex::new(Vec::new());

// How to manage data (AppState)
// https://codevoweb.com/build-a-simple-api-with-rust-and-rocket/

// TODO: Implement AppState
// TODO: Learn how to distibute everthing into crates

/*

pub struct AppState {
    pub todo_db: Arc<Mutex<Vec<Todo>>>,
}

impl AppState {
    pub fn init() -> AppState {
        AppState {
            todo_db: Arc::new(Mutex::new(Vec::new())),
        }
    }
}

#[launch]
fn rocket() -> _ {
    let app_data = model::AppState::init();
    rocket::build().manage(app_data).mount(
        "/api",
        routes![
            health_checker_handler,
            todos_list_handler,
            create_todo_handler,
            get_todo_handler,
            edit_todo_handler,
            delete_todo_handler
        ],
    )
}

*/
/*
fn generate_room_id(data: &State<AppState>) -> String {
    const CHARSET: &[u8] = b"abcdefghijklmnopqrstuvwxyz0123456789";
    let mut rng = rand::rng();
    let mut id;


    // Inside this inner scope there can only be a thread at a time
    // TODO: Release the lock if the thread panics inside
    {
        let mut rooms = data.rooms.lock().unwrap();
        loop {
    
            id = (0..ROOM_ID_LENGTH)
            .map(|_| {
                let idx = rng.random_range(0..CHARSET.len());
                CHARSET[idx] as char
            })
            .collect::<String>();
    
            println!("{}", id);
    
            if rooms.into_iter().find(|room| room.id == id).is_none() {
                break;
            }
            println!("Match found, regenerating...");
        }
    }
    // The lock automatically yields at the end of the inner scope
    println!("Leaving!");
    id

}
*/
// [POST] /room                         - Creates a new room (returns the room ID)
// [GET]  /room/<id>                    - Creates a sse connection that returns all info on the room
// [POST] /room/<id>/join?name&icon     - Adds a new users to the room (returns auth token)
// [POST] /room/<id>/leave              - Adds a new users to the room (returns auth token)
// [POST] /room/<id>/ready              - Sets the current user as ready


#[post("/")]
fn create_room() -> Json<NewRoom> {
    // MOST return a UserID and Room ID
    Json(
        NewRoom {
            room_id: /* generate_room_id()*/ "abc012".to_string(),
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
            state: State::Waiting,
            round: 0,
            players: Vec::new(),
            topics: Vec::new(),
            guesses: Vec::new()
        }
    )

}
*/

#[get("/<id>")]
fn events(id: u32) -> EventStream![] {
    let stream = EventStream! {

        let mut interval = time::interval(Duration::from_secs(30));
        loop {
            yield Event::data(format!("ping for room with ID: {}", id));
            interval.tick().await;
        }
    };
    stream.heartbeat(Duration::from_secs(15))
}

#[launch]
fn rocket() -> _ {
    rocket::build()
        .mount("/room", routes![create_room, events])
}
