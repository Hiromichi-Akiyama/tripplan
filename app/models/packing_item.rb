class PackingItem < ApplicationRecord
  belongs_to :trip

  CATEGORIES = ["衣類", "洗面・バス用品", "電子機器", "貴重品・書類", "薬・ヘルスケア", "その他"].freeze

  validates :name, presence: true
  validates :display_order, numericality: { only_integer: true, greater_than_or_equal_to: 1}
  validates :category, inclusion: {in: CATEGORIES}, allow_blank: true

  scope :ordered_for_list, -> {
    order(category: :asc)
      .order(checked: :asc)
      .order(display_order: :asc)
      .order(id: :asc)
  }

end
