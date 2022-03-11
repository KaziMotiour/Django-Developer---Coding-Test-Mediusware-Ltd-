from django.urls import path
from django.views.generic import TemplateView
from .views.product import ProductListApiView, ProductDetailApiView, createProductApiView, getRetriveData, UpdateProductView
from .views.variant import  VariantCreateApiView, getProductVariants, GetVariants

app_name = "product"

urlpatterns = [
    # Variants URLs

    path('list/', ProductListApiView.as_view(), name='product_list'),
    path('<int:pk>/', ProductDetailApiView.as_view(), name='productDetail'),
    path('create/', createProductApiView, name='create-product'),
    path('retrive/<int:pk>/', getRetriveData, name='create-product'),
    path('update/<int:pk>/', UpdateProductView, name='update-product'),

    path('varient/',GetVariants.as_view(), name='variant'),
    path('product-varient/',getProductVariants, name='priduct_variant'),
    path('create-varient/', VariantCreateApiView.as_view(), name='create_product_varient'),

    # path('variant/create', VariantCreateView.as_view(), name='create.variant'),
    # path('variant/<int:id>/edit', VariantEditView.as_view(), name='update.variant'),

    # # Products URLs
    # path('create/', CreateProductView.as_view(), name='create.product'),
    # path('list/', TemplateView.as_view(template_name='products/list.html', extra_context={
    #     'product': True
    # }), name='list.product'),
]
