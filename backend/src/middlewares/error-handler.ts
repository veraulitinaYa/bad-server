import { ErrorRequestHandler } from 'express'
import multer from 'multer'

const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
    // 🔥 FIX 1: логируем всегда (оставляем для дебага)
    console.log(err)

    // 🔥 FIX 2: обработка ошибок multer (LIMIT_FILE_SIZE и т.д.)
    if (err instanceof multer.MulterError) {
        let message = 'Ошибка загрузки файла'

        if (err.code === 'LIMIT_FILE_SIZE') {
            message = 'Файл слишком большой' // тест 14–15
        }

        return res.status(400).send({ message })
    }

    // 🔥 FIX 3: если кастомная ошибка (BadRequestError и т.д.)
    const statusCode = err?.statusCode || 500

    const message =
        statusCode === 500
            ? 'На сервере произошла ошибка'
            : err?.message || 'Ошибка'

    res.status(statusCode).send({ message })

    // ⚠️ FIX 4: НЕ вызываем next() после ответа
    // иначе возможны "headers already sent"
    return
}

export default errorHandler