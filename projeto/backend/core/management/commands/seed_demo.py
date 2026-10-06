import os
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError
from core.models import Item, List


class Command(BaseCommand):
    help = 'Cria um usuário de demonstração e listas de exemplo sem duplicá-las.'

    def handle(self, *args, **options):
        password = os.getenv('DEMO_PASSWORD')
        if not password:
            raise CommandError('Defina DEMO_PASSWORD antes de executar este comando.')
        user, created = get_user_model().objects.get_or_create(username='demo')
        if created:
            user.set_password(password)
            user.save()
        examples = {
            'Rotina & bem-estar': [('Beber água ao longo do dia', True), ('Fazer uma caminhada', False), ('Ler 20 páginas', False)],
            'Aprendendo React': [('Revisar componentes e props', True), ('Praticar hooks', True), ('Integrar a API do Django', False)],
            'Ideias para a semana': [('Planejar as próximas leituras', False), ('Organizar o espaço de trabalho', False)],
        }
        for name, items in examples.items():
            task_list, _ = List.objects.get_or_create(owner=user, name=name)
            for title, done in items:
                Item.objects.get_or_create(list=task_list, name=title, defaults={'done': done})
        self.stdout.write(self.style.SUCCESS('Usuário demo e listas disponíveis. Usuários existentes mantêm sua senha.'))
