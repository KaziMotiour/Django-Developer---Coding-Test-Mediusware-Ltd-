# Generated by Django 4.0.3 on 2022-03-10 05:28

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('product', '0004_alter_productimage_product_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='productvariantprice',
            name='product_variant_one',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='product_variant_one', to='product.productvariant'),
        ),
        migrations.AlterField(
            model_name='productvariantprice',
            name='product_variant_three',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='product_variant_three', to='product.productvariant'),
        ),
        migrations.AlterField(
            model_name='productvariantprice',
            name='product_variant_two',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='product_variant_two', to='product.productvariant'),
        ),
        migrations.AlterField(
            model_name='variant',
            name='description',
            field=models.TextField(blank=True, null=True),
        ),
    ]