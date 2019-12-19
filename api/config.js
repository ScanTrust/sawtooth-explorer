module.exports = {
    JWT_SECRET: "Very super ultra secret",
    MONGO_URL: `mongodb://${process.env.DATABASE_URL || '127.0.0.1'}:27017/sawtooth-explorer`,
    SAWTOOTH_PROXY_PATH: '/sawtooth',
    blockchain: {
        REST_API_URL: process.env.REST_API_URL || 'http://46.173.219.81:8043',
        VALIDATOR_URL: process.env.VALIDATOR_URL || 'tcp://46.173.219.81:4040',
        STATE_PATH: '/state', 
        BLOCKS_PATH: '/blocks'
    },
}