require 'rails_helper'

RSpec.describe PackingItem, type: :model do
  before do
    @packing_item = FactoryBot.build(:packing_item)
  end

  describe 'PackingItemの登録' do
    context '登録できるとき' do
      it 'nameが存在すれば登録できる' do
        expect(@packing_item).to be_valid
      end
    end

    context '登録できないとき' do
      it 'nameが空では登録できない' do
        @packing_item.name = nil
        @packing_item.valid?
        expect(@packing_item.errors.full_messages).to include("アイテム名を入力してください")
      end
    end
  end

end
