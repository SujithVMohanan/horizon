from apps.users.models import LoggingModel


def log_create(action=None, model_content=None, model_name=None, user=None, timestamp=None):
    LoggingModel.objects.create(
        action=action,
        model_content=model_content,
        model_name=model_name,
        created_by=user,  
        created_date=timestamp
    )
    
    
    #     print("loggerrrrrrr ", action, model_name, user, timestamp)
    # except Exception as es:
    #     print('es es es::',es)
    #     pass