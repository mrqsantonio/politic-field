use std::sync::{Arc, Mutex};

use super::room_model::{Room};

pub struct AppState {
    pub rooms: Arc<Mutex<Vec<Room>>>,
}

impl AppState {
    pub fn init() -> AppState {
        AppState {
            rooms: Arc::new(Mutex::new(Vec::new())),
        }
    }
}
