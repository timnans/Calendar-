class CreateSchedules < ActiveRecord::Migration[6.1]
  def change
    create_table :schedules do |t|
      t.string :title
      t.integer :calendar_id
      t.datetime :start
      t.datetime :end
      t.string :location

      t.timestamps
    end
  end
end
