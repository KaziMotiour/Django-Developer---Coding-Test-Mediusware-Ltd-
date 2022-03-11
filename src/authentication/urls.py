from django.urls import path, include
from .views import CreateNewUserView


urlpatterns = [
    path('', CreateNewUserView.as_view(), name='singup')

]