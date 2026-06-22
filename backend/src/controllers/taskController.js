import mongoose from "mongoose";
import Task from "../models/Task.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const normalizeTaskInput = ({ title, description, completed }) => {
  const payload = {};

  if (title !== undefined) {
    payload.title = String(title).trim();
  }

  if (description !== undefined) {
    payload.description = String(description).trim();
  }

  if (completed !== undefined) {
    payload.completed = Boolean(completed);
  }

  return payload;
};

export const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json({ tasks });
  } catch (error) {
    return next(error);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const payload = normalizeTaskInput(req.body);

    if (!payload.title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = await Task.create({
      ...payload,
      user: req.user._id
    });

    return res.status(201).json({ task });
  } catch (error) {
    return next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid task id" });
    }

    const payload = normalizeTaskInput(req.body);

    if (payload.title !== undefined && !payload.title) {
      return res.status(400).json({ message: "Title cannot be empty" });
    }

    const task = await Task.findOneAndUpdate(
      { _id: id, user: req.user._id },
      payload,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.status(200).json({ task });
  } catch (error) {
    return next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid task id" });
    }

    const task = await Task.findOneAndDelete({ _id: id, user: req.user._id });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    return next(error);
  }
};
