Rails.application.routes.draw do
  devise_for :users, controllers: { sessions: "users/sessions" }
  root "pages#home"
  get "/demo", to: "demo_sessions#create", as: :demo_login
  delete "/demo", to: "demo_sessions#destroy", as: :demo_logout
  resource :profile, only: %i[edit update]

  resources :trips, only: %i[index show new create edit update destroy] do
    resources :activities, only: %i[show new create edit update destroy]
    resources :packing_items, only: %i[new create update destroy]
  end
end
