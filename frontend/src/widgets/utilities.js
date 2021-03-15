/* eslint-disable max-len */
export const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

export const timeConverter = (unixTimestamp) => {
  const a = new Date(unixTimestamp * 1000);
  // const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const year = a.getFullYear();
  const month = a.getMonth();
  const date = a.getDate();
  const hour = a.getHours();
  const min = a.getMinutes();
  const sec = a.getSeconds();
  const time = `${date}.${month}.${year} @${hour}:${min}:${sec}`;
  return time;
};
