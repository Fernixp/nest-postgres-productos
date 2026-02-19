

export const fileFilter = (req: Request, file: Express.Multer.File, callback: Function) => {

    /* Evaluamos el archivo */

    if (!file) return callback(new Error('Archivo Vacío..!!'), false)

    const fileExtension = file.mimetype.split('/')[1]

    const validExtensions = ['jpg', 'png', 'jpeg']

    if (validExtensions.includes(fileExtension)) {
        return callback(null, true)
    }
    callback(null, false);
}