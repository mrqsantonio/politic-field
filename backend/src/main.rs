mod models;
mod services;
mod handlers;

use models::app_model::AppState;
use handlers::room_handler::{create_room};
use handlers::game_handler::events;

#[macro_use] extern crate rocket;

#[cfg(test)] mod tests;

// https://codevoweb.com/build-a-simple-api-with-rust-and-rocket/

#[launch]
fn rocket() -> _ {
    let app_data = AppState::init();
    rocket::build().manage(app_data)
        .mount("/room", routes![create_room, events])
}
