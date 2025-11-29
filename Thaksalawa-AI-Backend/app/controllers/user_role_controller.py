from fastapi import HTTPException
from sqlalchemy.exc import SQLAlchemyError
from app.database.mysql_database import SessionLocal
from app.models.user_role_model import UserRole

def create_user_role(payload):
    session=SessionLocal()
    try:
        data=payload if isinstance(payload,dict) else payload.__dict__
        role_name= data.get("role_name")
        if session.query(UserRole).filter_by(role_name=role_name).first():
            raise HTTPException(status_code=400, detail="Role already exists")
        role = UserRole(role_name=role_name)
        session.add(role)
        session.commit()
        session.refresh(role)
        return role
    except SQLAlchemyError as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        session.close()
def get_all_user_roles():
    session=SessionLocal()
    try:
        return session.query(UserRole).all()
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        session.close()

def get_user_role_by_id(role_id: int):
    session=SessionLocal()
    try:
        role = session.query(UserRole).filter_by(id=role_id).first()
        if not role:
            raise HTTPException(status_code=404, detail="Role not found")
        return role
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        session.close()

def delete_user_role(role_id: int):
    session=SessionLocal()
    try:
        role = session.query(UserRole).filter_by(id=role_id).first()
        if not role:
            raise HTTPException(status_code=404, detail="Role not found")
        session.delete(role)
        session.commit()
        return {"message": "Role deleted successfully"}
    except SQLAlchemyError as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        session.close()