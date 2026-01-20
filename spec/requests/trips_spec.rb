# spec/requests/trips_spec.rb
require "rails_helper"

RSpec.describe "Trips", type: :request do
  let(:user) { FactoryBot.create(:user) }

  before do
    sign_in user
  end

  describe "GET /trips" do
    it "一覧が表示できる" do
      FactoryBot.create(:trip, user: user)

      get trips_path

      expect(response).to have_http_status(:ok)
    end
  end

  describe "GET /trips/:id" do
    it "詳細が表示できる" do
      trip = FactoryBot.create(:trip, user: user)

      get trip_path(trip)

      expect(response).to have_http_status(:ok)
    end
  end

  describe "GET /trips/new" do
    it "新規作成フォームが表示できる" do
      get new_trip_path

      expect(response).to have_http_status(:ok)
    end
  end

  describe "POST /trips" do
    context "パラメータが正しい場合" do
      it "Tripを作成でき、詳細へリダイレクトされる" do
        params = {
          trip: {
            title: "My Trip",
            destination: "Tokyo",
            start_date: Date.current,
            end_date: Date.current + 2,
            color: "#1e90ff",
            notes: "memo"
          }
        }

        expect {
          post trips_path, params: params
        }.to change(Trip, :count).by(1)

        created_trip = Trip.order(:id).last
        # Railsはリダイレクト時に 302 を返すことが多い（Turbo等で303になる場合もある）
        expect(response).to have_http_status(:found).or have_http_status(:see_other)
        expect(response).to redirect_to(trip_path(created_trip))
      end
    end

    context "パラメータが不正な場合" do
      it "Tripを作成できず、エラーとしてフォームが再表示される" do
        params = {
          trip: {
            title: "", # 不正（必須想定）
            start_date: Date.current,
            end_date: Date.current
          }
        }

        expect {
          post trips_path, params: params
        }.not_to change(Trip, :count)

        # render :new の場合は 200、Rails7+Turbo だと 422 のことがある
        expect(response).to have_http_status(:ok).or have_http_status(:unprocessable_entity)
      end
    end
  end

  describe "GET /trips/:id/edit" do
    it "編集フォームが表示できる" do
      trip = FactoryBot.create(:trip, user: user)

      get edit_trip_path(trip)

      expect(response).to have_http_status(:ok)
    end
  end

  describe "PATCH /trips/:id" do
    context "パラメータが正しい場合" do
      it "Tripを更新でき、詳細へリダイレクトされる" do
        trip = FactoryBot.create(:trip, user: user, title: "before")

        patch trip_path(trip), params: { trip: { title: "after" } }

        expect(trip.reload.title).to eq("after")
        expect(response).to have_http_status(:found).or have_http_status(:see_other)
        expect(response).to redirect_to(trip_path(trip))
      end
    end

    context "パラメータが不正な場合" do
      it "Tripを更新できず、編集フォームが再表示される" do
        trip = FactoryBot.create(:trip, user: user, title: "before")

        patch trip_path(trip), params: { trip: { title: "" } }

        expect(trip.reload.title).to eq("before")
        expect(response).to have_http_status(:ok).or have_http_status(:unprocessable_entity)
      end
    end
  end

  describe "DELETE /trips/:id" do
    it "Tripを削除でき、一覧へリダイレクトされる" do
      trip = FactoryBot.create(:trip, user: user)

      expect {
        delete trip_path(trip)
      }.to change(Trip, :count).by(-1)

      expect(response).to have_http_status(:found).or have_http_status(:see_other)
      expect(response).to redirect_to(trips_path)
    end
  end
end