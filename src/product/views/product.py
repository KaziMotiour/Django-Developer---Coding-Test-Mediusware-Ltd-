from django.views import generic
import time
import datetime
from django.utils import timezone
from django.db.models import Q, Sum
from rest_framework import serializers
from rest_framework.permissions import IsAuthenticated, IsAdminUser, IsAuthenticatedOrReadOnly
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.generics import ListAPIView, RetrieveUpdateDestroyAPIView, CreateAPIView, RetrieveAPIView
from rest_framework.response import Response
from ..serializers import StandardResultsSetPagination, VarientSerializers, ProductSerializers, ProuctImageSerializers, ProductVariantSerializers, ProductVariantPriceSerializers, ProductListAPiView
from ..models import Variant, Product, ProductImage, ProductVariant, ProductVariantPrice



class ProductListApiView(ListAPIView):
    pagination_class  = StandardResultsSetPagination
    # permission_classes=[IsAuthenticated, ]
    serializer_class = ProductListAPiView
    def get_queryset(self):
        user = self.request.user
        title = self.request.GET.get('title')
        varient=self.request.GET.get('varient')
        gte_price=self.request.GET.get('gte_price')
        lte_price=self.request.GET.get('lte_price')
        date=self.request.GET.get('date')
       

        if not title and not varient and not gte_price and not lte_price and not date:
            queryset = Product.objects.all()
        else:
            if date:
                get_date=datetime.datetime.strptime(date, "%Y-%m-%d").date()
               
                queryset = Product.objects.filter(title__icontains=title if title else '').filter(product_varient__variant_title__icontains=varient if varient else '').filter(product_varient_price__price__gte=gte_price if gte_price else 0).filter(product_varient_price__price__lte=lte_price if lte_price else 100000000000).filter(created_at__icontains=get_date).distinct()
            else:
               
                queryset = Product.objects.filter(title__icontains=title if title else '').filter(product_varient__variant_title__icontains=varient if varient else '').filter(product_varient_price__price__gte=gte_price if gte_price else 0).filter(product_varient_price__price__lte=lte_price if lte_price else 100000000000).distinct()

        
        

        return  queryset

class ProductDetailApiView(RetrieveUpdateDestroyAPIView):
    serializer_class = ProductListAPiView
    queryset = Product.objects.all()

class VariantListApiView(ListAPIView):
    permission_classes=[IsAuthenticated, ]
    serializer_class = VarientSerializers
    queryset = Variant.objects.all()


class VariantCreateApiView(CreateAPIView):
    permission_classes=[IsAuthenticated, ]
    serializer_class = VarientSerializers
    queryset = Variant.objects.all()


@api_view(['POST'])
def createProductApiView(request):
    idOfProductVarients = []
    product_details = request.data.get('productDetails')
    product_image = request.data.get('productImages')
    product_varient = request.data.get('productVariten')
    variten_price = request.data.get('varientPrice')

    # create new product
    if not product_details['productName'] or not product_details['sku']:
        return Response({"error":'Not product details found, Please provide the product details'})
    product_obj, created = Product.objects.get_or_create(title=product_details['productName'], sku=product_details['sku'], description=product_details['description'])
   
    if not created:
        return Response('Product already exist')

    if product_image:
        product_iamge = ProductImage.objects.create(product_image=product_obj, file_path=product_image[0]['path'])

    # Add product variant
    for i in range(len(product_varient)):
        varient_obj = Variant.objects.get(title=product_varient[i]['option'])
        for valus in product_varient[i]['tags']:
            obj, created = ProductVariant.objects.get_or_create(variant_title=valus, variant=varient_obj, product=product_obj)
            if created:
                print('created')

    # Add product variant price
    for price in  variten_price: 
        varients = [i.strip() for i in price['title'][:len(price['title'])-1].split('/')]
        idOfProductVarients=[]
        for i in varients:
            idOfProductVarients.append(ProductVariant.objects.filter(variant_title__icontains=i, product=product_obj)[0])
        if len(idOfProductVarients)==3:
            add_price=ProductVariantPrice.objects.create(product_variant_one=idOfProductVarients[0], product_variant_two=idOfProductVarients[1] if  idOfProductVarients[1] else None, product_variant_three=idOfProductVarients[2] if  idOfProductVarients[2] else None, price=price['price'],stock=price['stock'], product=product_obj)
        elif len(idOfProductVarients)==2:
            add_price=ProductVariantPrice.objects.create(product_variant_one=idOfProductVarients[0], product_variant_two=idOfProductVarients[1] if  idOfProductVarients[1] else None, price=price['price'],stock=price['stock'], product=product_obj)
        else:
            add_price=ProductVariantPrice.objects.create(product_variant_one=idOfProductVarients[0], price=price['price'],stock=price['stock'], product=product_obj)

    return Response({'status':'success'})


