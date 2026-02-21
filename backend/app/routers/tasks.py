from datetime import datetime
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from ..db import get_db
from ..domain.task import TaskCreate, TaskRead, TaskUpdate
from ..models.task import Task as TaskModel
router = APIRouter()

def get_task_or_404(session: Session, task_id: int) -> TaskModel:
    task = session.get(TaskModel, task_id)
    if task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Task not found"
        )
    return task


@router.post(
    "/tasks",
    response_model=TaskRead,
    status_code=status.HTTP_201_CREATED,
    tags=["tasks"],
)
def create_task(payload: TaskCreate, session: Session = Depends(get_db)) -> TaskModel:
    now = datetime.now()
    task = TaskModel(
        title=payload.title,
        description=payload.description,
        status=payload.status,
        created_at=now,
        updated_at=now,
    )
    session.add(task)
    session.commit()
    session.refresh(task)
    return task


@router.get("/tasks", response_model=List[TaskRead], tags=["tasks"])
def list_tasks(
    session: Session = Depends(get_db),
) -> List[TaskModel]:
    query = select(TaskModel)
    tasks = session.exec(query).all()
    return tasks


@router.get("/tasks/{task_id}", response_model=TaskRead, tags=["tasks"])
def get_task(task_id: int, session: Session = Depends(get_db)) -> TaskModel:
    return get_task_or_404(session, task_id)


def apply_update(task: TaskModel, payload: TaskUpdate) -> TaskModel:
    if payload.title is not None:
        task.title = payload.title
    if payload.description is not None:
        task.description = payload.description
    if payload.status is not None:
        task.status = payload.status
    task.updated_at = datetime.now()
    return task


@router.patch("/tasks/{task_id}", response_model=TaskRead, tags=["tasks"])
def patch_task(
    task_id: int, payload: TaskUpdate, session: Session = Depends(get_db)
) -> TaskModel:
    task = get_task_or_404(session, task_id)
    task = apply_update(task, payload)
    session.add(task)
    session.commit()
    session.refresh(task)
    return task


@router.delete(
    "/tasks/{task_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    tags=["tasks"],
)
def delete_task(task_id: int, session: Session = Depends(get_db)) -> None:
    task = get_task_or_404(session, task_id)
    session.delete(task)
    session.commit()
    return None
