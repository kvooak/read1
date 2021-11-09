export const HOST_DOMAIN = process.env.REACT_APP_HOST_DOMAIN;
export const HOST_PORT = process.env.REACT_APP_HOST_PORT;
export const HOST_PROTOCOL = process.env.REACT_APP_HOST_PROTOCOL;

export const SOCKET_IO_PROTOCOL = process.env.REACT_APP_SOCKET_IO_PROTOCOL;
export const SOCKET_IO_PORT = process.env.REACT_APP_SOCKET_IO_PORT;

export const BASE_URL = `${HOST_PROTOCOL}://${HOST_DOMAIN}:${HOST_PORT}`;
export const BASE_SOCKET_IO_URL = `${SOCKET_IO_PROTOCOL}://${HOST_DOMAIN}:${SOCKET_IO_PORT}`;

export const API_BASE_URL = `${BASE_URL}/api/v1/`;

export const DOCUMENT_SUFFIX = 'documents/';
