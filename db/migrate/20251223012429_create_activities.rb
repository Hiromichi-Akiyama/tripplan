class CreateActivities < ActiveRecord::Migration[7.1]
  def change
    create_table :activities do |t|
      t.references :trip, null: false, foreign_key: true
      t.string :title, null: false
      t.date :date, null: false
      t.time :start_time
      t.time :end_time
      t.string :location
      t.integer :cost
      t.text :memo
      t.string :address
      t.string :url
      t.string :booking_code
      t.integer :display_order, null: false, default: 1

      t.timestamps
    end
  end
end
