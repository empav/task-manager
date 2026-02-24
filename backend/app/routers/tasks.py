from datetime import datetime
from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func
from sqlmodel import Session, select

from ..db import get_db
from ..domain.task import TaskCreate, PaginatedTaskListResponse, TaskRead, TaskUpdate
from ..models.task import Task as TaskModel

router_v1 = APIRouter()
router_v2 = APIRouter()

def get_task_or_404(session: Session, task_id: int) -> TaskModel:
    task = session.get(TaskModel, task_id)
    if task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Task not found"
        )
    return task


@router_v1.post(
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


@router_v1.get("/tasks", response_model=List[TaskRead], tags=["tasks"])
def list_tasks_v1(
    session: Session = Depends(get_db),
) -> List[TaskModel]:
    query = select(TaskModel)
    tasks = session.exec(query).all()
    return tasks


@router_v2.get("/tasks", response_model=PaginatedTaskListResponse, tags=["tasks"])
def list_tasks_v2(
    page: int = Query(1, ge=1),
    page_size: int = Query(5, ge=1, le=100),
    session: Session = Depends(get_db),
) -> PaginatedTaskListResponse:
    offset = (page - 1) * page_size
    query = select(TaskModel).order_by(TaskModel.id).offset(offset).limit(page_size)
    tasks = session.exec(query).all()
    total_query = select(func.count()).select_from(TaskModel)
    total = session.exec(total_query).one()
    items = [
        TaskRead(
            id=task.id,
            title=task.title,
            description=task.description,
            status=task.status,
            created_at=task.created_at,
            updated_at=task.updated_at,
        )
        for task in tasks
    ]
    return PaginatedTaskListResponse(items=items, total=int(total))


@router_v1.get("/tasks/count", response_model=int, tags=["tasks"])
def count_tasks(session: Session = Depends(get_db)) -> int:
    query = select(func.count()).select_from(TaskModel)
    count = session.exec(query).one()
    return int(count)


@router_v1.get("/tasks/{task_id}", response_model=TaskRead, tags=["tasks"])
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


@router_v1.patch("/tasks/{task_id}", response_model=TaskRead, tags=["tasks"])
def patch_task(
    task_id: int, payload: TaskUpdate, session: Session = Depends(get_db)
) -> TaskModel:
    task = get_task_or_404(session, task_id)
    task = apply_update(task, payload)
    session.add(task)
    session.commit()
    session.refresh(task)
    return task


@router_v1.delete(
    "/tasks/{task_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    tags=["tasks"],
)
def delete_task(task_id: int, session: Session = Depends(get_db)) -> None:
    task = get_task_or_404(session, task_id)
    session.delete(task)
    session.commit()
    return None
