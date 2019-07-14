import Identicon from 'identicon.js'

function makeAvatarBase64 (publicKey) {
    return "data:image/png;base64," + (new Identicon(publicKey, 40).toString())
}

export default makeAvatarBase64

export const comparisonOperatorToFunction = {
    '==': (a, b) => a == b,
    '!=': (a, b) => a != b,
    '>': (a, b) => a > b,
    '>=': (a, b) => a >= b,
    '<': (a, b) => a < b,
    '<=': (a, b) => a <= b,
}

export function isEmptyValue (val) {
    return Array.isArray(val) && val.length == 0 ||
           typeof val === 'object' && Object.entries(val).length == 0 ||
           val == null
}
