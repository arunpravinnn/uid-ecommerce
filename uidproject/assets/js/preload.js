const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');

// Define the app data directory
const appDataDir = path.join(
  process.env.APPDATA || 
  (process.platform === 'darwin' ? 
    process.env.HOME + '/Library/Preferences' : 
    process.env.HOME + '/.local/share'),
  'glitch-app'
);

// File paths for different data stores
const cartFilePath = path.join(appDataDir, 'cart.json');
const usersFilePath = path.join(appDataDir, 'users.json');
const currentUserFilePath = path.join(appDataDir, 'currentUser.json');

// Ensure directory exists
function ensureDirectoryExists(filePath) {
  const dirname = path.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
}

// Generic read function
function readJsonFile(filePath, defaultValue) {
  try {
    ensureDirectoryExists(filePath);
    
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    } else {
      return defaultValue;
    }
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return defaultValue;
  }
}

// Generic write function
function writeJsonFile(filePath, data) {
  try {
    ensureDirectoryExists(filePath);
    fs.writeFileSync(filePath, JSON.stringify(data), 'utf8');
    return true;
  } catch (error) {
    console.error(`Error writing file ${filePath}:`, error);
    return false;
  }
}

// Expose Cart file system methods
contextBridge.exposeInMainWorld('cartFileSystem', {
  getCartItems: () => readJsonFile(cartFilePath, []),
  saveCartToFile: (cartData) => writeJsonFile(cartFilePath, cartData)
});

// Expose Auth file system methods
contextBridge.exposeInMainWorld('authFileSystem', {
  getRegisteredUsers: () => readJsonFile(usersFilePath, []),
  getCurrentUser: () => readJsonFile(currentUserFilePath, null),
  saveRegisteredUsers: (users) => writeJsonFile(usersFilePath, users),
  saveCurrentUser: (user) => {
    if (user === null) {
      // If user is null, delete the file if it exists
      if (fs.existsSync(currentUserFilePath)) {
        try {
          fs.unlinkSync(currentUserFilePath);
          return true;
        } catch (error) {
          console.error('Error deleting current user file:', error);
          return false;
        }
      }
      return true;
    } else {
      // Otherwise write the user data
      return writeJsonFile(currentUserFilePath, user);
    }
  }
});