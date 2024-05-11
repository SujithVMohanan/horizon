from random import randint
import time
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from datetime import datetime
from django.utils.translation import gettext_lazy as _
from django.utils.text import slugify
from django.utils import timezone


class UserManager(BaseUserManager):
    def create_user(self, username, password = None, **extra_fields):
        if not username:
            raise ValueError(_('The Email must be set'))

        username = self.normalize_email(username)
        user = self.model(username = username, **extra_fields)
        if password:

            user.set_password(password.strip())
            
        user.save()
        return user


    def create_superuser(self, username, password, **extra_fields):
        """
        Create and save a SuperUser with the given email and password.
        """
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(username, password, **extra_fields)


class Users(AbstractBaseUser, PermissionsMixin):
    
    email           = models.EmailField(_('Email'), max_length = 255, blank = True, null = True)
    full_name       = models.CharField(_('Full Name'), max_length = 250, blank = True, null = True)
    username        = models.CharField(_('User Name'), max_length = 250,unique = True, blank = True, null = True)
    date_of_birth   = models.CharField(_('User Name'), max_length = 250, blank = True, null = True)
    last_login      = models.DateTimeField(_('Last Login'),  auto_now = True, blank = True, null = True)
    is_verified     = models.BooleanField(default = False)
    is_admin        = models.BooleanField(default = False)
    is_active       = models.BooleanField(default = True)
    is_staff        = models.BooleanField(default = False)
    is_superuser    = models.BooleanField(default = False)
    is_deleted      = models.BooleanField(default = False)

    USERNAME_FIELD = 'username'

    REQUIRED_FIELDS = ['email']

    objects = UserManager()

    def __str__(self):
        return self.username
    
    def has_module_perms(self, app_label):
        "Does the user have permissions to view the app `app_label`?"
        return True
