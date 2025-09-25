use serde::{Serialize, Deserialize};

#[derive(Clone, Serialize, Deserialize)]
pub struct Player {
    id: u32,
    name: String,
    icon: u32
}