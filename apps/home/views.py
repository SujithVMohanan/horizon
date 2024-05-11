import logging
from django.shortcuts import render
from django.views import View
from apps.users.models import Users

logger = logging.getLogger(__name__)



class HomeView(View):
    def __init__(self):
        self.context = {}
        self.context['title'] = 'Dashboard'
        self.template = 'home/dashboard.html'

    def get(self, request, *args, **kwargs):
        self.context['corporate_users'] = Users.objects.filter(user_type='2', is_active=True)
        self.context['individual_users'] = Users.objects.filter(user_type='1', is_active=True)
        return render(request, self.template, self.context)
        