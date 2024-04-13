import config from "config"
import pino from "pino"

const streams = [
    {stream: process.stdout}
]

const options = (config.has("logger.options")? Object.assign({}, config.get('logger.options')):{})
let logger = pino(options, pino.multistream(streams))

export default logger