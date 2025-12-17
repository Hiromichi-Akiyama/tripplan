class CreateTrips < ActiveRecord::Migration[7.1]
  def change
    create_table :trips do |t|
      t.references :user,    null: false, foreign_key: true
      t.string :title,       null: false
      t.string :destination
      t.date   :start_date,  null: false
      t.date   :end_date,    null: false
      t.string :color
      t.text   :notes

      t.timestamps
    end
  end
end
