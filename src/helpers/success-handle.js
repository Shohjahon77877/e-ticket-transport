export const successHandle = (res, resData, code = 200) => {
    return res.status(code).json({
        statusCode: code,
        message: 'Success',
        data: resData,
    })
}