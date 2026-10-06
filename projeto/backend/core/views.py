from rest_framework import viewsets
from .selectors import items_for_user, lists_for_user
from .serializers import ItemSerializer, ListSerializer


class ListViewSet(viewsets.ModelViewSet):
    serializer_class = ListSerializer

    def get_queryset(self):
        return lists_for_user(self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class ItemViewSet(viewsets.ModelViewSet):
    serializer_class = ItemSerializer

    def get_queryset(self):
        return items_for_user(self.request.user)
