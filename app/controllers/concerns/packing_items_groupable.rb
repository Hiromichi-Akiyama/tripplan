module PackingItemsGroupable
  extend ActiveSupport::Concern

  private

  def prepare_packing_items_by_category
    grouped = {}
    @packing_items.each do |item|
      key = item.category.presence || "未分類"
      (grouped[key] ||= []) << item
    end

    @packing_items_by_category = grouped

    ordered = PackingItem::CATEGORIES.select { |category| grouped.key?(category) }
    extras = grouped.keys - PackingItem::CATEGORIES - ["未分類"]
    ordered += extras.sort
    ordered << "未分類" if grouped.key?("未分類")
    @packing_category_order = ordered
  end
end
