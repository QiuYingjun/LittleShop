# routes/sales_record.py
from flask import Blueprint, jsonify, request, abort
from models import db, SalesRecord, Customer
from sqlalchemy import MetaData
from sqlalchemy import select

# 创建一个蓝图
sales_bp = Blueprint("sales", __name__)


# 获取所有销售记录
@sales_bp.route("/sales_records", methods=["GET"])
def get_sales_records():
    records = SalesRecord.query.all()
    return jsonify([record.to_dict() for record in records])


# 获取单个销售记录
@sales_bp.route("/sales_records/<int:record_id>", methods=["GET"])
def get_sales_record(record_id):
    record = SalesRecord.query.get(record_id)
    if record is None:
        abort(404)
    return jsonify(record.to_dict())


# 创建新销售记录
@sales_bp.route("/sales_records", methods=["POST"])
def create_sales_record():
    if (
        not request.json
        or "product_id" not in request.json
        or "customer_id" not in request.json
    ):
        abort(400)

    metadata = MetaData()
    inventory_summary = db.Table("inventory_summary", metadata, autoload_with=db.engine)
    product_id = request.json["product_id"]
    quantity = request.json.get("quantity", 1)

    stmt = select(inventory_summary).where(inventory_summary.c.product_id == product_id)
    can_sale = False
    for row in db.engine.connect().execute(stmt):
        if row.product_id == product_id and row.current_stock >= quantity:
            can_sale = True
    if not can_sale:
        return {"error": "not enough stock"}, 400

    price = request.json["price"]
    points_used = request.json.get("points_used", 0)
    points_earned = request.json.get(
        "points_earned", (price * quantity - points_used) // 100
    )
    customer_id = request.json["customer_id"]
    if points_earned > 0 or points_used > 0:
        customer = Customer.query.get(customer_id)
        if points_used > customer.points:
            return {"error": "not enouth points"}, 400
        customer.points = customer.points - points_used + points_earned

    new_record = SalesRecord(
        product_id=product_id,
        customer_id=customer_id,
        price=price,
        quantity=quantity,
        points_used=points_used,
        points_earned=points_earned,
    )
    db.session.add(new_record)
    db.session.commit()
    return jsonify(new_record.to_dict()), 201


# 更新销售记录
@sales_bp.route("/sales_records/<int:record_id>", methods=["PUT"])
def update_sales_record(record_id):
    record = SalesRecord.query.get(record_id)
    if record is None:
        abort(404)

    if "product_id" in request.json:
        record.product_id = request.json["product_id"]
    if "customer_id" in request.json:
        record.customer_id = request.json["customer_id"]
    if "price" in request.json:
        record.price = request.json["price"]
    if "quantity" in request.json:
        record.quantity = request.json.get("quantity", 1)
    if "points_used" in request.json:
        record.points_used = request.json.get("points_used", 0)
    if "points_earned" in request.json:
        record.points_earned = (record.price - record.points_used) // 100

    db.session.commit()
    return jsonify(record.to_dict())


# 删除销售记录
@sales_bp.route("/sales_records/<int:record_id>", methods=["DELETE"])
def delete_sales_record(record_id):
    record = SalesRecord.query.get(record_id)
    if record is None:
        abort(404)
    db.session.delete(record)
    db.session.commit()
    return jsonify({"result": True})
