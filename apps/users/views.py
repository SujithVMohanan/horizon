import logging
from django.http import  JsonResponse
from django.shortcuts import get_object_or_404, render
from django.urls import reverse
from django.views import View
from django_datatables_view.base_datatable_view import BaseDatatableView
from django.utils.html import escape
from apps.users.models import Users
from django.db.models import Q
from django.utils.decorators import method_decorator
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from horizon.helpers.signer import URLEncryptionDecryption
from django.contrib.auth.hashers import make_password

logger = logging.getLogger(__name__)

# Create your views here.



class UsersView(View):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.context = {"breadcrumbs" : []}
        self.template = 'user/users/users.html'
        self.context['title'] = 'Users'
        self.generateBreadcrumbs()
        
    def get(self, request, *args, **kwargs):
        use_type = request.GET.get('type', None)
        if use_type is not None:
            self.context['use_type'] = use_type
        return render(request, self.template, context=self.context)

    def generateBreadcrumbs(self):
        self.context['breadcrumbs'].append({"name" : "Home", "route" : reverse('home:dashboard'),'active' : False});
        self.context['breadcrumbs'].append({"name" : "Users", "route" : '','active' : True});


class LoadUsersDatatable(BaseDatatableView):
    model = Users.objects.filter().exclude(is_admin=1,is_deleted=False)
    
    order_columns = ['id','full_name','email','username','full_name','is_active']
    
    def get_initial_queryset(self):
        
        usertype = self.request.POST.get('usertype', None) 
        if usertype == '1':
            self.model = self.model.filter(user_type=1)
        if usertype == '2':
            self.model = self.model.filter(user_type=2)
        
        filter_value = self.request.POST.get('columns[3][search][value]', None)
        
        if filter_value == '1':
            return self.model.filter(is_active=1)
        elif filter_value == '2':
            return self.model.filter(is_active=0)
        else:
            return self.model.filter()


    def filter_queryset(self, qs):
        search = self.request.POST.get('search[value]', None)
        if search:
            qs = qs.filter(Q(email__icontains=search) | Q(full_name__icontains=search) )

        """Advanced filtering

        Returns:
            _type_: _description_
        """
        filter_email = self.request.POST.get('email', None)
        
        
        if filter_email is not None:
            users_datas = filter_email.split(' ')
            qs_params = None
            for part in users_datas:
                q = Q(email__istartswith=part)
                qs_params = qs_params | q if qs_params else q
            qs = qs.filter(qs_params)
        
        return qs
    

    def prepare_results(self, qs):
        json_data = []
        for item in qs:
            
            json_data.append({
                'id'            : escape(item.id),
                'encrypt_id'    : escape(URLEncryptionDecryption.enc(item.id)),
                'email'         : escape(item.email),
                'username'      : escape(item.username),
                'image'         : escape(item.image.url),
                'full_name'     : escape(item.company_name) if item.user_type and int(item.user_type) == 2 else escape(item.full_name),
                'user_type'     : escape(item.user_type),
                'is_active'     : escape(item.is_active),
                'created_date'  : item.date_joined.strftime("%Y-%m-%d %H:%M:%S"),
            })
            
        return json_data
    
    
@method_decorator(login_required, name='dispatch')
class DestroyUsersRecordsView(View):
    def __init__(self, **kwargs):
        self.response_format = {"status_code": 101, "message": "", "error": ""}

    def post(self, request, *args, **kwargs):
        try:
            users_ids = request.POST.getlist('ids[]')
            if users_ids:
                user_obj = Users.objects.filter(id__in=users_ids)
                user_obj.delete()
    
                self.response_format['status_code'] = 200
                self.response_format['message'] = 'Success'
                
        except Exception as e:
            self.response_format['message'] = 'error'
            self.response_format['error'] = str(e)

        return JsonResponse(self.response_format, status=200)

    
class UserCreateOrUpdateView(View):
    def __init__(self, **kwargs):
        self.response_format            = {"status": 200, "message": "", "error": ""}
        self.context                    = {"breadcrumbs": []}
        self.context['title']           = 'Users'
        self.action                     = "Create"
        self.context['user_obj']        = Users.objects.all()
        self.template                   = 'user/users/create-or-update.html'
        self.generate_breadcrumbs()

    def get(self, request, *args, **kwargs):
        id = URLEncryptionDecryption.dec(kwargs.pop('id', None))
        if id:
            self.context['users'] = get_object_or_404(Users, id=id)
            
        return render(request, self.template, context=self.context)

    def generate_breadcrumbs(self):
        self.context['breadcrumbs'].append({"name": "Home", "route": reverse('home:dashboard'), 'active': False})
        self.context['breadcrumbs'].append({"name": "Users", "route": reverse('users:users.index'), 'active': False})
        self.context['breadcrumbs'].append({"name": "Create User", "route": '', 'active': True})

    def post(self, request, *args, **kwargs):
        user_id = request.POST.get('user_id', None)
        try:
            if user_id:
                self.action = 'Updated'
                user = get_object_or_404(Users, id=user_id)
            else:
                self.action = 'Created'
                user = Users()

            # Validate username and email using Q objects
            username_obj = Users.objects.filter(Q(username__iexact=request.POST.get('username', None)) & ~Q(id=user.id))
            email_check = Users.objects.filter(Q(email__iexact=request.POST.get('email', None)) & ~Q(id=user.id))

            if username_obj.exists():
                self.response_format['status'] = 400
                self.response_format['message'] = 'Username Already In Use'
                messages.error(request, self.response_format['message'])

            elif email_check.exists():
                self.response_format['status'] = 400
                self.response_format['message'] = 'Email Already In Use'
                messages.error(request, self.response_format['message'])

            else:
                # Save user details
                user.full_name = request.POST.get('full_name', None)
                user.company_name = request.POST.get('full_name', None)
                user.industry_type_id = request.POST.get('industry_type')
                
                if request.FILES.__len__() != 0:
                        if request.POST.get('user_profile_image', None) is None:
                            user.image = request.FILES.get('user_profile_image')  
                            
                        if request.POST.get('user_cover_image', None) is None:
                            user.cover_image = request.FILES.get('user_cover_image') 
                            
                if len(request.POST.get('password', '')) > 0:
                    user.password = make_password(request.POST.get('password'))

                user.email = request.POST.get('email', None)
                user.mobile = request.POST.get('mobile', None)
                user.username = request.POST.get('username', None)

                if request.POST.get('user_status'):
                    user.is_active = request.POST.get('user_status')
                else:
                    user.is_active = True

                user.reference_number = request.POST.get('reference_number')
                user.user_type = 2
                user.created_by = request.user
                user.save()

                self.response_format['status'] = 200
                self.response_format['message'] = f"Data Successfully {self.action}"
                messages.success(request, self.response_format['message'])

        except Exception as e:
            self.response_format['status'] = 500
            self.response_format['message'] = str(e)
            self.response_format['error'] = str(e)
            messages.error(request, f"Something went wrong: {str(e)}")

        return JsonResponse(self.response_format, status=200)
