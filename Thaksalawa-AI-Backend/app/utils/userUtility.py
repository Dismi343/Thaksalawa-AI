from bson import ObjectId

def serialize_dict(doc):
    return {k: str(v) if isinstance(v, ObjectId) else v for k, v in doc.items()}
def serialize_list(entity):
    return [serialize_dict(item) for item in entity]
