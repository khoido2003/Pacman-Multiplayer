# PACMAN MULTIPLAYER TODO lIST

## CLIENT TODO

- Send current pacman position and send back to server
- Receive position of other player's pacman and display on the map
- Receive positon of ghost, create ghost class and display 
- Receve food postion and display


## SERVER TODO

- Room to receive GameState via UpdateChannel
- Room Broadcasting to all players in
  the Room
- GameState in charge of internal game logic
    + Use A* algorithm for ghost movement
    + Synchronize user's pacman movement
    + Create food on the path
    + Dectecting collison

- Decouple Time Logic: Make the Room responsible for orchestrating game
  loop => Room manages both timing and broadcasting


