# Generated by Django 5.1.5 on 2025-03-27 20:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('counseling', '0003_alter_userprofile_gender_alter_userprofile_location'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userprofile',
            name='phone_number',
            field=models.CharField(blank=True, max_length=15, null=True),
        ),
    ]
