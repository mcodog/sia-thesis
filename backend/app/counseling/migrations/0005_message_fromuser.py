# Generated by Django 5.1.5 on 2025-01-28 07:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('counseling', '0004_rename_datecreated_chatlog_date_created'),
    ]

    operations = [
        migrations.AddField(
            model_name='message',
            name='fromUser',
            field=models.BooleanField(default=True),
        ),
    ]
