class Activity < ApplicationRecord
  belongs_to :trip

  validates :title, :date, presence: true
  validates :cost, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true

  scope :ordered_for_timeline, -> {
    order(date: :asc)
      .order(Arel.sql("start_time IS NULL ASC"))
      .order(start_time: :asc)
      .order(display_order: :asc)
  }

end
