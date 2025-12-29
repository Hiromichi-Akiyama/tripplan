class CreatePackingItems < ActiveRecord::Migration[7.1]
  def change
    create_table :packing_items do |t|
      t.references :trip, null: false, foreign_key: true
      t.string :name, null: false
      t.string :category
      t.boolean :checked, null: false, default: false
      t.integer :display_order, null: false, default: 1

      t.timestamps
    end
  end
end