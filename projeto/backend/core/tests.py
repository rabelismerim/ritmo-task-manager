from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from .models import Item, List


class TaskApiTests(APITestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user('ana', password='test-password')
        self.other = get_user_model().objects.create_user('bruno', password='test-password')
        self.mine = List.objects.create(owner=self.user, name='Minha lista')
        self.theirs = List.objects.create(owner=self.other, name='Privada')
        self.item = Item.objects.create(list=self.theirs, name='Segredo')
        self.client.force_authenticate(self.user)

    def test_anonymous_access_denied(self):
        self.client.force_authenticate(None)
        self.assertEqual(self.client.get('/list/').status_code, 401)

    def test_list_visibility(self):
        response = self.client.get('/list/')
        self.assertEqual([row['id'] for row in response.data], [self.mine.id])

    def test_owner_is_assigned_by_server(self):
        response = self.client.post('/list/', {'name': 'Nova', 'owner': self.other.id})
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['owner'], self.user.id)

    def test_other_users_item_is_inaccessible(self):
        for method in [self.client.get, self.client.patch, self.client.delete]:
            self.assertEqual(method(f'/item/{self.item.id}/').status_code, 404)
        self.assertEqual(self.client.get('/item/').data, [])

    def test_cannot_create_item_in_another_users_list(self):
        response = self.client.post('/item/', {'name': 'Invasão', 'list': self.theirs.id})
        self.assertEqual(response.status_code, 400)

    def test_item_lifecycle(self):
        response = self.client.post('/item/', {'name': 'Estudar', 'list': self.mine.id})
        self.assertEqual(response.status_code, 201)
        url = f"/item/{response.data['id']}/"
        self.assertTrue(self.client.patch(url, {'done': True}).data['done'])
        self.assertEqual(self.client.patch(url, {'list': self.theirs.id}).status_code, 400)
        self.assertEqual(self.client.delete(url).status_code, 204)

    def test_cannot_modify_another_users_list(self):
        self.assertEqual(self.client.patch(f'/list/{self.theirs.id}/', {'name': 'Editada'}).status_code, 404)
        self.assertEqual(self.client.delete(f'/list/{self.theirs.id}/').status_code, 404)

    def test_login_returns_token(self):
        self.client.force_authenticate(None)
        response = self.client.post('/api-token-auth/', {'username': 'ana', 'password': 'test-password'})
        self.assertEqual(response.status_code, 200)
        self.assertIn('token', response.data)
