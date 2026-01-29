from rest_framework.generics import (
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView,
)
from rest_framework.permissions import IsAuthenticated

from .serializers import TodoSerializer
from .models import Todo


class UserFilteredMixin:
    def get_queryset(self):
        return Todo.objects.filter(user=self.request.user)


class TaskListCreateAPIView(UserFilteredMixin, ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TodoSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TaskUpdateDeleteView(UserFilteredMixin, RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TodoSerializer
