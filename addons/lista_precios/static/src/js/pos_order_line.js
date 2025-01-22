import { PosOrderline } from "@point_of_sale/app/models/pos_order_line";
import { PosOrder } from "@point_of_sale/app/models/pos_order";
import { patch } from "@web/core/utils/patch";

// Constants
const PRICES = {
    UNIT: 1500,
    DOZEN: 1250
};

// PosOrderline patch
patch(PosOrderline.prototype, {
    _isEmpanadasCategory(product) {
        return product?.categ_id?.name?.includes('Empanadas') || false;
    },

    _calculateEmpanadasPrice(quantity) {
        const dozens = Math.floor(quantity / 12);
        const remainingUnits = quantity % 12;
        return (dozens * 12 * PRICES.DOZEN) + (remainingUnits * PRICES.UNIT);
    },

    set_quantity(quantity, force_update = false) {
        const result = super.set_quantity(...arguments);
        
        if (this._isEmpanadasCategory(this.get_product())) {
            this.price = this.get_price_without_tax();
            this.order?.update_total();
        }
        
        return result;
    },

    get_unit_price() {
        const product = this.get_product();
        if (!this._isEmpanadasCategory(product)) {
            return super.get_unit_price(...arguments);
        }

        const quantity = parseInt(this.get_quantity()) || 0;
        return quantity >= 12 && quantity % 12 === 0 ? PRICES.DOZEN : PRICES.UNIT;
    },

    get_price_without_tax() {
        const product = this.get_product();
        if (!this._isEmpanadasCategory(product)) {
            return super.get_price_without_tax();
        }

        const quantity = parseInt(this.get_quantity()) || 0;
        return this._calculateEmpanadasPrice(quantity);
    },

    set_unit_price(price) {
        if (!this._isEmpanadasCategory(this.get_product())) {
            return super.set_unit_price(price);
        }

        const quantity = parseInt(this.get_quantity()) || 0;
        const calculatedPrice = this.get_price_without_tax();
        super.set_unit_price(quantity > 0 ? calculatedPrice / quantity : price);
    },

    getDisplayData() {
        if (!this._isEmpanadasCategory(this.get_product())) {
            return super.getDisplayData?.() || {};
        }

        const product = this.get_product();
        const quantity = parseInt(this.get_quantity() || 0);

        return {
            productName: product.display_name || '',
            qty: quantity.toString(),
            unitPrice: this.get_unit_price().toString(),
            price: this.get_price_without_tax().toString(),
            discount: '0',
            unit: product.uom_id?.[1] || ''
        };
    }
});

// PosOrder patch
patch(PosOrder.prototype, {
    get_total_without_tax() {
        return this.get_orderlines().reduce((sum, line) => 
            sum + (line.get_price_without_tax() || 0), 0);
    },

    add_product(product, options) {
        const res = super.add_product(...arguments);
        const line = this.get_selected_orderline();
        
        if (line?._isEmpanadasCategory(product)) {
            const quantity = parseInt(line.get_quantity() || 0);
            const price = line.get_price_without_tax();
            
            if (quantity > 0) {
                line.set_unit_price(price / quantity);
            }
            
            this.update_total();
        }
        
        return res;
    },

    update_total() {
        const total = this.get_total_without_tax();
        Object.assign(this, {
            amount_total: total,
            amount_tax: 0,
            amount_paid: total,
            amount_return: 0
        });

        this.trigger('change');
        this.trigger('change:total');
    },

    export_as_JSON() {
        const json = super.export_as_JSON();
        const total = this.get_total_without_tax();
        
        return {
            ...json,
            amount_total: total,
            amount_tax: 0,
            amount_paid: total,
            amount_return: 0
        };
    }
});
