# product_routes.py
from flask import Blueprint, jsonify, request, abort
from models import db, Supplier

# 创建一个蓝图
supplier_bp = Blueprint("suppliers", __name__)


# 获取所有供应商
@supplier_bp.route("/suppliers", methods=["GET"])
def get_suppliers():
    suppliers = Supplier.query.all()
    return jsonify([supplier.to_dict() for supplier in suppliers])


# 获取单个供应商
@supplier_bp.route("/suppliers/<int:supplier_id>", methods=["GET"])
def get_supplier(supplier_id):
    supplier = Supplier.query.get(supplier_id)
    if supplier is None:
        abort(404)
    return jsonify(supplier.to_dict())


# 创建新供应商
@supplier_bp.route("/suppliers", methods=["POST"])
def create_supplier():
    if not request.json or "name" not in request.json:
        abort(400)
    new_supplier = Supplier(
        name=request.json["name"], address=request.json.get("address", "")
    )
    db.session.add(new_supplier)
    db.session.commit()
    return jsonify(new_supplier.to_dict()), 201


# 更新供应商信息
@supplier_bp.route("/suppliers/<int:supplier_id>", methods=["PUT"])
def update_supplier(supplier_id):
    supplier = Supplier.query.get(supplier_id)
    if supplier is None:
        abort(404)
    if "name" in request.json:
        supplier.name = request.json["name"]
    if "address" in request.json:
        supplier.address = request.json["address"]
    db.session.commit()
    return jsonify(supplier.to_dict())


# 删除供应商
@supplier_bp.route("/suppliers/<int:supplier_id>", methods=["DELETE"])
def delete_supplier(supplier_id):
    supplier = Supplier.query.get(supplier_id)
    if supplier is None:
        abort(404)
    db.session.delete(supplier)
    db.session.commit()
    return jsonify({"result": True})
