import { Response } from "express";
import { AuthRequest } from "../middleware/auth.js";
import { DomainTask } from "../models/DomainTask.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

export const listDomainTasksAdmin = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const { domainId } = req.query;
    const filter: Record<string, unknown> = {};
    if (domainId) filter.domainId = domainId;

    const tasks = await DomainTask.find(filter).sort({ domainId: 1, sortOrder: 1, weekNumber: 1 });
    return sendSuccess(res, tasks);
  } catch {
    return sendError(res, "Failed to load domain tasks", 500);
  }
};

export const createDomainTask = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const { domainId, weekNumber, title, description, dueDate, feeAmount, sortOrder, isActive } =
      req.body;
    if (!domainId?.trim() || !weekNumber?.trim() || !title?.trim()) {
      return sendError(res, "Domain, week, and title are required", 400);
    }

    const task = await DomainTask.create({
      domainId: domainId.trim(),
      weekNumber: weekNumber.trim(),
      title: title.trim(),
      description: description?.trim() || "",
      dueDate: dueDate ? new Date(dueDate) : undefined,
      feeAmount: feeAmount != null ? Number(feeAmount) : undefined,
      sortOrder: sortOrder != null ? Number(sortOrder) : 0,
      isActive: isActive !== false,
    });

    return sendSuccess(res, task, "Domain task created");
  } catch {
    return sendError(res, "Could not create task", 500);
  }
};

export const updateDomainTask = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const task = await DomainTask.findById(req.params.id);
    if (!task) return sendError(res, "Task not found", 404);

    const fields = [
      "domainId",
      "weekNumber",
      "title",
      "description",
      "dueDate",
      "feeAmount",
      "sortOrder",
      "isActive",
    ] as const;

    for (const key of fields) {
      if (req.body[key] !== undefined) {
        if (key === "dueDate") {
          task.dueDate = req.body.dueDate ? new Date(req.body.dueDate) : undefined;
        } else if (key === "feeAmount" || key === "sortOrder") {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (task as any)[key] = Number(req.body[key]);
        } else if (key === "isActive") {
          task.isActive = Boolean(req.body.isActive);
        } else {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (task as any)[key] = String(req.body[key]).trim();
        }
      }
    }

    await task.save();
    return sendSuccess(res, task, "Domain task updated");
  } catch {
    return sendError(res, "Update failed", 500);
  }
};

export const deleteDomainTask = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const task = await DomainTask.findByIdAndDelete(req.params.id);
    if (!task) return sendError(res, "Task not found", 404);
    return sendSuccess(res, null, "Domain task deleted");
  } catch {
    return sendError(res, "Delete failed", 500);
  }
};

export const listDomainTasksForStudent = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    if (!req.user) return sendError(res, "Unauthorized", 401);
    const domainId =
      (req.query.domainId as string) ||
      req.user.internshipDomain ||
      req.user.selectedDomain;

    if (!domainId) {
      return sendSuccess(res, { tasks: [], domainId: null });
    }

    const tasks = await DomainTask.find({ domainId, isActive: true }).sort({
      sortOrder: 1,
      weekNumber: 1,
    });

    return sendSuccess(res, { tasks, domainId });
  } catch {
    return sendError(res, "Failed to load tasks", 500);
  }
};
