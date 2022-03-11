from xml.parsers.expat import model
from rest_framework import serializers
from rest_framework.pagination import PageNumberPagination
from django.contrib.auth import get_user_model, login
from .models import Variant, Product, ProductImage, ProductVariant, ProductVariantPrice

User = get_user_model()

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 2
    page_query_param='p'
    page_size_query_param = 'page'
    max_page_size = 2


class VarientSerializers(serializers.ModelSerializer):
    class Meta:
        model = Variant
        fields = ['id','title', 'description', 'active']

class ProductSerializers(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['title', 'sku', 'description', 'updated_at']

class ProuctImageSerializers(serializers.ModelSerializer):
    class Meta:
        model  = ProductImage
        fields = ['file_path']



class ProductVariantSerializers(serializers.ModelSerializer):
    variant=VarientSerializers()
    class Meta:
        model  = ProductVariant
        fields = ['variant_title', 'variant', 'product']


class ProductVariantPriceSerializers(serializers.ModelSerializer):
    product_variant_one = ProductVariantSerializers()
    product_variant_two = ProductVariantSerializers()
    product_variant_three = ProductVariantSerializers()
    class Meta:
        model  = ProductVariantPrice
        fields = ['id', 'product_variant_one', 'product_variant_two', 'product_variant_three', 'price', 'stock',]



class ProductListAPiView(serializers.ModelSerializer):
    product_image = ProuctImageSerializers(many=True)
    product_varient = ProductVariantSerializers(many=True)
    product_varient_price = ProductVariantPriceSerializers(many=True)
    class Meta:
        model = Product
        fields = ['id', 'title', 'sku', 'description', 'created_at', 'updated_at', 'product_image', 'product_varient', 'product_varient_price']