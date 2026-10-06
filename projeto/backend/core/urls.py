from rest_framework.routers import DefaultRouter
from .views import ItemViewSet, ListViewSet

router = DefaultRouter()
router.register('list', ListViewSet, basename='list')
router.register('item', ItemViewSet, basename='item')
urlpatterns = router.urls
