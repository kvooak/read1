const timestamp = () => {
  const now = new Date();
  const hour = now.getHours();
  const min = now.getMinutes();
  const sec = now.getSeconds();
  return (
    `${now.toLocaleDateString('en-DE')} UTC/GMT+1 ${hour}:${min < 10 ? `0${min}` : min}:${sec < 10 ? `0${sec}` : sec} :`
  );
};

const originalConsole = console;

module.exports = {
  log: (text) => {
    if (Array.isArray(text)) {
      originalConsole.log(timestamp(), ...text);
    } else {
      originalConsole.log(timestamp(), text);
    }
  },
  info: (text) => {
    if (Array.isArray(text)) {
      originalConsole.info(timestamp(), ...text);
    } else {
      originalConsole.info(timestamp(), text);
    }
  },
  warn: (text) => {
    if (Array.isArray(text)) {
      originalConsole.warn(timestamp(), ...text);
    } else {
      originalConsole.warn(timestamp(), text);
    }
  },
  error: (text) => {
    if (Array.isArray(text)) {
      originalConsole.error(timestamp(), ...text);
    } else {
      originalConsole.error(timestamp(), text);
    }
  },
};
