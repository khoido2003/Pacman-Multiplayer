# Game Server Guide

## Folder structure 
bash
```
/game-server
├── /cmd
│   └── /server
│       └── main.go                # Entry point for the server
├── /internal
│   ├── /game
│   │   ├── /model                 # Game state models (Pacman, Ghost, etc.)
│   │   ├── /logic                 # Game logic (movement, scoring, etc.)
│   │   ├── /handler               # WebSocket message handling
│   │   └── /service               # Game service (state updates, sync)
│   ├── /network                   # WebSocket connection handling
│   └── /util                      # Utility functions (e.g., logging,
configuration)
├── /pkg
│   └── /websocket                  # Reusable WebSocket utility functions
├── /scripts
│   └── /db-migrations             # Database migration scripts (if using
DB)
├── go.mod
└── go.sum

```

