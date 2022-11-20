# Generated by Django 4.1 on 2022-11-20 22:01

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('load_planer', '0005_delete_tour'),
    ]

    operations = [
        migrations.CreateModel(
            name='Tour',
            fields=[
                ('tour_id', models.CharField(max_length=30, primary_key=True, serialize=False)),
                ('exec_date', models.DateField()),
                ('delivery_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='load_planer.delivery_plan')),
                ('driver_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='load_planer.driver')),
                ('truck_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='load_planer.truck')),
            ],
        ),
        migrations.CreateModel(
            name='DeliveryPoint',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('delivery_time', models.TimeField()),
                ('f_pallets', models.PositiveSmallIntegerField()),
                ('c_pallets', models.PositiveSmallIntegerField()),
                ('d_pallets', models.PositiveSmallIntegerField()),
                ('destination', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='load_planer.destination')),
                ('tour_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='load_planer.tour')),
            ],
        ),
    ]
