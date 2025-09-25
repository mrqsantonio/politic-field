use serde::{Serialize, Deserialize};

use super::player_model::Player;

#[derive(Clone, Serialize, Deserialize)]
pub struct Settings {
    topic_time: u32,
    guess_time: u32
}

#[derive(Clone, Serialize, Deserialize)]
pub enum GameState {
	Waiting,
	Topic,
	Guess,
	Reviewing
}


#[derive(Clone, Serialize, Deserialize)]
pub struct Topic {
    author_id: u32,
    content: String
}

#[derive(Clone, Serialize, Deserialize)]
pub struct Guess {
    topic_id: u32,
    author_id: u32,
    x: u32,
    y: u32
}

#[derive(Clone, Serialize, Deserialize)]
pub struct Room {
    pub id: String,
    settings: Settings,
    state: GameState,
    round: u32,
    players: Vec<Player>,
    topics: Vec<Topic>,
    guesses: Vec<Guess>
}

#[derive(Clone, Serialize, Deserialize)]
pub struct NewRoom {
    pub room_id: String,
    pub player_id: u32
}