# product_routes.py
from flask import Blueprint, jsonify, request, abort
from models import db, Product

# 创建一个蓝图
product_bp = Blueprint("products", __name__)


# 获取所有产品
@product_bp.route("/products", methods=["GET"])
def get_products():
    products = Product.query.all()
    return jsonify([product.to_dict() for product in products])


# 获取单个产品
@product_bp.route("/products/<int:product_id>", methods=["GET"])
def get_product(product_id):
    product = Product.query.get(product_id)
    if product is None:
        abort(404)
    return jsonify(product.to_dict())


# 创建新产品
@product_bp.route("/products", methods=["POST"])
def create_product():
    if not request.json or "name" not in request.json or "size" not in request.json:
        abort(400)

    new_product = Product(
        name=request.json["name"],
        size=request.json["size"],
        tags=request.json.get("tags", ""),
        image_url=request.json.get("image_url", ""),
        description=request.json.get("description", ""),
    )
    db.session.add(new_product)
    db.session.commit()
    return jsonify(new_product.to_dict()), 201


# 更新产品信息
@product_bp.route("/products/<int:product_id>", methods=["PUT"])
def update_product(product_id):
    product = Product.query.get(product_id)
    if product is None:
        abort(404)

    if "name" in request.json:
        product.name = request.json["name"]
    if "size" in request.json:
        product.size = request.json["size"]
    if "tags" in request.json:
        product.tags = request.json["tags"]
    if "image_url" in request.json:
        product.image_url = request.json["image_url"]
    if "description" in request.json:
        product.description = request.json["description"]

    db.session.commit()
    return jsonify(product.to_dict())


# 删除产品
@product_bp.route("/products/<int:product_id>", methods=["DELETE"])
def delete_product(product_id):
    product = Product.query.get(product_id)
    if product is None:
        abort(404)
    db.session.delete(product)
    db.session.commit()
    return jsonify({"result": True})
