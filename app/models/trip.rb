class Trip < ApplicationRecord
  belongs_to :user
  has_many :activities, dependent: :destroy
  has_many :packing_items, dependent: :destroy

  validates :title, :start_date, :end_date, presence: true

  validate :end_date_after_or_equal_start_date


  # Tabs for Trips index
  TABS = %w[all upcoming past].freeze

  # end_date >= today (includes trips currently in-progress)
  scope :upcoming, ->(today = Date.current) { where("end_date >= ?", today) }

  # end_date < today
  scope :past, ->(today = Date.current) { where("end_date < ?", today) }

  # Apply filtering + ordering for the given tab key.
  # Usage: current_user.trips.for_tab("upcoming")
  scope :for_tab, ->(tab, today = Date.current) {
    tab = tab.to_s
    case tab
    when "upcoming"
      upcoming(today).order(start_date: :asc)
    when "past"
      past(today).order(end_date: :desc)
    else
      order(start_date: :desc)
    end
  }

  def self.find_by_user_and_id(user, id)
    user.trips.find(id)
  end

  private

  def end_date_after_or_equal_start_date
    return if start_date.blank? || end_date.blank?

    if end_date < start_date
      errors.add(:end_date, "終了日は開始日以降の日付を選択してください")
    end
  end

end
