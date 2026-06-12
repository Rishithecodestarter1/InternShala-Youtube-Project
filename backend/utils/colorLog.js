const reset = '\x1b[0m'

function write(colorCode, message) {
  console.log(`${colorCode}${message}${reset}`)
}

export function success(message) {
  write('\x1b[38;2;0;255;0m', message)
}

export function error(message) {
  write('\x1b[38;2;255;0;0m', message)
}

export function info(message) {
  write('\x1b[38;2;100;149;237m', message)
}

export function warn(message) {
  write('\x1b[38;2;255;165;0m', message)
}
