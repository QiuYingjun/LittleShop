from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from sqlalchemy import event
from sqlalchemy.sql import text

db = SQLAlchemy()


class Supplier(db.Model):
    __tablename__ = "supplier"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)  # 主键，自增
    name = db.Column(db.String, nullable=False)  # 供应商名称，不能为空
    address = db.Column(db.String)  # 地址，可以为空

    def to_dict(self):
        return {"id": self.id, "name": self.name, "address": self.address}


class Product(db.Model):
    __tablename__ = "product"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String, nullable=False)
    size = db.Column(db.String, nullable=False)
    tags = db.Column(db.String)
    image_url = db.Column(db.String)
    description = db.Column(db.Text)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "size": self.size,
            "tags": self.tags,
            "image_url": self.image_url,
            "description": self.description,
        }


class InventoryRecord(db.Model):
    __tablename__ = "inventory_record"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    product_id = db.Column(db.Integer, db.ForeignKey("product.id"), nullable=False)
    supplier_id = db.Column(db.Integer, db.ForeignKey("supplier.id"), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    purchase_price = db.Column(db.Float, nullable=False)
    purchase_time = db.Column(db.DateTime, default=datetime.utcnow)

    product = db.relationship(
        "Product", backref=db.backref("inventory_records", lazy=True)
    )
    supplier = db.relationship(
        "Supplier", backref=db.backref("inventory_records", lazy=True)
    )

    def to_dict(self):
        return {
            "id": self.id,
            "product_id": self.product_id,
            "supplier_id": self.supplier_id,
            "quantity": self.quantity,
            "purchase_price": self.purchase_price,
            "purchase_time": (
                self.purchase_time.isoformat() if self.purchase_time else None
            ),
        }


class Customer(db.Model):
    __tablename__ = "customer"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String, nullable=False)
    points = db.Column(db.Integer, nullable=False, default=0)

    def to_dict(self):
        return {"id": self.id, "name": self.name, "points": self.points}


class Order(db.Model):
    __tablename__ = "order"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    customer_id = db.Column(db.Integer, db.ForeignKey("customer.id"), nullable=False)
    points_used = db.Column(db.Integer, nullable=False, default=0)
    points_earned = db.Column(db.Integer, nullable=False, default=0)
    total_price = db.Column(db.Float, nullable=False)
    customer = db.relationship("Customer", backref=db.backref("orders", lazy=True))

    def to_dict(self):
        return {
            "id": self.id,
            "customer_id": self.customer_id,
            "points_used": self.points_used,
            "points_earned": self.points_earned,
            "total_price": self.total_price,
        }


class SalesRecord(db.Model):
    __tablename__ = "sales_record"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    product_id = db.Column(db.Integer, db.ForeignKey("product.id"), nullable=False)
    customer_id = db.Column(db.Integer, db.ForeignKey("customer.id"), nullable=False)
    order_id = db.Column(db.Integer, db.ForeignKey("order.id"), nullable=False)

    sale_date = db.Column(db.DateTime, default=datetime.utcnow)
    price = db.Column(db.Float, nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)

    product = db.relationship("Product", backref=db.backref("sales_records", lazy=True))
    customer = db.relationship(
        "Customer", backref=db.backref("sales_records", lazy=True)
    )
    order = db.relationship("Order", backref=db.backref("sales_records", lazy=True))

    def to_dict(self):
        return {
            "id": self.id,
            "product_id": self.product_id,
            "customer_id": self.customer_id,
            "sale_date": self.sale_date.isoformat() if self.sale_date else None,
            "price": self.price,
            "quantity": self.quantity,
            "order_id": self.order_id,
        }


# 创建视图
def create_views():
    with db.engine.connect() as connection:
        statement = text("DROP VIEW IF EXISTS inventory_summary;")
        connection.execute(statement)
        statement = text(
            """
CREATE VIEW
    inventory_summary AS
SELECT
    p.id AS product_id,
    p.name AS product_name,
    COALESCE(total_received, 0) as total_received,
    COALESCE(total_sold, 0) as total_sold,
    COALESCE(total_received, 0) - COALESCE(total_sold, 0) AS current_stock,
    last_purchase_time,
    last_sale_time
FROM
    product p
    LEFT JOIN (
        SELECT
            product_id,
            sum(quantity) total_received,
            max(purchase_time) last_purchase_time
        from
            inventory_record
        group by
            product_id
    ) ir on ir.product_id = p.id
    LEFT JOIN (
        SELECT
            product_id,
            sum(quantity) total_sold,
            max(sale_date) last_sale_time
        from
            sales_record
        group by
            product_id
    ) sr on sr.product_id = p.id
where
    current_stock > 0;
"""
        )
        connection.execute(statement)
