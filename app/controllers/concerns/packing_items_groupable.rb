module PackingItemsGroupable
  extend ActiveSupport::Concern

  private

  def prepare_packing_items_by_category
    uncategorized = I18n.t("packing_items.uncategorized")
    grouped = {}
    @packing_items.each do |item|
      key = item.category.presence || uncategorized
      (grouped[key] ||= []) << item
    end

    @packing_items_by_category = grouped

    ordered = PackingItem::CATEGORIES.select { |category| grouped.key?(category) }
    extras = grouped.keys - PackingItem::CATEGORIES - [uncategorized]
    ordered += extras.sort
    ordered << uncategorized if grouped.key?(uncategorized)
    @packing_category_order = ordered
  end
end
