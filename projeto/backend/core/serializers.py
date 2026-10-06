from rest_framework import serializers
from .models import Item, List


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ['id', 'name', 'done', 'list']

    def validate_list(self, value):
        if value.owner_id != self.context['request'].user.id:
            raise serializers.ValidationError('Selecione uma lista que pertence a você.')
        return value


class ListSerializer(serializers.ModelSerializer):
    item_set = ItemSerializer(many=True, read_only=True)
    owner = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = List
        fields = ['id', 'name', 'owner', 'item_set']
