import logging
from django.http import  JsonResponse
from django.shortcuts import render, redirect
from django.views import View
from django.contrib.auth import authenticate, login, logout
logger = logging.getLogger(__name__)



class LoginView(View):
    def __init__(self):
        self.response_format = {"status_code": 101, "message": "", "error": ""}

    def get(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return redirect('home:dashboard')
        return render(request, 'auth/login.html')

    def post(self, request, *args, **kwargs):
        try:
            username = request.POST.get('username')
            password = request.POST.get('password')
            user = authenticate(username=username, password=password)

            if user is not None and user.is_admin == True:  
                login(request,user)
                self.response_format['status_code'] = 100
                self.response_format['message'] = f"You are now logged in as {user.full_name}"
            else:
                self.response_format['message'] = 'Invalid username or password'

        except Exception as e:
            self.response_format['message'] = 'Something went wrong, Please try again later.'
            self.response_format['error'] = str(e)

        return JsonResponse(self.response_format, status=200)


def signout(request):
    logout(request)
    return redirect('authentication:login')
    
    
    
