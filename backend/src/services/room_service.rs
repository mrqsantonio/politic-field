use rocket::State;
use rand::Rng;

use crate::models::app_model::AppState;

const ROOM_ID_LENGTH: usize = 6;

pub fn generate_room_id(data: &State<AppState>) -> String {
    const CHARSET: &[u8] = b"abcdefghijklmnopqrstuvwxyz0123456789";
    let mut rng = rand::rng();
    let mut id;


    // Inside this inner scope there can only be a thread at a time
    // TODO: Release the lock if the thread panics inside
    {
        let rooms = data.rooms.lock().unwrap();
        loop {
    
            id = (0..ROOM_ID_LENGTH)
            .map(|_| {
                let idx = rng.random_range(0..CHARSET.len());
                CHARSET[idx] as char
            })
            .collect::<String>();
    
            println!("{}", id);
    
            if rooms.clone().into_iter().find(|room| room.id == id).is_none() {
                break;
            }
            println!("Match found, regenerating...");
        }
    }
    // The lock automatically yields at the end of the inner scope
    println!("Leaving!");
    id

}