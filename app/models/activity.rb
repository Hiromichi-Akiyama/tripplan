class Activity < ApplicationRecord
  belongs_to :trip

  validates :title, :date, presence: true
  validates :cost, numericality: { only_integer: true, greater_than_or_equal_to: 0 }, allow_blank: true
  validate :date_within_trip_period

  scope :ordered_for_timeline, -> {
    order(date: :asc)
      .order(Arel.sql("start_time IS NULL ASC"))
      .order(start_time: :asc)
      .order(display_order: :asc)
  }

  def self.find_by_trip_and_id(trip, id)
    trip.activities.find(id)
  end

  private

  def date_within_trip_period
    return if date.blank? || trip.blank? || trip.start_date.blank? || trip.end_date.blank?
    return if (trip.start_date..trip.end_date).cover?(date)

    errors.add(:date, "は旅行期間内の日付を選択してください")
  end
end
