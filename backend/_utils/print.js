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
  log: (...args) => {
  	originalConsole.log(timestamp(), args);
  },
  info: (...args) => {
    originalConsole.info(timestamp(), args);
  },
  warn: (...args) => {
    originalConsole.warn(timestamp(), args);
  },
  error: (...args) => {
   	originalConsole.error(timestamp(), args);
  },
};
