from django.db import models
from config.g_model import TimeStampMixin


def upload_to(instance, filename):
    return 'Product_image/{filename}'.format(filename=filename)

# Create your models here.
class Variant(models.Model):
    title = models.CharField(max_length=40, unique=True)
    description = models.TextField(null=True, blank=True)
    active = models.BooleanField(default=True)
    def __str__(self):
        return str(self.title)

class Product(models.Model):
    title = models.CharField(max_length=255)
    sku = models.SlugField(max_length=255, unique=True)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at =models.DateField(auto_now_add=False, null=True, blank=True)
    class Meta:
        ordering = ('-created_at', )

    def __str__(self):
        return str(self.sku)
    
        


class ProductImage(models.Model):
    product_image = models.ForeignKey(Product, related_name='product_image', on_delete=models.CASCADE)
    file_path = models.ImageField(upload_to=upload_to)


class ProductVariant(models.Model):                 
    variant_title = models.CharField(max_length=255)
    variant = models.ForeignKey(Variant, related_name='varient_type', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, related_name='product_varient', on_delete=models.CASCADE)
    def __str__(self):
        return str(self.variant_title)

class ProductVariantPrice(models.Model):
    product_variant_one = models.ForeignKey(ProductVariant, on_delete=models.CASCADE, null=True, blank=True,
                                            related_name='product_variant_one')
    product_variant_two = models.ForeignKey(ProductVariant, on_delete=models.CASCADE, null=True, blank=True,
                                            related_name='product_variant_two')
    product_variant_three = models.ForeignKey(ProductVariant, on_delete=models.CASCADE, null=True, blank=True,
                                              related_name='product_variant_three')
    price = models.FloatField()
    stock = models.FloatField()
    product = models.ForeignKey(Product, related_name='product_varient_price', on_delete=models.CASCADE)
    def __str__(self):
        return str(self.price)