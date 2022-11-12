from django.urls import path

from . import views


urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("tour_planing", views.tour_planing, name="tour_planing"),
    path("trucks", views.trucks, name="trucks"),
    path("drivers", views.drivers, name="drivers"),
    path("reg_driver", views.reg_driver, name="reg_driver"),
    path("delivery_plans", views.delivery_plans, name="delivery_plans"),
    path("del_plan_preform", views.del_plan_preform, name="del_plan_preform"),
    path("delivery_plan/<str:delivery_plan_id>", views.delivery_plan, name="delivery_plan"),
    path("gateway", views.gateway, name="gateway"),
    path("profile/<int:profileid>", views.profile, name="profile"),
    path("verify_driver/<int:profileid>", views.verify_driver, name="verify_driver"),
    path("reg_destination", views.reg_destination, name="reg_destination"),
    path("destinations", views.destinations, name="destinations"),
    path("destination/<str:destination_id>", views.destination, name="destination"),
]