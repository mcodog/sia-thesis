# Generated by Django 5.1.5 on 2025-01-28 07:02

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('counseling', '0005_message_fromuser'),
    ]

    operations = [
        migrations.RenameField(
            model_name='message',
            old_name='fromUser',
            new_name='from_user',
        ),
    ]
