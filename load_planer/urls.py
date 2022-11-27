from django.urls import path

from . import views


urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("tour_planning", views.tour_planning, name="tour_planning"),
    path("trucks", views.trucks, name="trucks"),
    path("drivers", views.drivers, name="drivers"),
    path("reg_driver", views.reg_driver, name="reg_driver"),
    path("delivery_plans", views.delivery_plans, name="delivery_plans"),
  
    path("delivery_plan/<str:delivery_plan_id>", views.delivery_plan, name="delivery_plan"),
    path("gateway", views.gateway, name="gateway"),
    path("profile/<int:profileid>", views.profile, name="profile"),
    path("verify_driver/<int:profileid>", views.verify_driver, name="verify_driver"),
    path("reg_destination", views.reg_destination, name="reg_destination"),
    path("destinations", views.destinations, name="destinations"),
    path("destination/<str:destination_id>", views.destination, name="destination"),

    # API
    path("get_destination_list", views.get_destination_list, name="get_destination_list"),
    path("reg_destination_plan", views.reg_destination_plan, name="reg_destination_plan"),
    path("get_delivery_plan_list/<str:delivery_id>", views.get_delivery_plan_list, name="get_delivery_plan_list"),
    path("get_delivery_list_by_details/<int:year>/<int:quarter>", views.get_delivery_list_by_details, name="get_delivery_list_by_details"),
    path("get_driver_list/<slug:date>", views.get_driver_list, name="get_driver_list"),
    path("get_truck_list/<slug:date>", views.get_truck_list, name="get_truck_list"),
    path("get_delivery_destinations/<str:delivery_id>", views.get_delivery_destinations, name="get_delivery_destinations"),
    path("register_delivery_point", views.register_delivery_point, name="register_delivery_point"),
    path("get_truck_details/<str:truck_id>", views.get_truck_details, name="get_truck_details"),
    path("register_tour", views.register_tour, name='register"tour'),
]