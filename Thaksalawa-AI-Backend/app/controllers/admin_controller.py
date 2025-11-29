from fastapi import HTTPException
from sqlalchemy.exc import SQLAlchemyError
from app.database.mysql_database import SessionLocal
from app.models.admin_model import AdminModel
from app.models.user_role_model import UserRole
from app.auth.auth_config import hash_password


def creat_admin(payload):
    session=SessionLocal()
    try:
        data=payload if isinstance(payload,dict) else payload.__dict__
        if session.query(AdminModel).filter_by(email=data.get("email")).first():
            raise HTTPException(status_code=400, detail="Email already exists")
        # optional: validate role exists
        role_id = data.get("role_id")
        if role_id and not session.query(UserRole).filter_by(role_id=role_id).first():
            raise HTTPException(status_code=400, detail="Role not found")
        user_password=data.get("password")
        hashed_pwd=hash_password(user_password)
        admin=AdminModel(
            name=data.get("name"),
            email=data.get("email"),
            password=hashed_pwd,
            user_role_role_id =data.get("role_id")
        )
        session.add(admin)
        session.commit()
        session.refresh(admin)
        return admin
    except HTTPException:
        session.rollback()
        raise
    except SQLAlchemyError as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=f"Database error:  {str(e)}")
    finally:
        session.close()

def get_all_admins():
    session=SessionLocal()
    try:
        return session.query(AdminModel).all()
    except SQLAlchemyError:
        raise HTTPException(status_code=500, detail="Database error")
    finally:
        session.close()
def get_admin_by_id(admin_id: int):
    session=SessionLocal()
    try:
        admin=session.query(AdminModel).filter_by(admin_id=admin_id).first()
        if not admin:
            raise HTTPException(status_code=404, detail="Admin not found")
        return admin
    except SQLAlchemyError:
        raise HTTPException(status_code=500, detail="Database error")
    finally:
        session.close()
def delete_admin_by_id(admin_id:int):
    session =SessionLocal()
    try:
        admin=session.query(AdminModel).filter_by(admin_id=admin_id).first()
        if not admin:
            raise HTTPException(status_code=404, detail="Admin not found")
        session.delete(admin)
        session.commit()
        return {"message":"Admin deleted successfully"}
    except SQLAlchemyError:
        session.rollback()
        raise HTTPException(status_code=500, detail="Database error")
    finally:
        session.close()