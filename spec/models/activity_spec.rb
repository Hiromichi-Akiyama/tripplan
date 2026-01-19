require 'rails_helper'

RSpec.describe Activity, type: :model do
  before do
    @activity = FactoryBot.build(:activity)
  end

  describe 'Activityの登録' do
    context '登録できるとき' do
      it 'title,dateが全て存在し、かつdateがtripのstart_date以上end_date以下なら登録できる' do
        expect(@activity).to be_valid
      end

      it 'dateが旅行期間の開始日でも登録できる' do
        @activity.date = @activity.trip.start_date
        expect(@activity).to be_valid
      end

      it 'dateが旅行期間の最終日でも登録できる' do
        @activity.date = @activity.trip.end_date
        expect(@activity).to be_valid
      end

      it 'costが0以上の場合登録できる' do
        @activity.cost = 0
        expect(@activity).to be_valid
      end

      it 'start_time,end_time,location,cost,memo,address,url,booking_codeが空でも登録できる' do
        @activity.start_time = nil
        @activity.end_time = nil
        @activity.location = nil
        @activity.cost = nil
        @activity.memo = nil
        @activity.address = nil
        @activity.url = nil
        @activity.booking_code = nil
        expect(@activity).to be_valid
      end
    end

    context '登録できないとき' do
      it 'titleが空では登録できない' do
        @activity.title = nil
        @activity.valid?
        expect(@activity.errors.full_messages).to include("タイトルを入力してください")
      end

      it 'dateが空では登録できない' do
        @activity.date = nil
        @activity.valid?
        expect(@activity.errors.full_messages).to include("日付を入力してください")
      end

      it 'dateが旅行開始日より前だと登録できない' do
        @activity.date = @activity.trip.start_date - 1.day
        @activity.valid?
        expect(@activity.errors.full_messages).to include("日付は旅行期間内の日付を選択してください")
      end

      it 'dateが旅行終了日より後だと登録できない' do
        @activity.date = @activity.trip.end_date + 1.day
        @activity.valid?
        expect(@activity.errors.full_messages).to include("日付は旅行期間内の日付を選択してください")
      end

      it 'costがマイナスだと登録できない' do
        @activity.cost = -1
        @activity.valid?
        expect(@activity.errors.full_messages).to include("費用は0以上の整数を入力してください")
      end

      it 'costが小数だと登録できない' do
        @activity.cost = 1.5
        @activity.valid?
        expect(@activity.errors.full_messages).to include("費用は0以上の整数を入力してください")
      end

      it 'costが文字列だと登録できない' do
        @activity.cost = "abc"
        @activity.valid?
        expect(@activity.errors.full_messages).to include("費用は0以上の整数を入力してください")
      end

    end

  end
end
