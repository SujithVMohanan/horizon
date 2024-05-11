from django.urls import path,include,re_path
from . import views

urlpatterns = [
    
    re_path(r'^v1/', include([
        re_path(r'^users/', include([
            path('', views.UsersView.as_view(), name='users.index'),
            path('create', views.UserCreateOrUpdateView.as_view(), name='users.create'),
            path('<str:id>/update/', views.UserCreateOrUpdateView.as_view(), name='users.update'),
            path('load_users_datatable', views.LoadUsersDatatable.as_view(), name='load.users.datatable'),
            path('destroy_records/', views.DestroyUsersRecordsView.as_view(), name='users.records.destroy'),
        ])),
    ])),
    
]