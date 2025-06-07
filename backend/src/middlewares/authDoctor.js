import jwt from 'jsonwebtoken'

const authDoctor = async (req, res, next) => {
    const { doctorToken } = req.headers
    if (!doctorToken) {
        return res.json({ success: false, message: 'Not Authorized Login Again' })
    }
    try {
        const token_decode = jwt.verify(doctorToken, process.env.JWT_SECRET)
        req.body.docId = token_decode.id
        next()
    } catch (error) {
        res.json({ success: false, error: error.message })
    }
}

export default authDoctor;