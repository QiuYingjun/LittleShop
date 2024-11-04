from flask import Flask
from models import db, create_views
from routes.product import product_bp
from routes.supplier import supplier_bp
from routes.inventory_record import inventory_bp  # 导入库存记录路由
from routes.customer import customer_bp  # 导入顾客路由
from routes.sales_record import sales_bp  # 导入销售记录路由
from routes.order import order_bp  # 导入销售记录路由


app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db.init_app(app)


with app.app_context():
    db.create_all()
    create_views()


# 注册产品路由蓝图
app.register_blueprint(product_bp)
app.register_blueprint(supplier_bp)
app.register_blueprint(inventory_bp)
app.register_blueprint(customer_bp)
app.register_blueprint(sales_bp)
app.register_blueprint(order_bp)

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
