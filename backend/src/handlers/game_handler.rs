use rocket::{get};
use rocket::response::stream::{Event, EventStream};
use rocket::tokio::time::{self, Duration};

#[get("/<id>")]
pub fn events(id: u32) -> EventStream![] {
    let stream = EventStream! {

        let mut interval = time::interval(Duration::from_secs(30));
        loop {
            yield Event::data(format!("ping for room with ID: {}", id));
            interval.tick().await;
        }
    };
    stream.heartbeat(Duration::from_secs(15))
}