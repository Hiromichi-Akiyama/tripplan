require 'rails_helper'

RSpec.describe "TripsPermissions", type: :request do
  fixtures :users, :trips

  describe "他人のTripsにアクセスできない" do
    it "GET /trips/:id は他人のTripだとアクセスできない（404/403など）" do
      other = users(:other)
      trip = trips(:owner_trip)

      sign_in other
      get trip_path(trip)

      # まずは 404 を想定（落ちたら実装に合わせて :forbidden や :redirect に変更）
      expect(response).to have_http_status(:not_found).or have_http_status(:forbidden)
    end

    it "PATCH /trips/:id は他人のTripを更新できない（DBが変わらない）" do
      other = users(:other)
      trip = trips(:owner_trip)
      original_title = trip.title

      sign_in other
      patch trip_path(trip), params: { trip: { title: "after" } }

      #アクセス拒否(404/403など)
      expect(response).to have_http_status(:not_found).or have_http_status(:forbidden)

      #DBが更新されていないこと（重要）
      expect(trip.reload.title).to eq(original_title)
    end

    it "DELETE /trips/:id は他人のTripを削除できない（レコードが残る）" do
      other = users(:other)
      trip = trips(:owner_trip)

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
