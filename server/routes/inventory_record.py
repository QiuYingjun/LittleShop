# routes/inventory_record.py
from flask import Blueprint, jsonify, request, abort
from models import db, InventoryRecord
from datetime import datetime
from sqlalchemy import MetaData
from sqlalchemy import select


# 创建一个蓝图
inventory_bp = Blueprint("inventory", __name__)


@inventory_bp.route("/inventory_summary", methods=["GET"])
def get_inventory_summary():
    metadata = MetaData()
    inventory_summary = db.Table("inventory_summary", metadata, autoload_with=db.engine)
    stmt = select(inventory_summary)
    result = []
    for row in db.engine.connect().execute(stmt):
        offset = 0

        count = 0
        for_calc = []
        finish = False
        while not finish:
            print(offset)
            latest_in = (
                InventoryRecord.query.filter(
                    InventoryRecord.product_id == row.product_id
                )
                .order_by(InventoryRecord.purchase_time.desc())
                .limit(5)
                .offset(offset)
                .all()
            )
            for r in latest_in:
                count = count + r.quantity
                for_calc.append(r)
                print(r.id, r.quantity, r.purchase_price)
                if count >= row.current_stock:
                    finish = True
                    break
            else:
                offset = offset + 5

        sale_price = (
            (
                sum([t.quantity * t.purchase_price for t in for_calc], 0)
                / sum([t.quantity for t in for_calc], 0)
                * 1.1
            )
            // 10
            + 1
        ) * 10

        result.append(
            {
                "product_id": row.product_id,
                "product_name": row.product_name,
                "total_received": row.total_received,
                "total_sold": row.total_sold,
                "current_stock": row.current_stock,
                "last_purchase_time": row.last_purchase_time,
                "last_sale_time": row.last_sale_time,
                "sale_price": sale_price,
            }
        )

    return result


# 获取所有库存记录
@inventory_bp.route("/inventory_records", methods=["GET"])
def get_inventory_records():
    records = InventoryRecord.query.all()
    return jsonify([record.to_dict() for record in records])


# 获取单个库存记录
@inventory_bp.route("/inventory_records/<int:record_id>", methods=["GET"])
def get_inventory_record(record_id):
    record = InventoryRecord.query.get(record_id)
    if record is None:
        abort(404)
    return jsonify(record.to_dict())


# 创建新库存记录
@inventory_bp.route("/inventory_records", methods=["POST"])
def create_inventory_record():
    if (
        not request.json
        or "product_id" not in request.json
        or "supplier_id" not in request.json
    ):
        abort(400)
    new_record = InventoryRecord(
        product_id=request.json["product_id"],
        supplier_id=request.json["supplier_id"],
        quantity=request.json.get("quantity", 1),
        purchase_price=request.json["purchase_price"],
        purchase_time=request.json.get("purchase_time", datetime.utcnow()),
    )
    db.session.add(new_record)
    db.session.commit()
    return jsonify(new_record.to_dict()), 201


# 更新库存记录
@inventory_bp.route("/inventory_records/<int:record_id>", methods=["PUT"])
def update_inventory_record(record_id):
    record = InventoryRecord.query.get(record_id)
    if record is None:
        abort(404)

    if "product_id" in request.json:
        record.product_id = request.json["product_id"]
    if "supplier_id" in request.json:
        record.supplier_id = request.json["supplier_id"]
    if "quantity" in request.json:
        record.quantity = request.json["quantity"]
    if "purchase_price" in request.json:
        record.purchase_price = request.json["purchase_price"]
    if "purchase_time" in request.json:
        record.purchase_time = request.json["purchase_time"]

    db.session.commit()
    return jsonify(record.to_dict())


# 删除库存记录
@inventory_bp.route("/inventory_records/<int:record_id>", methods=["DELETE"])
def delete_inventory_record(record_id):
    record = InventoryRecord.query.get(record_id)
    if record is None:
        abort(404)
    db.session.delete(record)
    db.session.commit()
    return jsonify({"result": True})
