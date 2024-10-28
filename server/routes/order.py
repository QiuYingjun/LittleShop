# routes/order.py
from flask import Blueprint, jsonify, request, abort
from models import db, Order
from models import Customer, SalesRecord
from routes.inventory_record import get_inventory_summary
from typing import List

# 创建一个蓝图
order_bp = Blueprint("orders", __name__)


# 获取所有订单
@order_bp.route("/orders", methods=["GET"])
def get_orders():
    orders = Order.query.all()
    return jsonify([order.to_dict() for order in orders])


# 删除订单
@order_bp.route("/orders/<int:order_id>", methods=["DELETE"])
def delete_order(order_id):
    SalesRecord.query.filter(SalesRecord.order_id == order_id).delete()

    order = Order.query.get(order_id)
    if order is None:
        abort(404)
    db.session.delete(order)
    db.session.commit()
    return jsonify({"result": True})


# 创建明细及订单
@order_bp.route("/orders", methods=["POST"])
def create_orders():
    sales_records: List[dict] = request.json.get("sales_records", [])
    if not sales_records:
        return {"error": f"no product"}, 400
    points_used = request.json.get("points_used", 0)
    customer_id = request.json.get("customer_id")

    # 检查库存
    stocks = get_inventory_summary()
    print(30, [s["product_id"] for s in stocks if s["product_id"] == 1])
    total_price = 0
    for sales_record in sales_records:

        stock1 = [s for s in stocks if s["product_id"] == sales_record["product_id"]]

        stock = stock1[0] if stock1 else None
        if stock is None or sales_record["quantity"] > stock["current_stock"]:
            return {
                "error": f"no enough stock for product {sales_record['product_id']}"
            }, 400
        else:
            total_price = total_price + sales_record["quantity"] * sales_record["price"]

    # 检查积分
    customer = Customer.query.get(customer_id)
    if points_used > customer.points:
        return {"error": f"no enough points for customer {customer_id}"}, 400

    # 创建订单
    new_order = Order(
        customer_id=customer_id,
        points_used=points_used,
        points_earned=total_price // 100,
        total_price=total_price,
    )

    db.session.add(new_order)
    db.session.commit()

    # 创建明细
    new_sales_records = [
        SalesRecord(
            product_id=t["product_id"],
            customer_id=customer_id,
            order_id=new_order.id,
            price=t["price"],
            quantity=t["quantity"],
        )
        for t in sales_records
    ]

    db.session.add_all(new_sales_records)

    customer.points = customer.points - new_order.points_used + new_order.points_earned
    db.session.add(customer)

    db.session.commit()
    return new_order.to_dict(), 201
