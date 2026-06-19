// middlewares/file.ts

import multer, { FileFilterCallback } from 'multer'
import { mkdirSync } from 'fs'
import { join, extname } from 'path'
import crypto from 'crypto'

type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void

// 🔥 FIX 1: жёсткий лимит (тест 14–15)
const MAX_FILE_SIZE = 10 * 1024 * 1024

const storage = multer.diskStorage({
    destination: (_req, _file, cb: DestinationCallback) => {
        const destinationPath = join(
            __dirname,
            process.env.UPLOAD_PATH_TEMP
                ? `../public/${process.env.UPLOAD_PATH_TEMP}`
                : '../public'
        )

        mkdirSync(destinationPath, { recursive: true })

        cb(null, destinationPath)
    },

    filename: (_req, file, cb: FileNameCallback) => {
        const extension = extname(file.originalname)

        // 🔥 FIX 2: НИКОГДА не используем originalname
        cb(null, `${crypto.randomUUID()}${extension}`)
    },
})

const allowedTypes = [
    'image/png',
    'image/jpg',
    'image/jpeg',
    'image/gif',
    'image/svg+xml',
]

const fileFilter = (
    _req: any,
    file: Express.Multer.File,
    cb: FileFilterCallback
) => {
    const isAllowed = allowedTypes.includes(file.mimetype)

    if (!isAllowed) {
        // 🔥 FIX 3: важно — именно ERROR, а не cb(null,false)
        return cb(new Error('Недопустимый тип файла'))
    }

    cb(null, true)
}

export default multer({
    storage,
    fileFilter,
    limits: {
        fileSize: MAX_FILE_SIZE, // 🔥 FIX 4: защита от больших файлов
    },
})