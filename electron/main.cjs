const { app, BrowserWindow, session } = require('electron')
const path = require('path')

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    title: 'Mauerseglerhilfe – Bestandsbuch',
    backgroundColor: '#f9fafb',
  })

  // Keine Popups/neuen Fenster: die App braucht keine, und so kann kein
  // eingeschleuster Link ein ungeschuetztes Fenster oeffnen
  win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }))

  if (isDev) {
    win.loadURL('http://localhost:5173')
    win.webContents.openDevTools()
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

app.whenReady().then(() => {
  // Die App braucht keine Geraete-/Browser-Berechtigungen (Kamera, Mikrofon,
  // Standort, Benachrichtigungen, ...) - alle Anfragen ablehnen
  session.defaultSession.setPermissionRequestHandler((_webContents, _permission, callback) => {
    callback(false)
  })
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
