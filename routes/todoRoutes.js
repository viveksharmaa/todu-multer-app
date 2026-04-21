const express = require("express");
const router = express.Router();
const Todo = require("../models/Todo");
const multer = require("multer");

// ===== MULTER CONFIG =====
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + "-" + file.originalname;
        cb(null, uniqueName);
    },
});

const upload = multer({ storage });

// ===== CREATE TODO (WITH FILE) =====
router.post("/", upload.single("file"), async (req, res) => {
    try {
        const newTodo = new Todo({
            title: req.body.title,
            file: req.file ? req.file.path : "",
        });

        const saved = await newTodo.save();
        res.json(saved);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ===== GET ALL TODOS =====
router.get("/", async (req, res) => {
    try {
        const todos = await Todo.find().sort({ createdAt: -1 });
        res.json(todos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ===== DELETE TODO =====
router.delete("/:id", async (req, res) => {
    try {
        await Todo.findByIdAndDelete(req.params.id);
        res.json({ message: "Todo deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;