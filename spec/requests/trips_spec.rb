# spec/requests/trips_spec.rb
require "rails_helper"

RSpec.describe "Trips", type: :request do
  fixtures :users, :trips

  let(:user) { users(:owner) }

  before do
    sign_in user
  end

  describe "GET /trips" do
    it "一覧が表示できる" do
      get trips_path

      expect(response).to have_http_status(:ok)
    end
  end

  describe "GET /trips/:id" do
    it "詳細が表示できる" do
      trip = trips(:owner_trip)

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
    let(:fixed_start_date) { Date.new(2026, 1, 10) }
    let(:fixed_end_date)   { Date.new(2026, 1, 12) }

    context "パラメータが正しい場合" do
      it "Tripを作成でき、詳細へリダイレクトされる" do
        params = {
          trip: {
            title: "My Trip",
            destination: "Tokyo",
            start_date: fixed_start_date,
            end_date: fixed_end_date,
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
            start_date: fixed_start_date,
            end_date: fixed_end_date
          }
        }

        expect {
          post trips_path, params: params
        }.not_to change(Trip, :count)

        # render :new の場合は 200、Rails7+Turbo だと 422 のことがある
        expect(response).to have_http_status(:ok).or have_http_status(:unprocessable_content)
      end
    end
  end

  describe "GET /trips/:id/edit" do
    it "編集フォームが表示できる" do
      trip = trips(:owner_trip)

      get edit_trip_path(trip)

      expect(response).to have_http_status(:ok)
    end
  end

  describe "PATCH /trips/:id" do
    context "パラメータが正しい場合" do
      it "Tripを更新でき、詳細へリダイレクトされる" do
        trip = trips(:owner_trip)

        patch trip_path(trip), params: { trip: { title: "after" } }

        expect(trip.reload.title).to eq("after")
        expect(response).to have_http_status(:found).or have_http_status(:see_other)
        expect(response).to redirect_to(trip_path(trip))
      end
    end

    context "titleが空の場合" do
      it "Tripを更新できず、編集フォームが再表示される" do
        trip = trips(:owner_trip)
        original_title = trip.title

        patch trip_path(trip), params: { trip: { title: "" } }

        expect(trip.reload.title).to eq(original_title)
        expect(response).to have_http_status(:ok).or have_http_status(:unprocessable_content)
        expect(response.body).to include(I18n.t("errors.format",
          attribute: I18n.t("activerecord.attributes.trip.title"),
          message: I18n.t("errors.messages.blank")
        ))
      end
    end

    context "start_dateが空の場合" do
      it "Tripを更新できず、編集フォームが再表示される" do
        trip = trips(:owner_trip)
        original_start_date = trip.start_date

        patch trip_path(trip), params: { trip: { start_date: "" } }

        expect(trip.reload.start_date).to eq(original_start_date)
        expect(response).to have_http_status(:ok).or have_http_status(:unprocessable_content)
        expect(response.body).to include(I18n.t("errors.format",
          attribute: I18n.t("activerecord.attributes.trip.start_date"),
          message: I18n.t("errors.messages.blank")
        ))
      end
    end

    context "end_dateが空の場合" do
      it "Tripを更新できず、編集フォームが再表示される" do
        trip = trips(:owner_trip)
        original_end_date = trip.end_date

        patch trip_path(trip), params: { trip: { end_date: "" } }
        
        expect(trip.reload.end_date).to eq(original_end_date)
        expect(response).to have_http_status(:ok).or have_http_status(:unprocessable_content)
        expect(response.body).to include(I18n.t("errors.format",
          attribute: I18n.t("activerecord.attributes.trip.end_date"),
          message: I18n.t("errors.messages.blank")
        ))
      end
    end

    context "end_dateがstart_dateより前の場合" do
      it "Tripを更新できず、編集フォームが再表示される" do
        trip = trips(:owner_trip)
        original_end_date = trip.end_date

        patch trip_path(trip), params: { trip: { end_date: trip.start_date - 1 } }

        expect(trip.reload.end_date).to eq(original_end_date)
        expect(response).to have_http_status(:ok).or have_http_status(:unprocessable_content)
        expect(response.body).to include(I18n.t("errors.format",
          attribute: I18n.t("activerecord.attributes.trip.end_date"),
          message: I18n.t("errors.messages.before_start_date")
        ))
      end
    end

  end
  describe "DELETE /trips/:id" do
    it "Tripを削除でき、一覧へリダイレクトされる" do
      trip = trips(:owner_trip)

      expect {
        delete trip_path(trip)
      }.to change(Trip, :count).by(-1)

      expect(response).to have_http_status(:found).or have_http_status(:see_other)
      expect(response).to redirect_to(trips_path)
    end
  end
end
