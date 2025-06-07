import jwt from "jsonwebtoken"

const authAdmin = async (req, res, next) => {
    try {
        const { adminToken } = req.headers
        if (!adminToken) {
            return res.json({ success: false, message: 'Not Authorized Login Again' })
        }
        const token_decode = jwt.verify(adminToken, process.env.JWT_SECRET)
        if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
            return res.json({ success: false, message: 'Not Authorized Login Again' })
        }
        next()
    } catch (error) {
        res.json({ success: false, message: "Something went wrong", error: error.message })
    }
}

export default authAdmin;