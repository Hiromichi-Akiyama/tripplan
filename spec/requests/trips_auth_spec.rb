require "rails_helper"

RSpec.describe "Trips auth", type: :request do
  fixtures :users, :trips

  describe "未ログイン時のアクセス制御" do
    it "GET /trips はログイン画面へリダイレクトされる" do
      get trips_path

      # 302 リダイレクトになること
      expect(response).to have_http_status(:found)

      # Deviseのログイン画面へ飛ばされること
      expect(response).to redirect_to(new_user_session_path)
    end

    it "GET /trips/:id はログイン画面へリダイレクトされる" do
      trip = trips(:owner_trip)

      get trip_path(trip)

      expect(response).to have_http_status(:found)
      expect(response).to redirect_to(new_user_session_path)
    end
  end
end
