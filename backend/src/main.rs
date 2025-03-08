use rocket::{get, routes};
use rocket::response::stream::{Event, EventStream};
use rocket::tokio::time::{self, Duration};

#[macro_use] extern crate rocket;

#[cfg(test)] mod tests;

// [PUT]  /room                         - Creates a new room (returns the room ID)
// [GET]  /room/<id>                    - Creates a web socket that returns all info on the room
// [POST] /room/<id>/join?name&icon     - Adds a new users to the room (returns auth token)
// [POST] /room/<id>/leave              - Adds a new users to the room (returns auth token)
// [POST] /room/<id>/ready              - Sets the current user as ready

#[get("/events")]
fn events() -> EventStream![] {
    let stream = EventStream! {

        let mut interval = time::interval(Duration::from_secs(30));
        loop {
            yield Event::data("ping");
            interval.tick().await;
        }
    };
    stream.heartbeat(Duration::from_secs(15))
}

#[launch]
fn rocket() -> _ {
    rocket::build()
        .mount("/", routes![events])
}
