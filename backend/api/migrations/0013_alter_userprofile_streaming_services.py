# Generated by Django 4.2.1 on 2024-09-11 15:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0012_alter_userprofile_profile_picture_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userprofile',
            name='streaming_services',
            field=models.TextField(blank=True),
        ),
    ]
