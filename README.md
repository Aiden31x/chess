# ♟️ Multiplayer Chess Game

A real-time multiplayer chess game built with React, TypeScript, Node.js, and WebSocket technology. Play chess online with friends in a modern, responsive web interface.

![Chess Game](https://img.shields.io/badge/Chess-Multiplayer-brightgreen)
![React](https://img.shields.io/badge/React-18.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-18.0-green)
![WebSocket](https://img.shields.io/badge/WebSocket-Real--time-orange)

## ✨ Features

- **🎮 Real-time Multiplayer**: Play chess with friends in real-time using WebSocket connections
- **♟️ Full Chess Rules**: Complete implementation of chess rules using chess.js library
- **🎨 Modern UI**: Clean, responsive design with Tailwind CSS
- **⚡ Real-time Updates**: Instant board synchronization between players
- **🚨 Smart Validation**: Client and server-side move validation with helpful error messages
- **🎯 Turn Management**: Automatic turn switching with visual indicators
- **🔍 Move Highlighting**: Visual feedback for selected pieces and valid moves
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices



## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server
- **chess.js** - Chess game logic and validation

### Backend
- **Node.js** - JavaScript runtime
- **TypeScript** - Type-safe server code
- **WebSocket (ws)** - Real-time communication
- **chess.js** - Server-side chess validation

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Aiden31x/chess
   cd chess-game
   ```

2. **Install backend dependencies**
   ```bash
   cd backend1
   npm install
   ```

3. **Compile TypeScript**
   ```bash
   npx tsc
   ```

4. **Start the server**
   ```bash
   node dist/index.js
   ```

   The backend will start on `http://localhost:8080`

### Frontend Setup

1. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Start the development server**
   ```bash
   npm run dev
   ```

   The frontend will start on `http://localhost:5173`

## 🎮 How to Play

1. **Start a Game**
   - Open the application in your browser
   - Click "Play Online" to start a new game
   - Share the game URL with a friend

2. **Join a Game**
   - Open the same URL in another browser/tab
   - Click "Play" to join the game
   - You'll be assigned a color (White or Black)

3. **Make Moves**
   - Click on a piece to select it (highlighted with yellow ring)
   - Click on a valid destination square to make your move
   - Wait for your opponent's turn

4. **Game Rules**
   - White always moves first
   - Follow standard chess rules
   - Invalid moves will show helpful error messages
   - Game ends with checkmate, stalemate, or draw

## 🏗️ Project Structure

```
chess/
├── backend1/                 # Backend server
│   ├── src/
│   │   ├── Game.ts          # Game logic and state management
│   │   ├── GameManager.ts   # Player and game management
│   │   ├── messages.ts      # WebSocket message types
│   │   └── index.ts         # Server entry point
│   └── dist/                # Compiled JavaScript
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChessBoard.tsx  # Main chess board component
│   │   │   ├── Button.tsx      # Reusable button component
│   │   │   └── Warning.tsx     # Error/warning display
│   │   ├── screens/
│   │   │   ├── Game.tsx        # Game screen
│   │   │   └── Landing.tsx     # Home page
│   │   ├── hooks/
│   │   │   └── useSocket.ts    # WebSocket connection hook
│   │   └── App.tsx             # Main app component
│   └── public/                 # Static assets
└── README.md
```

## 🔧 Key Features Explained

### Real-time Communication
- **WebSocket Connection**: Maintains persistent connection between players
- **Message Types**: Structured message system for game events
- **Board Synchronization**: Automatic board state updates across all players

### Move Validation
- **Server-side Validation**: All moves validated on the server using chess.js
- **Client-side Feedback**: Immediate visual feedback for invalid moves
- **Turn Management**: Automatic turn switching with proper validation

### Error Handling
- **User-friendly Messages**: Clear explanations for invalid moves
- **Visual Warnings**: Non-intrusive warning system for errors
- **Auto-dismiss**: Warnings automatically disappear after 4 seconds

## 🎨 UI Components

### Chess Board
- **Responsive Grid**: 8x8 grid with alternating colors
- **Piece Rendering**: Unicode chess symbols with proper styling
- **Move Highlighting**: Visual feedback for selected pieces
- **Click Handling**: Intuitive piece selection and movement

### Warning System
- **Toast Notifications**: Fixed positioning at top of screen
- **Smooth Animations**: Fade in/out transitions
- **Auto-dismiss**: Automatic cleanup after timeout
- **Manual Close**: Users can dismiss warnings manually

## 🔌 API Endpoints

### WebSocket Messages

| Type | Description | Payload |
|------|-------------|---------|
| `init_game` | Start a new game | `{ color: "white" \| "black" }` |
| `move` | Make a chess move | `{ from: string, to: string }` |
| `BOARD_UPDATE` | Board state update | `{ board: array, turn: string }` |
| `ERROR` | Error message | `{ message: string }` |
| `game_over` | Game end | `{ winner: string }` |

## 🚀 Deployment

### Backend Deployment
1. Build the TypeScript code: `npx tsc`
2. Deploy the `dist` folder to your server
3. Install production dependencies: `npm install --production`
4. Start the server: `node dist/index.js`

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Update the WebSocket URL in `useSocket.ts` to point to your backend

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Commit your changes: `git commit -m 'Add feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [chess.js](https://github.com/jhlywa/chess.js) - Chess game logic library
- [React](https://reactjs.org/) - Frontend framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket) - Real-time communication

## 📞 Support

If you have any questions or issues, please:
1. Check the [Issues](https://github.com/yourusername/chess-game/issues) page
2. Create a new issue with detailed information
3. Contact: your-email@example.com

---

**Happy Playing! ♟️** 