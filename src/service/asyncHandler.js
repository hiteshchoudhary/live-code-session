
const asyncHandler = (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next)
    } catch (error) {
        res.status(error.code || 500).json({
            success: false,
            message: error.message
        })
    }
}

export default asyncHandler;

// const asyncHandler = "Hitesh"
// const asyncHandler = () => {}
// const asyncHandler = (func) => {}
// const asyncHandler = (func) => () => {}
// const asyncHandler = (func) => async() => {}