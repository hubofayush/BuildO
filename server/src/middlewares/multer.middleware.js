// import multer from "multer";

// // const storage = multer.diskStorage({});

// // export const upload = multer({ storage });
// import path from "path";
// import fs from "fs";

// // Ensure upload directory exists
// const uploadDir = "./public/temp";
// if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir, { recursive: true });
// }

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, uploadDir);
//     },
//     filename: (req, file, cb) => {
//         const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//         cb(
//             null,
//             file.fieldname +
//                 "-" +
//                 uniqueSuffix +
//                 path.extname(file.originalname)
//         );
//     },
// });
// const fileFilter = (req, file, cb) => {
//     const allowedMimes = [
//         "image/jpeg",
//         "image/jpg",
//         "image/png",
//         "image/gif",
//         "application/pdf",
//     ];
//     if (allowedMimes.includes(file.mimetype)) {
//         cb(null, true);
//     } else {
//         cb(
//             new Error(
//                 "Invalid file type. Only JPEG, PNG, GIF, JPG and PDF files are allowed."
//             ),
//             false
//         );
//     }
// };

// export const upload = multer({
//     storage,
//     fileFilter,
//     limits: {
//         fileSize: 10 * 1024 * 1024, // 10MB limit
//     },
// });
import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure upload directory exists
const uploadDir = "/tmp"; // Use Vercel's writable /tmp directory
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(
            null,
            file.fieldname +
                "-" +
                uniqueSuffix +
                path.extname(file.originalname)
        );
    },
});

const fileFilter = (req, file, cb) => {
    const allowedMimes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "application/pdf",
    ];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new Error(
                "Invalid file type. Only JPEG, PNG, GIF, JPG, and PDF files are allowed."
            ),
            false
        );
    }
};

export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
});
