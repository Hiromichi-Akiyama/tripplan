class Activity < ApplicationRecord
  belongs_to :trip

  validates :title, :date, presence: true
  validate :cost_is_non_negative_integer
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

  def cost_is_non_negative_integer
    raw_cost = cost_before_type_cast
    return if raw_cost.blank?

    valid =
      case raw_cost
      when Integer
        raw_cost >= 0
      when String
        raw_cost.match?(/\A\d+\z/)
      else
        false
      end

    errors.add(:cost, "は0以上の整数を入力してください") unless valid
  end

  def date_within_trip_period
    return if date.blank? || trip.blank? || trip.start_date.blank? || trip.end_date.blank?
    return if (trip.start_date..trip.end_date).cover?(date)

    errors.add(:date, "は旅行期間内の日付を選択してください")
  end
end
