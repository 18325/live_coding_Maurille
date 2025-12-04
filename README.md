# 📝 Notes - Collaborative Workspace

A modern, real-time collaborative notes application built with React, Node.js, and Socket.io. Features a clean, minimalist design with powerful collaboration capabilities.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Features

- 🔐 **Simple Authentication** - Username-based login with automatic account creation
- 📄 **Note Management** - Create, edit, delete, and organize notes with tags
- 🤝 **Real-time Collaboration** - Multiple users can edit the same note simultaneously
- 🔍 **Smart Search** - Filter notes by content, title, or tags
- 📊 **Flexible Sorting** - Sort by last updated, newest, or oldest
- 🏷️ **Tag System** - Organize notes with customizable tags
- 📝 **Markdown Support** - Write in Markdown with live preview
- 💾 **Export Options** - Export notes as Markdown or plain text
- 🎨 **Clean UI** - Minimalist, professional design with excellent UX
- 👥 **Active Editors** - See who's currently editing each note

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Socket.io Client** - Real-time communication
- **Axios** - HTTP client
- **Marked** - Markdown parsing
- **Lodash** - Utility functions

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **Socket.io** - WebSocket server
- **TypeScript** - Type-safe development

## 📦 Installation

### Prerequisites
- Node.js (v16+)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the repository
```bash
git clone https://github.com/18325/live_coding_Maurille.git
cd live_coding_Maurille
```

### 2. Backend Setup
```bash
cd notes-app-backend
npm install
```

Create `.env` file in `notes-app-backend/`:
```env
PORT=5000
MONGO_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/notesapp?retryWrites=true&w=majority
CLIENT_URL=http://localhost:3000
```

### 3. Frontend Setup
```bash
cd ../notes-app
npm install
```

Create `.env` file in `notes-app/`:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

## 🚀 Running the Application

### Start Backend (Terminal 1)
```bash
cd notes-app-backend
npm run dev
```
Backend will run on **http://localhost:5000**

### Start Frontend (Terminal 2)
```bash
cd notes-app
npm start
```
Frontend will run on **http://localhost:3000**

## 📁 Project Structure

```
live_coding_Maurille/
├── notes-app/                  # Frontend React application
│   ├── public/
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── Auth/          # Login component
│   │   │   ├── Layout/        # Header, Sidebar
│   │   │   └── Notes/         # Note components
│   │   ├── context/           # React Context (Auth, Notes)
│   │   ├── hooks/             # Custom hooks
│   │   ├── services/          # API and Socket services
│   │   ├── types/             # TypeScript definitions
│   │   ├── App.tsx            # Main app component
│   │   └── index.tsx          # Entry point
│   └── package.json
│
├── notes-app-backend/         # Backend Node.js application
│   ├── src/
│   │   ├── config/           # Database configuration
│   │   ├── controllers/      # Business logic
│   │   ├── models/           # Mongoose models
│   │   ├── routes/           # API routes
│   │   ├── socketHandlers/   # Socket.io handlers
│   │   └── server.ts         # Entry point
│   └── package.json
│
├── .gitignore
├── project-documentation.md   # Detailed documentation
└── README.md
```

## 🎨 Design System

### Color Palette
- **Primary**: Gray-900 (#111827) - Text, buttons, active elements
- **Secondary**: Gray-600/700 - Secondary text
- **Borders**: Gray-200/300 - Subtle borders
- **Backgrounds**: White, Gray-50/100
- **Accent**: Green-500 - Real-time collaboration indicator

### UI Components
- **Rounded corners** for modern look (rounded-lg, rounded-2xl)
- **Subtle shadows** for depth (shadow-sm, shadow-md, shadow-lg)
- **Smooth transitions** for interactions
- **Focus rings** for accessibility

## 🔧 Configuration

### Important Settings

**Backend Port**: 5000 (not 3000!)
- Configured in `notes-app-backend/.env`

**CORS**: Accepts connections from ports 3000 and 3001
- Configured in `notes-app-backend/src/server.ts`

**MongoDB**: 
- Connection string in `notes-app-backend/.env`
- Ensure IP whitelist is configured in MongoDB Atlas

**Socket Connection Delay**: 500ms
- Configured in `notes-app/src/context/AuthContext.tsx`
- Ensures stable connection after authentication

## 📖 Usage

1. **Login**: Enter any username (account created automatically)
2. **Create Note**: Click "Create" button in sidebar
3. **Edit Note**: Click on a note to open it in the editor
4. **Add Tags**: Use the tag input in the editor footer
5. **Search**: Use the search bar to filter notes
6. **Filter by Tag**: Click on tag filters to view specific categories
7. **Export**: Use the Export menu to download as MD or TXT
8. **Preview**: Toggle Markdown preview to see formatted content
9. **Collaborate**: Share your screen - others see live edits!

## 🐛 Troubleshooting

### Login not working
- Check backend is running on port 5000
- Verify `.env` files are configured correctly
- Check browser console and backend terminal for errors

### Socket.io not connecting
- Verify `REACT_APP_SOCKET_URL` points to port 5000
- Check CORS settings in backend
- Ensure 500ms connection delay is present

### MongoDB connection failed
- Check connection string format (no angle brackets around password)
- Verify IP whitelist in MongoDB Atlas
- Ensure database user has correct permissions

### Notes not syncing
- Check Socket.io connection in browser DevTools
- Verify debounce is working (500ms delay)
- Check backend socket handlers for errors

## 🚀 Future Enhancements

- [ ] JWT authentication with passwords
- [ ] Dark mode toggle
- [ ] Push notifications
- [ ] Note version history
- [ ] Share notes via links
- [ ] Rich text WYSIWYG editor
- [ ] Offline mode (PWA)
- [ ] Performance optimizations (virtualization)

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 👨‍💻 Author

**Maurille** - [GitHub](https://github.com/18325)

## 🙏 Acknowledgments

- React team for the amazing library
- Socket.io for real-time capabilities
- Tailwind CSS for the styling system
- MongoDB for the database solution

---

**Happy Coding!** 🎉 If you have questions or issues, please open an issue on GitHub.
