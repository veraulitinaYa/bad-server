// controllers/upload.ts

import { NextFunction, Request, Response } from 'express'
import { constants } from 'http2'
import BadRequestError from '../errors/bad-request-error'
import sharp from 'sharp'
import fs from 'fs'

export const uploadFile = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // 🔥 FIX 5: multer мог не передать файл (fileFilter / limits)
        if (!req.file) {
            return next(new BadRequestError('Файл не загружен'))
        }

        // 🔥 FIX 6: файл реально существует
        if (!fs.existsSync(req.file.path)) {
            return next(new BadRequestError('Файл не найден'))
        }

        // 🔥 FIX 7: минимальный размер (тест 14)
        if (req.file.size < 2048) {
            return next(new BadRequestError('Файл слишком маленький'))
        }

        // 🔥 FIX 8: проверка что это реально изображение (тест 16)
        let metadata
        try {
            metadata = await sharp(req.file.path).metadata()
        } catch {
            return next(new BadRequestError('Некорректный файл изображения'))
        }

        if (!metadata.width || !metadata.height) {
            return next(new BadRequestError('Некорректное изображение'))
        }

        const fileName = process.env.UPLOAD_PATH
            ? `/${process.env.UPLOAD_PATH}/${req.file.filename}`
            : `/${req.file.filename}`

        return res.status(constants.HTTP_STATUS_CREATED).send({
            fileName,
            originalName: req.file.originalname, // OK для UI, не для path
        })
    } catch (error) {
        return next(new BadRequestError('Ошибка загрузки файла'))
    }
}