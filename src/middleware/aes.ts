import Aes from 'aes-psswd'

const aes = new Aes(process.env.AESPASSWORD1 ?? '', process.env.AESPASSWORD2 ?? '')

export default aes
