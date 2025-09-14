import { User, File } from "../model/model.js";

export const upload = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ error: "User not found" });
        const newFile = new File({
            filename: req.file.originalname,
            filepath: req.file.path,
            mimetype: req.file.mimetype,
            size: req.file.size,
            user: req.userId,
        });
        await newFile.save();
        res.json({ message: "File uploaded", file: newFile });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};
