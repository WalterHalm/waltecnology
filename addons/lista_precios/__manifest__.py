# -*- coding: utf-8 -*-
{
    'name': 'POS Empanadas Pricing',
    'author': "Walter Hal,",
    'summary': """Implementa precios especiales para las empanadas en el POS.""",
    'description': """
        Este módulo implementa la lógica de precios para productos tipo "empanadas". 
        El precio es 1500 pesos por unidad y 1250 pesos por docena o múltiplos de 12.
    """,
    'category': 'Point of Sale',
    'version': '18.0.1.0',
    'depends': ['point_of_sale'],
    'assets': {
        'point_of_sale._assets_pos': [
            #'lista_precios/static/src/xml/order_total.xml',
            'lista_precios/static/src/js/pos_order_line.js',
            #'lista_precios/static/src/js/pos_order_total.js',
        ],
    },   
    'license': 'LGPL-3',
    'application': True,
    'auto_install': False,
}

