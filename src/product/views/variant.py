from django.views import generic
from rest_framework import serializers
from rest_framework.permissions import IsAuthenticated, IsAdminUser, IsAuthenticatedOrReadOnly
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.generics import ListAPIView, RetrieveUpdateDestroyAPIView, CreateAPIView, RetrieveAPIView
from rest_framework.response import Response
from ..serializers import StandardResultsSetPagination, VarientSerializers, ProductSerializers, ProuctImageSerializers, ProductVariantSerializers, ProductVariantPriceSerializers, ProductListAPiView
from ..models import Variant, Product, ProductImage, ProductVariant, ProductVariantPrice


@api_view(['GET'])
def getProductVariants(request):
    color_variant=Variant.objects.all()
    all_variant=dict()
    tempo = set()
    for variant in color_variant:
        
        product_variant = ProductVariant.objects.filter(variant=variant).distinct()
        
        for vari in product_variant:
           print(vari.variant_title)
           tempo.add(vari.variant_title)
           all_variant[variant.title]=tempo
        tempo=set()
    print(all_variant)
    return Response(all_variant)


class GetVariants(ListAPIView):
    
    serializer_class = VarientSerializers
    queryset = Variant.objects.all()

class VariantCreateApiView(CreateAPIView):
    # permission_classes=[IsAuthenticated, ]
    serializer_class = VarientSerializers
    queryset = Variant.objects.all()


