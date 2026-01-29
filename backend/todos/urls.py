from django.urls import path

from .views import TaskListCreateAPIView, TaskUpdateDeleteView

urlpatterns = [
    path("tasks/", TaskListCreateAPIView.as_view()),
    path("tasks/<int:pk>/", TaskUpdateDeleteView.as_view()),
]