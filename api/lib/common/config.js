module.exports = {
    secretKey: '12345-67890-09876-54321',
    mongoUrl : 'mongodb://localhost:27017/sawtooth-explorer',
    blockchain: {
        REST_API_URL: 'http://46.173.219.81:8043',
        VALIDATOR_URL: 'tcp://46.173.219.81:4040',
        STATE_PATH: '/state',
        BLOCKS_PATH: '/blocks'
    }
}