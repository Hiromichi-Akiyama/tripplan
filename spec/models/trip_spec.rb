require 'rails_helper'

RSpec.describe Trip, type: :model do
  before do
    @trip = FactoryBot.build(:trip)
  end

  describe 'Tripの登録' do
    context '登録できるとき' do
      it 'title,start_date,end_dateが全て存在し、かつend_date >= start_dateなら登録できる' do
        expect(@trip).to be_valid
      end

      it 'end_dateがstart_dateと同じ日付でも登録できる' do
        @trip.end_date = @trip.start_date
        expect(@trip).to be_valid
      end

      it 'destination,color,notesが空でも登録できる' do
        @trip.destination = nil
        @trip.color = nil
        @trip.notes = nil
        expect(@trip).to be_valid
      end
    end

    context '登録できないとき' do
      it 'titleが空では登録できない' do
        @trip.title = ''
        @trip.valid?
        expect(@trip.errors.full_messages).to include("タイトルを入力してください")
      end

      it 'start_dateが空では登録できない' do
        @trip.start_date = nil
        @trip.valid?
        expect(@trip.errors.full_messages).to include("開始日を入力してください")
      end

      it 'end_dateが空では登録できない' do
        @trip.end_date = nil
        @trip.valid?
        expect(@trip.errors.full_messages).to include("終了日を入力してください")
      end

      it 'end_dateがstart_dateより前の日程では登録できない' do
        @trip.end_date = @trip.start_date - 1.day
        @trip.valid?
        expect(@trip.errors.full_messages).to include("終了日は開始日以降の日付を選択してください")
      end

    end
  end
end
