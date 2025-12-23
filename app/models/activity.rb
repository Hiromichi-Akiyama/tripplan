class Activity < ApplicationRecord
  belongs_to :trip

  scope :ordered_for_timeline, -> {
    order(date: :asc)
      .order(Arel.sql("start_time IS NULL ASC"))
      .order(start_time: :asc)
      .order(display_order: :asc)
  }

end
