# -*- coding: utf-8 -*-
# from odoo import http


# class ListaPrecios(http.Controller):
#     @http.route('/lista_precios/lista_precios', auth='public')
#     def index(self, **kw):
#         return "Hello, world"

#     @http.route('/lista_precios/lista_precios/objects', auth='public')
#     def list(self, **kw):
#         return http.request.render('lista_precios.listing', {
#             'root': '/lista_precios/lista_precios',
#             'objects': http.request.env['lista_precios.lista_precios'].search([]),
#         })

#     @http.route('/lista_precios/lista_precios/objects/<model("lista_precios.lista_precios"):obj>', auth='public')
#     def object(self, obj, **kw):
#         return http.request.render('lista_precios.object', {
#             'object': obj
#         })

