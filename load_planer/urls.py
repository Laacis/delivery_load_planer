from django.urls import path

from . import views


urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("tour_planing", views.tour_planing, name="tour_planing"),
    path("trucks", views.trucks, name="trucks"),
    path("drivers", views.drivers, name="drivers")
]