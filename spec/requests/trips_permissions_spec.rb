require 'rails_helper'

RSpec.describe "TripsPermissions", type: :request do
  describe "他人のTripsにアクセスできない" do
    it "GET /trips/:id は他人のTripだとアクセスできない（404/403など）" do
      owner = FactoryBot.create(:user)
      other = FactoryBot.create(:user)
      trip = FactoryBot.create(:trip, user: owner)

      sign_in other
      get trip_path(trip)

      # まずは 404 を想定（落ちたら実装に合わせて :forbidden や :redirect に変更）
      expect(response).to have_http_status(:not_found).or have_http_status(:forbidden)
    end

    it "PATCH /trips/:id は他人のTripを更新できない（DBが変わらない）" do
      owner = FactoryBot.create(:user)
      other = FactoryBot.create(:user)
      trip = FactoryBot.create(:trip, user: owner, title: "before")

      sign_in other
      patch trip_path(trip), params: { trip: { title: "after" } }

      #アクセス拒否(404/403など)
      expect(response).to have_http_status(:not_found).or have_http_status(:forbidden)

      #DBが更新されていないこと（重要）
      expect(trip.reload.title).to eq("before")
    end

    it "DELETE /trips/:id は他人のTripを削除できない（レコードが残る）" do
      owner = FactoryBot.create(:user)
      other = FactoryBot.create(:user)
      trip = FactoryBot.create(:trip, user: owner)

      sign_in other

      expect {
        delete trip_path(trip)
      }.not_to change(Trip, :count)

      #アクセス拒否(404/403など)
      expect(response).to have_http_status(:not_found).or have_http_status(:forbidden)

      # レコードが残っていること（重要）
      expect(Trip.exists?(trip.id)).to be(true)
    end

  end
end
