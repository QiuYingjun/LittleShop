# routes/customer.py
from flask import Blueprint, jsonify, request, abort
from models import db, Customer

# 创建一个蓝图
customer_bp = Blueprint("customers", __name__)


# 获取所有顾客
@customer_bp.route("/customers", methods=["GET"])
def get_customers():
    customers = Customer.query.all()
    return jsonify([customer.to_dict() for customer in customers])


# 获取单个顾客
@customer_bp.route("/customers/<int:customer_id>", methods=["GET"])
def get_customer(customer_id):
    customer = Customer.query.get(customer_id)
    if customer is None:
        abort(404)
    return jsonify(customer.to_dict())


# 创建新顾客
@customer_bp.route("/customers", methods=["POST"])
def create_customer():
    if not request.json or "name" not in request.json:
        abort(400)

    new_customer = Customer(
        name=request.json["name"], points=request.json.get(
            "points", 0)  # 默认积分为 0
    )
    db.session.add(new_customer)
    db.session.commit()
    return jsonify(new_customer.to_dict()), 201


# 更新顾客信息
@customer_bp.route("/customers/<int:customer_id>", methods=["PUT"])
def update_customer(customer_id):
    customer = Customer.query.get(customer_id)
    if customer is None:
        abort(404)

    if "name" in request.json:
        customer.name = request.json["name"]
    if "points" in request.json:
        customer.points = request.json["points"]

    db.session.commit()
    return jsonify(customer.to_dict())


# 删除顾客
@customer_bp.route("/customers/<int:customer_id>", methods=["DELETE"])
def delete_customer(customer_id):
    customer = Customer.query.get(customer_id)
    if customer is None:
        abort(404)
    db.session.delete(customer)
    db.session.commit()
    return jsonify({"result": True})