@api_view(['GET'])
def getRetriveData(request, pk):
    porduct = Product.objects.get(id=pk)
    product_variant = ProductVariant.objects.filter(product=porduct)
    all_variant=dict()
    
    
    for i in product_variant:
        if i.variant.title in all_variant.keys():
            values = all_variant[i.variant.title] 
            values.append(i.variant_title)
            all_variant[i.variant.title]=values
        else:
             all_variant[i.variant.title]=[i.variant_title]
       
    varientPrice=ProductVariantPrice.objects.filter(product=porduct)
    varientPriceSerializer=ProductVariantPriceSerializers(varientPrice, many=True)
    
    serializer=ProductListAPiView(porduct)

    return Response({'product':serializer.data, 'varient':all_variant, 'variantPrice':varientPriceSerializer.data})

@api_view(['POST'])
def UpdateProductView(request, pk):

    product_details = request.data.get('productDetails')
    product_image = request.data.get('productImages')
    variten_price = request.data.get('varientPrice')
    product = Product.objects.get(id=pk)
    # try:

    if product_details:
        Product.objects.filter(id=pk).update(title=product_details['title'], sku=product_details['sku'], description=product_details['description'])
    if product_image:
        porductImage, created=ProductImage.objects.get_or_create(product_image=product)
        try:
            porductImage.file_path=product_image[0]['path']
        except:
            porductImage.file_path=product_image
        porductImage.save()

    for variant in variten_price:
        varitants = variant['title'][:len(variant['title'])-1].split('/')
        if len(varitants)==1:
            product_variant=ProductVariant.objects.filter(variant_title=varitants[0], product=product)[0]
            variant_price = ProductVariantPrice.objects.filter(product_variant_one=product_variant, product=product)[0]
            if not variant['price'] and not variant['stock']:
                variant_price.delete()
            else:
                variant_price.price=variant['price'] if variant['price'] else 0
                variant_price.stock=variant['stock'] if variant['stock'] else 0
                variant_price.save()


        elif len(varitants)==2:
            product_variant1=ProductVariant.objects.filter(variant_title=varitants[0], product=product)[0]
            product_variant2=ProductVariant.objects.filter(variant_title=varitants[1], product=product)[0]
            variant_price = ProductVariantPrice.objects.filter(product_variant_one=product_variant1,product_variant_two=product_variant2, product=product)[0]
            
            if not variant['price'] and not variant['stock']:
                variant_price.delete()
            else:
               
                variant_price.price=variant['price']  if variant['price'] else 0
                variant_price.stock=variant['stock'] if variant['stock'] else 0
                variant_price.save()

        else:
            product_variant1, =ProductVariant.objects.filter(variant_title=varitants[0], product=product)[0]
            product_variant2=ProductVariant.objects.filter(variant_title=varitants[1], product=product)[0]
            product_variant3=ProductVariant.objects.filter(variant_title=varitants[2], product=product)[0]
            variant_price = ProductVariantPrice.objects.filter(product_variant_one=product_variant1, product_variant_two=product_variant2, product_variant_three=product_variant3, product=product)[0]
            if not variant['price'] and not variant['stock']:
                variant_price.delete()
            else:
                variant_price.price=variant['price'] if variant['price'] else 0
                variant_price.stock=variant['stock'] if variant['stock'] else 0
                variant_price.save()
        

    return Response({'status':'success'})
    # except :
    #     return Response({'error':'error'})
    

    return Response({'status':'success'})