import Identicon from 'identicon.js'

function makeAvatarBase64 (publicKey) {
    return "data:image/png;base64," + (new Identicon(publicKey, 40).toString())
}

export default makeAvatarBase64
