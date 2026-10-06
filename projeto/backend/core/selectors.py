from .models import Item, List


def lists_for_user(user):
    return List.objects.filter(owner=user).prefetch_related('item_set').order_by('id')


def items_for_user(user):
    return Item.objects.filter(list__owner=user).select_related('list').order_by('id')
