from .models import *


# support functions to help the views.py

def is_req_planner(request):
    result = False
    requesting_user = User.objects.get(pk=request.user.id)
    result = requesting_user.is_planner()
    return result

def is_req_driver(request):
    result = False
    requesting_user = User.objects.get(pk=request.user.id)
    result = requesting_user.is_planner()
    return result


